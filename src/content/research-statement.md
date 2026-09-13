My research focuses on how AI agents can become more capable through learning and interaction while remaining safe, reliable, and subject to meaningful human control. I study three connected questions: what evidence makes oversight effective, which learning signals preserve safety through adaptation, and how control survives long tasks and delegation. My long-term goal is to enable sustained autonomy in scientific research and enterprise work, including AI systems that contribute to their own development. I aim to develop learning and control methods whose benefits persist as models, tools, and workflows change.

This agenda addresses a concrete industrial transition. Frontier-lab research and engineering work increasingly combines post-training, interactive environments, feedback quality, action monitoring, security boundaries, and the cost of human review. The supporting role audit remains in the downloadable PDF. OpenAI's Auto-review and Meta's Muse show how learned judgment and separately enforced permissions are already being combined in deployed systems [5,13]. These developments motivate my central question: **how can the evidence and controls that justify delegation remain effective as the agent and its environment evolve?**

### Research foundation and approach

My work on code language models and program repair provides a foundation in testing learned behavior against execution. Our execution-trace study found limited benefit from trace-based information in the investigated fine-tuning and inference settings [1]. Defects4C grounds repair evaluation in reproducible C/C++ faults and tests [2]; RATCHET studies retrieval-augmented repair [3]. These projects inform my approach: identify the failure mechanism, design an intervention, and test its effect on independently assessed behavior. I will extend this approach to agent learning and control, using software as an initial experimental domain and testing transfer to other digital workflows.

Throughout this program, **reliability** means sustained completion of the intended task under stated operating conditions; **safety** concerns specified harmful outcomes; and **authorization** determines who may act on which resources. I measure them separately. An accurate result may still disclose restricted data, and a blocked action may prevent harm while leaving useful work unfinished.

> The next three sections develop the research problems. All future contributions are proposed; no new experimental results are asserted.


---

## I. Scalable oversight under adaptation

*What must a supervisor observe to justify an agent's next action?*

> **Problem definition.** Given an acting agent, a partially observed environment, explicit task and authority requirements, and a limited review budget, learn an oversight policy that selects evidence and interventions before consequential actions. The target is fewer harmful or unauthorized effects at comparable useful task completion and total cost, including when the actor or an external attacker adapts to the review policy.

The difficulty is that the actor can influence both its behavior and the account on which it is judged. In a research workflow, an agent may explain why an export is necessary while omitting that a tool endpoint has changed. A stronger language-model judge cannot infer an unobserved destination reliably from that explanation alone. AI Control already studies supervision under intentional subversion [4], and Auto-review evaluates actions at a sandbox boundary while acknowledging residual attacks and incomplete visibility [5]. I would study how the available evidence determines the limits and effectiveness of oversight.

### Direction 1: Learn which evidence changes the decision

I would develop evidence-acquisition policies that choose among service-state queries, sandboxed execution, artifact checks, model review, and human inspection. A candidate method would estimate the expected reduction in decision error from each check, accounting for delay and the consequences of acting before the check completes. It would then use the result to permit an action, request a safer plan, or defer. The intended advance is a method for selecting decision-relevant observations and recognizing when the available view is insufficient. A check needs a stated property: a signed receipt establishes origin, while a trusted execution test may establish a bounded behavioral fact.

### Direction 2: Preserve oversight signals under optimization

I would train and evaluate monitors against actors that learn to exploit their blind spots. The study would vary the actor's control over evidence, its knowledge of the monitor, and the capability gap between them. Reasoning traces, when available, would be tested alongside externally collected evidence; neither verbal explanations nor the use of a different model establishes independence. My working hypothesis is that selective access to protected observations can improve oversight robustness beyond transcript-only review, and that its value depends on which facts the actor can conceal or alter.

### Contribution and decisive evidence

The contribution sought is a learned oversight policy together with an account of its information requirements. I would compare it with a stronger transcript reviewer, fixed checks, random audits, and an evidence-equipped reviewer under matched budgets. The evaluation would separate failure to detect a violation from failure to enforce a correct decision. An advantage that disappears under adaptive attacks or depends on privileged access unavailable in deployment would narrow the claim. Initial theory would characterize observation and intervention requirements in explicit models; empirical work would establish how far those conditions transfer.

---

## II. Safety-preserving learning and feedback

*Which changes to training improve the agent's subsequent behavior?*

> **Problem definition.** Given an assessed agent and a specified sequence of capability updates, design learning signals and update-selection methods that improve useful performance while limiting regression on fixed safety requirements. When feedback itself is repaired, the target is the resulting agent's independently measured behavior after learning. A better evaluator score alone is insufficient evidence of improvement.

Adaptation changes behavior and the data available for later learning. Fine-tuning can compromise safety [6]; RUBAS supplies trajectory-level rubric rewards [7], and ToolShield develops defensive experience for multi-turn tool use [8]. Building on these foundations, I would investigate which distinctions learned from feedback transfer to new environments and persist through subsequent capability training.

### Direction 1: Train on consequential decision differences

I would construct matched task pairs that preserve the legitimate goal while changing the recipient, data-use scope, instruction source, or a tool's external effect. Training would combine outcome feedback with separately checked constraint labels and retain a feasible authorized solution. The hypothesis is that these contrasts teach the dependence of a decision on authority and consequences. Comparisons with matched-data adversarial training, ordinary safety fine-tuning, and rubric-based RL would measure transfer and retention after further capability updates. Gains from broad refusal would not support the hypothesis.

### Direction 2: Select feedback repairs by their learning effects

Which defect in a reward model, evaluator, or simulator most needs repair before the next training stage? A frequent labeling error may have little learning effect, while a rare exploitable reward can redirect the policy. I would predict how candidate repairs change future trajectory distributions, using controlled interventions and limited training branches. The target is a reusable estimator and repair-selection rule, tested against prioritization by current error frequency, severity, or judge disagreement.

The causal target is the difference in independently assessed outcomes after matched updates with and without a repair. Predictions must account for adaptation: the largest reward change need not produce the best behavior. Automated alignment research demonstrates gains on well-characterized failures [9]. I would study reliable feedback selection when optimization alters which failures matter.

### Contribution and decisive evidence

I would seek learning methods with measurable safety retention and repair-effect predictions that generalize to unseen repairs or update stages. Validation would keep outcome criteria fixed, isolate test access, and measure actual post-update behavior over multiple seeds. The cost of selecting repairs, including exploratory training branches, counts toward the budget. Failure to beat simple repair-priority rules at matched total cost would reject the added machinery. Improvements confined to a single model, task family, or update schedule would be reported at that scope.

---

## III. Control across time and delegation

*When do local restrictions remain sufficient for a changing workflow?*

> **Problem definition.** Given a long-running workflow, identified principals, changing tools or permissions, and global constraints, design a protocol that preserves authorized execution through handoffs and partial failure. The target is useful joint completion with bounded violations and intervention cost under an explicit adversary and trusted execution boundary.

An agent replacement, permission revocation, or tool change can invalidate approvals for pending work. Cooperation adds another difficulty: an agent with private-data access can pass a derived artifact to another with external communication privileges. Isolated checks may miss the resulting disclosure. I would study what state control must retain across time and organizational boundaries.

### Direction 1: Carry constraints through task decomposition

I would bind delegated work to its principal, permitted operations, data dependencies, and validity conditions. Learned components would propose task decompositions; an independent execution layer would check machine-enforceable restrictions. The theoretical target is to identify when local checks imply a stated workflow property, and counterexamples when they do not. Identity, evidence quality, authorization, and task correctness remain distinct; unknown semantic effects require conservative handling or human judgment.

### Direction 2: Revise control when its assumptions change

I would identify which pending decisions require renewed evidence after a change, tracking dependencies behind approvals to suspend or replan affected work while preserving valid progress. This builds on information-flow defenses such as CaMeL and Fides [10,11]. EvoSafeHarness already optimizes policies and executable controls for a frozen model in a target domain [12], and Muse separates its acting runtime from permission authority [13]. My target is control that evolves during an ongoing workflow while retaining an explicit basis for each permitted effect.

### Contribution and decisive evidence

Comparisons would include stateful access control, information-flow enforcement, whole-workflow suspension, and learned harnesses with the same information and authority. I would measure unauthorized effects, completion, review demand, recovery costs, and unresolved obligations. Formal guarantees would apply only to the modeled property and trusted components; rollback cannot erase external disclosure. Cross-agent tests would include compromised participants and messages, without assuming shared objectives or protocol compliance.

### Long-term direction: AI-assisted research that can improve safely

Together, these problems support a longer-term program in autonomous research and AI development. Agents could propose changes to training data, tools, and evaluators while separate processes establish whether those changes improve behavior and preserve control. I would begin with oversight and learning, then extend validated mechanisms to delegation. The scientific ambition is to understand when useful autonomy can grow without outrunning the evidence needed to supervise it.

---

## References

*Primary sources checked on 13 September 2026*

[1] J. Wang et al. [Do Code Semantics Help? A Comprehensive Study on Execution Trace-Based Information for Code Large Language Models.](https://aclanthology.org/2025.findings-emnlp.548/) Findings of EMNLP, 2025.

[2] J. Wang et al. [Defects4C: Benchmarking Large Language Model Repair Capability with C/C++ Bugs.](https://arxiv.org/abs/2510.11059v2) ASE, 2025; arXiv:2510.11059v2.

[3] J. Wang et al. [Ratchet: Retrieval Augmented Transformer for Program Repair.](https://doi.org/10.1109/ISSRE62328.2024.00048) ISSRE, 2024, pp. 427-438.

[4] R. Greenblatt et al. [AI Control: Improving Safety Despite Intentional Subversion.](https://arxiv.org/abs/2312.06942v5) ICML, 2024; arXiv:2312.06942v5.

[5] M. Trebacz et al. [Auto-review of agent actions without synchronous human oversight.](https://alignment.openai.com/auto-review/) OpenAI Alignment, 30 April 2026.

[6] X. Qi et al. [Fine-tuning Aligned Language Models Compromises Safety, Even When Users Do Not Intend To!](https://arxiv.org/abs/2310.03693) arXiv:2310.03693, 2023.

[7] X. Q. Loye et al. [RUBAS: Rubric-Based Reinforcement Learning for Agent Safety.](https://arxiv.org/html/2606.04051v1) arXiv:2606.04051v1, 2 June 2026.

[8] X. Li et al. [Unsafer in Many Turns: Benchmarking and Defending Multi-Turn Safety Risks in Tool-Using Agents.](https://arxiv.org/abs/2602.13379) arXiv:2602.13379, 2026.

[9] Chen Yueh-Han, J. Wen, and J. H. Kirchner. [Automated Researchers Can Mitigate Well-Characterized Alignment Failures.](https://alignment.anthropic.com/2026/automated-alignment-researchers/) Anthropic Alignment Science, 2026.

[10] E. Debenedetti et al. [Defeating Prompt Injections by Design.](https://arxiv.org/abs/2503.18813v2) CaMeL; arXiv:2503.18813v2, 2025.

[11] M. Costa et al. [Securing AI Agents with Information-Flow Control.](https://arxiv.org/abs/2505.23643v2) Fides; arXiv:2505.23643v2, 2025.

[12] N. Li et al. [EvoSafeHarness: Evolving Model- and Domain-Specific Harnesses for Securing Agents.](https://arxiv.org/abs/2609.05903v1) arXiv:2609.05903v1, 5 September 2026.

[13] T. Sheasha. [How We Built Safety Into Muse.](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse) Meta AI Research, 8 September 2026.
