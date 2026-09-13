# Harness Engineering: How OpenAI's Ryan Lapopolo Builds Software Without Touching the Editor

![Harness Engineering: How OpenAI's Ryan Lapopolo Builds Software Without Touching the Editor](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/harness-engineering-how-openais-ryan-lapopolo-builds.png)

In a London keynote, OpenAI's Ryan Lapopolo argues that implementation has stopped being the scarce resource in software engineering. The job now, he says, is to build the scaffolding — documentation, lints, review agents, repo structure — that lets coding agents do the full job while humans move up to defining the work and steering it.

## The central claim: code is free

Lapopolo opens with a confession that doubles as a thesis. He calls himself a "token billionaire," says he has spent the last nine months building software exclusively with agents, and admits he has banned his team from touching their editors. The reason isn't theatrics. It's that, in his telling, the models crossed a threshold in late 2025 — GPT 5.2 was his personal "magic moment" — where they became roughly isomorphic to a human software engineer for the purpose of producing real, merge-quality code in real codebases.

If that's true, the implication ripples outward. Code stops being a maintenance burden you ration and starts being something you can mass-produce, refactor, and delete on demand. P3 tickets that would never get done now get kicked off four-at-a-time in parallel. Internal tools ship with full localization on day one because the marginal cost of "also do French, Dutch, German" is just tokens. Long-running migrations that hung open for six months can be finished in an afternoon by spinning up fifteen agents.

Lapopolo argues that every engineer in the room now has access to "550 or 5,000 engineers worth of capacity" running 24/7, constrained only by GPU and budget. The skill set that matters, he says, shifts toward systems thinking, system design, and delegation. Every engineer is effectively a staff engineer now.

## What's actually scarce

The talk reframes scarcity around three things: human time, human and model attention, and model context window. Lapopolo's argument is that any time the human is in the loop synchronously, that's a failure of the harness — and any wasted context token is a failure of the codebase.

He pushes hard on a related idea: the models have been trained on trillions of lines of code that resolve every possible non-functional tradeoff differently. A single good patch involves something like 500 implicit decisions about reliability, error handling, naming, structure. If you don't write those decisions down, the agent will make them for you, more or less at random. So the work is to specify the non-functional requirements explicitly, in places the agent will actually see them.

His blunter version: "Don't accept slop, you won't get slop in your code base."

## Prompts everywhere

A recurring move in the talk is to flatten distinctions between different ways of telling a model what to do. Lapopolo lists them as a kind of joke: "agents.md is prompts. Skills are prompts. Rules files are prompts. Lint error messages are prompts. Review agents are prompts." The category is broader than people treat it.

This matters because of context decay. With auto-compaction now standard, instructions loaded at the top of a session won't survive long-horizon work. So a good harness, in Lapopolo's framing, isn't one that front-loads everything — it's one that surfaces the right instructions at the right time over the entire course of a PR.

Concrete examples from the talk:

- **Lints with remediation prompts.** Instead of failing with "you have an `unknown` here," a lint should say *why* — "we parse-don't-validate at the edge; this type should be derived from a Zod schema." The error message is a prompt.
- **Tests about source code, not behavior.** Lapopolo describes writing tests that fail if a file exceeds 350 lines, or if a Zod schema gets duplicated, or if package privacy boundaries are violated. The test suite enforces the codebase's shape, not just its correctness.
- **Persona-based review agents.** His team asked each engineer to bucket their PR feedback by the persona they were giving it as — front-end architect, reliability engineer, scalability reviewer — and turned each bucket into an automated review agent that runs on every push.
- **Network code guardrails.** Lapopolo admits he's an unreliable reviewer for "did this fetch get a timeout and a retry?" So he wrote a bespoke lint that checks every `fetch` call. The category of bug is now categorically gone.
- **Recursion all the way down.** He has Codex itself, pointed at OpenAI's prompting cookbooks, write skills for writing better prompts. He uses the agent to write the prompts that prompt the agent.

## Garbage collection day

The most concrete process Lapopolo describes is what his team calls "garbage collection day." Every Friday, every engineer's job is to look at every piece of slop that made a PR painful that week, and figure out how to make that class of mistake categorically impossible going forward — a doc, a lint, a test, a review agent.

The chain he's describing: a human gives review feedback on a PR → that feedback indicates a context failure → the fix isn't to leave a comment, it's to put the missing context in the repo → and then attach an automated process (a lint, a reviewer agent) that surfaces it next time. Synchronous human review is the failure mode being engineered away.

He's blunt about the merge-conflict pressure that forced this. With three engineers each shipping three to five PRs a day, conflicts became "super miserable." The fix was both structural — a 750-package PNPM workspace partitioned by domain, so PRs touch disjoint subtrees — and procedural: shrink time-to-merge by removing humans as the bottleneck on review.

## Building the harness around Codex, not around yourself

Lapopolo describes his team's setup as one where Codex is the entry point to the development process, not the IDE. The local app, the observability stack, the Chrome DevTools attachment — every dev tool is wrapped in a skill so that Codex invokes it first, not the human.

He tells one anecdote that captures the philosophy: his team migrated from talking to Chrome DevTools directly to going through a custom daemon, and he didn't notice for three weeks. The skill abstracted it. The agent kept working.

His advice on skills runs against the grain of "more skills, more capability." He recommends keeping the count small — five to ten — and deepening them rather than widening the surface area. The leverage compounds: one product-minded engineer documenting what a good QA plan looks like means every agent on the team produces good QA plans forever.

## Why he doesn't worry about the bitter lesson

Asked how he avoids over-engineering harnesses that the next model release will obsolete, Lapopolo points to context. Models, he argues, will always need to be told the requirements of a task and the local definition of "good." That doesn't go away with better weights. So a good harness isn't trying to compensate for model weakness — it's trying to surface the right text at the right time, which is durable work.

He extends this into an analogy: treat the LLM as a fuzzy compiler. The harness is the equivalent of a static-analysis and optimization pass. Swapping models is like swapping LLVM for Cranelift as a code-generation backend in the Rust compiler — you'd expect the rules about what valid Rust looks like to still hold, even if the generated x86 differs. The constraints around acceptable code, encoded in the repo, should make any reasonable backend produce acceptable output.

## A skeptical note on plan mode

One side observation worth flagging: Lapopolo is openly suspicious of plan-approval workflows. His argument is that humans rarely read the plan carefully, so approving it amounts to silently endorsing a pile of instructions you haven't actually evaluated — and then the rollout proceeds with bad instructions baked in. If a team is going to use plans, he recommends pushing them up as standalone PRs that get reviewed line-by-line before any execution kicks off. Otherwise, in his view, it's better to drop the ticket directly to the agent.

## What "removing yourself from the loop" actually looks like

Lapopolo splits his roughly billion daily tokens across three categories of work in roughly equal thirds: planning and ticket curation, implementation, and CI-time review and verification. He notes that getting tokens spent in CI is essential — writing code is no longer the hard part; getting code merged is.

He describes kicking off agents before leaving the office, tethering his laptop to his phone, and strapping it into the back seat of his car so the agents keep running while he commutes. The aim he states is having fifty agents running 24/7 with no human-in-the-loop interaction at all. Every time he has to type "continue," he counts it as a failure of the harness to have specified what completion means.

## Where the talk leaves the reader

Lapopolo's closing pitch is direct: agents can do the full job, and the work that remains for humans is to define the work, set the constraints, and build the structures that let agents drive it to completion. The future he's optimizing for is one where a token budget and a quarterly roadmap go in, and a working product comes out, with the human's role reduced to ranking priorities and writing down what "good" means.

Whether that future arrives on his timeline is a separate question. But the operational claim underneath it — that most of what currently feels like coding work is actually context-management work, and that context-management work compounds — is the part of the talk that travels even if you discount the rhetoric.
