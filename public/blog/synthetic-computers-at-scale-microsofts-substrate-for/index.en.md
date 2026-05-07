# Synthetic Computers at Scale: Microsoft's Substrate for Training Long-Horizon Productivity Agents

![Synthetic Computers at Scale: Microsoft's Substrate for Training Long-Horizon Productivity Agents](/images/blog/synthetic-computers-at-scale-microsofts-substrate-for.png)

Productivity agents need rich user-specific context — files, project history, collaborator threads — to do realistic work, but real trajectories of that work are private and costly to collect. A Microsoft technical report by Ge, Peng, Cheng, and Gao proposes generating the *environment itself*: synthetic, persona-grounded computers populated with directory hierarchies and content-rich documents, then running long-horizon agent simulations on top of them to produce experiential training signal at scale.

## The argument: synthesise the context, not just the task

The authors frame three guiding principles. Productivity work is grounded in accumulated artifacts and history; success depends on using that context over long horizons; and synthetic data therefore has to synthesise the *context*, not just the task, or it degenerates into "generic, toy workflows." Prior persona-driven synthetic data work (Ge et al., 2024) gives them a billion-scale persona pool to start from. The contribution here is the pipeline that turns each persona into a fully populated computer and uses it as the environment for a month-long simulated work episode.

## How a synthetic computer is built

Construction proceeds in four stages, each conditioned on the last:

1. **Persona → user profile.** A short persona ("a financial advisor focused on…") is expanded into a detailed profile covering identity, career stage, current projects, named collaborators, document habits, naming conventions, and tidiness. The profile in the paper's running example is a senior financial advisor at a Denver wealth firm with five active projects.
2. **Filesystem policy.** A user-specific style sheet — system start time, drive layout, default paths, naming conventions ("uses version suffixes; rarely keeps default filenames"), tidiness level.
3. **File plan with a dependency graph.** Rather than sampling files independently, the planner emits a directed graph where later files are derived from, revise, or cite earlier ones. The example shows an internal asset-class workbook derived from a downloaded Vanguard PDF, then allocation models derived from that workbook, then a draft and final outlook PDF derived from those.
4. **Artifact instantiation.** Files are created in topological order so each one can condition on its predecessors. Public artifacts (e.g., a Vanguard white paper) are fetched from the web when possible; everything else is synthesised by an LLM agent equipped with document-creation skills (Anthropic's skills for non-Office formats; MiniMax's `minimax-docx`, `minimax-xlsx`, `pptx-generator`, `minimax-pdf` for Office files).

## How a month of simulated work runs

Each computer is then handed to a two-agent simulation. A **setup agent** (Claude Opus 4.6) reads the user profile and the populated computer, then writes ~5 deliverables that look like real work packages — for the financial-advisor example, a VCMM model-portfolio refresh, an HNW client onboarding, a rebalancing-framework v3 with peer sign-off, and so on, each with milestones, expected output files, and target dates. The setup agent also stages a small cast of **simulated collaborators** (manager, peer, client, compliance officer, junior associate, external data provider), each with a communication style and *privately held* reference files that only surface through later interaction. Some of those reference files contain deliberate snags — a 1.7% allocation discrepancy in a client's account statement, expense ratios entered as bps instead of percent — that the agent must catch.

The **work agent** (Claude Sonnet 4.6, run via the Claude Code SDK) then plays the user. It plans the week, breaks it into daily activities (deep work, review, outreach, admin), and executes one day at a time as separate sessions, restoring context each morning by reading the prior activity log and any new collaborator replies.

## What the simulations produce

In the preliminary run, the authors instantiate 1,000 synthetic computers and run one month-long simulation per computer. Reported averages:

- **Files**: ~112 pre-simulation → ~197 post-simulation; directory depth essentially unchanged, so the agent extends rather than restructures the environment.
- **Format mix**: DOCX 34.8%, XLSX 15.8%, PDF 13.9%, PPTX 8.5% — productivity artifacts dominate at 67.8% of files.
- **Effort per simulation**: 2,272 turns and 8.59 hours of agent runtime; 5.5 simulated collaborators and 31 communications per run.
- **File sizes** are non-trivial — final-deliverable PPTX averages 615 KB, PDF 142 KB — which the authors take as evidence the artifacts are content-rich rather than placeholder stubs.

A rubric-based judge (Claude Opus 4.6) scores 100 sampled computers, with most aggregate scores between 60% and 80%.

## Turning trajectories into skills, then testing transfer

The more interesting claim is that the trajectories are useful as training signal. The authors split 900 computers as a "training" set (used to extract experience, not to update weights) and 100 as held-out tests. From each training run they generate a retrospective report, extract per-occupation lesson and failure-mode lists, and have a skill-creator (Anthropic's `skill-creator`) write one occupation-specific skill per occupation cluster.

**In-domain.** On the 100 held-out computers, mean rubric score rises from **61.6% → 68.6%** when the work agent has access to the matching occupation skill, with the skill-augmented agent winning 83 of 100 paired comparisons. The gain scales with the number of training computers: 10 → no improvement (50/50), 100 → 64% wins, 500 → 75%, 900 → 83%. The authors attribute the scaling to broader occupation coverage and more reliable frequency estimates for which lessons matter.

**Out-of-domain (GDPVal).** The same skills transfer to GDPVal (Patwardhan et al., 2025), 220 standalone productivity tasks that are much shorter (31 turns, 17 minutes vs. 2,272 turns and 8.59 hours) and lack a populated computer. On Sonnet 4.6 — the same model the simulations were extracted from — the skill-augmented agent wins 105, ties 48, loses 67 (one-sided p=0.002). Cross-model transfer to Haiku 4.5 (104W/36T/80L, two-sided p=0.090) and Opus 4.6 (99W/50T/71L, p=0.038) is positive but weaker, which the authors read as Opus already avoiding many of the Sonnet-derived failure modes and Haiku struggling more with long-context pressure.

## What the failure modes look like

The released retrospective report (financial-advisor computer, scored 71.5%) is unusually concrete about how a long-horizon agent goes wrong, and worth reading on its own terms. The dominant failure mode is **cross-document inconsistency**: in the same deliverable package, the Conservative US Large Cap weight appears as 14% / 20% / 27.4% / 19% across four documents; Growth EM moves *down* in the workbook and *up* in the rollout memo; an alternatives recommendation cites three different commodity ETFs across three files. Secondary modes include **dropped collaborator feedback** (a peer's stress-test corrections flagged on day 17 are never applied), **blank outbound messages** to simulated collaborators (10 in the final week, suggesting the agent ran out of planning capacity), and **supporting workbooks not propagated** when narrative figures change. These read less like brittle benchmark failures and more like the kinds of mistakes a real junior analyst makes under deadline pressure — which is presumably the point.

## What it doesn't show

The paper is candid that the rubric judge is a "simple" baseline and that more advanced rubric generation is orthogonal to the main contribution. The "training" computers are used only to extract skills; no model weights are updated, so the loop the authors sketch — simulations → skills → distill into the model → reset skills — is proposed rather than demonstrated. Several limitations are explicitly raised: artifact visual style is too uniform across computers; the filesystems are tidier than real ones (no abandoned drafts, screenshots, or unrelated junk); simulated collaborators are reactive rather than autonomous agents with their own evolving state; and the web-availability check on "downloadable" files happens after planning, so some are quietly synthesised when retrieval fails.

The cost side is also worth noting: ~8.6 hours of agent runtime per simulation at Sonnet/Opus rates is substantial, and the authors do not report total compute or dollar cost for the 1,000-computer run.

## Released artifacts

To support follow-on work, the authors release **100 synthetic computers** (50 Windows-style, 50 macOS-style) and **retrospective analysis reports for 500 simulations** at `huggingface.co/datasets/microsoft/synthetic-computers-at-scale`.

## Takeaway

The bet is that the bottleneck for long-horizon productivity agents isn't task variety but *environment fidelity* — the messy, user-specific files and histories that real work is grounded in — and that personas plus careful planning give a tractable way to mass-produce that fidelity. The in-domain and GDPVal numbers are early but real, and the released retrospectives give the community a concrete artifact for studying how long-horizon agents actually fail. Whether the proposed self-improvement loop closes (signals → skills → weights → stronger simulator) is the open question the paper sets up rather than answers.
