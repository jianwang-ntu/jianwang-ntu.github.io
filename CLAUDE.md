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
- `tools/video-to-blog/` — the Python pipeline + the `blog.sh` wrapper that
  drafts posts from a video and opens a PR. Run from a residential network.
- `.github/workflows/deploy.yaml` — Pages artifact deploy on master push.
- `.github/workflows/publish-dist.yml` — on master push, builds dist/
  once and force-pushes two orphan commits:
  - **`dist`** — full build, image refs stay relative (`/images/...`).
    Served by GitHub Pages itself.
  - **`dist_remote`** — same build with image refs rewritten to absolute
    GitHub Pages URLs (`https://<owner>.github.io/images/...`) and the
    local `images/` dir dropped. Served by the remote nginx host, which
    therefore doesn't need to store the image assets.

## How a blog post gets created

1. **Manually:** edit `public/blog/<slug>/index.en.md` (and `index.zh.md` if you
   want a translation). Update `meta.json` and prepend an entry to `posts.json`.
   Open a PR.
2. **From a video URL — the standard path:** run the local script
   ```
   tools/video-to-blog/blog.sh "<URL>" --tags "agents,llm" --languages en,zh
   ```
   It runs the pipeline (audio → transcript → blog draft → publish), creates
   a `blog/<slug>` branch, pushes, and opens a PR. Run it from a residential
   network — YouTube blocks GitHub-Actions IPs for both player and caption
   endpoints, which is why CI was retired.
3. **Closing an issue with the post:** add `--issue N` to the script call.
   The PR body and commit message will reference `Closes #N`.

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

## Why no CI

YouTube fully blocks GitHub-Actions runner IPs across both the player API
(yt-dlp) and the `/timedtext` endpoint (`youtube-transcript-api`). Cookies
get rotated by the browser within hours; cheap residential proxies (Webshare
$1/mo) get 429-rate-limited; player_client variants no longer help. A working
CI would need either a paid premium-rotating-residential proxy or a
self-hosted runner — not worth the spend or maintenance for a hobby blog.
The local `blog.sh` runs from your residential IP and just works.

If YouTube ever relaxes its block, the previous workflow design is in
git history (search for `auto-blog.yml`).

## Pipeline knobs (when running locally via `blog.sh` or `pipeline.py`)

**Transcript source** — three tiers, tried in order when applicable:

1. **YouTube captions** (`try_captions`) — fastest, free. Uses
   `youtube-transcript-api` first (less IP-locked) and yt-dlp's
   `--write-auto-subs` as a second chance.
2. **OpenAI Whisper API** — `~$0.006/min`. Uses `OPENAI_API_KEY`. Audio
   >25 MB is auto-chunked.
3. **Local faster-whisper** — CPU-only. Slow but free.

Flags:
- `--captions {auto, off, only}` — default `auto`: try captions first.
- `--transcribe {auto, local, openai}` — default `auto`: prefer the
  OpenAI API when `OPENAI_API_KEY` is set, else local faster-whisper.

**Blog-drafting LLM**:
- `--llm claude` (default) — drives the `claude` CLI in headless mode.
  Uses `ANTHROPIC_API_KEY` if set, otherwise falls back to your `claude
  login` subscription.
- `--llm openai` — uses the OpenAI Chat Completions API. Model is
  `gpt-4o` by default; override with `--openai-model` or `OPENAI_MODEL`.

If you ever revive CI on a self-hosted runner, the Webshare residential
proxy hooks (`WEBSHARE_PROXY_USERNAME` / `WEBSHARE_PROXY_PASSWORD` env
vars) and yt-dlp cookies file (`--yt-cookies`) are still wired in
`pipeline.py` — they just aren't reached on a residential laptop.
