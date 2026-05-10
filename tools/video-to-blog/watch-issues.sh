#!/usr/bin/env bash
# watch-issues.sh — poll GitHub issues and draft blog posts from them locally.
#
# Loops every $WATCH_INTERVAL seconds (default 60). On each tick:
#   1. Fetch the oldest UP TO $BATCH_MAX (default 10) open, unassigned issues
#      labeled `blog-request` (or legacy `video-blog`).
#   2. If the queue has 1 issue → single-PR path: claim, draft, push, open PR.
#      If the queue has 2+ issues → BATCH path: claim each, draft each as one
#      commit on a shared `blog/batch-<timestamp>` branch, then push and open
#      ONE PR that closes every successful issue. This dodges GitHub's per-PR
#      rate limit and reduces review noise when draining a backlog.
#   3. On per-issue failure inside a batch, the watcher comments + unassigns
#      that issue and resets the working tree so the next iteration is clean;
#      successful drafts still ship in the batch PR.
#
# Usage:
#   tools/video-to-blog/watch-issues.sh
#   WATCH_INTERVAL=30 tools/video-to-blog/watch-issues.sh
#   BATCH_MAX=20      tools/video-to-blog/watch-issues.sh
#   tools/video-to-blog/watch-issues.sh --once   # single pass for testing
#
# Why local instead of CI: drafting from a video URL needs a residential IP
# (YouTube blocks GitHub-Actions ranges for both player + caption endpoints).
# This script is what you'd cron / systemd-unit on a residential box.

set -euo pipefail

usage() { sed -n '2,25p' "${BASH_SOURCE[0]}"; exit "${1:-0}"; }

ONCE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --once)    ONCE=1; shift ;;
    -h|--help) usage 0 ;;
    *)         echo "Unknown flag: $1" >&2; usage 2 ;;
  esac
done

INTERVAL="${WATCH_INTERVAL:-60}"
BATCH_MAX="${BATCH_MAX:-10}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# Resolve owner/repo. We prefer `gh` over the raw remote URL because repo
# names can contain dots (e.g. `jianwang-ntu.github.io`), and a naive
# `[^.]+` regex on the URL would truncate at the first dot.
REPO_FULL=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null) \
  || REPO_FULL=$(git -C "$REPO_ROOT" config --get remote.origin.url \
       | sed -E 's|^.*github\.com[:/](.+)\.git$|\1|; s|^.*github\.com[:/](.+)$|\1|')

# Pre-flight: gh logged in, blog.sh executable, claude on PATH (drafting fails
# fast if claude is missing, but better to surface early than mid-run).
command -v gh >/dev/null || { echo "gh not on PATH." >&2; exit 1; }
[[ -x "$SCRIPT_DIR/blog.sh" ]] || { echo "blog.sh missing or not executable." >&2; exit 1; }
ME=$(gh api user --jq .login 2>/dev/null) || { echo "gh not authenticated. Run: gh auth login" >&2; exit 1; }

# Auto-load secrets (ANTHROPIC_API_KEY / OPENAI_API_KEY) the same way blog.sh does
# so we can fail fast if they're missing rather than partway through a draft.
[[ -f "$REPO_ROOT/.env" ]] && { set -a; . "$REPO_ROOT/.env"; set +a; }

# Remember the branch we started on. The batch path needs to return to it
# (not blindly to master) at end-of-batch — switching to a different branch
# also swaps the on-disk copy of blog.sh, and if the watcher was started
# from a branch with newer logic that hasn't merged to master yet, that
# revert would break subsequent batches with "Unknown flag: --branch".
START_BRANCH=$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD)

echo "watch-issues: $REPO_FULL  interval=${INTERVAL}s  batch_max=$BATCH_MAX  user=$ME  base=$START_BRANCH"
[[ "$ONCE" -eq 1 ]] && echo "  (single-pass mode)"

# Parse the issue-form body. Each section is `### Header\n\nbody...` until the
# next `### ` or EOF. `_No response_` becomes empty. We support both the new
# "Source URL" / "Source kind" headers and the legacy "Video URL" header so the
# watcher works against issues filed before the source-diversity expansion.
parse_issue() {
  # NOTE: the script is passed via `-c`, NOT a heredoc. `python3 - <<'PY'`
  # redirects stdin to the heredoc, which conflicts with the body we pipe
  # in — Python ends up reading the body as if it were source code (or
  # reading nothing) instead of letting the script consume it via
  # sys.stdin.read(). Using `-c` keeps stdin free for the body.
  python3 -c '
import json, re, sys
body = sys.stdin.read()
fields = {}
for s in re.split(r"^### ", body, flags=re.M)[1:]:
    head, *rest = s.split("\n", 1)
    val = (rest[0] if rest else "").rstrip()
    val = val.lstrip("\n")
    if val.strip() == "_No response_":
        val = ""
    fields[head.strip().lower()] = val
url   = (fields.get("source url") or fields.get("video url") or "").strip()
kind  = (fields.get("source kind") or "auto").strip().lower()
tags  = fields.get("tags", "").strip()
langs = (fields.get("languages") or "en,zh").strip()
text  = fields.get("pasted source body", "")
# The form renders `Pasted source body` as a code block (`render: text`),
# so even an empty submission comes back as "```text\n\n```". Strip the
# fences and treat all-whitespace as empty so we do not invoke
# `--text-file` with a placeholder.
m = re.match(r"^```[a-zA-Z0-9_-]*\n(.*?)\n?```\s*$", text, flags=re.S)
if m:
    text = m.group(1)
if not text.strip():
    text = ""
print(json.dumps({
    "url": url, "kind": kind, "tags": tags, "langs": langs, "text": text,
}))
'
}

# ---------------------------------------------------------------------------
# Duplicate detection helpers
# ---------------------------------------------------------------------------

# Ensure the `duplicate` label exists in the repo (idempotent).
ensure_duplicate_label() {
  gh label create "duplicate" \
      --repo "$REPO_FULL" \
      --description "Source already exists as a published blog post" \
      --color "cfd3d7" >/dev/null 2>&1 || true
}

# Normalise a source URL to a canonical dedup key:
#   YouTube  → "youtube:<video_id>"   (strips timestamp, playlist params)
#   arXiv    → "arxiv:<paper_id>"     (abs/pdf/html forms all collapse)
#   other    → "scheme://host/path"   (query string stripped)
# Echoes the key; returns 0 always.
normalise_source_url() {
  python3 -c "
import sys, urllib.parse, re
url = sys.argv[1].strip()
p = urllib.parse.urlparse(url)
host = p.netloc.lower()
if 'youtube.com' in host:
    qs = urllib.parse.parse_qs(p.query)
    vid = (qs.get('v') or [''])[0]
    if vid: print('youtube:' + vid); sys.exit(0)
if 'youtu.be' in host:
    vid = p.path.lstrip('/')
    if vid: print('youtube:' + vid); sys.exit(0)
if 'arxiv.org' in host:
    m = re.match(r'/(abs|pdf|html)/(.+?)(?:\\.pdf)?/?$', p.path)
    if m: print('arxiv:' + m.group(2)); sys.exit(0)
print(p.scheme + '://' + p.netloc + p.path)
" "$1"
}

# Compare the given URL against every source in public/blog/posts.json using
# the same normalisation. Echoes the slug of the first match, or nothing.
find_duplicate_post() {
  local url="$1"
  local canonical
  canonical=$(normalise_source_url "$url") || return 0
  [[ -z "$canonical" ]] && return 0
  python3 -c "
import json, sys, urllib.parse, re

canonical = sys.argv[1]
try:
    posts = json.load(open('public/blog/posts.json'))
except Exception:
    sys.exit(0)

def norm(u):
    if not u: return ''
    p = urllib.parse.urlparse(u.strip())
    host = p.netloc.lower()
    if 'youtube.com' in host:
        qs = urllib.parse.parse_qs(p.query)
        vid = (qs.get('v') or [''])[0]
        if vid: return 'youtube:' + vid
    if 'youtu.be' in host:
        vid = p.path.lstrip('/')
        if vid: return 'youtube:' + vid
    if 'arxiv.org' in host:
        m = re.match(r'/(abs|pdf|html)/(.+?)(?:\\.pdf)?/?$', p.path)
        if m: return 'arxiv:' + m.group(2)
    return p.scheme + '://' + p.netloc + p.path

for post in posts:
    if norm(post.get('source','')) == canonical:
        print(post['slug'])
        sys.exit(0)
" "$canonical"
}

# Comment on the issue explaining the duplicate, add `duplicate` label,
# and unassign. Called from build_blogsh_args_for_issue; returns 3 so
# callers can distinguish "duplicate skipped" from other non-0 returns.
mark_issue_duplicate() {
  local n="$1" dup_slug="$2" url="$3"
  ensure_duplicate_label
  local post_link="https://www.wj2ai.com/blog/${dup_slug}"
  gh issue comment "$n" --repo "$REPO_FULL" --body \
"**Duplicate source detected — skipping.**

This URL has already been drafted as a blog post:
→ [\`${dup_slug}\`](${post_link})

If the new post covers substantially different content (e.g. a follow-up video), please unassign and update the issue notes, then the watcher will retry." \
    >/dev/null 2>&1 || true
  gh issue edit "$n" --repo "$REPO_FULL" \
      --add-label "duplicate" \
      --remove-assignee "$ME" >/dev/null 2>&1 || true
  echo "  ⚠ #$n duplicate of '${dup_slug}' — labelled and skipped"
}

# ---------------------------------------------------------------------------
# Pull the oldest unassigned issues. Echoes the JSON array (possibly empty).
fetch_queue() {
  local raw
  raw=$(gh issue list --repo "$REPO_FULL" \
        --label blog-request --state open \
        --search 'no:assignee sort:created-asc' \
        --json number,title,body --limit "$BATCH_MAX")
  if [[ "$raw" == "[]" || -z "$raw" ]]; then
    # Fall back to legacy label so a half-migrated issue tracker still works.
    raw=$(gh issue list --repo "$REPO_FULL" \
          --label video-blog --state open \
          --search 'no:assignee sort:created-asc' \
          --json number,title,body --limit "$BATCH_MAX")
  fi
  printf '%s' "$raw"
}

# Build the blog.sh argv array for one parsed issue. Sets the global
# `BLOGSH_ARGS` and `CLEANUP_TEXT` (a tempfile path or empty). Honours the
# extra `BLOGSH_EXTRA` array (e.g. --branch / --no-pr from the batch path).
# Returns 0 on success, 2 on parse error / missing source (already commented
# + unassigned).
build_blogsh_args_for_issue() {
  local n="$1" body="$2"
  BLOGSH_ARGS=()
  CLEANUP_TEXT=""

  local fields URL KIND TAGS LANGS TEXT
  # Parse failures stay assigned-to-me on purpose: a malformed issue body
  # needs human inspection before retry. The next tick's `no:assignee`
  # filter then correctly skips it.
  fields=$(printf '%s' "$body" | parse_issue) || {
    gh issue comment "$n" --repo "$REPO_FULL" \
      --body "Watcher could not parse this issue's body. Please reformat using the issue template, then unassign me." >/dev/null
    return 2
  }
  URL=$(jq -r '.url'   <<<"$fields")
  KIND=$(jq -r '.kind' <<<"$fields")
  TAGS=$(jq -r '.tags' <<<"$fields")
  LANGS=$(jq -r '.langs'<<<"$fields")
  TEXT=$(jq -r '.text' <<<"$fields")

  if [[ -z "$URL" && -z "$TEXT" ]]; then
    gh issue comment "$n" --repo "$REPO_FULL" \
      --body "Watcher couldn't find a Source URL or Pasted source body. Add one and unassign me." >/dev/null
    gh issue edit "$n" --repo "$REPO_FULL" --remove-assignee "$ME" >/dev/null 2>&1 || true
    return 2
  fi

  # Duplicate check — compare source URL against existing posts.json entries.
  # Exit code 3 = duplicate found; callers treat it as a clean skip.
  if [[ -n "$URL" ]]; then
    local dup_slug
    dup_slug=$(cd "$REPO_ROOT" && find_duplicate_post "$URL")
    if [[ -n "$dup_slug" ]]; then
      mark_issue_duplicate "$n" "$dup_slug" "$URL"
      return 3
    fi
  fi

  # Pasted source wins over URL (for paywalled posts).
  if [[ -n "$TEXT" ]]; then
    CLEANUP_TEXT=$(mktemp -t blog-issue-XXXXXX)
    printf '%s' "$TEXT" > "$CLEANUP_TEXT"
    local effective_kind="$KIND"
    [[ "$effective_kind" == "auto" || -z "$effective_kind" ]] && effective_kind="post"
    BLOGSH_ARGS+=(--text-file "$CLEANUP_TEXT" --kind "$effective_kind")
    [[ -n "$URL" ]] && BLOGSH_ARGS+=(--source-url "$URL")
  else
    case "$KIND" in
      paper)            BLOGSH_ARGS+=(--pdf "$URL") ;;
      post)             BLOGSH_ARGS+=(--linkedin "$URL") ;;
      video|auto|"")    BLOGSH_ARGS+=("$URL") ;;
      *) echo "  unknown kind '$KIND'; defaulting to auto"; BLOGSH_ARGS+=("$URL") ;;
    esac
  fi
  [[ -n "$TAGS"  ]] && BLOGSH_ARGS+=(--tags  "$TAGS")
  [[ -n "$LANGS" ]] && BLOGSH_ARGS+=(--languages "$LANGS")
  BLOGSH_ARGS+=(--issue "$n")

  # Caller-supplied extras (e.g. --branch <name> --no-pr for batch mode).
  if [[ "${#BLOGSH_EXTRA[@]}" -gt 0 ]]; then
    BLOGSH_ARGS+=("${BLOGSH_EXTRA[@]}")
  fi
  return 0
}

# Reset the working tree to the current branch's HEAD. Used between batch
# iterations so a partial draft from a failed blog.sh doesn't poison the
# next one. Only touches blog content paths to avoid blowing away anything
# unexpected in the repo root.
cleanup_worktree() {
  git -C "$REPO_ROOT" reset --hard HEAD >/dev/null 2>&1 || true
  git -C "$REPO_ROOT" clean -fd public/blog public/images/blog >/dev/null 2>&1 || true
}

# Comment + unassign on a failed issue. Used by both single and batch paths.
mark_issue_failed() {
  local n="$1" rc="$2"
  gh issue comment "$n" --repo "$REPO_FULL" --body \
"Watcher run failed (exit $rc). Likely cause: \`gh pr create\` indexing race (branch may already be on GitHub), transient network failure, or pipeline error (LLM/transcription). Unassigning so the next tick retries.

If this keeps failing, check the local watcher logs and rerun blog.sh by hand for the same source." >/dev/null 2>&1 || true
  gh issue edit "$n" --repo "$REPO_FULL" --remove-assignee "$ME" >/dev/null 2>&1 || true
}

# Single-issue path: defer to blog.sh end-to-end (it pushes + opens the PR
# itself). Used when the queue has exactly one item.
process_single() {
  local raw="$1"
  local n title body
  n=$(jq -r '.[0].number'    <<<"$raw")
  title=$(jq -r '.[0].title' <<<"$raw")
  body=$(jq -r '.[0].body'   <<<"$raw")
  echo "→ #$n  $title  (single)"

  if ! gh issue edit "$n" --repo "$REPO_FULL" --add-assignee "$ME" >/dev/null 2>&1; then
    echo "  could not claim #$n; skipping"
    return 1
  fi

  BLOGSH_EXTRA=()
  if ! build_blogsh_args_for_issue "$n" "$body"; then
    return 2
  fi

  echo "  running: blog.sh ${BLOGSH_ARGS[*]}"
  if "$SCRIPT_DIR/blog.sh" "${BLOGSH_ARGS[@]}"; then
    echo "  ✓ #$n drafted"
    [[ -n "$CLEANUP_TEXT" ]] && rm -f "$CLEANUP_TEXT"
    return 0
  else
    local rc=$?
    echo "  ✗ #$n failed ($rc)"
    [[ -n "$CLEANUP_TEXT" ]] && rm -f "$CLEANUP_TEXT"
    mark_issue_failed "$n" "$rc"
    return 2
  fi
}

# `gh pr create` races GitHub's branch indexing on a fresh push. Mirror the
# retry budget blog.sh uses so the batch path doesn't fail on the same race.
pr_create_with_retry() {
  local branch="$1" title="$2" body="$3"
  local out=""
  local max_attempts=10
  for attempt in $(seq 1 "$max_attempts"); do
    if out=$(gh pr create \
        --repo "$REPO_FULL" \
        --base master \
        --head "$branch" \
        --title "$title" \
        --body "$body" 2>&1); then
      printf '%s' "$out"
      return 0
    fi
    if [[ $attempt -lt $max_attempts ]]; then
      local delay=$(( attempt < 5 ? attempt * 5 : 30 ))
      echo "  gh pr create retry $attempt (sleep ${delay}s) ..." >&2
      sleep "$delay"
    fi
  done
  echo "$out" >&2
  return 1
}

# Batch path: claim N issues, draft each as one commit on a shared branch,
# push once, open one PR. Each commit message has its own `Closes #N`, and
# the PR body lists every closure too (so squash-merge or rebase-merge both
# close every issue).
process_batch() {
  local raw="$1" count="$2"
  local branch_name="blog/batch-$(date +%Y%m%d-%H%M%S)"
  echo "→ batch of $count issues → $branch_name"

  # Sanity: refuse to start a batch if the working tree is dirty. blog.sh
  # checks the same thing per call, but this fails earlier.
  if [[ -n "$(git -C "$REPO_ROOT" status --porcelain)" ]]; then
    echo "  working tree dirty in $REPO_ROOT; commit or stash first" >&2
    return 2
  fi

  local closed_issues=()        # numbers of issues whose drafts succeeded
  local successful_titles=()    # post titles, parallel array to closed_issues
  local successful_slugs=()     # slugs, parallel array to closed_issues
  local i n title body rc
  for i in $(seq 0 $((count - 1))); do
    n=$(jq -r ".[$i].number"    <<<"$raw")
    title=$(jq -r ".[$i].title" <<<"$raw")
    body=$(jq -r ".[$i].body"   <<<"$raw")
    echo "  [$((i + 1))/$count] → #$n  $title"

    if ! gh issue edit "$n" --repo "$REPO_FULL" --add-assignee "$ME" >/dev/null 2>&1; then
      echo "    could not claim #$n; skipping"
      continue
    fi

    BLOGSH_EXTRA=(--branch "$branch_name" --no-pr)
    if ! build_blogsh_args_for_issue "$n" "$body"; then
      # build helper already commented + unassigned
      continue
    fi

    echo "    running: blog.sh ${BLOGSH_ARGS[*]}"
    if "$SCRIPT_DIR/blog.sh" "${BLOGSH_ARGS[@]}"; then
      [[ -n "$CLEANUP_TEXT" ]] && rm -f "$CLEANUP_TEXT"
      # The most recent commit's title is `blog: <Title>` and its tree
      # contains the new slug folder. Capture both for the PR body.
      local last_title last_slug
      last_title=$(git -C "$REPO_ROOT" log -1 --format=%s | sed -E 's/^blog:[[:space:]]*//')
      last_slug=$(git -C "$REPO_ROOT" log -1 --name-only --pretty='' \
                   | grep -E '^public/blog/[^/]+/index\.en\.md$' \
                   | head -1 | sed -E 's|^public/blog/([^/]+)/index\.en\.md$|\1|' \
                   || true)
      closed_issues+=("$n")
      successful_titles+=("$last_title")
      successful_slugs+=("${last_slug:-unknown}")
      echo "    ✓ #$n drafted (slug=${last_slug:-?})"
    else
      rc=$?
      echo "    ✗ #$n failed ($rc)"
      [[ -n "$CLEANUP_TEXT" ]] && rm -f "$CLEANUP_TEXT"
      mark_issue_failed "$n" "$rc"
      # Reset the working tree so a partial draft (untracked slug folder
      # or a half-staged image) doesn't trip the next blog.sh's clean-tree
      # check. Successful commits are preserved by `reset --hard HEAD`.
      cleanup_worktree
    fi
  done

  if [[ ${#closed_issues[@]} -eq 0 ]]; then
    echo "  no drafts succeeded; tearing down empty batch branch"
    git -C "$REPO_ROOT" checkout "$START_BRANCH" >/dev/null 2>&1 || true
    git -C "$REPO_ROOT" branch -D "$branch_name" >/dev/null 2>&1 || true
    return 2
  fi

  echo "  pushing $branch_name (${#closed_issues[@]} successful drafts)"
  if ! git -C "$REPO_ROOT" push -u origin "$branch_name" >/dev/null 2>&1; then
    echo "  push failed — leaving branch + commits in place for manual recovery" >&2
    git -C "$REPO_ROOT" checkout "$START_BRANCH" >/dev/null 2>&1 || true
    return 2
  fi

  # Build PR title + body. Title summarises count; body lists each post +
  # `Closes #N` so all linked issues close on merge regardless of strategy.
  local pr_title pr_body
  pr_title="blog: batch of ${#closed_issues[@]} posts"
  pr_body="Drafted ${#closed_issues[@]} posts in one batch (single PR to dodge GitHub's per-PR rate limit on backlog drains).

"
  local k
  for k in "${!closed_issues[@]}"; do
    pr_body+="- **${successful_titles[$k]}** (\`${successful_slugs[$k]}\`) — Closes #${closed_issues[$k]}
"
  done
  pr_body+="
Review each post under \`public/blog/<slug>/\` and merge when satisfied. Both the Pages artifact and the \`dist\` branch redeploy automatically on the merge commit."

  local pr_url
  if pr_url=$(pr_create_with_retry "$branch_name" "$pr_title" "$pr_body"); then
    echo "  ✓ batch PR opened: $pr_url"
  else
    echo "  ✗ gh pr create exhausted retries; branch is on origin — open the PR by hand:" >&2
    echo "    gh pr create --base master --head $branch_name --title \"$pr_title\" --body ..." >&2
    git -C "$REPO_ROOT" checkout "$START_BRANCH" >/dev/null 2>&1 || true
    return 2
  fi

  git -C "$REPO_ROOT" checkout "$START_BRANCH" >/dev/null 2>&1 || true
  return 0
}

# One tick: fetch the queue, dispatch single or batch.
process_one_tick() {
  local raw count
  raw=$(fetch_queue)
  if [[ "$raw" == "[]" || -z "$raw" ]]; then
    return 1
  fi
  count=$(jq length <<<"$raw")
  if [[ "$count" -eq 1 ]]; then
    process_single "$raw"
  else
    process_batch "$raw" "$count"
  fi
}

# Main loop.
while true; do
  if process_one_tick; then
    : # processed; continue immediately rather than sleep so we drain the queue
  else
    [[ "$ONCE" -eq 1 ]] && exit 0
    sleep "$INTERVAL"
  fi
done
