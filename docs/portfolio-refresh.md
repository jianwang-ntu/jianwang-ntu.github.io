# Portfolio navigation and content

The homepage uses a compact academic identity rail and a reading column. Work is indexed independently of the publication list, and the research statement has its own route.

## Editing content

- `src/pages/Home.jsx`: biography distinguishing PhD work from the current agenda; Assured Agency and Collective Agency as research directions; Independent Evidence and Controlled Adaptation as their shared foundation; and collaboration links to the statement roadmap and earlier projects.
- `src/data-work.js`: one record per project, including type, room, skill tags, period, status, and publication link. The room map and filter results use the same records.
- `src/content/research-statement.md`: the September 2026 V4 statement, “Trustworthy Agent Networks: Assured Agency and Collective Agency,” with its original research-status qualifications and references. Only its duplicated title and byline are omitted from the Markdown body because the page provides them.
- `public/data/Jian_Wang_Research_Statement_202609.pdf`: unchanged V4 PDF accompanying the HTML statement. The older PDF remains available at its existing URL.

## Navigation

`/statement` is canonical. `/research` and `/research/` redirect to it while retaining the query and fragment. Homepage interests link directly to the statement's two essays and shared-foundation section. The statement overview and table of contents link to unique section IDs, including repeated subtitles.

`/work` supports `type`, `year`, and `skill` query parameters. Filters intersect and can be shared, refreshed, or revisited with browser history. A room or project link opens that entry with the filters cleared. Clicking a skill opens its filtered project index. On phones, the SVG floor plan becomes a list of the same room and project links.

Research years are publication years. Industry year ranges identify the role period, not an inferred launch date. The Xiaomi emoji, portrait, 58.com and Baidu entries retain explicit TODO labels for case studies. Publication links identify research artifacts; no industry work is presented as a paper.

## Content evidence

The biography retains the supplied personal and industry facts, with the PhD topics framed as background. Current interests and the collaboration invitation follow the V4 statement in draft_research_topic. Existing publication records and abstracts support the research descriptions. Skill labels and the current SMU role title were checked against September 2026 resume material. No new performance metrics were inferred. The execution-trace entry preserves the paper's limited-usefulness finding.

The layout references are Academic Pages (https://academicpages.github.io/) and the AI Secure project index (https://aisecure.github.io/PROJECTS/index.html); the project-room metaphor comes from the supplied floor-plan image. The implementation uses native SVG links rather than fixed raster image-map coordinates.

## Verification

Run `npm test` for project filtering, year intervals, TODO status, publication links, unique statement anchors and PDF presence. Run `npm run build` for Vite, sitemap generation and route metadata. Browser checks cover desktop and 320/390-pixel layouts, room clicks, combined filters, empty results, direct links and the legacy statement route.
