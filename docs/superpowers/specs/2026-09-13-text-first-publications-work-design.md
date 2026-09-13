# Text-first Publications and Work Design

## Purpose

Simplify the Publications and Work sections so visitors can understand the portfolio without navigating through several layers or decoding a dense visual interface. Index pages should read like an academic CV with concise commentary. Detail pages should remain available for images, full explanations, and citation material.

## Design principles

- Text is the primary interface. Images support the detail pages but do not dominate index pages.
- The first Work page explains the important industry projects well enough to stand alone.
- Use indentation, whitespace, and short lead-in labels instead of cards, tables, chips, dashboards, or many nested headings.
- Preserve the shared profile rail and responsive stacking used across the site.
- Keep every existing public route and canonical URL stable.
- Do not add claims, metrics, ownership statements, or technical details that are not supported by the retained portfolio record.

## Publications index

`/pubs` becomes a compact chronological text list.

Each entry contains:

1. Publication year in a narrow left column.
2. Paper title.
3. Authors and venue on one subdued metadata line.
4. One sentence describing the paper's question or contribution, using the existing `brief` field.
5. A restrained link row: available source links followed by `Details`.

The index removes paper figures, placeholder figures, cards, chips, figure-count statistics, and per-entry research-agenda connection panels. Years remain visible but do not become large repeated section headings.

## Publication detail pages

Every `/pubs/:key` route uses one consistent editorial layout:

- Back link, title, authors, venue, and source links.
- One large paper figure when an existing figure is available.
- A prominent one-paragraph summary from the existing `brief`.
- A prose section combining the paper's question, method, and evidence using the existing abstract and metadata. It uses at most one main section heading rather than several small subsections.
- A short, indented connection to the current research agenda when the existing research-connection data supports it.
- Citation material inside a collapsed native `<details>` block so BibTeX does not dominate the page.

The page must remain useful when a paper has no figure or abstract. In that case it presents the verified metadata and source links without generating filler.

## Work index

`/work` becomes a text-first portfolio overview and removes the project-room map, filter controls, skill chips, large image cards, and duplicated career timeline.

The page order is:

1. A brief introduction and CV link.
2. Industry work, with 58.com and Xiaomi explained in full on the page.
3. Research projects as a compact text list.
4. Other industry experience that does not yet have a dedicated visual case study.

### 58.com on the index

One company heading and employment line introduce two indented project narratives:

- Shared asynchronous Web framework: why App-facing services, Mobile WAP, and business lines needed common request handling; middleware and common-component boundaries; the documented 100M+ daily request scale; compatibility, per-request overhead, and failure-isolation constraints.
- Nginx traffic router: central rule matching in the request path, upstream selection, configuration updates, bounded hot-path cost, and fallback behaviour. It is described as a custom Nginx module with an OpenResty-like programming goal, not as an OpenResty/Lua implementation.

The company entry ends with one `Details with diagrams` link and a Chinese-version link.

### Xiaomi on the index

One company heading and employment line introduce three indented narratives:

- Portrait semantic segmentation: subject masks, difficult boundaries, and real-scene failure cases.
- Selfie-to-emoji generation: GAN-based translation, identity preservation, and cross-expression consistency.
- Deployment efficiency: training in PyTorch/CUDA followed by compression, graph conversion, and validation on Hexagon DSP or Kirin NPU.

The company entry ends with one `Details with images` link.

### Research projects on the index

Research projects use the same compact row language as Publications: project title, year/venue, one summary sentence, skills as plain text, and source or publication links. No project is rendered as a card.

## Work detail pages

The 58.com and Xiaomi detail routes remain independent, shareable pages, but they become richer editorial narratives rather than collections of interface blocks.

Each detail page has no more than three main content headings. Within a section, implementation, efficiency, and difficulty are introduced with bold inline labels inside indented prose. Large images or diagrams separate the major project narratives.

### 58.com detail

The English and Chinese routes remain equivalent in structure and evidence. The page expands the two project narratives from the Work index, explains the request path and routing path around the diagrams, and makes the trade-offs explicit. The 100M+ request figure retains its evidence boundary; unavailable latency and CPU measurements are not reconstructed.

### Xiaomi detail

The page keeps the two existing illustrative reconstruction images and clearly labels them as reconstructions. It expands the segmentation, cartoonisation, and mobile-deployment narratives in prose. The page does not present proprietary topology, losses, FPS, latency, or model-size figures as facts when those records are unavailable.

## Visual system

- Reading column: approximately 720–800px inside the existing profile-rail frame.
- Surfaces: white background, thin separators, no shadows, dark panels, gradient takeaways, or pill groups.
- Hierarchy: page title, two or three main headings, then paragraph rhythm and indentation.
- Links: one consistent blue treatment; `Details` links are visually secondary to titles.
- Images: absent from index lists; full-width and captioned on detail pages.
- Mobile: profile rail stacks above content, year columns collapse above entries, and indentation narrows without producing horizontal scrolling.

## Data and component boundaries

- `src/data.jsx` and `src/data-pubs.js` remain the sources for publication facts.
- `src/data-work.js` remains the source for research and other industry entries.
- The two long industry summaries on `/work` use the already verified case-study copy rather than duplicating a new factual source.
- Publications and Work may share small text-row styles, but no new general component abstraction is required unless the implementation contains real repeated markup.
- Existing routing, sitemap generation, static prerender metadata, bilingual document language, and S3 asset paths remain unchanged.

## Verification

Automated tests must demonstrate that:

- `/pubs` renders text summaries and `Details` links without list-page figures.
- `/work` contains the core 58.com and Xiaomi implementation, efficiency, and difficulty content without the project map or filters.
- Research projects remain reachable from `/work`.
- Every publication and industry detail route still renders its expected figure when one exists.
- Publication citations are collapsed by default.
- The 58.com English and Chinese routes preserve language switching and localized diagrams.
- Production build, sitemap, and static prerender output continue to publish all existing routes.

Final review includes desktop and narrow-mobile checks for reading width, indentation, heading count, image sizing, and horizontal overflow.
