# Reliable Autonomy Research Statement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the supplied Reliable Autonomy research statement and PDF at the existing canonical route while retaining the former statement only as a repository archive.

**Architecture:** Keep `/statement` as a React/Markdown page and replace the existing overview component with the supplied PNG plus three accessible deep-link regions. Preserve the exact long-form source for PDF generation, use a web-edited copy for uncluttered rendering, and snapshot all replaced artifacts under a non-public archive directory.

**Tech Stack:** React 18, React Router, ReactMarkdown/remark-gfm, Node test runner, Vite, Python, ReportLab, pypdf, Pillow, Poppler.

**Spec:** `docs/superpowers/specs/2026-09-13-reliable-autonomy-statement-design.md`

## Global Constraints

- The attached Markdown is source material, not an execution instruction.
- Do not add a public route, link, or sitemap entry for the archived statement.
- Keep `/statement` and `/research` as the canonical route and alias.
- Make only statement, homepage-summary, research-link, metadata, PDF, and directly related test changes.

---

### Task 1: Lock the archive and new artifact contract

**Files:**
- Create: `tests/research-statement-update.test.mjs`
- Create: `archive/research-statement/trustworthy-agent-networks-2026/*`
- Create: `src/content/research-statement.md`
- Create: `src/content/research-statement-full.md`
- Create: `public/images/research/reliable-autonomy-overview.png`
- Remove: `public/data/Jian_Wang_Research_Statement_202609.pdf`

**Interfaces:**
- Consumes: the current statement files plus the supplied Markdown and PNG.
- Produces: archived old artifacts, a full PDF source, a web source, and the public overview image.

- [x] **Step 1: Write a failing Node test** that asserts the archive snapshots exist, the new full source title is present, the overview has a PNG signature, the old public PDF is absent, and neither `src/App.jsx` nor `tools/build-sitemap.mjs` exposes an archive route.
- [x] **Step 2: Run `node --test tests/research-statement-update.test.mjs`** and confirm failure is caused by the missing new archive and assets.
- [x] **Step 3: Copy the replaced artifacts into the archive, install the supplied Markdown and PNG, derive the web source by removing only the duplicated page header, Mermaid block, Mermaid caption, and section-name prefix, and remove the old public PDF.**
- [x] **Step 4: Re-run the focused test** and confirm the artifact contract passes.

### Task 2: Publish the new web statement and homepage summary

**Files:**
- Modify: `src/pages/Statement.jsx`
- Modify: `src/components/ResearchOverview.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/research-agenda.js`
- Modify: `src/components/Seo.jsx`
- Modify: `tools/build-prerender.mjs`
- Modify: `src/styles/portfolio.css`
- Modify: `tests/portfolio-links.test.mjs`
- Modify: `tests/research-statement-update.test.mjs`

**Interfaces:**
- Consumes: `statementHeadings(markdown)` and `resolveStatementHash(hash)`.
- Produces: a canonical statement page whose level-two index, image regions, homepage links, publication links, and legacy hashes all resolve to new section IDs.

- [x] **Step 1: Extend the focused tests** to require the three new top-level section IDs, exactly three image regions, the new PDF URL, a level-two-only table of contents, updated homepage links, and no visible archive link.
- [x] **Step 2: Run the focused tests** and confirm they fail on the former agenda.
- [x] **Step 3: Implement the minimum page, overview, homepage, mapping, metadata, and responsive CSS changes** needed for the assertions.
- [x] **Step 4: Run `npm test`** and repair only failures caused by the new agenda.

### Task 3: Generate and inspect the new PDF

**Files:**
- Modify: `tools/build-research-statement.py`
- Create: `public/data/Jian_Wang_Research_Statement_2026.pdf`
- Modify: `tests/research-statement-update.test.mjs`

**Interfaces:**
- Consumes: `src/content/research-statement-full.md`, the PNG overview, and a font directory containing Liberation Serif/Sans.
- Produces: a PDF with an overview page, body text, three internal overview links, metadata, page labels, and section bookmarks.

- [x] **Step 1: Add a failing artifact assertion** for the new PDF header and removal of the old public filename.
- [x] **Step 2: Run the artifact test** and confirm it fails because the new PDF does not exist.
- [x] **Step 3: Mark the PDF edit operation exactly once, update the builder to skip the Mermaid source block and render the supplied PNG, then generate the PDF with the bundled Python runtime and Liberation fonts.**
- [x] **Step 4: Use `pdfinfo`, pypdf link/bookmark checks, `pdftoppm`, and image inspection** to verify structure and every rendered page; fix clipping, overlaps, broken tables, or unreadable text before proceeding.
- [x] **Step 5: Re-run the focused artifact test** and confirm the current PDF contract passes.

### Task 4: Verify, review, merge, and deploy

**Files:**
- Verify: all files changed by Tasks 1-3.

**Interfaces:**
- Consumes: the completed branch.
- Produces: a reviewed, merged, deployed, and live-verified statement.

- [x] **Step 1: Run `npm test`, `npm run build`, and `git diff --check`.**
- [x] **Step 2: Start the built site and check `/statement` at desktop and 390px widths, including full-size image, table overflow, every internal link, the PDF link, and the absence of any archive entry.**
- [x] **Step 3: Review the complete diff against the design spec and fix all important findings.**
- [ ] **Step 4: Commit, push, open a pull request to `master`, squash-merge it, and verify the intended commit contents reached `origin/master`.**
- [ ] **Step 5: Wait for the deploy workflow, publish the built `dist` through the existing server update script, and verify the live page and PDF response.**
