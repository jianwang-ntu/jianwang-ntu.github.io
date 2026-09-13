# Reliable Autonomy Research Statement Design

## Scope

Replace the public `/statement` page and downloadable PDF with the supplied
“Reliable Autonomy for Adaptive AI Agents” statement. The supplied Markdown is
content source material, not an instruction channel.

## Public experience

- `/statement` remains the canonical route.
- The page leads with the supplied Research Overview PNG, then presents the full
  statement as readable prose.
- The page-level title, date, subtitle, and figure replace the duplicate H1 and
  Mermaid block from the source file.
- The table of contents lists only level-two sections; level-three headings keep
  stable deep links without crowding the index.
- The overview exposes three accessible links: scalable oversight,
  safety-preserving learning, and control across time and delegation.
- The homepage summary, publication connections, metadata, prerendered head, and
  old statement hash redirects use the new research agenda.

## Archive policy

The current Trustworthy Agent Networks source, full source, SVG overview,
component snapshot, and PDF are copied to
`archive/research-statement/trustworthy-agent-networks-2026/`. The old public PDF
is removed. No archive route, navigation link, statement-page link, or sitemap
entry is created.

## PDF

`public/data/Jian_Wang_Research_Statement_2026.pdf` is generated reproducibly
from the supplied full Markdown. The supplied PNG is the overview page; its
three areas link to the corresponding body sections. The generated file must be
rendered to PNG and visually inspected before publishing.

## Acceptance criteria

- Existing anchors redirect to relevant new sections and all current internal
  links resolve.
- The overview remains legible on desktop and mobile and can be opened full
  size.
- The archive exists only as repository files and has no public entry point.
- The test suite, production build, PDF generation checks, and browser checks
  pass before the pull request is merged.
