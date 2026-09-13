# Project Architecture Diagrams Design

## Scope

Improve the existing Xiaomi and 58.com case-study pages with architecture diagrams that explain each system as a complete flow. Keep the pages text-first: diagrams support the narrative and existing result images remain evidence illustrations.

## Diagram set

- 58.com shared web framework: product entry points, shared asynchronous lifecycle, middleware/common capabilities, business handlers, downstream services, response and failure boundaries.
- 58.com Nginx traffic router: separate request data plane from rule control plane; show attribute reading, rule matching, upstream selection, fallback, validation and atomic rule publication.
- Xiaomi portrait segmentation: source, feature backbone, contextual/detail branches, mask fusion, boundary refinement, composite and quality feedback.
- Xiaomi selfie-to-emoji: source alignment, identity/structure encoding, GAN-style generation, training-only objectives, expression outputs and inference path.
- Xiaomi mobile deployment: GPU training, compression, export, runtime compatibility, device accelerators and validation feedback.

## Evidence boundary

Unknown internal blocks may be shown when needed to keep a system flow complete, but each must be labelled as a functional placeholder, for example `Feature backbone (GCN / Transformer class)`. The legend and captions must say that these blocks describe roles rather than Xiaomi's or 58.com's verified proprietary implementation. Do not claim unretained topology, loss formulation, latency, FPS or model size.

## Presentation

Use one restrained visual language across the five diagrams: stage labels, nested rounded panels, arrows, short annotations and a small legend. On narrow screens, preserve readable diagram text through a locally scrollable image viewport; the page itself must not overflow. Every diagram has descriptive alt text, a concise caption and a full-size link.

## Page order

Within each project section: context text, architecture diagram, existing result image when available, then implementation/efficiency/difficulty notes.
