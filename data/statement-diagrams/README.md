# Editable research statement diagrams

`statement-diagrams.pptx` contains four slides: the agenda overview and the three
research themes. Text, formulas, boundaries, number circles, flow lines and
arrowheads are native editable PowerPoint objects. Use **Edit Points** to adjust
flow paths. The human and robot are separate movable image objects cropped
directly from the original overview; their crop coordinates and checksums are
recorded in `public/images/research/roles/source.json`.

`statement-diagrams.pdf` is exported from that PowerPoint deck, with each page
cropped to the original diagram's dimensions. The deck retains white margins
because PowerPoint requires one canvas size for all slides. The website uses
matching SVGs at the original dimensions: 1448 × 1086 for the overview, 1870 × 841
for sections I and II, and 1881 × 836 for section III. All diagram text and lines
are vectors; only the original human and robot artwork are raster crops. The three
section diagrams share a white canvas and neutral grey panel fill. Clicking any
section diagram on the statement page opens its full-size SVG in a new tab.

`comparison.html` offers original and redrawn images side by side, plus an opacity
slider for aligned overlays. It uses the unchanged original PNG assets.

Edit the PowerPoint in PowerPoint, Keynote or LibreOffice, then export to PDF.
For synchronized source changes, edit `tools/redraw-statement-diagrams.mjs` and run
it with Node.js and `@oai/artifact-tool` installed (or supply its module path via
`ARTIFACT_TOOL_MODULE`). It writes a draft PPTX to `.codex-finalizer/restored/candidate.pptx`
and the four SVGs directly to `public/images/research/`. Review all four slides,
export the draft to PDF, then run `python tools/crop-statement-diagrams-pdf.py INPUT.pdf OUTPUT.pdf` (requires pypdf) to retain the original page sizes. Update the two download files in this directory.

The original AI-generated PNGs were committed and pushed before the redraw in
commit `e72816d`. The originals and SHA-256 manifest are preserved in
`archive/statement-images/2026-10-07-before-editable-redraw/`.

The first editable redraw from PR #138 is retained in
`archive/statement-images/editable-redraw-v1/`.
