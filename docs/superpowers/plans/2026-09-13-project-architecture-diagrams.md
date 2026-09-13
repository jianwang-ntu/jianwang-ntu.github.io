# Project Architecture Diagrams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five readable, evidence-bounded architecture diagrams to the Xiaomi and 58.com project pages and publish the result.

**Architecture:** A reusable React figure component owns responsive scrolling, captions and full-size links. The page modules supply content and asset paths. Static SVG assets contain the architecture itself so they remain crisp, accessible and directly viewable.

**Tech Stack:** React, Vite, static SVG, CSS, Node test runner

**Spec:** `docs/superpowers/specs/2026-09-13-project-architecture-diagrams.md`

## Global Constraints

- Unknown internal modules must be explicitly marked as functional placeholders.
- Do not claim proprietary topology, loss functions, FPS, latency or model size.
- Keep the page text-first and preserve existing result images.
- The page viewport must not overflow at 320px; only the diagram viewport may scroll horizontally.

---

### Task 1: Lock the architecture-figure contract

**Files:**
- Modify: `tests/fifty-eight-project.test.mjs`
- Modify: `tests/xiaomi-project.test.mjs`
- Modify: `tests/industry-publishing.test.mjs`
- Create: `src/components/ArchitectureFigure.jsx`
- Modify: `src/styles/apages.css`

**Interfaces:**
- Consumes: page-provided `src`, `alt`, `caption`, `viewLabel`, `hint`, `priority`, `width`, and `height` props.
- Produces: `ArchitectureFigure` with `.architecture-scroll`, `.architecture-placeholder-note`, and a full-size asset link.

- [x] **Step 1: Write failing route and build assertions**

Assert that both 58 routes expose placeholder-role notes and two architecture figures; assert that Xiaomi exposes three named SVG diagrams, three full-size links, and placeholder-role wording. Add build assertions for all three Xiaomi SVG assets under 120 KB.

- [x] **Step 2: Run the focused tests and verify RED**

Run: `node --test tests/fifty-eight-project.test.mjs tests/xiaomi-project.test.mjs tests/industry-publishing.test.mjs`

Expected: FAIL because the reusable component and Xiaomi SVG references do not exist.

- [x] **Step 3: Implement the reusable figure**

Create a semantic figure whose image sits inside a locally scrollable wrapper. Render the evidence-boundary note and full-size link in the caption. Add narrow-screen CSS that applies `min-width` only inside `.architecture-scroll` and keeps the wrapper within the page width.

- [x] **Step 4: Integrate the component into both pages**

Replace the local 58 figure implementation with `ArchitectureFigure`. Insert one architecture figure in each Xiaomi section, before the existing result illustration or engineering notes. Supply captions that state the diagrams are system-level reconstructions.

- [x] **Step 5: Run the focused tests**

Run: `node --test tests/fifty-eight-project.test.mjs tests/xiaomi-project.test.mjs tests/industry-publishing.test.mjs`

Expected: route assertions progress to asset-publication failures until Task 2 adds SVGs.

### Task 2: Draw the five system architectures

**Files:**
- Modify: `public/images/projects/58/shared-middleware-architecture.svg`
- Modify: `public/images/projects/58/shared-middleware-architecture-zh.svg`
- Modify: `public/images/projects/58/nginx-traffic-router.svg`
- Modify: `public/images/projects/58/nginx-traffic-router-zh.svg`
- Create: `public/images/projects/xiaomi/portrait-segmentation-architecture.svg`
- Create: `public/images/projects/xiaomi/selfie-emoji-architecture.svg`
- Create: `public/images/projects/xiaomi/mobile-deployment-architecture.svg`

**Interfaces:**
- Consumes: static paths referenced by the case-study pages.
- Produces: standalone accessible SVGs with `<title>`, `<desc>`, complete flows, legends and explicit placeholder labels.

- [x] **Step 1: Redraw the two bilingual 58.com diagrams**

Show request lifecycle/common capabilities and data-plane/control-plane flows without claiming undocumented component names. Keep English and Chinese assets structurally equivalent.

- [x] **Step 2: Add the three Xiaomi diagrams**

Use placeholder boxes such as `Feature backbone (GCN / Transformer class)` and `Generator (GAN class)`. Distinguish inference flow from training/validation feedback and mark placeholders in the legend.

- [x] **Step 3: Run focused tests and verify GREEN**

Run: `node --test tests/fifty-eight-project.test.mjs tests/xiaomi-project.test.mjs tests/industry-publishing.test.mjs`

Expected: PASS.

### Task 3: Validate, integrate and publish

**Files:**
- Verify all files changed by Tasks 1 and 2.

**Interfaces:**
- Consumes: completed branch.
- Produces: merged master commit and verified live routes.

- [x] **Step 1: Run full verification**

Run: `npm test && npm run build`

Expected: all tests pass and all project assets appear under `dist/images/projects`.

- [x] **Step 2: Inspect desktop and 320px layouts**

Serve the production build, inspect both project routes, confirm diagram text can be reached in the local scroller and document width stays within viewport width.

- [ ] **Step 3: Commit, push and merge through a PR**

Commit the page, tests, styles, plan and SVG assets; push `codex/project-architecture-diagrams`; open a PR; squash-merge; verify the merged master includes every intended file.

- [ ] **Step 4: Verify deployment and live routes**

Wait for the deployment workflow, then verify the Xiaomi and 58.com pages and their architecture assets return successfully.
