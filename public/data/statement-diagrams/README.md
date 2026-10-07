# Editable research statement diagrams

`statement-diagrams.pptx` contains four slides: the agenda overview and the three
research themes. Text, boundaries, flow lines and arrowheads are native editable
PowerPoint objects. No raster images are embedded. Flow lines are native paths;
use **Edit Points** to adjust their routes.

`statement-diagrams.pdf` is a vector export of that PowerPoint deck. The website
uses matching SVGs from `public/images/research/`, so labels stay sharp at any zoom.

Edit the PowerPoint in PowerPoint, Keynote or LibreOffice, then export to PDF.
For synchronized source changes, edit `tools/redraw-statement-diagrams.mjs` and run
it with Node.js and `@oai/artifact-tool` installed (or supply its module path via
`ARTIFACT_TOOL_MODULE`). It writes a draft PPTX to `.codex-finalizer/candidate.pptx`
and the four SVGs directly to `public/images/research/`. Review all four slides,
export the draft to PDF, and update the two download files in this directory.

The original AI-generated PNGs were committed and pushed before the redraw in
commit `e72816d`. The originals and SHA-256 manifest are preserved in
`archive/statement-images/2026-10-07-before-editable-redraw/`.
