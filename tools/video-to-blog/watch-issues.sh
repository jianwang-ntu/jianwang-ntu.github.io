#!/usr/bin/env bash
# watch-issues.sh — poll GitHub issues and draft blog posts from them locally.
#
# Loops every $WATCH_INTERVAL seconds (default 60). On each tick:
#   1. Find one open, unassigned issue labeled `blog-request` (or `video-blog`
#      for legacy issues).
#   2. Claim it by assigning to ourselves so a second watcher won't double-process.
#   3. Parse the issue-form body into URL / kind / tags / languages / pasted text.
#   4. Run blog.sh with the right arguments. The PR body's `Closes #N` will close
#      the issue automatically when the PR is merged.
#   5. On failure, comment with the error and unassign so the issue is retryable.
#
# Usage:
#   tools/video-to-blog/watch-issues.sh
#   WATCH_INTERVAL=30 tools/video-to-blog/watch-issues.sh
#   tools/video-to-blog/watch-issues.sh --once   # single pass for testing
#
# Why local instead of CI: drafting from a video URL needs a residential IP
# (YouTube blocks GitHub-Actions ranges for both player + caption endpoints).
# This script is what you'd cron / systemd-unit on a residential box.

set -euo pipefail

usage() { sed -n '2,21p' "${BASH_SOURCE[0]}"; exit "${1:-0}"; }

ONCE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --once)    ONCE=1; shift ;;
    -h|--help) usage 0 ;;
    *)         echo "Unknown flag: $1" >&2; usage 2 ;;
  esac
done

INTERVAL="${WATCH_INTERVAL:-60}"
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

echo "watch-issues: $REPO_FULL  interval=${INTERVAL}s  user=$ME"
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

# One iteration: returns 0 if it processed an issue, 1 if there was nothing
# to do, 2 if processing failed.
process_one() {
  # Pick the oldest unassigned open issue. Sorting by `created` keeps FIFO order
  # so people whose issues sit longest get drafted first.
  local raw
  raw=$(gh issue list --repo "$REPO_FULL" \
        --label blog-request --state open --search 'no:assignee sort:created-asc' \
        --json number,title,body --limit 1)
  if [[ "$raw" == "[]" || -z "$raw" ]]; then
    # Fall back to legacy label so a half-migrated issue tracker still works.
    raw=$(gh issue list --repo "$REPO_FULL" \
          --label video-blog --state open --search 'no:assignee sort:created-asc' \
          --json number,title,body --limit 1)
  fi
  if [[ "$raw" == "[]" || -z "$raw" ]]; then
    return 1
  fi

  local n title body
  n=$(jq -r '.[0].number'    <<<"$raw")
  title=$(jq -r '.[0].title' <<<"$raw")
  body=$(jq -r '.[0].body'   <<<"$raw")
  echo "→ #$n  $title"

  # Claim. If the assign call fails (e.g. someone else just took it) skip and
  # let the next tick find the next open issue.
  if ! gh issue edit "$n" --repo "$REPO_FULL" --add-assignee "$ME" >/dev/null 2>&1; then
    echo "  could not claim #$n; skipping"
    return 1
  fi

  # Parse the form body into shell vars.
  local fields URL KIND TAGS LANGS TEXT
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
    gh issue edit "$n" --repo "$REPO_FULL" --remove-assignee "$ME" >/dev/null
    return 2
  fi

  # Build blog.sh arguments. Pasted source wins over URL (for paywalled posts).
  local -a args=()
  local cleanup_text=""
  if [[ -n "$TEXT" ]]; then
    cleanup_text=$(mktemp -t blog-issue-XXXXXX)
    printf '%s' "$TEXT" > "$cleanup_text"
    local effective_kind="$KIND"
    [[ "$effective_kind" == "auto" || -z "$effective_kind" ]] && effective_kind="post"
    args+=(--text-file "$cleanup_text" --kind "$effective_kind")
    [[ -n "$URL" ]] && args+=(--source-url "$URL")
  else
    case "$KIND" in
      paper)            args+=(--pdf "$URL") ;;
      post)             args+=(--linkedin "$URL") ;;
      video|auto|"")    args+=("$URL") ;;
      *) echo "  unknown kind '$KIND'; defaulting to auto"; args+=("$URL") ;;
    esac
  fi
  [[ -n "$TAGS"  ]] && args+=(--tags  "$TAGS")
  [[ -n "$LANGS" ]] && args+=(--languages "$LANGS")
  args+=(--issue "$n")

  echo "  running: blog.sh ${args[*]}"
  if "$SCRIPT_DIR/blog.sh" "${args[@]}"; then
    echo "  ✓ #$n drafted"
    [[ -n "$cleanup_text" ]] && rm -f "$cleanup_text"
    return 0
  else
    local rc=$?
    echo "  ✗ #$n failed ($rc)"
    [[ -n "$cleanup_text" ]] && rm -f "$cleanup_text"
    gh issue comment "$n" --repo "$REPO_FULL" --body \
"Watcher run failed (exit $rc). Likely cause: \`gh pr create\` indexing race (branch may already be on GitHub) or transient network failure. Unassigning so the next tick retries.

If this keeps failing, check the local watcher logs and rerun blog.sh by hand for the same source." >/dev/null
    gh issue edit "$n" --repo "$REPO_FULL" --remove-assignee "$ME" >/dev/null
    return 2
  fi
}

# Main loop.
while true; do
  if process_one; then
    : # processed; continue immediately rather than sleep so we drain the queue
  else
    [[ "$ONCE" -eq 1 ]] && exit 0
    sleep "$INTERVAL"
  fi
done
