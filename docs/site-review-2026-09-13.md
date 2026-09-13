# Website editorial review — 13 September 2026

## Scope and changes

Reviewed the main pages, 11 publication details, the English and Chinese 58.com case studies, Xiaomi's case study, the research statement, and the reading-note collection. The aim was a quieter text-first site, clear attribution, and no unsupported additions to the author's record.

- Removed the repeated research diagram from Home, duplicated contact links and explanatory boilerplate, and overlapping CV/publication content. Kept the full interactive overview on the statement page and figures on detail pages.
- Kept the distinction between completed work and proposed research. Separated portrait segmentation from GAN selfie cartoonisation. Preserved the stated absence of historical performance measurements and the illustrative status of reconstructed industry diagrams.
- Removed the statement's internal drafting-provenance section and three unused references. The nine linked SVG blocks, company-sample percentage definitions, full downloadable PDF, and hidden-web-appendix behavior remain unchanged.
- Moved 12 obsolete, unlinked downloads out of `public/` into `archive/legacy-downloads/`. These files remain recoverable in Git; there is no website entry point. Repository archiving is not confidential storage.
- Consolidated one duplicate company/AI note into the other version. The old article URL redirects to the retained note, with a matching canonical page and no duplicate sitemap entry. There are now 41 indexed notes, each available in English and Chinese.
- Replaced truncated English list summaries; corrected source types, person names, technical terminology, and several overbroad summaries. Removed five superseded or erroneous covers into `archive/blog-images/` and removed references to one additional missing cover (its remote URL also returned 403).
- Corrected publication titles, summary scope, and BibTeX name delimiters. Added all 11 publication details to the sitemap. Aligned static and runtime page metadata and removed duplicate/stale article JSON-LD during navigation.

## Evidence checks

Corrections were tied to the source record rather than inferred from the generated covers:

- [MAD Podcast video](https://www.youtube.com/watch?v=DhD1zZ8w8Mw): Yann Dubois, not Jan Leike; host Matt Turck.
- [Max Schoening talk](https://www.youtube.com/watch?v=mCO-D3pkviM) and [Cat Wu interview](https://www.youtube.com/watch?v=PplmzlgE0kg): corrected speaker spellings.
- [Ryan Lopopolo's OpenAI article](https://openai.com/index/harness-engineering/): verified the surname. This related article was not substituted for the missing original keynote URL.
- [Geoffrey Huntley's biography](https://ghuntley.com/bio/): corrected the given name.
- [Anthropic's NLA article](https://www.anthropic.com/research/natural-language-autoencoders) and [technical report](https://www.transformer-circuits.pub/2026/nla/index.html): distinguished withheld implanted-motivation data from NLA training, and retained the possibility of incorrect explanations.
- [RNNRepair at PMLR](https://proceedings.mlr.press/v139/xie21b.html): official title and a bounded summary of RNN diagnosis/repair.
- [ASE AIGC detector paper](https://conf.researchr.org/details/ase-2024/ase-2024-research/68/An-Empirical-Study-to-Evaluate-AIGC-Detectors-on-Code-Content): distinguished code-related Q&A, summarization, and generation; removed the ambiguous all-code interpretation of the dataset count.
- [YC's self-improving-company talk](https://www.youtube.com/watch?v=X_JsIHUfUjc): retained one attributed note rather than two overlapping articles.

An independent diff review identified two additional summary corrections: Heuristic Learning improves pure-code policies without neural-weight updates; ATBench evaluates detection and explanation of trajectory risks. Both were applied before final verification.

## Verification

- `npm test`: 39 passed, 0 failed, including production build and prerender assertions.
- `git diff --check`: clean.
- Actual browser checks: nine principal routes and 11 publication-detail routes at 1280 px, 390 px, and 320 px. Each has one H1 and no document-wide horizontal overflow. The statement diagram intentionally scrolls within its own narrow-screen container.
- All 41 reading notes rendered in both languages at 390 px: 82 views checked for title/language state, article loading, one managed JSON-LD block, and page overflow.
- Functional checks: the consolidated article redirects correctly; switching Chinese back to Home resets document language and clears article JSON-LD; an SVG block navigates to its statement heading; the publication citation is initially collapsed and expands to BibTeX.
- Build checks cover publication titles/sitemap entries, archived-file exclusion, note metadata parity, translation presence, local Markdown image references, aliases, and all nine SVG targets.

## Limits

This is a site-wide editorial, integrity, and rendering review, not a claim-by-claim independent verification of every third-party talk. Two legacy notes still lack their original source URL (the therapist note and the Ryan Lopopolo keynote); the reader-facing source line explicitly marks that absence. No URL or historical project metric was invented to fill a gap. External hosting and links can change after this review.
