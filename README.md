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
npm run build  # writes ./dist
npm run preview  # sanity-check the static bundle on :9002
```

`dist/` is the entire deployable artefact. Copy it to the host (e.g.,
`/var/www/wjhome/dist`) and serve it through nginx — see `nginx.example.conf`
for the clean-URL fallback that lets `/home`, `/pubs`, `/work`, `/cv` resolve
on a hard refresh.

## Editing content

All copy lives in `src/data.jsx`:

- `NEWS` — hero column on the home page
- `FEATURED_PUBS` — top three on the home page
- `ALL_PUBS` — full Publications page (auto-grouped by year)
- `WORK` — the spine on Work & Projects
- `PROJECTS` — open-source artifact grid

`public/data/` and `public/images/` ship verbatim — drop the CV PDF, bio.txt,
and headshot variants there.

## Headshot

`public/images/headshot-ai.png` is the AI-stylised wireframe portrait used in
the hero. Three additional locally-generated variants live next to it
(`headshot-sketch.jpg`, `headshot-cartoon.jpg`, `headshot-ink.png`) — swap by
editing the `<img src>` in `src/pages/Home.jsx`.
