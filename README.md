# wjhome — Vite + React

Static personal site, ported from the in-browser Babel build to a Vite + React
SPA. Designed to run cheaply on a 4-vCPU host: production output is plain
`index.html` + content-hashed JS/CSS, no SSR runtime.

## Develop

```sh
npm install
npm run dev    # http://0.0.0.0:9002
```

Hot-reloads on file save. Vite dev server is fine for a single developer; do
not run it on the production host.

## Build

```sh
npm run build    # writes ./dist
npm run preview  # sanity-check the static bundle on :9002
```

`dist/` is the entire deployable artefact.

## Deploy

### GitHub Pages (canonical)

Push to `master` — `.github/workflows/deploy.yaml` builds and publishes to
<https://jianwang-ntu.github.io/>. The workflow copies `dist/index.html` to
`dist/404.html` so SPA clean URLs (`/home`, `/pubs`, `/work`, `/cv`) resolve
on direct hits. It also rewrites `/images/` paths to point at the S3 bucket
and drops `dist/images/` from the Pages payload.

The repo must be **public** for Pages to publish on a free account, and the
Pages source must be set to **GitHub Actions** under `Settings → Pages`.

### Self-hosted nginx

Copy `dist/` to the host doc-root and serve it. See `nginx.example.conf` for
the clean-URL fallback (`try_files $uri $uri/ /index.html;`) — without this
patch, `/pubs` etc. 404 on hard refresh.

```sh
rsync -avz --delete \
      --exclude '.DS_Store' --exclude '~$*' \
      ./dist/ ubuntu@HOST:/home/ubuntu/www/website/
```

## Editing content

All copy lives in `src/data.jsx`:

- `NEWS` — timeline items shown on Home (both style modes)
- `FEATURED_PUBS` — top three papers shown on Home (both style modes)
- `ALL_PUBS` — full Publications page (auto-grouped by year)
- `WORK` — the spine on Work & Projects
- `PROJECTS` — open-source artifact grid

`public/data/` and `public/images/` ship verbatim — drop the CV PDF, bio.txt,
and headshot variants there.

## Style toggle (classic ↔ academic)

The Home and Publications pages carry two full layout variants that the visitor
can switch between using the **`◧ classic` / `◨ academic` button** in the nav.

| Mode | Description |
|---|---|
| **academic** | Academic portfolio look (default): circular photo, Bio / Research Interests / News column, clean text-based publication list with blue PDF links — inspired by [liuyang12.github.io](https://liuyang12.github.io/) and [franklinliu.github.io/publications](https://franklinliu.github.io/publications/) |
| **classic** | Original wireframe aesthetic: Caveat display headings, thumbnail placeholder boxes, dashed borders, editorial two-column hero |

The choice persists in `localStorage` (key: `wj-style-mode`).

**Where the wiring lives:**

- `src/context/StyleCtx.jsx` — `StyleProvider` + `useStyleMode()` hook
- `src/App.jsx` — wraps the route tree with `<StyleProvider>`
- `src/components/Nav.jsx` — reads `{ mode, toggle }` and renders the button
- `src/pages/Home.jsx` — exports `ClassicHome` and `AcademicHome` sub-components;
  the page shell picks one based on `mode`
- `src/pages/Publications.jsx` — same pattern: `ClassicPublications` /
  `AcademicPublications`
- `src/styles/pages.css` — both sets of layout classes live in the sheet
  simultaneously; switching is purely a React-rendered DOM swap

## Photos

| File | Used in |
|---|---|
| `public/images/jornbowrl_circle.jpg` | Academic mode profile avatar (pre-cropped circle) |
| `public/images/headshot-ai.png` | Classic mode hero (AI-stylised portrait, 220×260 px box) |
| `headshot-sketch.jpg`, `headshot-cartoon.jpg`, `headshot-ink.png` | Spares — swap by editing `<img src>` in `Home.jsx` |
