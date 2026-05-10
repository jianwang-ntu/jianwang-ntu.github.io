# Beyond Compliance: Teaching LLM Client Simulators to Push Back

![Beyond Compliance: Teaching LLM Client Simulators to Push Back](/images/blog/beyond-compliance-teaching-llm-client-simulators-to-push.png)
*Image from [https://arxiv.org/pdf/2604.10507](https://arxiv.org/pdf/2604.10507)*


Counselor-training simulators have a credibility problem: the LLM-based "clients" used to rehearse therapeutic conversations are too agreeable, leaving trainees unprepared for the resistance that pervades real practice. A new paper from Liu et al. at Southeast University proposes **ResistClient**, a simulator that models challenging client behavior by grounding it in Client Resistance Theory and training the model to reason about *why* a client would resist before deciding how to respond.

## The compliance problem

The authors frame the gap precisely. Pre-aligned LLMs are trained to be helpful, polite, and forthcoming — exactly the opposite of what real clients often are. Existing simulators (Patient-Ψ, AnnaAgent, Yang et al. 2025) try to inject difficulty through prompt-level tricks: random emotion tags, low-receptivity flags, or instructions to withhold information. The paper argues these produce only "surface-level difficulty," because the underlying model has never been exposed to authentic resistance during pretraining.

![Beyond Compliance: Teaching LLM Client Simulators to Push Back — overview diagram](/images/blog/beyond-compliance-teaching-llm-client-simulators-to-push_diagram.png)


The deeper critique is theoretical: clinical literature treats resistance as a cognitive-affective process — a self-protective response to an intervention that touches a vulnerability — not as an isolated rude behavior. Simulators that only fit surface response patterns can't capture this, even when prompted to "be difficult."

## RPC: a dataset where clients actually resist

The authors' first move is data. They build the **Resistance-Informed Psychological Conversations (RPC)** dataset by rewriting an existing Chinese counseling corpus (ProPsyC). The pipeline has three pieces:

- **5P profiles.** Each session gets a structured client profile across Presenting, Predisposing, Precipitating, Perpetuating, and Protective factors — a clinical case-formulation schema rather than a shallow persona.
- **Trigger recognition.** Counselor turns are scanned for interventions likely to elicit resistance given the client's specific vulnerabilities (e.g., a reframe that challenges a perfectionist's self-image).
- **Localized rewriting.** Around detected triggers, DeepSeek-V3.2 rewrites the next 1–3 turns to express one of five resistance types — Controlling, Emotional, Defensive, Avoidant, or Compliant — with at most one resistance episode per session to prevent semantic drift.

The result is 1,849 sessions, 1,761 of which contain resistance. Compliant Resistance dominates (n=1,277), followed by Defensive (975) and Emotional (624); the authors note this reflects culturally Chinese patterns where overt confrontation is rare. Four licensed counselors verified annotations, with inter-rater Fleiss' κ around 0.74–0.77.

## RIMR: two-stage training with reasoning supervision

ResistClient is trained on Qwen3-8B via a framework the authors call **Resistance-Informed Motivation Reasoning (RIMR)**:

**Stage 1 — Supervised fine-tuning** on RPC, where the model learns to predict (reaction type, response, motivation reason) tuples conditioned on profile and history. The authors argue this is what recalibrates the base model's compliant prior.

**Stage 2 — Motivation Reasoning Reinforcement Learning (MRRL).** Before generating a response, the model must produce three structured reasoning steps:

1. **Profile Reflection** — what stable cognitive/emotional factors from the 5P profile are relevant?
2. **Situation Awareness** — what is the client's momentary state given the conversation?
3. **Reaction Decision** — what reaction type and behavioral characteristics should follow?

Counselors then score sampled outputs on a 0–5 scale across each reasoning step, the final response, and a *consistency* dimension that checks whether the response actually matches the decided reaction type. These expert ratings become process-level rewards in an offline GRPO setup, with a "consistency-aware reward reweighting" trick: the consistency reward is added to both the decision and response steps, so coupling between internal reasoning and surface output is back-propagated to the earlier reasoning tokens.

## What the experiments show

The paper reports three evaluations.

**Resistance simulation accuracy.** Replaying real counselor turns from RPC against 100 sampled profiles, ResistClient hits 70.38% precision, 78.95% recall, and 74.42 F1 on resistance triggering — outperforming GPT-5.1 (61.04 F1), DeepSeek-V3.2 (55.12), Kimi-K2-thinking (49.05), and GLM-4.6 (51.76). Smaller open-source models like Qwen3-8B (41.68) over-trigger resistance with high RTF but low precision. Human raters give ResistClient the top fidelity (1.63), rationality (1.58), and reasoning quality (2.61) scores.

The ablation matters: Qwen3-8B-SFT alone reaches 68.33 F1 — competitive with all closed-source baselines — suggesting the RPC dataset itself does most of the heavy lifting, with MRRL adding refinement on reasoning–response coherence.

**Realism in full sessions.** Against three existing challenging-client simulators (Patient-Ψ, AnnaAgent, Yang et al. 2025) using SoulChat2.0 as the standardized counselor, ResistClient achieves the lowest Client Cooperation Rate (60.84% — meaning more challenge), longest sessions (17.88 turns), highest coherence (0.73), and highest realism (2.39). Notably, AnnaAgent's random emotion injection compromises coherence, and Yang et al.'s low-receptivity control produces repetitive patterns; ResistClient is the only one that varies its resistance type with context.

**Stress-testing psychological LLMs.** When ResistClient is used to evaluate counselor models, both general-purpose (GPT-5.1, Gemini-3-flash, DeepSeek-V3.2, GLM-4.6) and specialized ones (MeChat, MindChat, Psyche-R1, SoulChat2.0) trigger client resistance 38–52% of the time. The authors report elevated counseling drift and limited progress across the board — domain-specific models do roughly match large general models, but no model handles resistance well.

## What it doesn't show

The authors are explicit about scope. RPC is built entirely from Chinese counseling sessions, and they note that the resistance distribution (heavy on Compliant, light on Controlling) reflects cultural norms that may not transfer. Human evaluation relies on four counselors, which the authors flag as a diversity-of-perspectives limitation. And the framework only models the *client* side — a counselor agent capable of managing resistance is left to future work.

There's also an implicit limitation worth naming: the agreement between DeepSeek-V3.2's resistance labels and human annotators landed at Cohen's κ = 0.72 after iteration, meaning the training signal itself contains some labeler–model disagreement.

## Takeaway

The paper's most useful contribution may not be ResistClient itself but the argument it operationalizes: that simulating "difficult" users requires modeling motivation, not just behavior, and that the alignment-induced compliance of base LLMs is a *training-data* problem before it's a prompting problem. For anyone building user simulators in domains where realistic non-cooperation matters — clinical training, sales, negotiation — RIMR offers a concrete recipe, and the gaps it exposes in current psychological LLMs suggest the next benchmark for that field should look a lot like this one.
