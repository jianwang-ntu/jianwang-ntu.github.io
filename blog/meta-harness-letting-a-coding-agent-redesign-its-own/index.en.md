# Meta-Harness: Letting a Coding Agent Redesign Its Own Scaffolding

A new paper from Lee et al. (Stanford, KRAFTON, MIT) argues that the code wrapping an LLM — the *harness* that decides what to store, retrieve, and show the model — can be optimized end-to-end by a coding agent that reads the full filesystem of prior attempts. The authors report that this approach beats hand-engineered harnesses on text classification, math retrieval, and the TerminalBench-2 agent benchmark, and substantially outperforms existing text optimizers in the same role.

## The setup the paper is pushing back against

Prior work on text optimization (OPRO, TextGrad, GEPA, AlphaEvolve/OpenEvolve, Feedback Descent, TTT-Discover) iteratively improves prompts or programs using feedback from earlier attempts. The authors note that all of these compress feedback aggressively: some condition only on the current candidate, others on scalar scores, others on LLM-generated summaries. Table 1 of the paper estimates the per-step context budget for each method at roughly 100–30,000 tokens.

![Meta-Harness: Letting a Coding Agent Redesign Its Own Scaffolding — overview diagram](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/meta-harness-letting-a-coding-agent-redesign-its-own_diagram.png)


The authors argue this is a mismatch for harness engineering. Harnesses are stateful, and a single design choice — what to keep in memory, when to retrieve — can ripple through many later reasoning steps. Compressed feedback strips out the signal needed to trace those downstream failures back to their cause. The paper situates its contribution in a regime where a single evaluation can produce up to 10 million tokens of diagnostic information, three orders of magnitude beyond the largest budgets in prior optimizers.

## What Meta-Harness actually does

Meta-Harness is an outer loop. At each iteration, a coding-agent proposer (Claude Code running Opus-4.6 in the paper's experiments) is pointed at a filesystem containing every previous candidate's source code, execution traces, and scores. It reads what it wants via standard tools (`grep`, `cat`), reasons about failure modes, and writes a new harness. The new harness is evaluated, its artifacts are logged, and the loop repeats.

The authors emphasize what is *not* in the loop: no parent-selection rule, no archive structure, no fixed mutation operators, no per-candidate summary template. The agent is free to inspect any prior harness. Empirically (Appendix A), in the TerminalBench-2 run the proposer reads a median of 82 files per iteration, split roughly evenly between prior source code (41%) and execution traces (40%), referencing more than 20 prior candidates per step.

The system maintains a Pareto frontier when objectives conflict (e.g., accuracy vs. context cost). Final test-set evaluation runs only on that frontier; the proposer never sees test results during search.

## What the experiments show

**Online text classification (GPT-OSS-120B classifier, three datasets: USPTO, Symptom2Disease, LawBench).** Initialized from zero-shot, few-shot, ACE, and MCE baselines and run for 20 iterations producing 40 candidates. The selected Meta-Harness reaches 48.6% average accuracy versus 40.9% for ACE and 40.0% for MCE — a 7.7-point gain over ACE — while using 11.4K context tokens versus ACE's 50.8K. Against text optimizers under matched compute, Meta-Harness matches OpenEvolve and TTT-Discover's final accuracy within four evaluations and finishes more than 10 points above them.

The ablation in Table 3 is the cleanest evidence for the paper's central claim. A scores-only proposer reaches 34.6 median / 41.3 best; adding LLM-generated summaries reaches 34.9 / 38.7; the full Meta-Harness interface (raw traces) reaches 50.0 / 56.7. The authors interpret this as evidence that summaries don't recover the missing signal — and may compress away the diagnostically useful detail.

A nine-dataset OOD evaluation finds the discovered harness generalizes: 73.1% average versus 70.2% for ACE, best on 6/9 unseen datasets.

**Retrieval-augmented math reasoning.** The authors give the system a 500K+ problem corpus (deduplicated and decontaminated against eval benchmarks), a 250-problem Olympiad search set, and 40 iterations. The selected harness — a four-route BM25 program with subject-specific gates for combinatorics, geometry, number theory, and a default route — improves average accuracy on 200 IMO-level problems by 4.7 points over no-retrieval across five held-out models (GPT-5.4-nano, GPT-5.4-mini, Gemini-3.1-Flash-Lite, Gemini-3-Flash, GPT-OSS-20B), and beats BM25 retrieval by 1.3 points on average. The paper is explicit that this is a single discovered harness transferred across models the search never saw.

**TerminalBench-2.** Initialized from Terminus-2 and Terminus-KIRA on the same 89 tasks used for both search and evaluation (the authors flag this and audit for overfitting via manual inspection and regex checks for task-string leakage). On Claude Opus 4.6, the discovered harness reaches 76.4%, beating Terminus-KIRA's 74.7% and ranking #2 on the leaderboard. On the weaker Haiku 4.5, it reaches 37.6%, beating Goose's 35.5% and taking the top reported result. The single modification responsible was purely additive: a pre-loop environment snapshot (working directory, installed languages, package managers, memory) injected into the initial prompt.

## A small narrative inside the TerminalBench-2 run

Appendix A.2 is the most novel-feeling part of the paper. It traces the proposer's reasoning across ten iterations as transcribed from the search log. The first two candidates bundle structural bugfixes with prompt-template rewrites and both regress. By iteration 3, the proposer explicitly identifies the confound — "The structural bugfixes were confounded with harmful prompt changes" — and runs the structural fixes alone. After six consecutive regressions on completion-flow and prompt edits, it pivots in iteration 7 to a purely additive environment-bootstrap intervention, justifying the choice as lower-risk because it avoids the previously fragile completion machinery. That candidate wins the run.

The authors offer this trajectory as qualitative evidence that filesystem access is enabling the proposer to form and test causal hypotheses rather than perform local mutation — the behavior they argue compressed-feedback optimizers cannot support.

## What the paper doesn't claim

The authors are reasonably candid about scope. The TerminalBench-2 setup performs search and evaluation on the same benchmark, framed as a discovery problem rather than a generalization claim; they cite leaderboard practice as precedent. The math-retrieval claim is for a single discovered harness — not for harnesses discovered per-model. Only one proposer (Claude Code with Opus-4.6) is studied; the paper flags the question of how strongly results depend on proposer capability. The authors also note that one Opus 4.6 leaderboard entrant (ForgeCode, 81.8%) outscores their result and that they could not reproduce that score from the public repository.

## What it opens up

The paper is best read as evidence that once a coding agent is capable enough to navigate a large filesystem of prior runs, harness search becomes a viable replacement for hand-iteration — at least when evaluations are cheap enough to run ~60 of them per discovery. The natural follow-up the authors gesture at is co-evolving harness code with model weights. The more immediate question for practitioners is whether the result will hold when "the proposer" stops being Opus-4.6 specifically, or whether the method inherits a hidden ceiling from whichever coding agent sits at the center of the loop.
