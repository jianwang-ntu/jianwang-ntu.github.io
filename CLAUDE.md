# CLAUDE.md — context for agents working in this repo

This is **Jian Wang's personal site**: a Vite + React SPA deployed to GitHub Pages.
Pages: `/home`, `/pubs`, `/work`, `/cv`, `/blog`. Build output is plain HTML +
content-hashed JS/CSS — no SSR.

## Style toggle (classic ↔ academic)

Home and Publications carry **two full layout variants** switchable via a button
in the nav bar. The choice persists in `localStorage` (key: `wj-style-mode`).

| Mode | Default | Description |
|---|---|---|
| `academic` | ✓ | Academic portfolio: circular photo, Bio/Research/News column, clean text pub list with `--link: #2962ff` blue. Inspired by liuyang12.github.io + franklinliu.github.io/publications |
| `classic` | | Original wireframe: Caveat headings, placeholder thumbnail boxes, dashed borders, two-column hero with `headshot-ai.png` |

**Wiring:**
- `src/context/StyleCtx.jsx` — `StyleProvider` + `useStyleMode()` hook (reads/writes localStorage)
- `src/App.jsx` — `<StyleProvider>` wraps the entire route tree
- `src/components/Nav.jsx` — `◧ classic` / `◨ academic` toggle button; label = the mode you'll switch TO
- `src/pages/Home.jsx` — `ClassicHome` + `AcademicHome` sub-components; page shell picks via `mode`
- `src/pages/Publications.jsx` — `ClassicPublications` + `AcademicPublications`; same pattern
- `src/styles/pages.css` — both sets of CSS classes coexist; switching is a React DOM swap, no class juggling

**Photos used:**
- `public/images/jornbowrl_circle.jpg` — pre-cropped circle; academic mode avatar on Home + Publications sidebar
- `public/images/headshot-ai.png` — AI-stylised portrait; classic mode hero box (220×260 px)

When editing Home or Publications, preserve both sub-components and only change
the one matching the mode you're fixing. Never collapse back to a single layout.

## Where things live

- `src/pages/` — top-level routes. `Blog.jsx` (index list) and `BlogPost.jsx`
  (single post with EN/中文 switcher) are the blog pair. `Home.jsx` and
  `Publications.jsx` each contain two named sub-layouts (Classic + Academic)
  selected by the style toggle.
- `src/context/StyleCtx.jsx` — style-mode context; see "Style toggle" section above.
- `src/data.jsx` — hand-edited content for Home/Publications/Work/CV.
- `src/styles/pages.css` — all styles. Classic wireframe classes
  (`.home-hero`, `.pub-item`, …) and academic classes (`.about-section`,
  `.pub-entry`, …) coexist. `.blog-post` (cards) + `.blog-body`
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
  drafts posts from a *source* and opens a PR. Despite the directory name,
  the pipeline now accepts three source kinds (see "How a blog post gets
  created" below). Run from a residential network when the source is a
  YouTube video; PDF/LinkedIn paths don't need the residential IP.
- `tools/click-counter/` — Lambda + DynamoDB backend that records global
  blog click counts. Powers the "Popular" sort on `/blog`. Endpoint:
  `https://sgwa5dhthk.execute-api.ap-southeast-1.amazonaws.com/`. Update
  the Lambda code with `tools/click-counter/deploy.sh`.
- `public/robots.txt` + `public/sitemap.xml` — SEO basics. The sitemap is
  auto-generated from `public/blog/posts.json` + the static routes by
  `tools/build-sitemap.mjs` (npm `prebuild` lifecycle, also runs on every
  CI deploy). Robots allows everything and points crawlers at the canonical
  `https://www.wj2ai.com/sitemap.xml`.
- `tools/build-sitemap.mjs` — pre-build sitemap generator. Reads
  `posts.json`, writes `public/sitemap.xml` (then Vite copies it into
  `dist/`). Canonical site URL via `SITE_URL` env var (default
  `https://www.wj2ai.com`).
- `tools/build-prerender.mjs` — post-build SEO prerender. Vite outputs a
  single `dist/index.html` SPA shell; social-sharing crawlers (LinkedIn,
  Twitter, FB, Slack unfurl) don't run JS, so without this step every
  shared link would show the homepage's title/description. The script
  writes `dist/<route>/index.html` for each top-level route + each blog
  post, with a route-specific `<head>` (title, description, canonical,
  Open Graph, Twitter Card, plus JSON-LD `BlogPosting` for posts). Body
  is unchanged — the SPA still mounts and React Router takes over once
  JS executes. Both deploy targets serve `dist/<route>/index.html`
  directly via `try_files` when present.
- `src/components/Seo.jsx` — runtime head updater. Used by every page
  component (Home, Publications, WorkProjects, CV, Blog, BlogPost) to
  keep `<title>` / meta tags / canonical / og: / twitter: / JSON-LD in
  sync as the user navigates client-side. Googlebot runs JS so it picks
  up these post-mount updates; static crawlers see the prerendered
  `<head>` instead. The two layers carry the same content so they don't
  contradict.
- `.github/workflows/deploy.yaml` — single deploy workflow on master push.
  Builds once, rewrites `/images/` paths in the built dist to point at
  the public S3 bucket (`https://publicsg.s3.ap-southeast-1.amazonaws.com/
  github.io/images/...`), drops `dist/images/`, then both deploys to
  GitHub Pages and force-pushes the dist as an orphan commit on the
  `dist` branch. Both targets carry identical content. The `dist_remote`
  branch is no longer used — image hosting moved to S3. The rewrite
  step covers `*.html *.js *.css *.json *.md` — `*.json` matters because
  `posts.json` carries each post's `image` field as `/images/blog/<slug>.png`,
  and missing it from the glob causes live 404s on the index thumbnails.

## How a blog post gets created

1. **Manually:** edit `public/blog/<slug>/index.en.md` (and `index.zh.md` if you
   want a translation). Update `meta.json` and prepend an entry to `posts.json`.
   Open a PR.
2. **From a source — the standard path:** run the local script. One source
   per call. The script auto-detects arXiv / LinkedIn / direct-PDF URLs from
   the positional argument, so the simplest form just works:
   ```
   tools/video-to-blog/blog.sh "<youtube-url>"     --tags "agents,llm"
   tools/video-to-blog/blog.sh "<arxiv-url>"        --tags "research"
   tools/video-to-blog/blog.sh "<linkedin-url>"     --tags "agents"
   tools/video-to-blog/blog.sh --pdf /path/to/paper.pdf
   tools/video-to-blog/blog.sh --linkedin "<url>"
   tools/video-to-blog/blog.sh --text-file /tmp/post.txt --kind post \
                                --source-url "<url>"
   ```
   It picks the right intake (audio→transcript for video, pypdf for PDFs,
   og:meta scrape for LinkedIn, raw read for `--text-file`), drafts the post
   using a per-kind system prompt (`prompts/blog_system_<kind>.md`), creates a
   `blog/<slug>` branch, pushes, and opens a PR. Video sources need a
   residential network (YouTube blocks GitHub-Actions IPs for both player and
   caption endpoints, which is why CI was retired). PDF and LinkedIn paths
   don't.
3. **Closing an issue with the post:** add `--issue N` to the script call.
   The PR body and commit message will reference `Closes #N`.
   The watcher also runs a **duplicate check** before claiming each issue:
   it normalises the source URL (YouTube video ID, arXiv paper ID, or bare
   path) and compares it against every `source` entry in `posts.json`. On a
   match it adds the `duplicate` label, posts a comment linking the existing
   post, unassigns the issue, and skips it — no draft is produced.

4. **Issue-driven (`watch-issues.sh`):** file an issue using the
   `Blog draft request` form (`.github/ISSUE_TEMPLATE/blog-request.yml`,
   auto-applies the `blog-request` label) with a Source URL — YouTube /
   arXiv / LinkedIn / direct PDF / blog post URL — plus optional tags,
   languages, and a `Pasted source body` for paywalled inputs. Then run:
   ```
   tools/video-to-blog/watch-issues.sh         # default poll 60s, batch≤10
   WATCH_INTERVAL=30 tools/video-to-blog/watch-issues.sh
   BATCH_MAX=20      tools/video-to-blog/watch-issues.sh
   tools/video-to-blog/watch-issues.sh --once  # one tick, then exit
   ```
   On each tick the watcher fetches up to `BATCH_MAX` oldest unassigned
   `blog-request` issues. **One issue → single PR** (current single-issue
   path: `blog/<slug>` branch, one PR, `Closes #N`). **Two or more →
   batched into ONE PR** to dodge GitHub's per-PR rate limit and reduce
   review noise: a shared `blog/batch-<timestamp>` branch holds one commit
   per drafted post, and the single PR body lists every `Closes #N`. If
   one draft inside the batch fails, that issue gets a comment + is
   unassigned for retry, the working tree is reset, and the rest of the
   batch continues; successful posts still ship in the batch PR. The
   watcher remembers the branch you started it on (`START_BRANCH`) and
   returns there at the end of every batch, so running it from a feature
   branch does not silently revert to master mid-run. blog.sh in
   `--branch <name> --no-pr` mode is what the watcher invokes per-post.
   Best run on a residential box (cron or systemd-unit) — YouTube
   blocks GitHub-Actions ranges, and the same machine should hold the
   gh / claude / aws creds.

The drafted post gets `source_kind: "video" | "paper" | "post"` in
`meta.json`, plus `format:<kind>` in the auto-classified `labels` array
(filterable from the `/blog` page's filter bar). LinkedIn posts often
paywall their public HTML — if the og:description scrape comes back near
empty, the pipeline prints a hint to copy the post body and rerun with
`--text-file <path> --kind post --source-url <linkedin-url>`.

## Editing a single post

When asked to refine a published post:

- Touch only `public/blog/<slug>/index.en.md`, `index.zh.md`, and `meta.json`.
- Keep `posts.json` in sync — its entry for `<slug>` mirrors `meta.json` field
  names (`title_en`, `title_zh`, `dek_en`, `dek_zh`, `date`, `tags`, `source`,
  `languages`).
- Do NOT touch other posts unless explicitly asked.
- Re-run `npm run dev` and verify the page renders before opening a PR.

## Voice and tone for blog posts

The same voice rules apply to all source kinds — a *reader/viewer summarising*
the source, **never** the writer impersonating the speaker/author/poster:

- Third person throughout the writer's voice. The speaker / paper authors /
  original poster is referred to by name (e.g. "Lapopolo argues…",
  "Vaswani et al. report…", "Karpathy writes…").
- First person is allowed only inside attributed direct quotes from the
  source (e.g. `He calls this out: "Every time I have to type continue is a
  failure of the harness."`).
- No corporate filler ("In today's fast-paced world…"), no AI throat-clearing
  ("It's important to note…"), no "fascinating insights" hype.
- The Chinese version is a translation of the same post, in the same voice —
  not a separate summary. Preserve technical terms (model names, file paths,
  product names) in English where convention dictates.

The system prompts live under `tools/video-to-blog/prompts/`:
- `blog_system.md` — video sources (legacy filename; also acts as the fallback
  when a kind-specific file is missing).
- `blog_system_paper.md` — research papers / technical articles.
- `blog_system_post.md` — short-form posts (LinkedIn, X threads, etc.).

If you change the tone rules, update **all three** so kinds stay in sync, and
update the analogous file(s) in the upstream pipeline repo.

## Things to avoid

- Don't push to `master` directly — the repo's branch protection blocks it
  for *all* changes (blog content, workflows, components, CSS). Always open
  a PR and squash-merge. After pushing extra commits to an existing PR,
  GitHub's PR head pointer sometimes lags the branch ref, so a `gh pr merge
  --squash` immediately after a push can drop the latest commit. Verify
  every intended commit landed on master after the merge; if not, open a
  follow-up PR rather than amending.
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

**Transcript source** — three tiers; the first that works wins:

1. **YouTube captions** (`try_captions`) — fastest, free. Uses
   `youtube-transcript-api` first (less IP-locked) and yt-dlp's
   `--write-auto-subs` as a second chance.
2. **Local faster-whisper** (default fallback) — CPU-only. Slow on long
   audio but completely free.
3. **OpenAI Whisper API** (opt-in) — `~$0.006/min`. Use only when you
   want speed and accept the cost: pass `--transcribe openai`.

Flags:
- `--captions {auto, off, only}` — default `auto`: try captions first.
- `--transcribe {local, openai}` — default `local`. The local pipeline
  reserves OpenAI for image generation only.

**Cover image** — two-step pipeline. (1) Claude reads the full EN draft and
produces a structured visual brief (3–5 elements + composition + relationships).
(2) OpenAI's image API renders that brief as a labeled diagram. Image is
saved to `public/images/blog/<slug>.png` and `![title](/images/blog/<slug>.png)`
is injected at the top of every language version's markdown. `blog.sh`
also uploads the new cover to `s3://publicsg/github.io/images/blog/` so
the deployed sites can resolve it before any CI touches it. Skipped silently
if `OPENAI_API_KEY` is unset. Disable with `--image off`. Pick a different
model with `--image-model {gpt-image-1, dall-e-3}`.

**OpenAI usage** is intentionally limited to image generation only. The visual
brief, label classification, and blog drafting all route through `claude`
(headless mode, `--dangerously-skip-permissions` so non-TTY runs don't
block on permission prompts). Transcription defaults to local faster-whisper
when captions miss.

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
