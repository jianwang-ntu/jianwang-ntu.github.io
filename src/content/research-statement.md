I study AI agents that carry out tasks for people and collaborate with other agents. My goal is to preserve reliability, security, and human authority as their capabilities, tools, and responsibilities evolve. This agenda connects three themes: **assurance**, **retention**, and **control**.

**Assurance** grounds action approval in an explicit evidence base. Formal specifications and independent checks record what has been established, what remains uncertain, and which assumptions apply. **Retention** addresses the risk that model learning or harness upgrades invalidate earlier evidence or weaken existing guardrails. I examine how security and reliability can be reassessed and preserved across system versions. **Control** addresses failures at agent handoffs, where context, evidence, or restrictions may be lost, and individually permitted actions may combine into unauthorized outcomes. I study how delegated workflows can preserve reliability and authorization across these boundaries. Action checks inform learning and scoped approvals, while workflow failures guide further checks and updates.

### Research foundation and approach

My current research connects **Trustworthy Code LLMs** with **Reliable LLM Agents**. I evaluate AI-generated code detection and its implications for training-data curation ([ASE 2024](https://dl.acm.org/doi/10.1145/3691620.3695468)), study vulnerability detection ([LCTES 2024](https://arxiv.org/abs/2404.09599)), and develop retrieval-augmented program repair ([ISSRE 2024](/pubs/ratchet)). I also benchmark repair capability with Defects4C ([ASE 2025](/pubs/defects4c)) and test whether execution traces help models reason about program behavior; the evaluated settings show limited gains ([Findings of EMNLP 2025](https://arxiv.org/abs/2509.11686)). These results motivate my broader work on evidence, adaptation, and control in agents. These projects inform how I design experiments; they do not establish results on agent safety.

I would start with software tasks, then test transfer to other digital workflows. I measure task completion, harmful outcomes, and authorization violations separately: a correct result can still disclose restricted data. The work below is proposed research, not a report of new results.

---

## I. Oversight before action

*What evidence is needed before an agent acts?*

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

## III. Authorization across delegated workflows

*How can permissions and data restrictions hold across agent handoffs?*

![Authorization across delegated workflows: a private report can leak through a delegated email draft; track delegated scope, inherited data restrictions, and approval validity before executing, suspending, or replanning affected work.](/images/research/authorization-delegated-workflows.png)

For an approved model and harness version, I would study how authorization is preserved throughout a delegated workflow. Individually permitted actions may combine to disclose restricted information or exceed the authority originally granted. The challenge is controlling these combined effects across agents, changing permissions, and partial failures.

Delegated work would carry explicit constraints on authority, operations, and data use, together with the dependencies that determine when approvals remain valid. Building on information-flow controls [10,11] and separation of execution from permission authority [13], I would investigate when local enforcement supports workflow-wide guarantees. Runtime changes in recipients, access rights, or data dependencies would trigger revalidation, suspension, or replanning of affected work while preserving valid progress.

Evaluation would compare stateful access control, information-flow enforcement, and whole-workflow suspension under matched information and authority. Tests would include compromised agents, cross-agent disclosure, revoked permissions, and interrupted handoffs. I would measure authorized completion, violations, review effort, and recovery cost. Formal guarantees would depend on stated assumptions and trusted enforcement; recovery cannot undo completed disclosures.

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
