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
Fonts: Arial and Arial Narrow. Font substitution can affect text width.

`formal-reasoning-diagrams.pdf` is a vector export of the PowerPoint with
selectable text and clickable links. Source links are also in every slide's
speaker notes. The overview headings link to the corresponding statement sections.

The ZIP includes the editable PowerPoint, PDF, and the four consolidated PNGs
used on the website. The PNGs remain the existing published figures; the PPTX
is a native-object reconstruction rather than an embedded copy of those PNGs.

Authoring source: `tools/redraw-formal-reasoning-diagrams.mjs` uses
`@oai/artifact-tool` and `@napi-rs/canvas` (for text measurement). It exports a
private candidate and slide previews; the published deck is separately validated.

Context sources:
[1] Anthropic and Theorem. LLMs are making formal software verification feasible
    at a much larger scale. 22 October 2026.
    https://www.anthropic.com/research/formal-verification
[2] Margaret von Ebers et al. Bootstrapping the Verified Software Stack.
    Theorem, 29 September 2026.
    https://theorem.dev/blog/verified-software-stack/

These diagrams describe proposed research, not completed experimental results.
The previous multi-agent deck remains at `/data/statement-diagrams/`.
