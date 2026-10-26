My research asks **how AI coding agents can learn to write, repair, and maintain software whose required behavior is supported by independently checked evidence**. I study formal reasoning as a capability for reliable programming: choosing useful assertions, proposing function contracts, revising unsuccessful arguments, and connecting local guarantees across a program. The goal is to make software changes easier to justify and less likely to introduce functional or security regressions as implementations, dependencies, and requirements evolve.

[Anthropic and Theorem's work](https://www.anthropic.com/research/formal-verification) demonstrates AI-generated proofs for selected properties of real software under explicit assumptions. This motivates a broader learning question: what can an agent learn from constructing code and its supporting proofs that helps it make the next software change correctly? I propose three connected directions: learning verification-guided programming strategies, preserving guarantees across software changes, and aligning verification feedback with intended behavior. Automated theorem proving supplies a technical foundation, while software development and maintenance supply the problems and practical measures of success.

## Learning verification-guided programming strategies

**How can agents learn reasoning that improves the construction and repair of software?** I would train models on decisions linked to explicit verification obligations and checked consequences. Given code, an approved requirement, current assumptions, and previous attempts, an agent would decide which assertion to introduce, which supporting lemma to use, or how to revise an unsuccessful argument. Later experiments would connect these decisions to implementation and repair choices. The hypothesis is that learning how decisions affect verification outcomes produces strategies that transfer better than learning only from final code or completed proofs.

The first study would examine loop-invariant revision under controlled program changes. An invariant describes a property maintained by a loop. Changing initialization, loop updates, or the required result can make an earlier invariant invalid or insufficient. With executable code fixed, an agent would identify the blocked obligation and revise the supporting annotation. Some changed programs would satisfy the approved requirement and others would not. The agent would need to distinguish a failed proof strategy from evidence of a behavioral defect, and retain inconclusive cases.

This study would isolate the reasoning mechanism before extending it to code repair under fixed contracts. Comparisons would include training on completed proofs, training on obligation-linked decisions and revisions, retrieval, deterministic revision heuristics, and additional inference-time search. Models, available information, candidate sources, and checking resources would be controlled. Beyond proof acceptance, later repair experiments would measure required behavior, regressions, and total effort to obtain a checked repair.

## Preserving guarantees across software changes

**How can an agent change one part of a program without invalidating the guarantees needed by the rest?** [Theorem's verified-stack roadmap](https://theorem.dev/blog/verified-software-stack/) motivates reusing dependency proofs through verified interfaces. I would investigate how agents learn which contracts and intermediate claims make evidence reusable across functions, callers, and software versions.

For example, a library function may guarantee a result only when its caller satisfies a precondition. Updating the caller or strengthening the library's precondition can invalidate earlier reasoning. An agent must establish whether the old proof still applies, discharge the new obligations, and identify what needs revision. Local proofs would support a global property only through a checked composition argument that accounts for caller conditions, shared state, permitted modifications, and environmental assumptions under a common execution model.

Experiments would progress from interacting functions to selected dependency-linked components. Learned contract proposals and decompositions would be compared with fixed decompositions, direct proof generation, and retrieval under matched resources. Evaluation would measure checked completion, unresolved interface obligations, missed invalidations, and maintenance cost. Full rechecking would provide a reference within the encoded dependency model. The scientific question is whether learned reasoning improves the choice and reuse of proof structure, rather than merely retrieving familiar artifacts.

## Verification feedback aligned with intended behavior

**When does improving verification success improve the software?** I would study how feedback helps agents preserve required functionality while fixing defects. Feedback would distinguish accepted proofs, rejected proof attempts, validated counterexamples to specific obligations, and unknown or resource-limited outcomes. A counterexample to an auxiliary invariant would not automatically count as a software bug. Experiments would compare learning from these distinctions with learning from a single success-or-failure signal.

Approved specifications and acceptance rules would remain protected. Evidence would identify the exact code, specification, model, and assumptions checked. Independent requirement adjudication and held-out behavioral checks would assess whether an accepted repair addresses the defect and preserves required behavior. Tests would complement formal evidence while retaining their limitations. Evaluation would include weak specifications, unrealistic assumptions, and patches that remove a failure by disabling necessary functionality.

The [Verus guide for LLM proof development](https://verus-lang.github.io/verus/guide/llmforverusproof.html) already combines proof resources, verifier diagnostics, and restrictions against changing specifications or taking invalid shortcuts. My proposed contribution is to determine which feedback representations and learning interventions improve programming decisions beyond such workflows, with functional and security outcomes assessed separately from theorem acceptance.

## Experimental progression

I would begin with invariant revision in one verification environment, then test whether the learned decisions help repair code and preserve contracts across component changes. Related program families and transformations would remain in the same data split. Model weights and a training-only retrieval bank would be frozen before held-out evaluation. Results would separate retrieval, inference-time refinement, and learned transfer, count data-construction, training, inference, verification, and human-review effort, and distinguish model failures from tool failures. Success would mean more reliable software changes at an explicit cost, supported by evidence whose scope and assumptions remain clear.

## Research foundation and approach

My experience in loop-invariant synthesis, executable C/C++ repair benchmarks, retrieval-augmented repair, and code-model evaluation provides the experimental foundation. [Loop-R1](/pubs/loop-r1) is a preprint; [Defects4C](/pubs/defects4c) and [RATCHET](/pubs/ratchet) inform repair tasks and retrieval baselines. Our [execution-trace study](/pubs/code-semantics-execution-traces) found limited gains in its evaluated settings, motivating direct tests of which semantic evidence improves reasoning. The new learning and composition methods remain proposed research.

## References

[1] Anthropic and Theorem. [LLMs are making formal software verification feasible at a much larger scale.](https://www.anthropic.com/research/formal-verification) 22 October 2026.

[2] M. von Ebers et al. [Bootstrapping the Verified Software Stack.](https://theorem.dev/blog/verified-software-stack/) Theorem, 29 September 2026.

[3] Verus documentation. [Using LLMs to Help Write Verus Proofs.](https://verus-lang.github.io/verus/guide/llmforverusproof.html)
