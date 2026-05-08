#!/usr/bin/env bash
# blog.sh — full pipeline: source → drafted post → PR → deploy.
#
# Sources (one of):
#   <video-url>           positional video URL (yt-dlp). arXiv/LinkedIn URLs
#                          are auto-detected and routed to --pdf/--linkedin.
#   --pdf <path-or-url>   research paper or article PDF (local or http(s);
#                          arXiv URLs canonicalised). Skips audio+transcript.
#   --linkedin <url>      LinkedIn post URL (best-effort og: scrape).
#   --text-file <path>    pre-extracted source text. Requires --kind.
#
# Usage:
#   tools/video-to-blog/blog.sh "<video-url>" [opts]
#   tools/video-to-blog/blog.sh --pdf <path-or-url> [opts]
#   tools/video-to-blog/blog.sh --linkedin <url> [opts]
#   tools/video-to-blog/blog.sh --text-file <path> --kind {video,paper,post} \
#                               [--source-url <url>] [opts]
#
# Common opts: [--tags "a,b,c"] [--languages "en,zh"] [--issue N] [--watch]
#
# Batch opts (used by watch-issues.sh — accumulate several drafts on one
# branch and open a single PR for all of them, to dodge GitHub's
# per-PR rate limits when draining a queue):
#   --branch <name>       commit on this branch instead of `blog/<slug>`.
#                          Created from master if it does not yet exist.
#   --no-pr               commit but do not push and do not open a PR.
#                          Caller pushes + opens PR after batching.
#
# Stages, all done by this one script:
#   1. acquire      — fetch+extract source text (or audio→transcript for video)
#   2. generate     — claude (default) or OpenAI Chat → blog markdown EN+ZH
#   3. publish      — drops the post into public/blog/<slug>/, opens a PR
#   4. deploy       — once the PR is merged, GH Pages deploy workflow rebuilds
#                     dist/ and serves it. With --watch this script polls the
#                     PR and the deploy run, then prints the live post URL.
#
# First run creates a Python venv at tools/video-to-blog/.venv and installs
# requirements. Requires ffmpeg, gh (logged in), python3 on PATH. The blog
# step uses the `claude` CLI by default; set OPENAI_API_KEY to use OpenAI.

set -euo pipefail

usage() { sed -n '2,39p' "${BASH_SOURCE[0]}"; exit "${1:-0}"; }

URL=""
PDF=""
LINKEDIN=""
TEXT_FILE=""
KIND=""
SOURCE_URL=""
TAGS=""
LANGS="en,zh"
ISSUE=""
WATCH=0
BRANCH_OVERRIDE=""
NO_PR=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --pdf)        PDF="$2";        shift 2 ;;
    --linkedin)   LINKEDIN="$2";   shift 2 ;;
    --text-file)  TEXT_FILE="$2";  shift 2 ;;
    --kind)       KIND="$2";       shift 2 ;;
    --source-url) SOURCE_URL="$2"; shift 2 ;;
    --tags)       TAGS="$2";       shift 2 ;;
    --languages)  LANGS="$2";      shift 2 ;;
    --issue)      ISSUE="$2";      shift 2 ;;
    --watch)      WATCH=1;         shift   ;;
    --branch)     BRANCH_OVERRIDE="$2"; shift 2 ;;
    --no-pr)      NO_PR=1;         shift   ;;
    -h|--help)    usage 0 ;;
    --)           shift; break ;;
    -*)           echo "Unknown flag: $1" >&2; usage 2 ;;
    *)            if [[ -z "$URL" ]]; then URL="$1"; shift
                  else echo "Multiple URLs not supported." >&2; usage 2; fi ;;
  esac
done

# Auto-route a positional URL into --pdf / --linkedin when it pattern-matches.
# Keeps the simple `blog.sh <any-url>` ergonomic the script started with.
if [[ -n "$URL" && -z "$PDF" && -z "$LINKEDIN" && -z "$TEXT_FILE" ]]; then
  if [[ "$URL" =~ ^https?://(www\.)?arxiv\.org/(abs|pdf|html)/ ]]; then
    PDF="$URL"; URL=""
  elif [[ "$URL" =~ ^https?://([^/]+\.)?linkedin\.com/ ]]; then
    LINKEDIN="$URL"; URL=""
  elif [[ "$URL" =~ ^https?://.*\.pdf(\?|$) ]]; then
    PDF="$URL"; URL=""
  fi
fi

# Exactly one source must be provided.
sources=0
[[ -n "$URL"       ]] && sources=$((sources+1))
[[ -n "$PDF"       ]] && sources=$((sources+1))
[[ -n "$LINKEDIN"  ]] && sources=$((sources+1))
[[ -n "$TEXT_FILE" ]] && sources=$((sources+1))
if [[ "$sources" -ne 1 ]]; then
  echo "Provide exactly one source: <video-url> / --pdf / --linkedin / --text-file." >&2
  usage 2
fi
if [[ -n "$TEXT_FILE" && -z "$KIND" ]]; then
  echo "--text-file requires --kind {video,paper,post}." >&2; exit 2
fi

# Single canonical source-URL string for the PR body / commit message.
SRC_DESC="$URL$PDF$LINKEDIN$TEXT_FILE"

# Pre-flight tools. ffmpeg is only needed for video sources (audio extraction
# + transcription); skip it when the source is a PDF / LinkedIn post / text file.
required_bins=(gh python3 git)
[[ -n "$URL" ]] && required_bins+=(ffmpeg)
for bin in "${required_bins[@]}"; do
  command -v "$bin" >/dev/null || { echo "$bin not found on PATH." >&2; exit 1; }
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Auto-load secrets from .env at the repo root (gitignored). Convenient
# for OPENAI_API_KEY / ANTHROPIC_API_KEY without polluting the parent shell.
if [[ -f "$REPO_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env"
  set +a
fi

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
if [[ -n "$BRANCH_OVERRIDE" ]]; then
  # Batch mode: caller picks the branch. Create from CURRENT HEAD (not
  # master) if it does not yet exist, otherwise switch to it. Branching
  # off HEAD matters because, on a single working tree, switching to a
  # different commit ALSO swaps the on-disk script files. If we branched
  # from master, the second blog.sh invocation in a batch would read a
  # stale on-disk blog.sh that doesn't know about --branch / --no-pr and
  # die with "Unknown flag". The caller (watch-issues.sh) is responsible
  # for being on a sane base before invoking us.
  if git -C "$REPO_ROOT" rev-parse --verify "$BRANCH_OVERRIDE" >/dev/null 2>&1; then
    git -C "$REPO_ROOT" checkout "$BRANCH_OVERRIDE" >/dev/null
  else
    git -C "$REPO_ROOT" checkout -b "$BRANCH_OVERRIDE" >/dev/null
  fi
else
  git -C "$REPO_ROOT" checkout master >/dev/null
  git -C "$REPO_ROOT" pull --ff-only origin master >/dev/null 2>&1 || true
fi

OUT="$(mktemp -d -t v2b-XXXXXX)"
echo "Pipeline output → $OUT"

# Build the source-specific args once and inject them. Avoids passing empty
# flag values, which argparse interprets as the literal empty string.
PIPELINE_ARGS=()
if   [[ -n "$URL"       ]]; then PIPELINE_ARGS+=(--url "$URL")
elif [[ -n "$PDF"       ]]; then PIPELINE_ARGS+=(--pdf "$PDF")
elif [[ -n "$LINKEDIN"  ]]; then PIPELINE_ARGS+=(--linkedin "$LINKEDIN")
elif [[ -n "$TEXT_FILE" ]]; then PIPELINE_ARGS+=(--text-file "$TEXT_FILE")
fi
[[ -n "$KIND"       ]] && PIPELINE_ARGS+=(--kind "$KIND")
[[ -n "$SOURCE_URL" ]] && PIPELINE_ARGS+=(--source-url "$SOURCE_URL")

# Put the venv on PATH so subprocesses spawned by pipeline.py (yt-dlp,
# ffmpeg if it's pip-installed, etc.) resolve to the venv-installed tools.
PATH="$VENV/bin:$PATH" "$VENV/bin/python" "$SCRIPT_DIR/pipeline.py" \
  "${PIPELINE_ARGS[@]}" \
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

if [[ -n "$BRANCH_OVERRIDE" ]]; then
  # Already on $BRANCH_OVERRIDE from the checkout above; just record it.
  BRANCH="$BRANCH_OVERRIDE"
else
  BRANCH="blog/$SLUG"
  # Reuse a stale branch if the same slug was attempted earlier.
  git -C "$REPO_ROOT" checkout -B "$BRANCH" >/dev/null
fi

git -C "$REPO_ROOT" add "$POST_DIR" public/blog/posts.json
# Stage the cover image if pipeline.py generated one, and ship it to S3
# so the public bucket has the asset before the PR is even reviewed.
COVER_GLOB="public/images/blog/${SLUG}.*"
if compgen -G "$REPO_ROOT/$COVER_GLOB" > /dev/null; then
  git -C "$REPO_ROOT" add $COVER_GLOB
  if command -v aws >/dev/null && [[ -n "${S3_IMAGE_BUCKET:-publicsg}" ]]; then
    cover_src=$(compgen -G "$REPO_ROOT/$COVER_GLOB" | head -1)
    cover_key="github.io/images/blog/$(basename "$cover_src")"
    echo "Uploading cover → s3://${S3_IMAGE_BUCKET:-publicsg}/${cover_key}"
    aws s3 cp "$cover_src" "s3://${S3_IMAGE_BUCKET:-publicsg}/${cover_key}" \
      --no-progress 2>&1 | tail -1 || echo "  (S3 upload failed — image will still ship in the PR; sync manually later)"
  else
    echo "  (skipping S3 upload — aws CLI missing; sync manually later)"
  fi
fi
COMMIT_MSG="blog: $TITLE"
[[ -n "$ISSUE" ]] && COMMIT_MSG+=$'\n\nCloses #'$ISSUE
git -C "$REPO_ROOT" -c commit.gpgsign=false commit -m "$COMMIT_MSG"

# In batch mode the caller (watch-issues.sh) accumulates several drafts on
# one branch and opens a single PR at the end. We stop after the commit:
# no push, no PR, stay on the batch branch so the next iteration can add
# its own commit on top.
if [[ "$NO_PR" -eq 1 ]]; then
  cat <<EOF

✓ Drafted and committed (batch mode — no push, no PR).
  Slug   : $SLUG
  Files  : $POST_DIR/
  Branch : $BRANCH
EOF
  exit 0
fi

git -C "$REPO_ROOT" push -u origin "$BRANCH"

REPO_FULL=$(git -C "$REPO_ROOT" config --get remote.origin.url \
  | sed -E 's|.*github\.com[:/]([^/]+/[^.]+).*|\1|')
PR_BODY="Drafted from <$SRC_DESC>.

**Languages:** $LANGS
**Tags:** $TAGS

Review the markdown under \`$POST_DIR/\` and merge when satisfied. Both the Pages artifact and the \`dist\` branch redeploy automatically on the merge commit."
[[ -n "$ISSUE" ]] && PR_BODY="Closes #$ISSUE.

$PR_BODY"

# gh pr create races GitHub's branch indexing on a fresh push: the API
# can briefly think there are "No commits between master and <branch>".
# Retry with a generous budget — indexing has been observed to take >1min.
PR_URL=""
MAX_ATTEMPTS=10
for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  if PR_URL=$(gh pr create \
      --repo "$REPO_FULL" \
      --base master \
      --head "$BRANCH" \
      --title "blog: $TITLE" \
      --body "$PR_BODY" 2>&1); then
    break
  fi
  if [[ $attempt -lt $MAX_ATTEMPTS ]]; then
    delay=$(( attempt < 5 ? attempt * 5 : 30 ))
    echo "  gh pr create retry $attempt (sleep ${delay}s) ..."
    sleep "$delay"
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

  watch_workflow "Deploy site" || true

  echo
  echo "✓ All deploys complete. Post is live:"
  echo "  $LIVE_URL"
fi
