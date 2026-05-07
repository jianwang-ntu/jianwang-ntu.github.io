# CLAUDE.md — context for agents working in this repo

This is **Jian Wang's personal site**: a Vite + React SPA deployed to GitHub Pages.
Pages: `/home`, `/pubs`, `/work`, `/cv`, `/blog`. Build output is plain HTML +
content-hashed JS/CSS — no SSR.

## Where things live

- `src/pages/` — top-level routes. `Blog.jsx` (index list) and `BlogPost.jsx`
  (single post with EN/中文 switcher) are the blog pair.
- `src/data.jsx` — hand-edited content for Home/Publications/Work/CV.
- `src/styles/pages.css` — all styles. `.blog-post` (cards) + `.blog-body`
  (long-form markdown) live near the bottom.
- `public/blog/posts.json` — manifest, newest first. The Blog index page
  reads this directly.
- `public/blog/<slug>/` — one folder per post. **This is the unit of work** —
  treat each post as self-contained.
  - `index.en.md` — canonical English version. Always present.
  - `index.zh.md` — Simplified Chinese version. Optional; presence is
    declared in `meta.json["languages"]`.
  - `meta.json` — slug, titles, deks, date, tags, source URL, languages.
- `tools/video-to-blog/` — the Python pipeline that drafts posts from a video.
  Used by the auto-blog GitHub Action; can also be run locally.
- `.github/workflows/auto-blog.yml` — the issue→PR automation.
- `.github/ISSUE_TEMPLATE/video-blog.yml` — the form a user fills to trigger it.

## How a blog post gets created

1. **Manually:** edit `public/blog/<slug>/index.en.md` (and `index.zh.md` if you
   want a translation). Update `meta.json` and prepend an entry to `posts.json`.
   Open a PR.
2. **From a video URL via CI:** open an issue using the "New blog from video"
   template. The `auto-blog` workflow runs `tools/video-to-blog/pipeline.py`
   and opens a PR for review.
3. **From a video URL locally:** run the pipeline directly, see
   `tools/video-to-blog/README.md` if present, otherwise `python pipeline.py
   --url <URL> --blog-repo .` from inside the cloned repo.

## Editing a single post

When asked to refine a published post:

- Touch only `public/blog/<slug>/index.en.md`, `index.zh.md`, and `meta.json`.
- Keep `posts.json` in sync — its entry for `<slug>` mirrors `meta.json` field
  names (`title_en`, `title_zh`, `dek_en`, `dek_zh`, `date`, `tags`, `source`,
  `languages`).
- Do NOT touch other posts unless explicitly asked.
- Re-run `npm run dev` and verify the page renders before opening a PR.

## Voice and tone for blog posts

Posts written from videos follow a specific style — a viewer summarising the
talk, **never** the writer impersonating the speaker:

- Third person throughout the writer's voice. The speaker is referred to by
  name (e.g. "Lapopolo argues…").
- First person is allowed only inside attributed direct quotes from the
  speaker (e.g. `He calls this out: "Every time I have to type continue is a
  failure of the harness."`).
- No corporate filler ("In today's fast-paced world…"), no AI throat-clearing
  ("It's important to note…"), no "fascinating insights" hype.
- The Chinese version is a translation of the same post, in the same voice —
  not a separate summary. Preserve technical terms (model names, file paths,
  product names) in English where convention dictates.

The full system prompt that enforces this is `tools/video-to-blog/prompts/
blog_system.md`. If you change the tone rules, update both that file and the
analogous file in the upstream pipeline repo.

## Things to avoid

- Don't push to `master` directly for blog content — open a PR. Push directly
  is reserved for site/structural changes (workflows, components, CSS).
- Don't add a top-level CLAUDE.md inside each post folder. The metadata in
  `meta.json` is the right place for per-post facts; tone rules live here.
- Don't introduce a separate blog framework (Jekyll, Astro, etc.). The site is
  intentionally a thin React SPA reading static files.

## The auto-blog workflow

`.github/workflows/auto-blog.yml` triggers on issues labeled `video-blog`. It:

1. Parses the URL/tags/languages from the issue body.
2. Installs ffmpeg + Python deps + `claude` CLI.
3. Runs `tools/video-to-blog/pipeline.py --url … --blog-repo …`.
4. Pushes a `blog/<slug>` branch and opens a PR closing the issue.
5. Comments on the issue with the PR link.

Required repo secret: **`OPENAI_API_KEY`** (CI runs the pipeline with
`--llm openai`; locally you can keep using `--llm claude`, the default,
which uses your `claude login` subscription).

When debugging the workflow, check the run logs from the Actions tab —
typical failures: missing/invalid `OPENAI_API_KEY`, yt-dlp 403 on
restricted videos, Whisper model download timeout on the first run.

### Transcription tiers

Three sources of text, tried in this order when applicable:

1. **YouTube captions** (`try_captions`) — fastest, free, requires the
   video to have manual or auto captions. Uses yt-dlp `--write-auto-subs`
   and converts the result from VTT → SRT → plain text.
2. **OpenAI Whisper API** (`transcribe_with_openai`) — fast cloud
   transcription, ~$0.006/min. Uses the same `OPENAI_API_KEY` the blog
   step uses. Audio >25 MB is auto-chunked at 10-minute boundaries via
   ffmpeg, then concatenated with offset SRT timestamps.
3. **Local faster-whisper** (`transcribe`) — CPU-only, slow (≈ realtime
   on a runner). Use locally only when you have neither captions nor an
   OpenAI key.

CLI flags:

- `--captions {auto, off, only}` — default `auto`: try captions first.
  `only` skips the Whisper fallback entirely.
- `--transcribe {auto, local, openai}` — default `auto`: prefer the
  OpenAI Whisper API when `OPENAI_API_KEY` is set, else fall back to
  local faster-whisper.

The auto-blog workflow runs with `--captions auto --transcribe openai`,
so a video without captions is still transcribed quickly via the API
instead of stalling on a 30-minute CPU Whisper run.

### Webshare residential proxy

GitHub-hosted runner IPs are heavily blocked by YouTube — across both the
player API (yt-dlp) and the `/timedtext` endpoint (youtube-transcript-api).
The fix is a residential-proxy hop: youtube-transcript-api integrates with
**Webshare** natively. Set two repo secrets:

```bash
gh secret set WEBSHARE_PROXY_USERNAME -R <repo>   # paste username
gh secret set WEBSHARE_PROXY_PASSWORD -R <repo>   # paste password
```

The pipeline auto-detects them via `WEBSHARE_PROXY_USERNAME` /
`WEBSHARE_PROXY_PASSWORD` env vars and constructs a `WebshareProxyConfig`.
No code change needed when the secrets are present.

If the secrets are missing, the pipeline falls through to direct fetches —
which work locally but fail in CI.

### YouTube anti-bot block in CI

YouTube serves cloud-runner IPs (including GitHub Actions) with a
"Sign in to confirm you're not a bot" challenge. yt-dlp can bypass this
with authenticated cookies. To enable:

1. Export your YouTube cookies (e.g. via the "Get cookies.txt LOCALLY"
   browser extension or `yt-dlp --cookies-from-browser` locally).
2. Upload as a repo secret named **`YT_COOKIES`** — value is the entire
   cookies.txt content:
   ```bash
   gh secret set YT_COOKIES -R jianwang-ntu/jianwang-ntu.github.io \
     < /path/to/cookies.txt
   ```
3. The workflow auto-detects the secret. If absent, runs without cookies
   (works for non-YouTube sources, fails for YouTube under bot block).

Cookies expire — if CI starts failing again with the bot challenge, refresh
the secret with a freshly exported file. Treat the cookies as login
credentials: don't commit them, don't echo them in logs.

## LLM backend choice

`tools/video-to-blog/pipeline.py` supports two backends for the blog-drafting
step, selected via `--llm`:

- `--llm claude` (default) — drives the `claude` CLI in headless mode. Uses
  `ANTHROPIC_API_KEY` if set, otherwise falls back to your `claude login`
  subscription. Best for local runs.
- `--llm openai` — calls the OpenAI Chat Completions API directly via the
  `openai` Python package. Uses `OPENAI_API_KEY`. Used in CI because
  subscription login isn't viable on a fresh runner.

Model defaults to `gpt-4o`; override with `--openai-model` or `OPENAI_MODEL`
env var.
