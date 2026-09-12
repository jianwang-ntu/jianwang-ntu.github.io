# Portfolio navigation and content

The site follows a progression: published code repair and evaluation → a proposed multi-step maintenance testbed → assured agency under change → a conditional extension to cooperation across owners. Publications document completed work; the statement describes the proposed next questions; Work contains research artifacts and industry experience; the blog contains reading notes about other people's work.

## Editing content

- `src/pages/Home.jsx`: supplied biography, focused research introduction, progression and selected supporting publications. RATCHET joins Defects4C, the execution-trace study and the detector study as the four selected foundations.
- `src/content/research-statement.md`: focused web statement with five sections, approximately 1,000 words. It is a revision of the broader V4 agenda, not a transcription of its PDF.
- `src/components/ResearchPath.jsx`: responsive progression with arrows, an intermediate maintenance block and explicit published/proposed/conditional labels. Shared by Home and Statement.
- `src/research-agenda.js`: links between publications and proposed questions, with evidence boundaries; also aliases for old statement fragments. Shared connection copy appears on publication details and in concise links on Home, Publications and Work.
- `src/components/ResearchOverview.jsx`: the supplied `trustworthy_agent_networks.svg`, retained unchanged under an expandable broader-vision section on Home and Statement. Its 12 clickable regions now lead to the consolidated sections. The full-size asset is available from the caption.
- `src/data-work.js`: project type, room, skills, role/publication years, status and resource links. Room maps and filters use these same records.
- `public/data/jornbowrl-bio.txt`: current short biography with PhD status and the proposed next direction.

The original SVG is bundled from `src/assets/`, so it deploys with Vite assets rather than the separate image bucket. `public/data/Jian_Wang_Research_Statement_202609.pdf` is the earlier broad V4 draft and is explicitly labelled that way. The downloadable May 2026 CV remains a dated snapshot; the web CV clarifies the limited findings of the trace study.

## Navigation

`/statement` is canonical. `/research` preserves queries and fragments when redirecting. The five statement sections are `published-foundations`, `from-patches-to-maintenance`, `assured-agency`, `collective-agency` and `evaluation-and-milestones`. Older essay, background and subtopic fragments resolve to the section absorbing that subject. Unknown fragments do not trigger redirects.

`/work` supports intersecting `type`, `year` and `skill` queries. Room and project links clear filters so the destination is visible. Research years are publication years; industry spans are role periods. Xiaomi emoji/portrait, 58.com and Baidu case studies retain TODO labels. Industry experience is not used as publication evidence for agent research.

## Verification

Run `npm test` for project filtering, links to publications, statement headings, publication-to-agenda connections, legacy fragments and the archived PDF's presence. Run `npm run build` for Vite, the sitemap and route metadata. Browser checks cover the progression, publication-to-statement links, legacy redirects, broader-image links and responsive layouts.

See `docs/content-review-2026-09-12.md` for the evidence assessment and review scope.
