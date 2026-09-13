# Reliable Autonomy for Adaptive AI Agents

**Jian Wang | 13 September 2026**

Scalable oversight, safety-preserving learning, and secure delegation

I study how AI agents can learn and carry out long tasks while remaining safe and under human control. My research asks three questions: what evidence is needed before an agent acts, which training changes preserve safety, and how permissions should change when tasks or tools change.

The aim is reliable autonomy for scientific research and enterprise work. The collected company JDs provide industry context, not validation of my proposed methods.

```mermaid
flowchart TB
  O["I. Oversight: select evidence"] --> E["Independently assessed behavior and effects"]
  L["II. Learning: improve feedback"] --> E
  D["III. Delegation: carry constraints"] --> E
  E -. "revise oversight" .-> O
  E -. "revise learning" .-> L
  E -. "revise controls" .-> D
```

*Figure 1. Each problem supports an independent contribution. Solid arrows indicate assessment; dashed arrows return evidence for revision. Evaluation and authority remain separate from the optimizing agent.*

### Research foundation and approach

My work on code models and program repair grounds this agenda in execution-based evaluation. Our execution-trace study found limited gains from trace information in the settings tested [1]. Defects4C provides reproducible C/C++ repair tasks [2], while RATCHET studies retrieval-augmented repair [3]. These projects inform how I design experiments; they do not establish results on agent safety.

I would start with software tasks, then test transfer to other digital workflows. I measure task completion, harmful outcomes, and authorization violations separately: a correct result can still disclose restricted data. The work below is proposed research, not a report of new results.

## Research statement: I. Scalable oversight under adaptation

*What evidence is needed before an agent acts?*

An agent may explain why it needs to export a file without revealing that the destination has changed. A reviewer cannot establish the destination from that explanation alone. AI Control studies supervision under deliberate subversion [4]; Auto-review examines action review at a sandbox boundary [5]. I would study which observations make oversight effective when the agent can influence the evidence.

I would learn an oversight policy that decides when to query a service, run a sandboxed test, inspect an artifact, or request human review. Each check would be selected for its expected effect on the decision, weighed against delay and cost. The result would support permission to act, a safer plan, or deferral when evidence remains insufficient.

I would also train and test monitors against agents that learn to exploit their blind spots. Experiments would vary the agent's control over evidence, knowledge of the monitor, and relative capability. The hypothesis is that protected observations can improve on transcript-only review. Reasoning traces would be tested alongside external evidence, not treated as independent proof.

Comparisons would include stronger transcript reviewers, fixed checks, random audits, and reviewers with the same external evidence, at matched task completion and total cost. I would separate missed violations from failures to enforce a correct decision. Gains that disappear under adaptive attacks or require unavailable deployment data would limit the claim. Formal models would clarify which observations and interventions oversight requires.

---

## Research statement: II. Safety-preserving learning and feedback

*Which training changes improve behavior without weakening safety?*

Fine-tuning can weaken previously learned safety behavior [6]. RUBAS studies rubric-based rewards [7], and ToolShield uses defensive experience for multi-turn tool use [8]. I would investigate which learning signals transfer to new tasks and remain effective after further capability training.

One approach is to train on paired tasks with the same legitimate goal but different recipients, permissions, or tool effects. Each pair would retain a valid authorized solution. I would test whether outcome feedback and independently checked constraints teach why an action is acceptable in one case but not the other. I would compare this with safety fine-tuning, adversarial training, and rubric-based reinforcement learning using matched data.

A second question is which defects in feedback deserve repair first. A frequent labeling error may barely affect learning, while a rare exploitable reward can redirect behavior. I would use limited training experiments to predict the effects of repairing a reward model, evaluator, or simulator. Matched updates with and without a repair would test those predictions against independently assessed outcomes, extending work on automated alignment research [9].

Evaluation would use held-out tasks, fixed safety criteria, and multiple training seeds. Repair selection must beat simple priorities based on error frequency, severity, or reviewer disagreement at matched total cost, including exploratory training. I would measure safety retention after later updates and transfer to unseen repairs. Better evaluator scores or broader refusal would not count as improved behavior.

## Research statement: III. Control across time and delegation

*Which permissions remain valid when a workflow changes?*

An approval may become invalid when a tool changes or access is revoked. Delegation adds another risk: one agent can pass private information to another with permission to send messages externally. Separate local checks may miss the combined disclosure. I would study how control can preserve authorized execution across handoffs and partial failures.

I would attach constraints to delegated work: who authorized it, permitted operations, data dependencies, and conditions for validity. Learned components could propose task splits, while an independent execution layer enforces checkable restrictions. The theory would identify when local checks imply a workflow-wide property, and when they do not. Uncertain effects would require conservative handling or human review.

I would then track the dependencies behind approvals. A change would trigger new evidence and suspend or replan affected work while preserving valid progress. This builds on information-flow controls such as CaMeL and Fides [10,11]. EvoSafeHarness studies deployment-specific controls [12], while Muse separates action execution from permission authority [13]. My focus is how those controls remain justified during a changing workflow.

Comparisons would include stateful access control, information-flow enforcement, whole-workflow suspension, and learned controls with the same information and authority. I would measure completion, violations, review effort, and recovery cost, including tests with compromised agents. Formal guarantees would apply only to stated assumptions and trusted components; rollback cannot undo information already disclosed.

I would begin with oversight and learning, then extend validated methods to delegation. Longer term, I want AI systems to help improve research tools and training processes while independent checks establish whether those changes are useful, safe, and authorized.

---

## Appendix A: Execution, evidence, and a staged program

*A practical path from a focused mechanism to a transferable result*

I would begin in executable digital environments where task outcomes, authority, and selected harmful effects can be inspected. This provides a tractable basis for causal experiments and bounded formal reasoning. Defects4C supplies repair tasks with reproducible faults [2]; AgentDojo provides an extensible setting for tool use and prompt-injection evaluation [14]. Neither is a complete agent-safety test. Any added authority changes, revocation events, or feedback defects would be documented as new experimental conditions.

| Stage | Research objective and decision |
| --- | --- |
| 0-12 months | Establish one result on evidence acquisition for oversight. In a separate, bounded training study, test whether feedback-repair priorities predict post-update behavior. Advance a mechanism only if it improves over strong simple baselines at matched utility and total cost. |
| 12-24 months | Test safety retention across capability updates, model families, and unseen failure mechanisms. Combine learning and oversight only after each has a measured effect; use component ablations to identify interaction benefits or regressions. |
| 24-36 months | Study tool changes, revocation, and delegation in longer enterprise or research workflows. Extend claims only when they survive different dependency and verification structures; seek deployment partners for shadow evaluation and realistic incident distributions. |

### What would count as progress

I would report useful task completion, authorization violations, and harmful outcomes separately, including severity categories. Comparisons would use common task and attack budgets and show the tradeoffs among utility, risk, latency, and human effort. Training, evidence acquisition, inference, and recovery costs belong in the accounting. For learning, I would evaluate both the policy alone and the policy under a fixed controller, so that blocking cannot be mistaken for improved judgment.

Task families, tool semantics, and attack-generation procedures would be separated between development and evaluation. Adaptive adversaries would receive stated access and query budgets. Checkers would be validated against known outcomes; logs establish provenance within their trust boundary. Human review would be blinded and disagreement retained. Uncertainty would be estimated at the independent task, workflow, or training-run level, with sample sizes chosen for a pre-specified meaningful effect. Small pilots would test mechanisms, without establishing rare-event safety.

### How my existing methods carry forward

Execution-trace analysis [1] supports experiments on whether additional observations change a model's decisions. Reproducible repair tasks [2] support evaluation of actual effects and controlled feedback defects. Retrieval-based correction [3] provides experience with learning from relevant prior cases. The next methodological steps are sequential decision-making for oversight, post-training experiments that isolate causal effects, and security protocols with stated enforcement assumptions. The supplied publications support this starting foundation; they do not establish frontier-scale RL training experience.

Public outputs would include task specifications, threat models, implementations, and measured failures where sharing is permitted. The goal is publishable mechanisms and limits, and components that training, safety, and product teams can evaluate in their systems.


---

## Appendix B: How the JD collection shapes this agenda

*Source audit and direct evidence for the two near-term priorities*

The eight JD JSONL files contain **876 records and 829 distinct company-job-ID pairs**: Anthropic 328, OpenAI 188, Zhipu 162, MiniMax 75, Moonshot 53, and DeepSeek 23. The 47 repeated pairs are overlaps between safety and technical collections; some duplicates differ in formatting. Four Zhipu records have empty description bodies after HTML cleanup and contribute no responsibility evidence. The collection timestamps span 12-13 September 2026.

These are selected snapshots, mixing research, engineering, operational roles, locations, and seniority levels. They establish stated responsibilities, not hiring volume, growth rates, current availability, or personal eligibility. One DeepSeek Harness record covers several functions. Keyword counts would therefore be a weak basis for ranking research fields. The mapping uses specific duties and exact IDs; Chinese role titles are translated and responsibilities are paraphrased.

| Role and exact source ID | Responsibility and research implication |
| --- | --- |
| **J1 - OpenAI**: [Researcher, Agent Safety, Oversight and System Mitigations](https://jobs.ashbyhq.com/openai/7d49af15-623e-476a-9d35-831c5c9c9bf5)<br>Job ID: `7d49af15-623e-476a-9d35-831c5c9c9bf5` | Action review, isolation and permission boundaries; missed harm, false blocks, approval burden, and latency. Direct support for Problem I. |
| **J2 - OpenAI**: [Researcher, Agent Safety, Training and Evaluations](https://jobs.ashbyhq.com/openai/e1cc86e5-b56c-49c0-a4a6-8cf766c27281)<br>Job ID: `e1cc86e5-b56c-49c0-a4a6-8cf766c27281` | Train frontier models; convert incidents into repeatable safety signals and deployed mitigations. Direct support for Problem II. |
| **J3 - Anthropic**: [Research Engineer / Scientist, Alignment](https://job-boards.greenhouse.io/anthropic/jobs/4631822008)<br>Job ID: `4631822008` | Scalable oversight, AI control, alignment stress tests, and automated alignment research. Direct research context for Problems I-II. |
| **J4 - Anthropic**: [ML/Research Engineer, Safeguards](https://job-boards.greenhouse.io/anthropic/jobs/4949336008)<br>Job ID: `4949336008` | Adversarial classifiers, harms across exchanges, agent threat models, and prompt-injection mitigations. Deployment context for Problem I. |
| **J5 - OpenAI**: [Agent Post-Training, Frontier Evals and Environments Research](https://jobs.ashbyhq.com/openai/9d72171e-2630-4347-83a1-263178644282)<br>Job ID: `9d72171e-2630-4347-83a1-263178644282` | RL environments, measurement reliability, continuous evaluation, and model-understanding loops. Adjacent capability demand for Problems I-II. |
| **J6 - DeepSeek**: [Post-training Researcher (Data / Algorithms)](https://app.mokahr.com/social-recruitment/high-flyer/140576#/job/5d75f4cd-f626-4f73-80c1-e53b2073de76)<br>Job ID: `5d75f4cd-f626-4f73-80c1-e53b2073de76` | RL algorithms, data generation and filtering, and evaluations that identify agent capability limits. Adjacent training demand for Problem II. |
| **J7 - DeepSeek**: [Agent Harness Team - research responsibilities](https://app.mokahr.com/social-recruitment/high-flyer/140576#/job/8d40c764-d2b2-49b1-826c-e3f2adb75c01)<br>Job ID: `8d40c764-d2b2-49b1-826c-e3f2adb75c01` | Model-harness co-evolution; memory, subagents, long tasks, and feedback from real use. Supports adaptation as a research setting. |

> Reading the mapping: J1-J4 provide direct safety or alignment evidence. J5-J7 establish adjacent demand for environments, learning signals, and model-harness co-evolution. The latter support methodological relevance without implying dedicated safety mandates.


---

## Appendix B (continued): Industry fit and the boundary of the evidence

*Capability training, secure execution, and longer-term extensions*

| Role and exact source ID | Responsibility and research implication |
| --- | --- |
| **J8 - MiniMax**: [LLM Algorithm Engineer - Code](https://vrfi1sk8a0.jobs.feishu.cn/referral/position/7681565559078996251/detail)<br>Job ID: `7681565559078996251` | Execution and tool feedback for RL; reward design, iterative learning, and error analysis. Adjacent training demand for Problem II. |
| **J9 - Moonshot**: [Research Scientist / Engineer - Agentic RL/Infra](https://app.mokahr.com/apply/moonshot/148506#/job/d4a6a175-6506-4746-a6f4-2b736c0ce339)<br>Job ID: `d4a6a175-6506-4746-a6f4-2b736c0ce339` | Agentic and multi-agent RL algorithms, environments, and infrastructure. Supports agent learning; does not establish secure cooperation as a dedicated role. |
| **J10 - Zhipu**: [Post-training Algorithm Engineer - Coding Agent](https://app.mokahr.com/social-recruitment/zphz/148983?locale=zh-CN#/job/a1f2d79e-010c-43ba-ab4e-d609c4ce7a7f)<br>Job ID: `a1f2d79e-010c-43ba-ab4e-d609c4ce7a7f` | Data synthesis, RL, and realistic coding-agent evaluation across frameworks. Adjacent training demand for Problem II. |
| **J11 - Zhipu**: [GLM Coding Agent Data and Automated Iteration Engineer / Expert](https://app.mokahr.com/social-recruitment/zphz/148983?locale=zh-CN#/job/eb6e44ae-8d5e-4122-965d-b72f3922d08c)<br>Job ID: `eb6e44ae-8d5e-4122-965d-b72f3922d08c` | Mine production logs and bad cases; maintain data and RL infrastructure for continuous improvement. Concrete feedback-loop context for Problem II. |
| **J12 - MiniMax**: [Agent Sandbox Systems Architect](https://vrfi1sk8a0.jobs.feishu.cn/referral/position/7644834917046667539/detail)<br>Job ID: `7644834917046667539` | Resource isolation, credentials, network permissions, execution replay, and risk intervention. Engineering context for Problem III. |
| **J13 - Anthropic**: [Tech Lead Manager, Agent Runtime Platform](https://job-boards.greenhouse.io/anthropic/jobs/5316593008)<br>Job ID: `5316593008` | Secure credential-managed runtimes, reusable agent primitives, capacity, and reliability. Platform demand for Problem III; senior systems requirements apply. |

### Why this ordering

My interpretation of the combined evidence is to prioritize **scalable oversight and safety-preserving learning**. They have direct safety responsibilities in the collection and share methods with broader agent-training roles. Secure runtime research provides a route into deployment; cross-principal cooperation becomes a later extension that needs its own scientific case. OpenAI's recursive-self-improvement-safety role (ID 5a9e68f6-30b5-40c0-aa8c-c822c59140d0) and DeepSeek's Frontier role (ID c7076ca9-558c-4ec3-804b-f21bdfc6135c) support the long-term motivation. These two postings do not establish a broad or predictable market for that specialization.

### External checks on the positioning

The September 2026 Muse release [13] and EvoSafeHarness preprint [12] make independently enforced action boundaries and deployment-specific control concrete technical reference points. Singapore's IMDA framework calls for bounded permissions, meaningful oversight, and lifecycle monitoring [15]; NIST's agent initiative includes identity, authentication, and security-evaluation research [16]. These sources support the problem setting. Product reports are developer-reported evidence, preprints remain preliminary, and institutional priorities do not validate my proposed methods.

> Career relevance is methodological, not a claim of eligibility. For example, the Moonshot RL/Infra posting requests deep RL and large-scale systems experience. My prior publications justify the research foundation stated here; application-specific evidence of those additional skills would still be required.


---

## References: Selected references

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

[14] E. Debenedetti et al. [AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents.](https://arxiv.org/abs/2406.13352v3) arXiv:2406.13352v3, 2024.

[15] IMDA. [Model AI Governance Framework for Agentic AI.](https://www.imda.gov.sg/assets/63438074-73f6-4dcc-a281-030f42642cf4.pdf) Version 1.5, 20 May 2026; updated 5 June 2026.

[16] NIST. [AI Agent Standards Initiative.](https://www.nist.gov/artificial-intelligence/ai-agent-standards-initiative) Created 17 February 2026; updated 14 August 2026.

### Provenance of the statement

The research foundation is based on the two supplied statements and the cited publications. The industry mapping uses the supplied JD snapshots; role links identify source postings and do not certify current vacancies. The three problems and candidate mechanisms are a proposed agenda, requiring project-specific novelty analysis and new evidence before claims of effectiveness or priority.

The accompanying 120-person research-interest inventory, 25-person Agent Commons fit ranking, 26-person follow-up, and their shards were discovery material. Their fit scores were not reused as market evidence; shards were not counted as independent signals. The research direction follows the problems and sources above.

> Source files for the JD mapping: openai_filtered_technical_research_jobs_2026-09-13.jsonl; openai_safe.jsonl; anthropic_technical_jobs_2026-09-13.jsonl; anthropic_safe.jsonl; deepseek_selected_categories_jobs_2026-09-13.jsonl; minimax_feishu_rnd_jobs_2026-09-13.jsonl; moonshot_moka_technical_ai_jobs_2026-09-13.jsonl; zhipuai_moka_all_jobs_2026-09-13.jsonl. All are contained in the supplied data.zip.
