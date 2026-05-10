# WebForge: Generating Browser Agent Benchmarks That Are Realistic, Reproducible, and Scalable at the Same Time

![WebForge: Generating Browser Agent Benchmarks That Are Realistic, Reproducible, and Scalable at the Same Time](/images/blog/webforge-generating-browser-agent-benchmarks-that-are.png)
*Image from [https://arxiv.org/pdf/2604.10988](https://arxiv.org/pdf/2604.10988)*


Browser agent benchmarks force a three-way tradeoff: live websites give realism but rot within months, sandboxed environments give reproducibility but feel sterile, and both demand expensive manual curation. A new paper from Tencent BAC and Tsinghua, *WebForge: Breaking the Realism-Reproducibility-Scalability Trilemma in Browser Agent Benchmark* (Yuan et al., arXiv:2604.10988), proposes a four-agent generation pipeline that tries to satisfy all three constraints at once, and uses it to build WebForge-Bench — 934 tasks across 7 domains and 3 difficulty levels.

## The trilemma the authors are trying to break

The paper opens with a concrete framing of why current benchmarks are stuck. Real-website suites like WebVoyager and Mind2Web suffer continuous content drift — Xue et al. (2025) found that nearly half of Mind2Web's tasks expired within two years, and WebCanvas reported 12% expiration in a single year. Controlled environments like WebArena are reproducible but, as the authors put it, "sterile": no pop-ups, no cookie dialogs, no network delays, and they require costly manual curation. Prior automated approaches (BenchAgents, AutoBencher, DyVal, OS-Genesis) handle text-only tasks or GUI trajectories, but none generate complete interactive web environments.

![WebForge: Generating Browser Agent Benchmarks That Are Realistic, Reproducible, and Scalable at the Same Time — overview diagram](/images/blog/webforge-generating-browser-agent-benchmarks-that-are_diagram.png)


The authors call this the *benchmark trilemma* and argue that no existing benchmark satisfies all three corners simultaneously. WebForge is their attempt to do so.

## The four-agent pipeline

WebForge decomposes benchmark construction into four sequential agents:

- **Plan Agent** turns a (domain, difficulty) pair into a structured task blueprint using a dual-LLM trick: a high-temperature creative model (T=2.0) drafts the task, then a low-temperature precision model (T=1.0) refines it, modifying 30–50% of the draft for logic verification and difficulty calibration. The output includes a seven-dimensional difficulty vector δ ∈ {1,2,3}⁷.
- **Generation Agent** turns the blueprint into a runnable static website. It searches real sites for visual references, collects real-world data (images, product info), wires up `localStorage`-based state for stateful interactions like shopping carts, and embeds anti-cheating mechanisms.
- **Refinement Agent** runs an Assess→Plan→Execute→Verify loop against a quality checklist. Crucially, it injects real-web noise — pop-up ads, cookie consent prompts, simulated network latency — to bridge the gap between sterile sandboxes and the real web.
- **Validation Agent** is the final gate. It runs inside the same Chromium browser the evaluated agents will face, replays the solution path step by step (capped at 50 actions), and only admits tasks where the final state matches ground truth. Because earlier agents work at the source-code level, the Validation Agent catches rendering-dependent issues, JS execution errors, and dynamic interaction failures invisible in the source.

Of 1,260 generated candidates, 934 (74.1%) pass validation and become the benchmark.

## Seven dimensions of difficulty, set a priori

Rather than rating tasks "easy/medium/hard" post hoc, the authors define seven independent difficulty axes — Jump Depth, Jump Breadth, Page Interaction, Visual Complexity, Info Complexity, Reasoning/Calculation, and Risk Factor — each graded on three levels with explicit thresholds (e.g. Jump Depth L1 = 1–2 page transitions, L3 = 6+). The aggregate level is then a compositional rule: Level 3 requires at least two dimensions at L3 *and* at least two more at L2, so high overall difficulty demands multi-faceted complexity rather than one extreme axis.

The authors position this as the first browser benchmark with a-priori, multi-dimensional difficulty control. Table 5 contrasts it with prior work: WebArena and TheAgentCompany have no difficulty stratification; VisualWebArena offers two post-hoc dimensions; WorkArena++ varies only instruction explicitness.

## What the evaluation reveals

The paper evaluates 14 model configurations spanning closed-source (Gemini-3-Pro/Flash, Claude-4.5-Sonnet, GPT-5.2/Mini/Nano), open-source (Kimi-K2.5, Qwen3-VL-235B, Qwen3-Omni-30B), and text-only (DeepSeek-V3.2, GLM-4.7) models, with all evaluations run in non-headless Chromium and capped at 50 browser actions per task. Three findings stand out.

**Difficulty stratification works.** Level 1 accuracy clusters above 73% for most models; Level 3 spans 2–58%, a 56-point gap between Gemini-3-Pro (58.0%) and Qwen3-Omni-30B (2.4%). The progressive gradient is visible across all seven dimensions individually — Visual Complexity produces the steepest L1→L3 drop (Gemini-3-Pro: 90.8%→55.8%), while Reasoning/Calc most cleanly separates strong from weak models.

**Cross-domain bias is invisible to aggregate scores.** Info Retrieval (D4, 56.9% average) and Content Creation (D7, 57.2%) are the easiest domains; Consumer Transaction (D1) and Content Moderation (D2) are tied as hardest at 48.3%. The authors attribute D4's ease to its alignment with retrieval-augmented patterns familiar to LLM pretraining, and D1/D2's difficulty to stateful multi-step workflows and policy-grounded judgment. The GPT series shows this most starkly: GPT-5-Mini scores 73.8% on D4 but 50.4% on D3 — a 23-point gap that single-domain benchmarks would never expose.

**Visual input matters, and the gap widens with difficulty.** Stripping screenshots costs Gemini-3-Pro 16.7 points overall (75.9% → 59.2%), and the gap grows from ~6 points at L1 to 20+ points at L3. The text-only models DeepSeek-V3.2 and GLM-4.7 score in the same range as multimodal models *evaluated text-only*, suggesting their middling overall ranks are partly an artifact of missing visual input rather than weaker reasoning.

The pipeline ablations confirm each stage contributes: removing Plan Agent's refinement drops the validation pass rate from 74.1% to 59.5%; further removing the Refinement Agent drops it to 51.4%.

## A worked example, end to end

The supplementary material walks one task — booking a wedding venue at Level 3 — through every stage. The Plan Agent's draft proposes 7 pages with 3 pricing tiers; the refined plan adds a Saturday constraint, a hidden 10% service fee, an extra "Review & Confirm" page, and tightens the answer space from 4 candidate dates to 1. The Generation Agent composes the resulting site by borrowing visual priors from multiple real wedding sites (Cedar Lakes Estate, WeddingWire, MND Farm Westerlo) rather than copying any one of them, and produces 21 files including programmatically generated charts. The Refinement Agent expands this to 31 files, replaces blocking `alert()` dialogs with inline DOM errors (so browser agents can actually read them), wires up dead navigation links, and injects a stochastic 5–15s "Schedule a Private Tour" popup plus a cookie banner.

Anti-cheating is two-layered: ground-truth values are Base64-encoded in `data.json`, and partial mistakes return *plausible but wrong* confirmation codes (`GEG-2026-05842` for a non-Saturday date, `GEG-2026-05991` for wrong catering, etc.) that share the format of the real code. An agent can't shortcut the workflow by reading source, and partial successes can be diagnostically distinguished from full successes.

The Validation Agent's 24-step trace is the most candid part of the paper: the agent dismisses the popup, navigates the heatmap and bloom chart correctly, then spends 8 attempts across 12 steps fighting the HTML date input before discovering it needs to click another field to trigger the `onchange` event. The authors present this as evidence that WebForge tasks test real browser interaction, not idealized APIs.

## What the paper does not claim

The authors are explicit about scope. WebForge environments are static, self-contained sites with no server backends — tasks needing real-time data (live prices, flight availability), true multi-user collaboration, or persistent server-side state are out of reach. Visual designs are model-generated rather than human-designed. And the cross-benchmark transferability argument is informal: the paper notes that the WebForge ranking (Gemini-3-Pro > Claude-4.5-Sonnet > Gemini-3-Flash > GPT-5.2) is consistent with the independent Browser Use Benchmark, but explicitly defers a formal cross-benchmark correlation study to future work.

The authors also flag that some difficulty distributions are skewed — Risk Factor concentrates 61.1% of tasks at L1 and only 1.4% at L3, because real-world web applications rarely include irreversible actions without warnings — and that the seven dimensions are not fully orthogonal (average pairwise Spearman ρ = 0.495), since aggregate difficulty rules induce co-variation.

## Takeaway

The strongest practical contribution is the demonstration that a fully automated pipeline can produce interactive browser benchmarks that don't decay, don't require manual curation, and aren't sterile. The seven-dimensional difficulty design, paired with cross-domain analysis, makes the benchmark itself diagnostically richer than any aggregate accuracy number — and that, more than the specific 75.9% Gemini-3-Pro score, is the part worth borrowing for anyone building agent evaluations next.
