My proposed research asks **how AI coding agents can learn reusable formal reasoning from verification feedback, and apply it to verify and secure real software**. Recent work by [Anthropic and Theorem](https://www.anthropic.com/research/formal-verification) has demonstrated machine-checked proofs for real software, including properties derived from existing fuzz-test harnesses [[1]](https://www.anthropic.com/research/formal-verification). Such proofs extend sampled testing to all inputs in a stated domain, under explicit execution semantics. Their scope remains bounded by the harness, input domain, and modeled environment.

**Scaling proof generation creates a learning opportunity.** Constructing large proofs can be expensive, and related programs can share substantial proof structure [[1]](https://www.anthropic.com/research/formal-verification). [Theorem's verified-stack roadmap](https://theorem.dev/blog/verified-software-stack/) proposes verifying shared dependencies once and reusing their verified interfaces across dependent programs [[2]](https://theorem.dev/blog/verified-software-stack/). This motivates investigating what agents learn from checked derivations and unsuccessful proof attempts: which strategies transfer to unfamiliar programs, how local evidence composes, and whether accepted proofs establish the intended requirements. Reusing an existing proof artifact and learning a transferable strategy would be evaluated separately.

I propose three connected directions: **learning reusable proof strategies**, **compositional verification**, and **trustworthy verification feedback**. The goal is to make verification more efficient and reusable while keeping its guarantees explicit and independently checkable. Loop invariants provide an initial setting; the broader agenda includes function contracts, auxiliary lemmas, and proof decompositions for generating, repairing, and maintaining software.

## Learning reusable proof strategies

*What should a model learn from verification beyond a correct final answer?*

Large proofs offer many intermediate steps, but which parts teach a useful strategy remains an empirical question. I would study how agents learn to select useful assertions, propose auxiliary lemmas, and revise unsuccessful proof attempts. Training would compare final proofs with checked intermediate derivations and feedback-linked revisions to test what each contributes to transfer. Feedback would distinguish checked steps, counterexamples, unresolved obligations, and resource limits. Natural-language explanations could guide exploration, while formal claims would require independent checking.

The research would separate three mechanisms: retrieving an existing proof artifact, adapting a strategy during one investigation, and learning a strategy that transfers after training. Experiments would compare supervised learning from checked derivations, learning from verification feedback, and refinement during inference. Comparisons would control training data, tool access, and computational budgets.

Success would require transfer to unfamiliar program families or changed obligations, beyond reproducing familiar solutions. Loop-invariant tasks would provide an initial test of these hypotheses; contracts, lemmas, and other proof artifacts would extend the scope as evidence supports them.

## Compositional verification

*How can learned reasoning support larger verification tasks?*

Theorem's roadmap makes shared dependency proofs and verified interfaces central to scaling verification across a software stack [[2]](https://theorem.dev/blog/verified-software-stack/). Building on that motivation, I would investigate how agents decompose a verification goal into obligations, choose component contracts, and construct lemmas that connect local reasoning. An agent might need to relate an invariant inside a loop to a function's postcondition, or establish that one function supplies the assumptions required by another.

Reusing a local proof requires establishing that its assumptions hold in the new context. Local proofs would be checked together with their interface obligations, dependencies, and environmental assumptions. Experiments would test whether agents learn decompositions and interfaces that remain useful when a caller, component, or global obligation changes. Larger guarantees would be claimed only for the properties and execution model covered by that evidence.

Evaluation would progress from interacting loops and functions toward dependency-linked software components. Shared-library case studies would test when one checked component can support multiple callers, and which evidence must be revisited after a component changes. I would measure end-to-end verification success, unresolved interface obligations, proof reuse, and cost. Comparisons with direct proof generation would test whether learned decompositions make previously difficult tasks tractable under matched resources.

## Trustworthy verification feedback

*When does optimizing verification success improve reasoning about the intended property?*

A property extracted from a test harness can be useful while leaving intended behavior unspecified [[1]](https://www.anthropic.com/research/formal-verification). I would study failures in which an agent gains acceptance by weakening a specification, relying on an inconsistent premise, or changing the artifact being checked. For software repair, this includes patches that remove a failure by disabling required behavior. A valid proof establishes its stated theorem; assessing whether that theorem captures the intended requirement remains a separate responsibility.

Experiments would protect approved specifications and acceptance rules, bind evidence to the checked code and model, and audit the assumptions behind accepted results. Timeouts and unknown results would remain inconclusive. Counterexamples and failed obligations would guide further investigation without being treated as interchangeable failure signals.

Evaluation would include deliberately inadequate specifications, misleading feedback, and behavior-changing patches. Independent requirement checks and regression tests would assess whether an accepted repair preserves required behavior; passing those tests alone would not establish full correctness. I would measure accepted violations of independently assessed requirements, unsupported claims, useful verification coverage, and the effort needed to review evidence. Assurance would remain conditional on adequate specifications, faithful semantics, sound checking, and the stated trusted components.

## Evaluation and software-security applications

I would test transfer across program families, proof artifacts, and verification tasks, with related or transformed programs kept within the same data split. Comparisons would separate unchanged-artifact reuse, adaptation during inference, learned strategies, and additional search under matched total budgets. Measurements would include checked success, generalization, functional and security regressions, and total training and inference cost. Proof-checker acceptance, requirement coverage, and behavioral preservation would be reported separately.

I would begin with source-level tasks and extend to compiled components where suitable formal semantics and proof artifacts are available. Software-security applications would include validating repairs and establishing selected properties of code changes, with longer-term case studies on reusable evidence across shared dependencies [[2]](https://theorem.dev/blog/verified-software-stack/). Anthropic's work on Claude-generated proofs illustrates the relevance of independently checked evidence at software scale [[1]](https://www.anthropic.com/research/formal-verification). DeepSeek-Prover-V2 studies reinforcement learning and subgoal decomposition in formal mathematics [[3]](https://arxiv.org/abs/2504.21801), while Clover checks consistency among code, documentation, and formal annotations [[4]](https://arxiv.org/abs/2310.17807). My proposed emphasis is understanding what verification feedback teaches, how that learning transfers, and when the resulting evidence supports the intended software requirements. These are research questions, not claims of completed results.

## Research foundation and approach

My work provides experience in program reasoning, repair, and evaluation. [Loop-R1](/pubs/loop-r1) is a preprint on learning semantic reasoning for loop-invariant synthesis. [Defects4C](/pubs/defects4c) provides executable C/C++ repair tasks, and [RATCHET](/pubs/ratchet) studies retrieval-augmented repair. Our [execution-trace study](/pubs/code-semantics-execution-traces) found limited gains in the settings tested. These projects inform the experimental foundation; the broader transfer and compositional-verification goals above remain proposed work.

## References

[1] Anthropic and Theorem. [LLMs are making formal software verification feasible at a much larger scale.](https://www.anthropic.com/research/formal-verification) 22 October 2026.

[2] M. von Ebers, I. Hampton, H. Agrawal, L. Champine, R. Agrawal, and J. Gross. [Bootstrapping the Verified Software Stack.](https://theorem.dev/blog/verified-software-stack/) Theorem, 29 September 2026.

[3] Z. Z. Ren et al. [DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition.](https://arxiv.org/abs/2504.21801) 2025.

[4] C. Sun, Y. Sheng, O. Padon, and C. Barrett. [Clover: Closed-Loop Verifiable Code Generation.](https://arxiv.org/abs/2310.17807) SAIV, 2024.
