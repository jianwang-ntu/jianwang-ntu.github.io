# Portfolio navigation and content

The future research agenda leads the site: reliable autonomy for adaptive AI agents. It connects scalable oversight, safety-preserving learning, and control across time and delegation. Published work supplies methods and experience without being presented as evidence for the proposed results.

## Editing content

- `src/pages/Home.jsx`: biography, current research summary, visible overview and four selected publications.
- `src/content/research-statement.md`: public web version of the statement. The page supplies the title, date, subtitle and figure, so those duplicate elements and the Mermaid source are omitted here. Appendix A/B are excluded while References remain.
- `src/components/ResearchOverview.jsx`: loads the pure-vector `src/assets/reliable-autonomy-overview.svg`. Each of its nine research blocks links to the corresponding public section. On narrow screens the figure remains readable in a horizontally scrollable canvas, followed by three compact text links. Its caption links to the full-size SVG.
- `src/research-agenda.js`: publication-to-agenda connections and their evidence boundaries, plus aliases for old statement fragments.
- `src/pages/Publications.jsx`: the same `ApHead sidebar` and page grid as Home; publication counts and figure provenance belong in the main content.
- `src/pages/WorkProjects.jsx` and `src/styles/portfolio.css`: the highlighted project-rooms heading contains the map and an indented project index; project entries are indented again within each room.
- `src/data-work.js`: project type, room, skills, role/publication years, status and resource links. Room maps and filters share these records.
- `public/data/jornbowrl-bio.txt`: current biography with PhD status and the reliable-autonomy agenda.

The web overview SVG is imported from `src/assets/`, so Vite publishes it with the application bundle and no S3 upload is needed. `public/images/research/reliable-autonomy-overview.png` remains only as the current PDF cover input. `public/data/Jian_Wang_Research_Statement_2026.pdf` is the complete statement with Appendix A/B and an opening landscape overview page. The nine-page PDF is rebuilt from `src/content/research-statement-full.md`; it has three internal overview links and nine bookmarks. The former statement is retained only under `archive/research-statement/trustworthy-agent-networks-2026/`, with no route or public link.

## Navigation

`/statement` is canonical. `/research` preserves queries and fragments when redirecting. The three principal sections are `i-scalable-oversight-under-adaptation`, `ii-safety-preserving-learning-and-feedback`, and `iii-control-across-time-and-delegation`; References follow, while Appendix A/B remain PDF-only. The overview uses `research-overview`. Older essay, background, evaluation, and subtopic fragments resolve to the new section absorbing that subject. Unknown fragments do not redirect.

`/work` supports intersecting `type`, `year` and `skill` queries. Room and project links clear filters so their destinations are visible. Research years are publication years; industry spans are role periods. Xiaomi emoji/portrait, 58.com and Baidu case studies retain TODO labels. The heading hierarchy is Work → The project rooms → Project index → Room → Project.

## Verification

Run `npm test` for filtering, publication links, statement headings, all nine SVG targets, hidden appendices, legacy fragments, archive isolation, and PDF availability. Run `npm run build` for Vite, the sitemap, and route metadata. Browser checks cover first-view overview visibility, keyboard and pointer access to SVG blocks, legacy redirects, narrow-screen image scrolling, table overflow, and the absence of Appendix content.

See `docs/content-review-2026-09-12.md` for the evidence assessment and review scope.

## Rebuilding the downloadable statement

`src/content/research-statement-full.md` holds the complete supplied source; `src/content/research-statement.md` holds the web-edited version. Update both when changing the agenda while retaining the web exclusions described above. Appendix content remains available through the PDF but is intentionally absent from the public HTML.

`tools/build-research-statement.py` renders the full Markdown and the overview PNG into the stable PDF download. `--check` validates the source without authoring dependencies. Rebuilding requires `reportlab`, `pypdf`, and Liberation Serif/Sans fonts; run it with `--font-dir /path/to/liberation/fonts`. Review every rendered page, bookmark, and internal destination after rebuilding; then run the normal site build to refresh the preview download.

See `docs/research-statement-comparison-2026-09-12.md` for the latest synthesis decisions.
