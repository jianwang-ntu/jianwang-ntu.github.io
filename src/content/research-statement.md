## Published foundations

My published work studies **how to detect, understand and repair unreliable code**. It gives me a practical starting point for agent research: repair methods, executable tasks and experience evaluating model behaviour. The connection is strongest for software maintenance; cooperation between independently owned agents requires additional research.

- **[RATCHET (ISSRE 2024)](/pubs/ratchet)** combines fault localisation with retrieval-based patch generation. The next step is to place repair inside a workflow that inspects a repository, uses tools, checks a change and revises it. The paper evaluates repair, so this broader workflow is a proposed extension.
- **[Defects4C (ASE 2025)](/pubs/defects4c)** provides reproducible C/C++ bugs and vulnerabilities with tests. These tasks offer a starting point for observing whether an agent's changes repair a fault. A maintenance benchmark would still need sequences of actions, held-out checks and explicit failure conditions; passing existing tests is incomplete evidence of correctness.
- **[The execution-trace study (EMNLP Findings 2025)](/pubs/code-semantics-execution-traces)** finds limited usefulness from adding traces in the settings studied. My proposed follow-up asks which observations help an agent choose its next action, and which merely add context. Execution evidence must earn its place through measured outcomes.
- **[The AIGC-detector study (ASE 2024)](/pubs/aigc-detectors-on-code)** exposes difficulties transferring detection from prose to code. Its relevance is methodological: revalidate evaluation signals across tasks and models. Authorship detection does not establish correctness or safe agency, so it is background to the evaluation approach rather than a separate agent-research direction.

Earlier work on neural-network testing, repair, fairness and vision robustness remains in the [publication archive](/pubs). It provides experience studying AI failures; I do not treat it as direct evidence for delegation or collective agency.

## From patches to maintenance

**The immediate experiment is a software-maintenance agent with independently checked outcomes.** Start with an executable bug: inspect the code, propose a patch, build and test it, examine failures, and revise. Extend to sequences of related changes only after this loop can be evaluated reproducibly.

This intermediate step makes the move from code models to agents concrete. The research object becomes a sequence of tool actions and changing repository states, with a record of what was attempted and what the environment confirmed. Tests and traces are useful observations with limited coverage. The agent's own success report is a claim to check.

I would build on repair benchmarks such as Defects4C, adding controlled workflow tasks and held-out outcome checks. Comparisons would include a repair model, a fixed repair-and-test loop and a strong stateful coding agent under matched model and resource budgets. The question is whether the additional agent machinery improves completed, correct maintenance work enough to justify its cost.

## Assured agency

**The core question is how a maintenance agent can keep acting reliably when its working conditions change.** A maintainer may authorize an agent to edit a branch and run tests. While work is in progress, a dependency changes, a tool is replaced or permission to publish is withdrawn. Which earlier checks still justify the next action?

I would study a compact record connecting the task, permitted actions, repository and tool versions, pending work and verification results. A candidate method would identify which results become stale after a change, repeat the affected checks, and choose whether to continue, pause for authorization or recover partial work. This brings persistent state, authorized execution and recovery into one question: **when is existing evidence sufficient to continue?**

Independent outcome checks and controlled adaptation are part of this question. Better patch generation cannot enlarge permission to act; updating a tool requires checking its effects on pending work. In a repository, some actions can be rolled back. External disclosures or published artifacts may require different recovery, which limits what the initial testbed can establish.

The connection to my publications is through repair and evaluation. Permission changes, dependency-aware revalidation and persistent obligations are new research. The method must show benefits over full regression checks, existing workflow controls and equally informed stateful agents; keeping a larger log alone would not be a contribution.

## Collective agency

**Cooperation across owners is a longer-term extension, conditional on the earlier results.** The next setting would be maintenance across two repositories with different maintainers: one agent updates an interface while another adapts a dependent service. Each maintainer controls local changes, disclosures and acceptance.

This adds a specific question: how should agents coordinate dependent work when one side changes its plan or withdraws? Local verification would need to connect to shared acceptance conditions and recovery for unfinished contributions. The transition is from checking one agent's actions to checking whether separately authorized contributions compose into a working result.

My current publications do not evaluate this setting. I would begin with fixed participants and explicit dependency tasks. Open-ended group formation, negotiation markets, reputation systems and general private coordination are outside the immediate program. The broader network vision below remains a horizon, with these mechanisms deferred until a concrete need and suitable evidence emerge.

## Evaluation and milestones

The program advances by evidence rather than by adding topics:

1. **Establish the maintenance loop.** Release reproducible tasks, strong baselines and independent outcome checks. Separate successful repair from test overfitting, broken builds and incomplete work.
2. **Test change and recovery.** Introduce controlled repository changes, tool replacements and permission changes. Compare targeted revalidation with full rechecking and fixed workflows. Measure whether it preserves useful completion while reducing validation or human effort.
3. **Test cooperation only if justified.** Add two independently governed repositories. Compare against sequential handoffs and a coordinator with the same permitted information, including the cost of failed or withdrawn contributions.

Report correct completion, regressions, unauthorized effects, human interventions, compute and recovery costs separately. Separate development tasks from evaluation by repository or task family. If benefits vanish against strong baselines, require extra human intervention, or come mainly from refusing more work, the proposed mechanism has not earned its complexity.

This is a proposed research program. Existing publications support the starting methods and evaluation experience; agent reliability and collective outcomes remain hypotheses to test. I welcome collaborations on reproducible maintenance tasks, independent verification and controlled agent experiments.
