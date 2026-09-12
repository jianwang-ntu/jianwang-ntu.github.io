# Portfolio navigation and content

The future research agenda leads the site: trustworthy agent networks for people, groups and companies. Assured agency studies accountable representation as capabilities and circumstances change; collective agency studies cooperation across independent participants. Independent evidence and controlled adaptation connect the two. Published work supplies methods and experience without limiting which new questions the statement can pursue.

## Editing content

- `src/pages/Home.jsx`: supplied biography, a V4-aligned research abstract, visible overview and four selected publications.
- `src/content/research-statement.md`: web synthesis of V4 and Research_Interests_Academic.pdf, retaining five sections. The two research directions and shared foundation come first; evaluation follows; published foundations come last.
- `src/components/ResearchOverview.jsx`: the unchanged supplied SVG, with 12 responsive clickable regions. It appears immediately below the statement's title and short lead. Its caption links to the full-size asset.
- `src/components/ResearchPath.jsx`: a bridge at the bottom of the statement, from published repair/detection/testing through evidence and diagnosis to future agent research.
- `src/research-agenda.js`: publication-to-agenda connections and their evidence boundaries, plus aliases for old statement fragments.
- `src/pages/Publications.jsx`: the same `ApHead sidebar` and page grid as Home; publication counts and figure provenance belong in the main content.
- `src/pages/WorkProjects.jsx` and `src/styles/portfolio.css`: the highlighted project-rooms heading contains the map and an indented project index; project entries are indented again within each room.
- `src/data-work.js`: project type, room, skills, role/publication years, status and resource links. Room maps and filters share these records.
- `public/data/jornbowrl-bio.txt`: current biography with PhD status and the V4 research agenda.

The SVG is bundled from `src/assets/`, so it deploys with Vite assets rather than the separate image bucket. `public/data/Jian_Wang_Research_Statement_202609.pdf` is the full research statement, refined from V4 and the academic-interests draft, with an opening landscape overview page. The six-page PDF is rebuilt from `src/content/research-statement-full.md`. It has a vector overview with 12 internal topic links, seven bookmarks and five numbered text pages; the final page distinguishes related work from the author's published foundations. The May 2026 CV remains a dated snapshot; the web CV clarifies the limited findings of the trace study.

## Navigation

`/statement` is canonical. `/research` preserves queries and fragments when redirecting. The statement sections are `assured-agency`, `collective-agency`, `independent-evidence-and-controlled-adaptation`, `evaluation-and-milestones` and `published-foundations`, in that order. The overview uses `network-overview`; the publication bridge uses `research-path`. Older essay, background and subtopic fragments resolve to the section absorbing that subject. Unknown fragments do not redirect.

`/work` supports intersecting `type`, `year` and `skill` queries. Room and project links clear filters so their destinations are visible. Research years are publication years; industry spans are role periods. Xiaomi emoji/portrait, 58.com and Baidu case studies retain TODO labels. The heading hierarchy is Work → The project rooms → Project index → Room → Project.

## Verification

Run `npm test` for filtering, publication links, statement headings, diagram targets, legacy fragments and PDF availability. Run `npm run build` for Vite, the sitemap and route metadata. Browser checks cover first-view overview visibility, the publication sidebar, work-page indentation, clickable regions, legacy redirects and narrow-screen layouts.

See `docs/content-review-2026-09-12.md` for the evidence assessment and review scope.

## Rebuilding the downloadable statement

The website uses a concise synthesis; `src/content/research-statement-full.md` holds the full statement and related-work references. Update both when changing the agenda. The original draft files remain outside the repository as source material.

`tools/build-research-statement.py` renders the full Markdown and the existing SVG into the stable PDF download. It requires Python packages `reportlab`, `pypdf`, and `cairosvg`, the Cairo system library, and Liberation Serif/Sans fonts. Run it with `--font-dir /path/to/liberation/fonts`. It uses the website diagram's 12 regions and resolves each to the full statement's headings. Review every rendered page and internal destination after rebuilding; then run the normal site build to refresh the preview download.

See `docs/research-statement-comparison-2026-09-12.md` for the latest synthesis decisions.
