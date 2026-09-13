I study how AI agents can learn and carry out long tasks while remaining safe and under human control. My research asks three questions: what evidence is needed before an agent acts, which training changes preserve safety, and how permissions should change when tasks or tools change.

The aim is reliable autonomy for scientific research and enterprise work. The collected company JDs provide industry context, not validation of my proposed methods.

### Research foundation and approach

My work on code models and program repair grounds this agenda in execution-based evaluation. Our execution-trace study found limited gains from trace information in the settings tested [1]. Defects4C provides reproducible C/C++ repair tasks [2], while RATCHET studies retrieval-augmented repair [3]. These projects inform how I design experiments; they do not establish results on agent safety.

I would start with software tasks, then test transfer to other digital workflows. I measure task completion, harmful outcomes, and authorization violations separately: a correct result can still disclose restricted data. The work below is proposed research, not a report of new results.

---

## I. Scalable oversight under adaptation

*What evidence is needed before an agent acts?*

An agent may explain why it needs to export a file without revealing that the destination has changed. A reviewer cannot establish the destination from that explanation alone. AI Control studies supervision under deliberate subversion [4]; Auto-review examines action review at a sandbox boundary [5]. I would study which observations make oversight effective when the agent can influence the evidence.

I would learn an oversight policy that decides when to query a service, run a sandboxed test, inspect an artifact, or request human review. Each check would be selected for its expected effect on the decision, weighed against delay and cost. The result would support permission to act, a safer plan, or deferral when evidence remains insufficient.

I would also train and test monitors against agents that learn to exploit their blind spots. Experiments would vary the agent's control over evidence, knowledge of the monitor, and relative capability. The hypothesis is that protected observations can improve on transcript-only review. Reasoning traces would be tested alongside external evidence, not treated as independent proof.

Comparisons would include stronger transcript reviewers, fixed checks, random audits, and reviewers with the same external evidence, at matched task completion and total cost. I would separate missed violations from failures to enforce a correct decision. Gains that disappear under adaptive attacks or require unavailable deployment data would limit the claim. Formal models would clarify which observations and interventions oversight requires.

---

## II. Safety-preserving learning and feedback

*Which training changes improve behavior without weakening safety?*

Fine-tuning can weaken previously learned safety behavior [6]. RUBAS studies rubric-based rewards [7], and ToolShield uses defensive experience for multi-turn tool use [8]. I would investigate which learning signals transfer to new tasks and remain effective after further capability training.

One approach is to train on paired tasks with the same legitimate goal but different recipients, permissions, or tool effects. Each pair would retain a valid authorized solution. I would test whether outcome feedback and independently checked constraints teach why an action is acceptable in one case but not the other. I would compare this with safety fine-tuning, adversarial training, and rubric-based reinforcement learning using matched data.

A second question is which defects in feedback deserve repair first. A frequent labeling error may barely affect learning, while a rare exploitable reward can redirect behavior. I would use limited training experiments to predict the effects of repairing a reward model, evaluator, or simulator. Matched updates with and without a repair would test those predictions against independently assessed outcomes, extending work on automated alignment research [9].

Evaluation would use held-out tasks, fixed safety criteria, and multiple training seeds. Repair selection must beat simple priorities based on error frequency, severity, or reviewer disagreement at matched total cost, including exploratory training. I would measure safety retention after later updates and transfer to unseen repairs. Better evaluator scores or broader refusal would not count as improved behavior.

---

## III. Control across time and delegation

*Which permissions remain valid when a workflow changes?*

An approval may become invalid when a tool changes or access is revoked. Delegation adds another risk: one agent can pass private information to another with permission to send messages externally. Separate local checks may miss the combined disclosure. I would study how control can preserve authorized execution across handoffs and partial failures.

I would attach constraints to delegated work: who authorized it, permitted operations, data dependencies, and conditions for validity. Learned components could propose task splits, while an independent execution layer enforces checkable restrictions. The theory would identify when local checks imply a workflow-wide property, and when they do not. Uncertain effects would require conservative handling or human review.

I would then track the dependencies behind approvals. A change would trigger new evidence and suspend or replan affected work while preserving valid progress. This builds on information-flow controls such as CaMeL and Fides [10,11]. EvoSafeHarness studies deployment-specific controls [12], while Muse separates action execution from permission authority [13]. My focus is how those controls remain justified during a changing workflow.

Comparisons would include stateful access control, information-flow enforcement, whole-workflow suspension, and learned controls with the same information and authority. I would measure completion, violations, review effort, and recovery cost, including tests with compromised agents. Formal guarantees would apply only to stated assumptions and trusted components; rollback cannot undo information already disclosed.

I would begin with oversight and learning, then extend validated methods to delegation. Longer term, I want AI systems to help improve research tools and training processes while independent checks establish whether those changes are useful, safe, and authorized.

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
