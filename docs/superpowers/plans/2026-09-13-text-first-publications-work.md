# Text-first Publications and Work Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/pubs`, `/work`, and every associated detail route into a calm, text-first portfolio in which index pages are self-contained and detail pages provide the images, evidence, and deeper engineering narrative.

**Architecture:** Keep all current routes, data sources, SEO behaviour, and shared profile framing. Replace card, grid, filter, map, and dashboard markup with a small editorial vocabulary: chronological rows on index pages, indented labelled paragraphs for industry work, full-width figures on detail pages, and collapsed citations. Page-specific facts continue to come from the existing publication/work data and the verified 58.com and Xiaomi case-study copy.

**Tech Stack:** React 18, React Router 6, Vite 5, Node's built-in test runner, semantic HTML, CSS.

**Spec:** `docs/superpowers/specs/2026-09-13-text-first-publications-work-design.md`

## Global constraints

- Preserve `/pubs`, every `/pubs/:key`, `/work`, `/work/58-web-infrastructure`, `/zh/work/58-web-infrastructure`, and `/work/xiaomi-portrait-ai`.
- Preserve existing S3 asset URLs, sitemap entries, static prerendering, SEO metadata, profile rail, and bilingual `html lang` behaviour.
- Do not invent latency, CPU, FPS, model-size, proprietary-model, or ownership claims.
- Keep index pages image-free. Use images only on the corresponding detail routes.
- Use at most three main content headings on an industry detail page. Prefer inline bold labels and indentation to additional sections.
- Do not introduce a new general-purpose component unless two live call sites share meaningful behaviour.
- Make each behaviour change test-first and commit after a coherent passing slice.

## Task 1: Lock the text-first index contract

**Files:**

- Create: `tests/text-first-portfolio.test.mjs`
- Modify: `src/pages/Publications.jsx`
- Modify: `src/pages/WorkProjects.jsx`
- Modify: `src/styles/apages.css`
- Modify: `src/styles/portfolio.css`
- Test: `tests/portfolio-links.test.mjs`
- Test: `tests/fifty-eight-project.test.mjs`
- Test: `tests/xiaomi-project.test.mjs`
- Test: `tests/work-index.test.mjs`

- [ ] **Step 1: Read the test-quality instructions before changing a test.**

Read the complete file:

```text
/Users/aa/.codex/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills/test-driven-development/writing-good-tests.md
```

- [ ] **Step 2: Add route-level failing tests for the Publications index.**

Reuse the Vite SSR setup already present in the industry-project tests. Render `/pubs` and assert user-visible behaviour:

```js
assert.match(html, /Publications/);
assert.match(html, /Details/);
assert.match(html, new RegExp(PUB_META.defects4c.brief.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.doesNotMatch(html, /<figure|<img/);
```

Count detail links from the rendered output and compare them with the number of publication records so every paper remains reachable.

- [ ] **Step 3: Add route-level failing tests for the Work index.**

Render `/work` and verify that the first page contains the essential narratives and detail links without filters, maps, or image-led cards:

```js
assert.match(html, /Shared asynchronous Web framework/i);
assert.match(html, /100M\+/);
assert.match(html, /custom Nginx module/i);
assert.match(html, /portrait semantic segmentation/i);
assert.match(html, /selfie-to-emoji/i);
assert.match(html, /Hexagon DSP|Kirin NPU/);
assert.match(html, /href="\/work\/58-web-infrastructure"/);
assert.match(html, /href="\/work\/xiaomi-portrait-ai"/);
assert.doesNotMatch(html, /<select/);
assert.doesNotMatch(html, /Project rooms|Filter projects/i);
```

Also assert at least one existing research-project title and its source link so simplification does not remove research work.

- [ ] **Step 4: Run the new test and confirm RED.**

Run:

```bash
node --test tests/text-first-portfolio.test.mjs
```

Expected: failures show current list figures and Work map/filter markup or missing first-page narrative.

- [ ] **Step 5: Rewrite `Publications.jsx` as a chronological text list.**

Remove `Figure` and `ResearchConnection` from the index. Render one semantic row per paper with a narrow year label and a text body:

```jsx
<article className="text-index-row publication-index-row">
  <div className="text-index-year">{pub.year}</div>
  <div className="text-index-body">
    <h2>{pub.title}</h2>
    <p className="text-index-meta">{pub.authors.join(', ')} · {pub.venue}</p>
    <p>{meta.brief}</p>
    <div className="text-index-links">{sourceLinks}<Link to={`/pubs/${pub.key}`}>Details</Link></div>
  </div>
</article>
```

Keep the existing publication order and data sources. Do not show figure statistics or large repeated year headings.

- [ ] **Step 6: Rewrite `WorkProjects.jsx` as a self-contained text overview.**

Remove navigation/query-state code, `ProjectMap`, filters, skill chips, visual cards, and the duplicate career timeline. Render:

```jsx
<section className="work-editorial-entry">
  <h2>58.com</h2>
  <p className="text-index-meta">Senior engineering work · Web infrastructure</p>
  <div className="work-indented-notes">
    <p><strong>Shared asynchronous Web framework.</strong> …</p>
    <p><strong>Implementation and constraints.</strong> …</p>
    <p><strong>Traffic routing.</strong> …</p>
  </div>
  <p className="work-detail-links"><Link to="/work/58-web-infrastructure">Details with diagrams</Link> · <Link to="/zh/work/58-web-infrastructure">中文</Link></p>
</section>
```

Follow it with an equivalent Xiaomi entry, a compact research-project list sourced from `WORK_PROJECTS`, and concise other-industry entries. Retain the CV link and all existing external source/publication links.

- [ ] **Step 7: Replace index-only visual styles with restrained editorial styles.**

Define shared `.text-index-*`, `.work-editorial-*`, `.work-indented-notes`, and `.work-detail-links` styles. Use thin rules, no shadows, no gradients, no pills, and no index images. At the current mobile breakpoint, stack the year above the paper body and reduce indentation.

- [ ] **Step 8: Run focused tests and reach GREEN.**

Run:

```bash
node --test tests/text-first-portfolio.test.mjs tests/portfolio-links.test.mjs tests/work-index.test.mjs tests/fifty-eight-project.test.mjs tests/xiaomi-project.test.mjs
```

Expected: all focused tests pass.

- [ ] **Step 9: Commit the index redesign.**

```bash
git add tests/text-first-portfolio.test.mjs src/pages/Publications.jsx src/pages/WorkProjects.jsx src/styles/apages.css src/styles/portfolio.css tests/portfolio-links.test.mjs tests/fifty-eight-project.test.mjs tests/xiaomi-project.test.mjs tests/work-index.test.mjs
git commit -m "refactor: simplify publication and work indexes"
```

Only add test files that actually changed.

## Task 2: Make every publication detail page editorial and evidence-safe

**Files:**

- Modify: `tests/text-first-portfolio.test.mjs`
- Modify: `src/pages/PublicationDetail.jsx`
- Modify: `src/components/ResearchConnection.jsx`
- Modify: `src/styles/apages.css`

- [ ] **Step 1: Add failing tests for a full and a sparse publication record.**

Render `/pubs/defects4c` and one record whose `abstract` is absent. Assert that:

```js
assert.match(fullHtml, /<figure/);
assert.match(fullHtml, /<details[^>]*class="[^"]*pub-citation/);
assert.match(fullHtml, /<summary>Citation<\/summary>/);
assert.doesNotMatch(fullHtml, /<details[^>]*open/);
assert.match(sparseHtml, new RegExp(sparseMeta.brief.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.doesNotMatch(sparseHtml, /undefined|null/);
```

Also count the page's main content headings and assert the editorial body does not recreate a stack of small dashboard sections.

- [ ] **Step 2: Run the detail tests and confirm RED.**

Run:

```bash
node --test tests/text-first-portfolio.test.mjs
```

Expected: the current always-visible BibTeX block and old section layout fail the contract.

- [ ] **Step 3: Rewrite `PublicationDetail.jsx`.**

Use one consistent article structure:

```jsx
<article className="publication-detail editorial-detail">
  {figure}
  <p className="publication-detail-summary">{meta.brief}</p>
  {meta.abstract && <section><h2>About this paper</h2><p>{meta.abstract}</p></section>}
  <ResearchConnection publicationKey={key} variant="editorial" />
  <details className="pub-citation">
    <summary>Citation</summary>
    <button type="button" onClick={copyCitation}>Copy BibTeX</button>
    <pre>{meta.bibtex}</pre>
  </details>
</article>
```

When `abstract` is absent, do not add synthetic prose. The verified brief, metadata, links, optional figure, supported research connection, and citation remain useful.

- [ ] **Step 4: Add an editorial variant to `ResearchConnection.jsx`.**

The editorial variant renders the existing connection and boundary as an indented note with bold inline labels and no new section heading. Preserve the current default/compact behaviour for any other live call site.

- [ ] **Step 5: Style the editorial publication page.**

Make existing figures full-width within the reading column, give the brief a stronger text treatment without a card, and style native `<details>` with a thin top rule. Keep BibTeX horizontally scrollable inside its own block without causing page overflow.

- [ ] **Step 6: Run focused tests and reach GREEN.**

Run:

```bash
node --test tests/text-first-portfolio.test.mjs tests/portfolio-links.test.mjs
```

Expected: all tests pass for publications with and without figures/abstracts.

- [ ] **Step 7: Commit the publication detail redesign.**

```bash
git add tests/text-first-portfolio.test.mjs src/pages/PublicationDetail.jsx src/components/ResearchConnection.jsx src/styles/apages.css
git commit -m "refactor: enrich publication detail pages"
```

## Task 3: Turn the 58.com detail routes into bilingual engineering narratives

**Files:**

- Modify: `tests/fifty-eight-project.test.mjs`
- Modify: `src/pages/FiftyEightWebInfrastructure.jsx`
- Modify: `src/styles/apages.css`

- [ ] **Step 1: Add failing EN/ZH structural tests.**

Keep the existing evidence and language assertions, then add checks that both routes contain exactly two major project headings, both diagrams, and the implementation, efficiency, and difficulty narratives in the matching language. Visual-grid removal is verified during browser QA rather than by locking tests to CSS internals.

```js
assert.equal((enHtml.match(/<h2/g) || []).length, 2);
assert.equal((zhHtml.match(/<h2/g) || []).length, 2);
assert.match(enHtml, /Implementation[.:]/);
assert.match(enHtml, /Efficiency[.:]/);
assert.match(enHtml, /What was difficult[.:]/);
assert.match(zhHtml, /实现[：:]/);
assert.match(zhHtml, /效率[：:]/);
assert.match(zhHtml, /难点[：:]/);
```

- [ ] **Step 2: Run the 58.com test and confirm RED.**

Run:

```bash
node --test tests/fifty-eight-project.test.mjs
```

Expected: current grid/dashboard markup and heading count fail.

- [ ] **Step 3: Consolidate the bilingual content model.**

Keep one EN and one ZH copy object with equivalent keys for page metadata and the two projects. Each project provides a heading, explanatory paragraphs, and short labelled notes for implementation, efficiency, and difficulty. Preserve the documented 100M+ request scale and explicitly state that unavailable latency/CPU measurements are not reconstructed.

- [ ] **Step 4: Rewrite the page markup around two project sections.**

For each project, use prose followed by a diagram and indented notes:

```jsx
<section className="case-study-section">
  <h2>{project.title}</h2>
  <p>{project.summary}</p>
  <figure className="case-study-figure">…</figure>
  <div className="case-study-notes">
    <p className="case-study-note"><strong>{labels.implementation}</strong> {project.implementation}</p>
    <p className="case-study-note"><strong>{labels.efficiency}</strong> {project.efficiency}</p>
    <p className="case-study-note"><strong>{labels.difficulty}</strong> {project.difficulty}</p>
  </div>
</section>
```

Describe the router as a custom Nginx module with an OpenResty-like programming goal, never as proof of a Lua/OpenResty implementation. Keep both language-switch links and localized diagram text.

- [ ] **Step 5: Replace the 58.com grid/dashboard CSS.**

Use the shared reading column, thin separators, full-width diagrams, and the same indentation rhythm as `/work`. Remove shadows, stat tiles, and small subheading grids that no longer have markup.

- [ ] **Step 6: Run focused tests and reach GREEN.**

Run:

```bash
node --test tests/fifty-eight-project.test.mjs tests/text-first-portfolio.test.mjs tests/industry-publishing.test.mjs
```

Expected: EN/ZH routes, language switching, diagrams, first-page links, and publishing checks all pass.

- [ ] **Step 7: Commit the 58.com redesign.**

```bash
git add tests/fifty-eight-project.test.mjs src/pages/FiftyEightWebInfrastructure.jsx src/styles/apages.css
git commit -m "refactor: present 58.com work as an editorial case study"
```

## Task 4: Turn the Xiaomi detail route into a richer image-led narrative

**Files:**

- Modify: `tests/xiaomi-project.test.mjs`
- Modify: `src/pages/XiaomiPortraitAI.jsx`
- Modify: `src/styles/apages.css`

- [ ] **Step 1: Add failing editorial-structure tests.**

Preserve assertions for both reconstruction images and the known deployment stack. Add checks for exactly three major headings, implementation/efficiency/difficulty narratives, reconstruction labels, and the absence of extra dashboard-only headings. Grid/panel removal is verified during browser QA rather than by locking tests to CSS internals.

```js
assert.equal((html.match(/<h2/g) || []).length, 3);
assert.match(html, /Implementation[.:]/);
assert.match(html, /Efficiency[.:]/);
assert.match(html, /What was difficult[.:]/);
assert.match(html, /illustrative reconstruction/i);
```

- [ ] **Step 2: Run the Xiaomi test and confirm RED.**

Run:

```bash
node --test tests/xiaomi-project.test.mjs
```

Expected: the current pill/grid/panel layout fails the new contract.

- [ ] **Step 3: Rewrite `XiaomiPortraitAI.jsx` as three narrative sections.**

Use these sections only:

1. Portrait semantic segmentation.
2. Selfie-to-emoji generation.
3. Mobile deployment and validation.

Place each existing image after the narrative it illustrates. Explicitly label both images as reconstructions rather than original product screenshots. Within each section, use bold inline labels inside indented paragraphs for implementation, efficiency, and difficulty. Keep PyTorch/CUDA, compression, graph conversion, Hexagon DSP, and Kirin NPU in their supported sequence.

- [ ] **Step 4: Preserve the evidence boundary in normal prose.**

State that the page explains the engineering path without reconstructing proprietary topology, loss design, FPS, latency, or model-size figures. Do not put this caveat in a decorative warning card.

- [ ] **Step 5: Remove obsolete Xiaomi visual-system CSS.**

Delete styles for pills, step/challenge grids, dark efficiency panels, and gradient takeaways after their markup is gone. Reuse `.case-study-*` editorial styles where the visual behaviour is genuinely shared with 58.com.

- [ ] **Step 6: Run focused tests and reach GREEN.**

Run:

```bash
node --test tests/xiaomi-project.test.mjs tests/text-first-portfolio.test.mjs tests/industry-publishing.test.mjs
```

Expected: the Xiaomi route, image publishing, and Work-index link all pass.

- [ ] **Step 7: Commit the Xiaomi redesign.**

```bash
git add tests/xiaomi-project.test.mjs src/pages/XiaomiPortraitAI.jsx src/styles/apages.css
git commit -m "refactor: enrich the Xiaomi portrait AI case study"
```

## Task 5: Remove visual residue and verify the complete site

**Files:**

- Modify if needed: `src/styles/apages.css`
- Modify if needed: `src/styles/portfolio.css`
- Modify if needed: `tests/text-first-portfolio.test.mjs`
- Verify: `dist/**`

- [ ] **Step 1: Audit changed pages for orphaned visual classes.**

Search for removed cards, filters, maps, pills, grids, panels, and gradients:

```bash
rg -n "industry-feature-visual|industry-fact-pill|industry-step-grid|industry-challenge-grid|industry-efficiency-panel|f8-detail-grid|f8-scale|project-map|work-filter" src/pages src/styles
```

Remove obsolete CSS introduced for these pages when there is no remaining live markup. Do not delete data helpers still covered by `tests/work-index.test.mjs`.

- [ ] **Step 2: Run the entire test suite.**

Run:

```bash
npm test
```

Expected: all tests pass with zero failures.

- [ ] **Step 3: Build every static route.**

Run:

```bash
npm run build
```

Expected: Vite build, sitemap generation, and prerender generation all finish successfully; all existing publication and work routes appear in the generated output.

- [ ] **Step 4: Check patch hygiene and generated language metadata.**

Run:

```bash
git diff --check origin/master...HEAD
rg -n '<html lang="(en|zh-CN)"' dist/work/58-web-infrastructure/index.html dist/zh/work/58-web-infrastructure/index.html
rg -n '/pubs/|/work/58-web-infrastructure|/work/xiaomi-portrait-ai' dist/sitemap.xml
```

Expected: no whitespace errors; English and Chinese pages have the correct language; expected routes remain in the sitemap.

- [ ] **Step 5: Perform desktop and narrow-mobile visual QA.**

Start a local preview:

```bash
npm run preview -- --host 127.0.0.1 --port 9015
```

At approximately 1440px and 390px, inspect `/pubs`, `/work`, `/pubs/defects4c`, `/work/58-web-infrastructure`, `/zh/work/58-web-infrastructure`, and `/work/xiaomi-portrait-ai`. Verify:

- the profile rail stacks correctly on mobile;
- reading width and paragraph rhythm are calm;
- year labels stack above publication entries at narrow width;
- detail images are legible and stay within the viewport;
- indentation narrows on mobile;
- there is no horizontal page overflow;
- `Details`, language-switch, source, and back links navigate correctly.

Stop the preview process after inspection.

- [ ] **Step 6: Commit any final responsive cleanup.**

If visual QA required changes, rerun Tasks 5.2–5.4 and commit only the affected files:

```bash
git add src/styles/apages.css src/styles/portfolio.css tests/text-first-portfolio.test.mjs
git commit -m "fix: polish text-first portfolio responsiveness"
```

Skip this commit when no files changed.

## Task 6: Review, publish, and merge the complete redesign

**Files:**

- Review: all changes from `origin/master...HEAD`

- [ ] **Step 1: Use the required completion skills.**

Read and follow `superpowers:requesting-code-review`, then `superpowers:verification-before-completion`, then `superpowers:finishing-a-development-branch`. Address concrete review findings with test-first changes and repeat the full verification if code changes.

- [ ] **Step 2: Confirm the branch is clean and contains only intended commits.**

Run:

```bash
git status --short --branch
git log --oneline origin/master..HEAD
git diff --stat origin/master...HEAD
```

Expected: clean worktree and only the design, plan, implementation, test, and responsive-polish commits for this redesign.

- [ ] **Step 3: Push the feature branch and open one pull request.**

Run:

```bash
git push -u origin codex/text-first-pub-work
gh pr create --base master --head codex/text-first-pub-work --title "Simplify publications and work portfolio" --body-file /tmp/text-first-portfolio-pr-body.md
```

The reviewed PR description must summarize the text-first indexes, richer detail pages, evidence boundaries, automated tests, build, and desktop/mobile QA. Create the temporary body file safely and do not commit it.

- [ ] **Step 4: Verify the remote head before merging.**

Run:

```bash
git fetch origin
git rev-parse HEAD
git rev-parse origin/codex/text-first-pub-work
gh pr checks codex/text-first-pub-work --watch
```

Expected: local and remote SHAs match and required checks pass.

- [ ] **Step 5: Squash-merge the complete batch and verify `master`.**

Run:

```bash
gh pr merge codex/text-first-pub-work --squash --delete-branch
git fetch origin
git log -1 --oneline origin/master
gh pr view codex/text-first-pub-work --json state,mergedAt,mergeCommit,url
```

Expected: the pull request is merged, `origin/master` contains the squash commit, and the user receives the PR URL and merge commit SHA. Do not mutate the unrelated root checkout branch.
