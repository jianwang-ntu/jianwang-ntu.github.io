# The Harness as a Distributed Context Management System

![The Harness as a Distributed Context Management System](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/the-harness-as-a-distributed-context-management-system.png)

In a recent LinkedIn post, Glean co-founder Tony Gentilcore argues that the central engineering challenge in agent design has shifted from prompting to context management — and that the agent harness is increasingly the place where that work happens. He reports that Glean cut its own agent system prompt by **more than 45%**, not by reducing capability, but by moving capability *out* of the prompt and into skills loaded on demand.

> "The job of the harness becomes keeping the agent focused on the right context at the right time."

Gentilcore frames four shifts that, taken together, describe what he calls a "distributed context management system":

- **Programmatic Tool Calling (PTC).** Instead of the model deciding tool calls turn by turn in conversation, the agent writes and executes code that orchestrates the calls. Loops, conditionals, and branching live in code rather than in the reasoning chain.
- **Sub-agents for context execution.** Tasks are decomposed into separate agents, each with its own isolated context window, handling a scoped piece of the problem.
- **Compaction.** Load-bearing state — intent, decisions made, approaches that failed — stays in the conversation; raw intermediate outputs move to summaries or the file system.
- **Search-first skill discovery.** Rather than front-loading every tool schema into the context window, the agent searches for relevant skills, loads only those descriptions, and fetches full schemas at execution time. This is the mechanism behind Glean's prompt reduction.

## Why this matters

The four moves all point in the same direction: as agents run longer and accumulate more state, context becomes a scarce resource that must be paged in and out, not a buffer that gets stuffed up front. Gentilcore's framing — the harness as a *distributed* context manager — names something practitioners have been converging on under different labels (subagents, slash-skills, file-backed memory). The takeaway from the post, as he puts it, is that long-running agents force the harness to take on the discipline of keeping the model focused on the right context at the right time.
