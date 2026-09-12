## Assured agency

**How can an agent become more capable while remaining accountable to the people or organizations it represents?** I study agency as a continuing relationship between delegated authority, useful capabilities and the consequences of action. A personal agent, a group representative and a company's agent all need to preserve that relationship as their tools, knowledge and responsibilities evolve.

The common unit of this agenda is an **authorized contribution**: work performed for an identifiable person or organization, within a mandate, with explicit dependencies, commitments and evidence of its effects. An agent must distinguish what it knows, what it can do, what it may do and what it already owes. A new skill can expand capability without expanding permission; a withdrawn permission can change future action without erasing an earlier obligation.

I would investigate representations and dependency analysis that connect mandates, private knowledge, versioned capabilities, pending commitments and observed effects. When a tool, recipient or permission changes, the system should identify affected work and decide whether to continue, revalidate, seek renewed authorization or recover. The research question is when local checks are sufficient to preserve specified properties while enabling useful autonomy.

Consider a creator whose agent contributes selected material to a joint production. A new editing tool may improve the work, while a change of editor alters who can receive private assets. The agent must support the creative task while respecting these different boundaries. This is where security, capability growth and recovery meet: useful adaptation must remain connected to the authority under which work began.

## Collective agency

**When can independently governed agents accomplish more together while preserving the interests and authority of those they represent?** The scope includes cooperation between individuals, between a person and a group or company, and among groups and companies. Each participant can have different objectives, private information, resources and acceptable outcomes.

Assured agency provides the locally authorized contributions. Collective agency studies how they become joint work: discovering feasible partners, forming a limited group mandate, allocating roles and connecting promises to delivery. A group's representative acts through authority delegated by its members; membership alone does not authorize every disclosure or action.

I would study **conditional commitments** that record who owes what to whom, under which conditions, and with which dependencies and acceptance evidence. Participants could share restricted feasibility information while retaining sensitive details locally. Proposals, accepted commitments, delivered artifacts and accepted outcomes would remain distinct. This connects negotiation and group formation to what happens after an agreement.

In the production example, a creator, an editing collective and a client company may cooperate without placing all their private state under one controller. If an editor leaves or a requirement changes, the network should identify affected contributions, permissible replacements and unresolved obligations. I want to understand when such coordination creates value after communication, verification and recovery costs, including for participants who leave.

The same structure applies to private research collaborations that combine data, expertise, computation and independent validation. Person-to-person, person-to-group, person-to-company, group-to-group, group-to-company and company-to-company relationships are settings for the same scientific questions about representation, cooperation and accountability.

## Independent evidence and controlled adaptation

**What evidence should justify trust in an outcome or a change to the system?** This shared foundation connects the two directions in a feedback loop: agents act and deliver contributions; observations establish what happened; diagnosis identifies a possible change; evaluation determines whether that change helps subsequent work.

Different claims need different evidence. Tests can check specified properties of an artifact, external records can establish events, and independent assessment can judge whether a contribution meets its acceptance conditions. I would examine the provenance and coverage of these observations, including cases where an agent and its evaluator share information gaps or correlated errors.

A failure may arise from a missing capability, an invalid assumption, a coordination defect, a policy violation or an evaluator error. These explanations call for different responses. I would use controlled interventions and paired replays where possible, testing diagnosis by whether the resulting repair improves held-out outcomes. Where effects cannot be replayed or reversed, uncertainty and recovery costs remain part of the result.

Evaluated updates may improve tools, plans, matching or coordination within existing authority. Changes to a mandate or a group's rules remain decisions for the relevant people and organizations. Together, the three parts connect **authority → contribution → shared outcome → evaluated adaptation**.

## Evaluation and milestones

I plan to develop this agenda through collaborative production and private research settings, where contributions, information boundaries, acceptance and partial delivery can be made explicit. Software workflows provide an additional controlled setting for studying execution and repair. These environments help test the general questions across different participants and kinds of work.

| Stage | Research focus |
| --- | --- |
| **2026–2027: State and execution** | Define mandate, commitment and evidence semantics. Build controlled contribution tasks and strong stateful/workflow baselines. Study tool changes, revocation and local recovery. |
| **2027–2028: Adaptation and cooperation** | Study capability updates during ongoing work, group formation and conditional commitments under private information. Test exits, adversarial behavior and evaluator dependence. |
| **2028–2029: Composition and transfer** | Test cooperation across independently governed groups and companies. Transfer between production and research settings, varying dependency structure, information access and the reversibility of effects. |

Comparisons would include fixed workflows, equally informed stateful agents, information-flow controls, negotiation methods and centralized coordinators with the same permitted information and resource budgets. Useful completion, unauthorized effects, disclosure, human effort, recovery costs and the distribution of participant outcomes would be reported separately.

The aim is to identify when proposed mechanisms improve useful autonomy and cooperation, and where simpler methods suffice. These are research questions and hypotheses to test. The program's ambition extends beyond my existing publications; those publications contribute methods and evaluation experience to its development.

## Published foundations

My earlier work provides experience with failure detection, repair and empirical evaluation. The connection is through these methods and lessons; the new agenda applies them to questions about persistent authority, cooperation and adaptation.

- **[RATCHET (ISSRE 2024)](/pubs/ratchet)** studies fault localisation and retrieval-based program repair. It contributes experience diagnosing a failure and constructing a corrective action, which informs questions about recovery in assured agency.
- **[Defects4C (ASE 2025)](/pubs/defects4c)** provides reproducible C/C++ bugs and vulnerabilities with tests. Its approach to executable evaluation informs how I would assess the effects of agent actions and updates, while accounting for the limits of available checks.
- **[The execution-trace study (EMNLP Findings 2025)](/pubs/code-semantics-execution-traces)** finds limited usefulness from adding traces in the settings studied. It motivates testing which observations improve decisions or expose failure, instead of assuming that additional context supplies reliable evidence.
- **[The AIGC-detector study (ASE 2024)](/pubs/aigc-detectors-on-code)** examines the difficulty of transferring detection from prose to code. It informs evaluation under changing tasks and models; authorship detection itself does not establish correctness or safe agency.

Earlier work on neural-network testing, repair, fairness and vision robustness adds experience studying AI failures. My industry work contributes experience building and operating useful systems. The [publication archive](/pubs) and [project rooms](/work#project-rooms) document that background; the future program asks how such methods can support agents acting for individuals, groups and companies.
