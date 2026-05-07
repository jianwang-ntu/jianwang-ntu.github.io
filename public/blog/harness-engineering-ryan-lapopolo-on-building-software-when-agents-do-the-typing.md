# Harness Engineering: Ryan Lapopolo on Building Software When Agents Do the Typing

At a recent London developer conference, OpenAI member of technical staff Ryan Lapopolo argued that implementation has stopped being the scarce resource in software engineering. For the past nine months he has banned his team from touching their editors — every line of code goes through an agent — and he believes the rest of the industry should reorganize around the same premise.

## The Central Claim: Code Is Free

Lapopolo opened with a deliberately provocative line: code is free. He acknowledged the discomfort — code carries maintenance burden, after all — but argued that the burden was always rooted in code being a synchronous drain on human attention. Models are patient and infinitely parallel. Producing, refactoring, and deleting code is no longer the bottleneck on what an engineering team can ship.

He pegged the inflection point to late 2025, calling GPT-5.2 the moment when the models became, in his words, "isomorphic" to a competent engineer for real work in real codebases. Each engineer in the room, he claimed, now has the equivalent of 550 to 5,000 engineers' worth of capacity available 24/7, constrained only by GPU and token budgets. The job, in his framing, has shifted to systems thinking, design, and delegation.

## What Becomes Scarce Instead

If implementation is no longer scarce, Lapopolo identified three things that are: human time, human and model attention, and the model's context window. The implication, as he framed it, is that every engineer is now effectively a staff engineer, responsible for setting up the structures that let an arbitrary number of agents work productively.

He offered a concrete consequence. In the old world, a stack-ranked backlog meant P3 tickets never shipped. In the new one, all of them get fired off in parallel, four variants at a time, and one is picked. He said this lets internal tools at OpenAI ship with full localization on day one — colleagues in London, Dublin, Paris, Brussels, Zurich, and Munich get native-language tooling without trading against any other team's capacity.

## Harness Engineering as a Discipline

The talk's title concept — harness engineering — is Lapopolo's name for the work of making a codebase *legible* to agents. He framed a "good harness" narrowly: it is the apparatus that surfaces the right instructions to the model at the right time, and nothing more. Front-loading every rule overwhelms the agent; deferring instructions until lint or test time lets the model prototype freely and then adjust.

### Specifying the Non-Functional Requirements

A single well-done patch, Lapopolo estimated, embeds roughly 500 small decisions about underspecified non-functional requirements — naming, error handling, structure, reliability. Models trained on trillions of lines have seen every possible answer to those questions. He argued the engineer's job is now to write the preferred answers down explicitly, in a place the agent will encounter them, and to refine that documentation whenever the agents produce something unacceptable.

His blunt framing: "You can just simply say do not produce slop. Don't accept slop, you won't get slop in your code base." But doing so requires absorbing short-term velocity hits to investigate why the agent went wrong and to install the corresponding guardrail.

### Prompts Everywhere

A running theme: nearly every leverage point in his workflow is a prompt in disguise. AGENTS.md files are prompts. Skills are prompts. Lint error messages are prompts. PR-review agents that block a merge until comments are addressed are prompts. He even pointed Codex at OpenAI's own prompting cookbooks and had it synthesize a "skill for writing skills" — meaning when he needs a new prompt, he uses an agent (using a prompt) to write a prompt.

The technique he highlighted as underused: writing tests *about the source code itself*, not just its behavior. One example was a test that fails if any file exceeds 350 lines, on the grounds that smaller files make the codebase more context-efficient for the model. Another was a lint rule that catches every `fetch` call without a timeout and retry — Lapopolo admitted he is not personally a reliable reviewer for that requirement, so he encoded it once and let the harness enforce it forever.

## Closing the Loop with "Garbage Collection Day"

In the Q&A, Lapopolo described how his team operationalized this discipline. With each engineer producing three to five PRs a day, merge conflicts and slow human review became the dominant pain. Their response was to dedicate every Friday to "garbage collection" — taking the week's recurring review feedback, identifying the underlying context failure, and writing it down as documentation, a lint, or a reviewer agent so the same correction never had to be made by a human again.

The pipeline he described: a human comment on a PR is treated as evidence of a missing prompt. That prompt gets added to the repo. A reviewer agent — primed against persona-specific docs (front-end architect, reliability engineer, scalability) — picks it up on the next push and surfaces it automatically. Over time, the slop drops.

## Repository Architecture for Agents

Lapopolo described his project's structure as built around agent ergonomics rather than human ones. It now spans roughly 750 packages in a PNPM workspace, isolated by business domain or stack layer, with package privacy enforced so that public versus internal APIs can be checked mechanically.

He pushed strongly for sameness across the codebase. One ORM. One language. One way to write a CI script, a bounded-concurrency helper, an instrumented side-effectful command. The reasoning, he said, is token predictability: the more uniform the code, the easier it is for the model to produce acceptable output anywhere in the tree, and the more transferable context an agent develops as it moves around. Large-scale migrations to enforce this consistency are themselves cheap, because agents can finish them — a point he made with evident pride about closing out migrations that previously hung open for months.

## Skills, Not Tools

On the question of custom tooling, Lapopolo described centralizing leverage in five to ten deep skills rather than spreading thin across many. Codex is the entry point; the local environment is built *around* it. Skills teach Codex how to launch the app, spin up the local observability stack, and attach Chrome DevTools via a daemon. When his team swapped the underlying mechanism from raw Chrome DevTools Protocol to a daemon, he said he didn't notice for three weeks — the skill abstraction held, and Codex kept working.

He was also wary of over-investing in scaffolding the models will soon obviate. His test for what's worth building: surfacing the right text to the agent at the right time will not be obsoleted by better models. Bespoke harness mechanics probably will be. He recommended depending on first-party harnesses (Codex, Claude Code) directly, since the labs post-train models *in the context of* those harnesses and the leverage compounds.

## Code Review and Working in the Car

Two of the more memorable Q&A moments. On code review: Lapopolo argued the goal is to push every recurring class of feedback out of the synchronous human path and into a lint, test, or reviewer agent. He warned against the failure mode of an implementation agent being "bullied" by reviewers — the bias should be toward acceptance, not perfection.

On his car commute: he straps a tethered laptop into the back seat, kicks off a task before leaving the office, and lets it run for the thirty-minute drive home. His skills tell the agent to keep going until the tests are green, so he doesn't have to reach back and approve continuations. Every time a human has to type "continue," he said, is a failure of the harness.

## Code as a Compiled Artifact

Asked whether code is now a disposable build artifact, Lapopolo answered yes without hesitation. His mental model: the LLM is a fuzzy compiler, and the documentation, lints, tests, and reviewer agents in a repo are the optimization passes that constrain what valid output looks like. Swapping models, in this view, is analogous to swapping LLVM for Cranelift in a Rust toolchain — the rules at the front determine the soundness of whatever the backend emits.

## Where He Wants to End Up

Lapopolo closed by sketching the workflow he is building toward: hand the system a token budget and a quarter's worth of prioritized work, let it run, and stay off the keyboard entirely. He noted that as agents took over implementation, weaker areas of the engineering process — QA smoke-testing built artifacts, triaging user feedback, watching for PII leaks in logs, writing run books for user operations — became visible as their own engineering problems. Those, too, he argued, are now things to delegate to agents, with the human role reduced to writing down what "good" means and letting the system enforce it.

His parting line was less a conclusion than a shove: stop hesitating, stop staying in the loop, and let the agents do the full job — because, he insists, they already can.
