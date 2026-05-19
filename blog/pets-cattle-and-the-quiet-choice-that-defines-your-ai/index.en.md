# Pets, Cattle, and the Quiet Choice That Defines Your AI Agent's Architecture

![Pets, Cattle, and the Quiet Choice That Defines Your AI Agent's Architecture](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/pets-cattle-and-the-quiet-choice-that-defines-your-ai.png)

A developer who has shipped an AI agent to production argues that the industry's hottest abstractions — Anthropic's "session, sandbox, harness" trio, the "don't treat agents as pets, treat them as cattle" slogan — only become useful once you can map them onto a concrete decision you've actually made. In a video walking through the build, the speaker shows how a seemingly throwaway choice about where to store conversation state quietly determined whether their agent ended up a pet or cattle.

## The Problem That Forced the First Decision

The speaker's starting point was mundane: AI agent tasks are long-running — twenty, thirty minutes at a stretch — and Vercel's serverless backend caps blocking HTTP calls at fifteen minutes. Almost every serverless provider imposes a similar limit. The standard workaround is well-known: run the long task on a different backend, return a service ID immediately, let the frontend poll for status.

Choosing that pattern forced a second choice. Since the work no longer ran inside the request that started it, every message — user input, agent output, every intermediate step — had to live somewhere both the worker and the frontend could read. The speaker put it all in a database. For live streaming of token-by-token output, they used a pub/sub service (Ably) instead, since databases are the wrong tool for that.

The speaker emphasizes that this looked like a boring, uncreative call at the time: "store everything in the database, including every step the agent takes." They didn't think it mattered. It turned out to matter more than anything else.

## Two Ways to Do Human-in-the-Loop

The interesting decision came when the speaker tried to support human-in-the-loop — letting users interrupt, answer questions mid-run, or steer the agent without waiting for it to finish. The speaker describes two genuinely different approaches:

- **Suspend the process and wait.** When the agent hits a step that needs human input, the running process pauses in place — possibly for hours or days — and resumes when the input arrives. SDKs like Inngest, Trigger.dev, Temporal, and the new Vercel WDK all advertise primitives for this: `wait for approval`, `wait for token`, durable timeouts.
- **End the conversation and restart it.** When the agent needs input, the process simply exits. Everything said and done so far is already in the database. When the user replies, the system bundles the prior history plus the new input into a fresh API call and the agent continues from there.

The speaker took the second path almost without noticing. Because every message and every tool-call step was already persisted, restarting was the path of least resistance: stop, wait for the user to type "continue," send the whole thing back to the model.

## The Self-Doubt Phase

Reading more documentation on Inngest — the speaker's chosen long-running-task host — produced a small panic. Inngest, Temporal, and the latest Vercel WDK all heavily promote *durable execution*: agents broken into discrete checkpointed steps, each individually retriable, with native `wait for token` events to handle human input.

The speaker's agent did none of that. It treated the entire run as one big function dropped onto a long-running runtime, with no checkpoints, no per-step durability, no native wait primitives. The worry was twofold: that they were misusing the tool, and that their "let the user type continue" pattern looked rustic next to the framework's polished alternative. They seriously considered rewriting the agent to fit the framework.

## Why Both Patterns Exist

What stopped the rewrite was a question: if `wait for token` is the right answer, why does the speaker's stateless approach also work, and work reliably? The research turned up a clean answer about origins.

The wait-and-resume model comes from the **workflow tradition** — Temporal-style systems that long predate AI. Workflows assume a single durable process that pauses at human steps and continues on the same execution context. The wait is fundamental; it's how the abstraction holds together.

The stateless model comes from the **chatbot tradition**. Conversations are sequences of messages. Whatever the model produces next is a pure function of the prior message list. There is no running process between turns. When a human replies, that reply is just one more message added to the context for the next API call. There's nothing to suspend because nothing was running.

The speaker borrows the field's labels: workflow-style is *stateful human-in-the-loop*; chatbot-style is *stateless human-in-the-loop*. Same goal, different lineages, different mental models.

## What Claude Code Does

Once the distinction was clear, the speaker noticed that most AI agent coding tools — Claude Code among them — sit firmly on the stateless side. They don't treat the agent run as a durable workflow. They treat the conversation itself as the source of truth and replay it forward, one discrete API call at a time. Inngest and Temporal lean stateful because their original business was traditional workflow orchestration; they have business reasons to push durable execution. The speaker concludes that for AI agents specifically, stateless is simpler, requires less to keep track of, and is plausibly where the field is heading.

## Where Pets and Cattle Finally Fit

With that mapping in hand, the speaker re-reads Anthropic's "Managed Agents" piece and finds the abstractions suddenly land. A stateful workflow returns a `run_id`. That `run_id` *is* the pet — a specific live process that must not crash, must not be lost, must be cared for, because the work lives inside it. Stateless workers are cattle: any process can pick up the next step as long as it can read the database. The "session vs harness" separation the article promotes is exactly what falls out when conversation state lives in storage rather than inside a running process.

The speaker's point is not that the article was wrong, but that the abstractions were unreachable without the concrete experience to attach them to.

## The Trap Worth Naming

The speaker closes with a warning about how this kind of decision actually plays out. When picking a human-in-the-loop strategy, it's hard to see the two camps as equally valid. The framework documentation foregrounds `wait for token` as a first-class feature; the stateless alternative shows up nowhere because it doesn't need a feature. A developer eyeing both will tend to assume the documented one is more sophisticated and the undocumented one is a stopgap they'll have to upgrade later.

The speaker says they came close to making exactly that rewrite, and the only thing that saved them was checking whether their working system was actually broken before "modernizing" it. The lesson they draw is that AI agent design isn't about stacking the most-cited frameworks. It's about being able to connect a high-altitude phrase like *separation of concerns* or *cattle, not pets* to a specific call you made in your own code — and being willing to keep the boring, working choice when the abstract one doesn't add anything.
