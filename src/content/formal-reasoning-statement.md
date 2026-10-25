My proposed research investigates **how AI coding agents can learn reusable formal reasoning from verification feedback**. I am interested in how checked proof steps, counterexamples, and unresolved obligations help agents develop strategies that transfer across programs and verification tasks. The agenda connects learning proof strategies, composing verification evidence, and assessing whether optimization establishes the intended software properties.

The central question is: **how can AI coding agents learn reusable formal reasoning from verification feedback, and apply it to verify and secure real software?** Loop invariants offer an initial setting, with a longer-term scope encompassing function contracts, auxiliary lemmas, and proof decompositions. My goal is to help agents generate, repair, and maintain software with independently checkable evidence of correctness and security, under explicit specifications and assumptions.

## Learning reusable proof strategies

*What should a model learn from verification beyond a correct final answer?*

I would study how agents learn to select useful intermediate assertions, propose auxiliary lemmas, and revise unsuccessful proof attempts. Feedback would distinguish checked steps, counterexamples, unresolved obligations, and resource limits. Natural-language explanations could guide exploration, while formal claims would require independent checking.

The research would separate three mechanisms: retrieving an existing proof artifact, adapting a strategy during one investigation, and learning a strategy that transfers after training. Experiments would compare supervised learning from checked derivations, learning from verification feedback, and refinement during inference. Comparisons would control training data, tool access, and computational budgets.

Success would require transfer to unfamiliar program families or changed obligations, beyond reproducing familiar solutions. Loop-invariant tasks would provide an initial test of these hypotheses; contracts, lemmas, and other proof artifacts would extend the scope as evidence supports them.

## Compositional verification

*How can learned reasoning support larger verification tasks?*

I would investigate how agents decompose a verification goal into obligations, choose component contracts, and construct lemmas that connect local reasoning. An agent might need to relate an invariant inside a loop to a function's postcondition, or establish that one function supplies the assumptions required by another.

The challenge is establishing that the pieces fit. Local proofs would be checked together with their interface obligations, dependencies, and environmental assumptions. Larger guarantees would be claimed only for the properties and execution model covered by that evidence.

Evaluation would progress from interacting loops and functions toward larger software components. I would measure end-to-end verification success, unresolved interface obligations, proof reuse, and cost. Comparisons with direct proof generation would test whether learned decompositions make previously difficult tasks tractable under matched resources.

## Trustworthy verification feedback

*When does optimizing verification success improve reasoning about the intended property?*

I would study failures in which an agent gains acceptance by weakening a specification, relying on an inconsistent premise, or changing the artifact being checked. A valid proof establishes its stated theorem; assessing whether that theorem captures the intended requirement remains a separate responsibility.

Experiments would protect approved specifications and acceptance rules, bind evidence to the checked code and model, and audit the assumptions behind accepted results. Timeouts and unknown results would remain inconclusive. Counterexamples and failed obligations would guide further investigation without being treated as interchangeable failure signals.

Evaluation would include deliberately inadequate specifications and misleading feedback. I would measure accepted violations of independently assessed requirements, unsupported claims, useful verification coverage, and the effort needed to review evidence. Assurance would remain conditional on adequate specifications, faithful semantics, sound checking, and the stated trusted components.

## Evaluation and software-security applications

I would test transfer across program families, proof artifacts, and verification tasks, with related or transformed programs kept within the same data split. Retrieval, additional search, and larger computational budgets would be explicit baselines. Measurements would include checked success, generalization, functional and security regressions, and total training and inference cost.

Software-security applications would include validating repairs and establishing selected properties of code changes. Anthropic's work on Claude-generated proofs illustrates the relevance of independently checked evidence at software scale [1]. DeepSeek-Prover-V2 studies reinforcement learning and subgoal decomposition in formal mathematics [2], while Clover checks consistency among code, documentation, and formal annotations [3]. My proposed emphasis is understanding what verification feedback teaches, how that learning transfers, and when the resulting evidence supports the intended software requirements. These are research questions, not claims of completed results.

## Research foundation and approach

My work provides experience in program reasoning, repair, and evaluation. [Loop-R1](/pubs/loop-r1) is a preprint on learning semantic reasoning for loop-invariant synthesis. [Defects4C](/pubs/defects4c) provides executable C/C++ repair tasks, and [RATCHET](/pubs/ratchet) studies retrieval-augmented repair. Our [execution-trace study](/pubs/code-semantics-execution-traces) found limited gains in the settings tested. These projects inform the experimental foundation; the broader transfer and compositional-verification goals above remain proposed work.

## References

[1] Anthropic and Theorem. [LLMs are making formal software verification feasible at a much larger scale.](https://www.anthropic.com/research/formal-verification) 22 October 2026.

[2] Z. Z. Ren et al. [DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition.](https://arxiv.org/abs/2504.21801) 2025.

[3] C. Sun, Y. Sheng, O. Padon, and C. Barrett. [Clover: Closed-Loop Verifiable Code Generation.](https://arxiv.org/abs/2310.17807) SAIV, 2024.
