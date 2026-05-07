#!/usr/bin/env bash
# blog.sh — generate a blog post from a video URL, then open a PR for review.
#
# Usage:
#   tools/video-to-blog/blog.sh "<URL>" \
#       [--tags "a,b,c"] [--languages "en,zh"] [--issue N]
#
# First run creates a Python venv at tools/video-to-blog/.venv and installs
# requirements. Requires ffmpeg, gh (logged in), python3 on PATH. The blog
# step uses the `claude` CLI by default; set OPENAI_API_KEY to use OpenAI.

set -euo pipefail

usage() { sed -n '2,11p' "${BASH_SOURCE[0]}"; exit "${1:-0}"; }

URL=""
TAGS=""
LANGS="en,zh"
ISSUE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tags)      TAGS="$2";  shift 2 ;;
    --languages) LANGS="$2"; shift 2 ;;
    --issue)     ISSUE="$2"; shift 2 ;;
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

# Identify the post written into the working tree.
SLUG=$(git -C "$REPO_ROOT" status --porcelain public/blog \
  | awk '
    /^\?\? public\/blog\/[^/]+\/$/ { sub(/\/$/, "", $2); split($2, a, "/"); print a[3]; exit }
    /^[ MAR]+ public\/blog\/[^/]+\/index\.en\.md$/ { split($NF, a, "/"); print a[3]; exit }
  ')
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

Review the markdown under \`$POST_DIR/\` and merge when satisfied. Pages will deploy automatically once master moves."
[[ -n "$ISSUE" ]] && PR_BODY="Closes #$ISSUE.

$PR_BODY"

PR_URL=$(gh pr create \
  --repo "$REPO_FULL" \
  --base master \
  --head "$BRANCH" \
  --title "blog: $TITLE" \
  --body "$PR_BODY")

git -C "$REPO_ROOT" checkout master >/dev/null

cat <<EOF

✓ Done.
  Slug   : $SLUG
  Files  : $POST_DIR/
  Branch : $BRANCH
  PR     : $PR_URL
EOF
