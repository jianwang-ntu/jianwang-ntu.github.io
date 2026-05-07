#!/usr/bin/env bash
# blog.sh — full pipeline: video URL → transcript → drafted post → PR → deploy.
#
# Usage:
#   tools/video-to-blog/blog.sh "<URL>" \
#       [--tags "a,b,c"] [--languages "en,zh"] [--issue N] [--watch]
#
# Stages, all done by this one script:
#   1. download     — yt-dlp (and friends) handled inside pipeline.py
#   2. transcript   — youtube-transcript-api → OpenAI Whisper → faster-whisper
#   3. generate     — claude (default) or OpenAI Chat → blog markdown EN+ZH
#   4. publish      — drops the post into public/blog/<slug>/, opens a PR
#   5. deploy       — once the PR is merged, GH Pages deploy workflow rebuilds
#                     dist/ and serves it. With --watch this script polls the
#                     PR and the deploy run, then prints the live post URL.
#
# First run creates a Python venv at tools/video-to-blog/.venv and installs
# requirements. Requires ffmpeg, gh (logged in), python3 on PATH. The blog
# step uses the `claude` CLI by default; set OPENAI_API_KEY to use OpenAI.

set -euo pipefail

usage() { sed -n '2,18p' "${BASH_SOURCE[0]}"; exit "${1:-0}"; }

URL=""
TAGS=""
LANGS="en,zh"
ISSUE=""
WATCH=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tags)      TAGS="$2";  shift 2 ;;
    --languages) LANGS="$2"; shift 2 ;;
    --issue)     ISSUE="$2"; shift 2 ;;
    --watch)     WATCH=1;    shift   ;;
    -h|--help)   usage 0 ;;
    --)          shift; break ;;
    -*)          echo "Unknown flag: $1" >&2; usage 2 ;;
    *)           if [[ -z "$URL" ]]; then URL="$1"; shift
                 else echo "Multiple URLs not supported." >&2; usage 2; fi ;;
  esac
done
[[ -n "$URL" ]] || { echo "URL required." >&2; usage 2; }

# Pre-flight tools
for bin in ffmpeg gh python3 git; do
  command -v "$bin" >/dev/null || { echo "$bin not found on PATH." >&2; exit 1; }
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Venv: create on first run, reuse afterwards.
VENV="$SCRIPT_DIR/.venv"
if [[ ! -x "$VENV/bin/python" ]]; then
  echo "Creating venv at $VENV (first run only) ..."
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install --upgrade pip >/dev/null
  "$VENV/bin/pip" install -r "$SCRIPT_DIR/requirements.txt" >/dev/null
fi

# Insist on a clean tree on master so we don't entangle the new post with
# unrelated WIP. The user can stash/commit and re-run.
if [[ -n "$(git -C "$REPO_ROOT" status --porcelain)" ]]; then
  echo "Working tree dirty in $REPO_ROOT. Commit or stash first." >&2
  exit 1
fi
git -C "$REPO_ROOT" fetch origin >/dev/null 2>&1 || true
git -C "$REPO_ROOT" checkout master >/dev/null
git -C "$REPO_ROOT" pull --ff-only origin master >/dev/null 2>&1 || true

OUT="$(mktemp -d -t v2b-XXXXXX)"
echo "Pipeline output → $OUT"

"$VENV/bin/python" "$SCRIPT_DIR/pipeline.py" \
  --url "$URL" \
  --out "$OUT" \
  --blog-languages "$LANGS" \
  --blog-repo "$REPO_ROOT" \
  --tags "$TAGS" \
  --no-commit

# Identify the post the pipeline just wrote into the working tree. We accept
# either a brand-new folder (untracked) or an updated index.en.md inside an
# existing folder (re-publish of the same slug).
status=$(git -C "$REPO_ROOT" status --porcelain public/blog)
SLUG=$(printf '%s\n' "$status" | grep -E '^\?\? public/blog/[^/]+/$' \
  | head -1 | sed -E 's|^\?\? public/blog/([^/]+)/$|\1|')
if [[ -z "$SLUG" ]]; then
  SLUG=$(printf '%s\n' "$status" | grep -E ' public/blog/[^/]+/index\.en\.md$' \
    | head -1 | sed -E 's|.* public/blog/([^/]+)/index\.en\.md$|\1|')
fi
[[ -n "$SLUG" ]] || { echo "Could not locate new post in working tree." >&2; exit 1; }

POST_DIR="public/blog/$SLUG"
TITLE="$(head -1 "$REPO_ROOT/$POST_DIR/index.en.md" | sed 's/^# //')"

BRANCH="blog/$SLUG"
# Reuse a stale branch if the same slug was attempted earlier.
git -C "$REPO_ROOT" checkout -B "$BRANCH" >/dev/null

git -C "$REPO_ROOT" add "$POST_DIR" public/blog/posts.json
COMMIT_MSG="blog: $TITLE"
[[ -n "$ISSUE" ]] && COMMIT_MSG+=$'\n\nCloses #'$ISSUE
git -C "$REPO_ROOT" -c commit.gpgsign=false commit -m "$COMMIT_MSG"
git -C "$REPO_ROOT" push -u origin "$BRANCH"

REPO_FULL=$(git -C "$REPO_ROOT" config --get remote.origin.url \
  | sed -E 's|.*github\.com[:/]([^/]+/[^.]+).*|\1|')
PR_BODY="Drafted from <$URL>.

**Languages:** $LANGS
**Tags:** $TAGS

Review the markdown under \`$POST_DIR/\` and merge when satisfied. Both the Pages artifact and the \`dist\` branch redeploy automatically on the merge commit."
[[ -n "$ISSUE" ]] && PR_BODY="Closes #$ISSUE.

$PR_BODY"

# gh pr create races GitHub's branch indexing on a fresh push: the API
# can briefly think there are "No commits between master and <branch>".
# Retry a few times before giving up.
PR_URL=""
for attempt in 1 2 3 4 5; do
  if PR_URL=$(gh pr create \
      --repo "$REPO_FULL" \
      --base master \
      --head "$BRANCH" \
      --title "blog: $TITLE" \
      --body "$PR_BODY" 2>&1); then
    break
  fi
  if [[ $attempt -lt 5 ]]; then
    sleep $(( attempt * 5 ))
    echo "  gh pr create retry $attempt ..."
  else
    echo "$PR_URL" >&2
    exit 1
  fi
done

git -C "$REPO_ROOT" checkout master >/dev/null

# Compute the eventual public URL of the post once the PR is merged. The
# Pages site root comes from the Pages settings; for github.io project sites
# it's https://<owner>.github.io/. We fetch it from the API for accuracy.
SITE_URL=$(gh api "repos/$REPO_FULL/pages" --jq .html_url 2>/dev/null || true)
[[ -z "$SITE_URL" ]] && SITE_URL="https://${REPO_FULL%%/*}.github.io/"
SITE_URL="${SITE_URL%/}"
LIVE_URL="$SITE_URL/blog/$SLUG"

cat <<EOF

✓ Drafted, pushed, PR opened.
  Slug   : $SLUG
  Files  : $POST_DIR/
  Branch : $BRANCH
  PR     : $PR_URL
  Live   : $LIVE_URL  (once the PR is merged and both deploys finish — Pages + dist branch)
EOF

# Optional deploy-verification loop: poll until the PR is merged, then poll
# the Pages deploy workflow until it reports success, then print the live URL.
if [[ "$WATCH" -eq 1 ]]; then
  PR_NUM=$(basename "$PR_URL")
  echo
  echo "Watching PR #$PR_NUM. Merge it in the browser; this will poll every 30s."

  # Phase 1: wait for merge. We capture the merge commit SHA so phase 2
  # can pick the runs triggered by *this* merge, not an older deploy.
  MERGE_SHA=""
  while true; do
    json=$(gh pr view "$PR_NUM" --repo "$REPO_FULL" --json state,mergeCommit \
      --jq '.state + "|" + (.mergeCommit.oid // "")')
    state="${json%%|*}"
    sha="${json#*|}"
    case "$state" in
      MERGED) echo "PR merged ($sha)."; MERGE_SHA="$sha"; break ;;
      CLOSED) echo "PR was closed without merging — exiting."; exit 1 ;;
      *)      printf "."; sleep 30 ;;
    esac
  done

  # Phase 2: wait for both deploy workflows started by the merge commit.
  # Filtering by headSha avoids picking an older run that already finished.
  watch_workflow() {
    local name="$1"
    echo "Waiting for '$name' on $MERGE_SHA ..."
    local run_id=""
    for _ in {1..60}; do  # ~15 min to appear and complete
      run_id=$(gh run list --repo "$REPO_FULL" --workflow "$name" \
        --limit 20 --json databaseId,headSha,status \
        --jq ".[] | select(.headSha == \"$MERGE_SHA\") | .databaseId" \
        | head -1)
      [[ -n "$run_id" ]] && break
      sleep 15
    done
    if [[ -z "$run_id" ]]; then
      echo "  ! No run for '$name' on $MERGE_SHA — check the Actions tab."
      return 1
    fi
    gh run watch "$run_id" --repo "$REPO_FULL" --exit-status >/dev/null
    echo "  ✓ '$name' succeeded."
  }

  watch_workflow "Deploy to GitHub Pages"   || true
  watch_workflow "Publish dist branch"      || true

  echo
  echo "✓ All deploys complete. Post is live:"
  echo "  $LIVE_URL"
fi
