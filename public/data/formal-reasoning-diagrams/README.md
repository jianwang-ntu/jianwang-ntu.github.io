# Formal reasoning research diagrams

Four slides redrawn from the consolidated monochrome figures, 26 October 2026:

1. Learning Reusable Formal Reasoning (overview)
2. Learning Reusable Proof Strategies
3. Compositional Verification
4. Trustworthy Verification Feedback

`formal-reasoning-diagrams.pptx` is the editable master. Labels are native
PowerPoint text boxes. Boxes, lines, arrows, symbols, and small icons are native
shapes or editable vector paths. There are no embedded raster pictures.
Select text to edit it; select a path and use Edit Points to adjust its geometry.
The canvas is 1672 × 941 CSS pixels (17.4167 × 9.8021 inches).
Font: Arial throughout, with larger body labels and consistent heading sizes.
Font substitution can affect text width.

`formal-reasoning-diagrams.pdf` is a vector export of the PowerPoint with
selectable text. Source citations appear in the website's HTML figure captions,
not inside the figures. They are also retained in every slide's speaker notes.
The overview headings link to the corresponding statement sections.

The website now displays vector SVG previews exported directly from this PDF.
Each preview opens its corresponding PDF page; the overview also preserves its
section-navigation regions. Downloadable PNGs are rendered at 2× resolution.
The ZIP includes the editable PowerPoint, PDF, four SVGs, four PNGs, and an
export manifest with source and output checksums.

The eight original published PNG/WebP assets were backed up before replacement:
`backups/pre-pdf-previews-20261026.zip` includes their original SHA-256 checksums.
The backup was committed and pushed before generating the replacement previews.
The previous masters with visible source footers are preserved separately in
`backups/pre-html-citations-masters-20261026.zip`.

Authoring source: `tools/redraw-formal-reasoning-diagrams.mjs` uses
`@oai/artifact-tool` and `@napi-rs/canvas` (for text measurement). It exports a
private candidate and slide previews; the published deck is separately validated.
After exporting the PowerPoint to PDF, run
`python3 tools/export-formal-reasoning-figures.py` to regenerate website previews
and the ZIP. This needs Poppler (`pdftocairo`, `pdftoppm`), Pillow, and pypdf.

Clarity and rigor review:
- Keep checked proofs, rejected attempts, validated counterexamples, and unknown
  outcomes distinct. A failed auxiliary invariant need not imply a software bug.
- Freeze model weights and retrieval banks before held-out evaluation. Separate
  related program families and report the three mechanisms independently.
- Check the composition argument as well as local proofs and caller obligations.
- Record evidence eligible for a declared use. Requirement checks remain
  potentially incomplete and do not turn theorem acceptance into blanket safety.
- Keep citations in HTML and speaker notes, with no visible source footers.

The preceding figures and editable masters are preserved in
`backups/pre-clarity-review-20261026.zip`.

Context sources:
[1] Anthropic and Theorem. LLMs are making formal software verification feasible
    at a much larger scale. 22 October 2026.
    https://www.anthropic.com/research/formal-verification
[2] Margaret von Ebers et al. Bootstrapping the Verified Software Stack.
    Theorem, 29 September 2026.
    https://theorem.dev/blog/verified-software-stack/

These diagrams describe proposed research, not completed experimental results.
The previous multi-agent deck remains at `/data/statement-diagrams/`.
