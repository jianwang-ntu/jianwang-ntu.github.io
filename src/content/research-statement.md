My research asks how intelligent agents can expand what people and organizations can accomplish while remaining accountable to those they represent. I aim to develop foundations and mechanisms for **trustworthy agent networks**: persistent agents that acquire useful capabilities, cooperate across independent principals, and learn from outcomes while preserving authorization, information boundaries, and outstanding commitments. This agenda connects two scientific questions: **how agency persists through change**, and **when cooperation among independent agents creates lasting value**.

Delegation becomes difficult when capabilities, authority, and obligations change on different timescales. An agent may learn a better tool without gaining permission to disclose additional information. A principal may withdraw permission for future work while an earlier commitment still requires resolution. A group may agree on a plan without acquiring the authority to act for every member. I want to understand how these relationships can remain coherent as agents become more capable and their cooperation becomes more ambitious.

### Two directions and a shared foundation

| Research direction | Central question | Scientific subproblems |
| --- | --- | --- |
| **I. Assured Agency** | How does agency persist through change? | Persistent mandates, state and commitments; authorized execution and recovery; capability growth under live obligations. |
| **II. Collective Agency** | When does cooperation create lasting value? | Limited group representation; private coordination and conditional commitments; delivery, exit and shared accountability. |
| **Shared foundation** | Which evidence should justify an update? | Outcome verification; failure attribution and recovery; evaluated capability and coordination updates. |

The common research object is an **authorized contribution**: work undertaken for an identifiable principal, within a defined mandate, with explicit dependencies, obligations, and evidence requirements. Assured Agency studies whether an agent can produce and maintain such contributions. Collective Agency studies how independent contributions can be organized into joint work. Action and delivery evidence then support evaluated changes to capabilities and coordination. Changes to authority remain decisions for the relevant principals.

A principal may be an individual or an organization. A mandate defines delegated authority; a commitment records an accepted obligation. A collective represents its members only within authority they have actually delegated. These distinctions let the program address personal agents, organizational agents, and cooperation between them using a consistent vocabulary.

My intended contribution is a scientific account of the conditions under which useful autonomy and cooperation can grow together with accountable control. Candidate mechanisms must demonstrate benefits beyond strong stateful agents, established workflows, and existing coordination methods. The following essays describe proposed research, hypotheses, and evaluation criteria; they do not report completed experiments or established novelty.

<!-- PAGEBREAK -->

## Essay I. Assured Agency

*Persistent agents that grow in capability while remaining accountable to their principals.*

I study Assured Agency as the persistence of a meaningful relationship between a principal's authority, an agent's capabilities, and the consequences of its actions. The objective is to enlarge the range of useful work that can be delegated over time. In this agenda, assurance means evidence and controls under explicit assumptions about trusted components and observable effects.

### Persistent mandates, state and commitments

An agent operating over weeks or months must distinguish what it knows, what it can do, what it may do, and what it already owes. I would investigate representations that separate authoritative mandates, private knowledge, versioned tools and skills, outstanding commitments, and evidence of external effects. Inferred preferences can inform planning, but cannot create permission. A mandate change must trigger a review of affected obligations without treating those obligations as erased.

The scientific question concerns which dependencies are necessary for deciding whether continued execution or an update is admissible. Explicit state alone is insufficient as a contribution. I would seek methods that identify affected commitments and information flows, determine which checks remain valid, and establish when local validation is sufficient. This would connect a representation to a testable advantage in useful completion, validation cost, or oversight effort.

### Authorized execution and recovery

CaMeL separates control and data flows to constrain the influence of untrusted inputs; Fides studies agent planners through information-flow control. ShieldAgent investigates policy reasoning over agent action trajectories [1-3]. Intelligent AI Delegation also treats authority, responsibility, and adaptation as central to delegation [4]. My proposed question is how these foundations compose when tools, permissions, recipients, and live obligations change together.

Consider a creator who authorizes an agent to contribute selected assets to a joint project. Replacing an editor changes the recipient of private material; extending a usage license changes the purpose of disclosure. A useful system should identify the affected work and choose among continuation, local suspension, renewed authorization, renegotiation, and recovery. Formal analysis would characterize preservation of specified properties across such transitions. It would state when those properties depend on complete mediation, accurate dependency records, or trustworthy observations.

### Capability growth under live obligations

I also want agents to learn new tools, compose specialist capabilities, and improve plans while work is in progress. A candidate update should expose which assumptions and obligations it may affect. I would study how dependency analysis and targeted validation can support bounded introduction of an update, followed by evaluation on subsequent outcomes. Improved task performance would not itself justify a broader mandate. Recovery may restore software state or compensate a participant, but it cannot reverse information already disclosed or work already consumed.

### Hypothesis and evidence

My working hypothesis is that dependency-aware validation can improve the frontier between useful autonomy and control cost when capabilities and live obligations interact. Comparisons would include equally informed stateful regression checks, fixed workflows with approval, information-flow controls, and adapted tool-learning or harness-update methods. All automated methods would receive the same permitted state, model access, and resource budgets; human assistance would be measured explicitly.

Task families would vary tool changes, revocation, delayed evidence, partial completion, and adversarial inputs. I would report useful completion, unauthorized effects, disclosure, oversight effort, and recovery cost separately. Evidence would count against the hypothesis if gains disappear with a strong stateful baseline, depend on unequal information, or arise only from additional refusals or human intervention. The intended outcome is a reusable account of when agency can persist through change, including boundaries where ordinary workflow controls are sufficient.

<!-- PAGEBREAK -->

## Essay II. Collective Agency

*Independent agents that form useful organizations and deliver shared outcomes.*

I study cooperation among agents whose principals have distinct interests, resources, and authority. A production team combines creators, editors, rights holders, and a customer; a research collaboration combines data, expertise, computation, and validation. I want to understand when complementary contributions produce value that survives the costs of coordination, verification, and recovery.

### Limited group representation

A collective agent should represent a group through a defined charter and limited member mandates. Membership does not imply consent to every action, and a group preference does not automatically transfer an individual's authority. I would investigate how a group discovers feasible cooperation, allocates roles, and maintains a shared plan while each principal retains local control over its actions and disclosures.

Group formation must connect to subsequent execution. AgenticPay studies language-mediated negotiation with private constraints and valuations [5]; A2A supports agent discovery, communication, and tasks [6]. I would build on these foundations to ask how an agreement should constrain delivery when participants change, dependencies fail, or evidence is incomplete. Cooperation must also be assessed after the work is performed.

### Private coordination and conditional commitments

My candidate approach represents a collective through limited mandates, an explicit charter, and a graph of conditional commitments. A contribution would identify who owes what to whom, the conditions under which the obligation applies, its dependencies, and the evidence required for acceptance. Proposals, accepted commitments, delivered artifacts, and accepted outcomes would remain distinct states.

Participants could expose restricted feasibility responses without pooling their full private state. Research questions include how to choose disclosure granularity, coordinate interdependent choices, and limit information revealed through repeated queries. A shared graph would contain only information permitted for the collaboration; sensitive local constraints could remain with their principals. Selective disclosure is a design objective whose effectiveness must be measured, rather than an assumed guarantee of privacy.

Commitments and recovery have established antecedents in multi-agent systems and distributed workflows. I would test when their combination with language-based capability discovery and adaptation improves cooperation under incomplete information, and when conventional coordination suffices.

### Delivery, exit and shared accountability

When a contributor withdraws, the system should identify affected work, permissible replacements, and obligations that remain unresolved. Meaningful exit does not require pretending that prior costs or commitments disappear. I would study how local recovery changes the feasibility of ongoing cooperation and how costs are allocated among the original participants. Strategic reports, colluding participants, and compromised evaluators would be explicit experimental conditions.

### Hypothesis and evidence

My working hypothesis is that coupling group formation to conditional commitments and bounded representation can improve realized participant outcomes in interdependent tasks. Evaluation would compare fixed-rule workflows, constraint-based coordination, negotiation agents, and centralized coordinators given the same permitted information. An omniscient solver would be reported separately as an upper bound; experienced human coordination would provide a practical comparison with recorded labor costs.

Experiments would vary complementarity, dependency structure, private information, member exits, and adversarial coalitions. The original participant cohort would remain in the analysis, including members who leave or are replaced. I would report delivery quality, unresolved obligations, the distribution of net outcomes, and all communication, computation, verification, and recovery costs. The hypothesis would fail if apparent gains rely on excluded participants, shifted losses, excessive overhead, or easier tasks. The long-term goal is to explain when independent agency becomes beneficial collective agency and which organizational structures support that transition.

<!-- PAGEBREAK -->

## Independent Evidence and Controlled Adaptation

*A shared foundation for both research directions.*

I would study how action and delivery evidence can improve capabilities and coordination while preserving each principal's authority. This foundation links both directions through a common learning problem: determine what happened, identify a promising change, and evaluate its effect on later outcomes.

### Outcome verification

Different claims require different evidence: artifact checks for specified properties, external records for events, and independent assessment for substantive acceptance. AgentBeats separates assessment logic from agent implementation through standardized interfaces [7]. This separation does not establish that judges have independent information or uncorrelated errors. I would examine actor-evaluator dependence alongside the provenance and limits of observations.

### Failure attribution and recovery

A failed project may reflect a missing capability, an invalid assumption, a coordination defect, a policy failure, or an evaluator error. These explanations imply different interventions. I would study attribution methods using controlled changes and paired replays where environments permit them, and explicit uncertainty where external effects cannot be replayed. Diagnosis would be evaluated by whether the proposed repair improves held-out outcomes, rather than by the plausibility of an explanatory narrative. Immediate recovery and longer-term learning would use related evidence but have distinct objectives.

### Evaluated capability and coordination updates

Candidate changes would be assessed within a defined scope and against affected obligations. Development and evaluation would be separated by task family. Updates could improve tools, plans, matching, or task structure within existing authority; mandate and collective-rule changes would require authorization from the relevant principals. Reputation and favorable self-evaluation would not create authority.

### A staged research program, 2026-2029

| Stage | Research objective and decision evidence |
| --- | --- |
| **Year 1: State and execution** | Define mandate, commitment, and evidence semantics. Establish strong stateful and workflow baselines in controlled collaborative production tasks. Test changes, revocation, and local recovery. |
| **Year 2: Adaptation and cooperation** | Study capability updates under live obligations and coordination under private information. Test exits, adversarial behavior, evidence dependence, and full cost accounting. |
| **Year 3: Composition and transfer** | Test cooperation across independently governed organizations. Transfer to cooperative production or private research, varying dependencies and the reversibility of effects. Study rule adaptation where earlier evidence supports it. |

Collaborative production offers inspectable artifacts, scoped asset use, acceptance, and partial delivery. Later environments would vary information access, verification difficulty, and the reversibility of effects. These structural differences define the program's generalization tests.

Across studies, I would report useful completion, security and authorization failures, disclosure, human effort, resource use, recovery cost, and participant outcomes separately. Pilot estimates would inform sample sizes and prespecified meaningful differences; uncertainty would be assessed at the project or organization level. A simulator score would not by itself establish value in deployment. My long-term goal is to enable people and organizations to undertake more consequential work together, supported by an intelligible relationship between authority, action, evidence, and outcome.

<!-- PAGEBREAK -->

## Selected Research Foundations

These sources anchor the mechanisms and evaluation ideas discussed in this statement. They are a selective set of foundations, not an exhaustive novelty audit. Publication pages and official documentation were checked on September 12, 2026.

1. Edoardo Debenedetti et al. **Defeating Prompt Injections by Design.** 2025. arXiv:2503.18813. [Publication](https://arxiv.org/abs/2503.18813). Foundation: separating trusted control flow from untrusted data and restricting information flows.

2. Manuel Costa et al. **Securing AI Agents with Information-Flow Control.** 2025. arXiv:2505.23643v2. [Publication](https://arxiv.org/abs/2505.23643v2). Foundation: formal analysis of agent planners and confidentiality and integrity tracking in Fides.

3. Zhaorun Chen, Mintong Kang, and Bo Li. **ShieldAgent: Shielding Agents via Verifiable Safety Policy Reasoning.** 2025. arXiv:2503.22738. [Publication](https://arxiv.org/abs/2503.22738). Foundation: explicit policy reasoning and checks over agent action trajectories.

4. Nenad Tomasev, Matija Franklin, and Simon Osindero. **Intelligent AI Delegation.** 2026. arXiv:2602.11865v1. [Publication](https://arxiv.org/abs/2602.11865v1). Foundation: adaptive delegation with authority, responsibility, accountability, and boundaries.

5. Xianyang Liu, Shangding Gu, and Dawn Song. **AgenticPay: A Multi-Agent LLM Negotiation System for Buyer-Seller Transactions.** 2026. arXiv:2602.06008v1. [Publication](https://arxiv.org/abs/2602.06008v1). Foundation: language-mediated negotiation under private constraints and valuations.

6. A2A Project. **Agent2Agent Protocol Documentation.** Official documentation, accessed September 12, 2026. [Documentation](https://a2a-protocol.org/latest/). Foundation: agent discovery, communication, and task interoperability.

7. Xiaoyuan Liu et al. **AgentBeats: Agentifying Agent Assessment for Openness, Standardization, and Reproducibility.** 2026. arXiv:2606.13608v2. [Publication](https://arxiv.org/abs/2606.13608v2). Foundation: separating assessment logic from agent implementation through standardized interfaces.

### Research status

This statement describes a proposed research program. The mechanism hypotheses remain to be tested. Any formal guarantee would require a specified model, property, and set of trust assumptions; empirical improvements would require appropriate comparisons and independent outcome assessment. The intended contribution includes both useful mechanisms and evidence about when simpler approaches remain preferable.
