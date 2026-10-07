I study how AI agents can learn and carry out long tasks while remaining safe and under human control. My research asks three questions: what evidence is needed before an agent acts, which training changes preserve safety, and how permissions should change when tasks or tools change.

The aim is reliable autonomy for scientific research and enterprise work. The collected company JDs provide industry context, not validation of my proposed methods.

### Research foundation and approach

My work on code models and program repair grounds this agenda in execution-based evaluation. Our execution-trace study found limited gains from trace information in the settings tested [1]. Defects4C provides reproducible C/C++ repair tasks [2], while RATCHET studies retrieval-augmented repair [3]. These projects inform how I design experiments; they do not establish results on agent safety.

I would start with software tasks, then test transfer to other digital workflows. I measure task completion, harmful outcomes, and authorization violations separately: a correct result can still disclose restricted data. The work below is proposed research, not a report of new results.

---

## I. Scalable oversight under adaptation

*What evidence is needed before an agent acts?*

### Oversight before action

![Formal oversight before action: approved specifications generate proof obligations; checked proofs and valid execution conditions permit action, while false or unknown conditions defer execution for review.](/images/research/formal-oversight-before-action.png)

I propose an oversight framework that connects approved formal specifications, proof checking, and controlled execution [4,5]. For an agent’s candidate x, the verification target is M(x) ⊨ Φ, where M(x) models the candidate’s behavior and tool effects, and Φ specifies approved task and security requirements. The framework would generate logical obligations and require each to be discharged through checked proofs. Unresolved obligations would guide repair of the candidate or proof.

An independent execution gate would permit action only when all conditions hold: the proof is accepted; the artifact, model, and specification match the checked versions; permissions remain valid at execution; and model assumptions still hold. False or unknown conditions would trigger deferral or review. Approved specifications and acceptance rules would be protected from agent modification, with the gate enforced through trusted controls.

I would study specification adequacy and robustness to adaptive attacks, comparing oversight methods at matched cost. Evaluation would measure task completion, accepted violations, unnecessary blocking, and verification effort. Assurance would remain conditional on adequate specifications, faithful models, sound proof checking, and trusted enforcement.

---

## II. Preserving safety through continual updates

*How can models and harnesses improve while preserving security and reliability?*

![Preserving safety through continual updates: propose a model or harness change, revalidate protected requirements and guardrails, repair and retest failures, then apply only the validated change or retain the current system.](/images/research/preserving-safety-continual-updates.png)

I would study how continual learning and harness upgrades can improve AI agents without losing established protection. Fine-tuning can weaken learned safety behavior [6], while changes to tools, monitors, or feedback can invalidate assumptions behind existing guardrails. My focus is identifying when safeguards become ineffective and how to restore protection across system versions.

Building on rubric-based learning [7] and defensive experience [8], I would investigate learning from paired authorized tasks and prioritizing feedback repairs by their influence on subsequent behavior [9]. Each proposed update would be assessed with existing guardrails through protected policy checks and independent retention tests. Failures would guide revisions to the update or guardrails while approved requirements remain fixed. The validated change, Δ*, would include any necessary protective repairs and be applied as Sₜ₊₁ = Update(Sₜ, Δ*). Failed or inconclusive checks would leave the current version in place.

Evaluation would follow repeated model and harness updates, comparing fixed guardrails, safety fine-tuning, and alternative repair strategies at matched total cost. I would measure safety retention, reliability, authorized task completion, and transfer to unseen tasks. Success would require sustained protection alongside useful capability gains.

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
