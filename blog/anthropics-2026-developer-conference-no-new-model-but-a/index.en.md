# Anthropic's 2026 Developer Conference: No New Model, But a Surprise Compute Deal With Musk

![Anthropic's 2026 Developer Conference: No New Model, But a Surprise Compute Deal With Musk](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/anthropics-2026-developer-conference-no-new-model-but-a.png)

In a recap of Anthropic's May 6 developer conference, Dafei — host of the Chinese tech show *Best Partners* — argues the headline news was not a next-generation foundation model but two things the industry did not see coming: a full lease of SpaceX's Colossus 1 data center to Anthropic, and a deliberate decision to spend the entire keynote on tooling, agents, and cost rather than model upgrades. Dafei frames the event as a clear signal that the AI race has shifted from parameter counts to deployment, developer experience, and unit economics.

## The Musk Deal That Reset the Compute Map

Dafei opens with what he calls the most surprising story of the week: Elon Musk leasing the entirety of SpaceX's Colossus 1 to a company xAI had been treating as a direct competitor. According to his recap, Musk spent significant time in closed-door meetings with Anthropic's leadership before the conference, probing — at the technical, structural, and cultural level — how the company keeps Claude aligned with safety guarantees. Musk later said publicly that every executive he met was professional and genuinely invested in the ethical limits of AI, and that none of them set off what he called his "malice detector."

The compute itself is significant. Dafei reports that Colossus 1, located in Memphis, Tennessee, holds more than 220,000 NVIDIA GPUs — a mix of H100, H200, and the newest GB200 — totaling over 300 megawatts. xAI had already migrated its training workloads to Colossus 2, freeing the older facility for full external lease.

For Anthropic, Dafei argues this fixes its most painful bottleneck of the past year. He cites the company's own figures: API call volume up roughly 17x over twelve months, Claude Code users averaging 20 hours per week, and chronic rate-limit complaints. With Colossus 1 secured, Anthropic announced at the conference:

- Claude Code's 5-hour rate limit doubled across Pro, Max, Team, and seat-based enterprise plans.
- Pro and Max accounts no longer throttled at peak hours.
- Substantially higher API ceilings for the Opus line.

Co-founder Tom Brown said expansion of inference capacity on Colossus 1 would begin within days. Dafei adds that Reuters reported the two companies also discussed jointly building multi-gigawatt orbital data centers — a thread he sees as central to SpaceX's pre-IPO growth narrative.

## Why Anthropic Chose Not to Ship a New Model

Anthropic's product lead Ami Vora set the tone early: no new model would be announced. Dafei reports the explicit goal was to close the gap between what current models *can* do on paper and what they actually do in production.

Research program lead Dianne Penn used Opus 4.7 — Anthropic's current frontier model — as the example. According to Dafei's recap:

- **Rakuten** moved its internal coding agent ANP fully to Opus 4.7's smart mode and saw 3x more production engineering tasks resolved per run versus the previous generation.
- **Intuit** found Opus 4.7 actively flags logical gaps during planning and self-corrects, producing cleaner output with fewer bugs.
- **Cloud Design**, launched the day after Opus 4.7, has been adopted alongside Claude Code to scaffold production-grade visual interfaces.

Penn also introduced what Dafei calls the most strategically loaded slide of the day: a new evaluation framework called **Task Temporal Reason**, designed to measure how long an agent can run autonomously before failing. The chart shows Claude moving from a few minutes of autonomous work a year ago to several hours today, with the stated goal of "always-on" agents that no longer need a human prompt to start. Penn's advice to the room, as Dafei reports it: don't design for the current Claude — design for the next one. Failed prototypes from six months ago, she argued, are often a small capability bump away from suddenly passing every test.

## Claude Manager: Three Bets on Agent Autonomy

The next section of the keynote unveiled three additions to Claude Manager, Anthropic's hosted agent platform.

### Multi-agent orchestration

A controller agent now coordinates child agents, each with its own context window, running tasks in parallel before the controller aggregates the result. Dafei recounts the conference demo: a fictional space-mining startup called Lomer, with three sub-agents — Commander (overall progress), Scout (selecting high-value landing sites), and Navigator (flight path and safe landing). The pitch is that this architecture suits logistics, aerospace, manufacturing, and financial controls — domains where one monolithic agent gets confused.

### Auto-comps for self-evaluation

Developers write the success criteria as a Markdown file. A separate scoring agent — created automatically — checks every run against those criteria, and if the run fails, the executing agent retries within a configured iteration cap. The demo conditions were strict: soft landing, fully empty terrain, enough fuel reserved for a return trip, all three or fail. No human in the loop.

### "Dreaming" — the research-preview feature

Officially called **Trace** (Dafei translates it as "doing dreams"), this feature lets an agent review its own session history at the end of a run, distill rules and failure patterns, and write the lessons into a persistent memory store that all future sessions can read. The on-stage demo showed six landing sites: four solved on the first run, all six solved on the second run after dreaming was enabled — and the developer's only action between runs was clicking a toggle. Dafei calls this the closest thing yet to AI agents behaving like long-term employees rather than fresh temps.

## Claude Code: Removing the Human From the Loop

Boris Cherny, a core Claude Code developer, summed up the shift in a line Dafei highlights: the default action is no longer "I prompt Claude Code" but "I tell Claude to prompt Claude Code." The updates fall into five buckets.

- **Routines** — automated triggers (cron, GitHub webhooks, custom API calls) that let Claude Code run unattended and open compliant PRs. The on-stage scenario: a refund-feature issue filed at night, a fully implemented PR — idempotency, multi-arm fusion, audit logging — waiting in the morning, with even a CI failure auto-diagnosed and fixed.
- **Auto Mode** — a built-in dual classifier that judges every tool call on two questions: is this destructive, and is this a prompt-injection attempt? Only calls passing both run without approval, eliminating the constant approval prompts that break flow.
- **Worktrees** — a wrapper around Git worktrees triggered either by a `cloud-w` command or by plain language. Claude decides whether a feature needs an isolated environment, sets it up, and cleans up when done. The demo ran two color-theme and rounded-corner features in parallel without conflict.
- **Auto Memory** — a cross-session memory written to a per-project `Memory.md` so that successive sessions and sub-agents can pick up project context, build commands, and team preferences without being re-briefed.
- **Cloud Review** — a multi-stage, multi-agent review pipeline. Specialist agents inspect security, readability, performance, and compliance separately; a verifier agent filters false positives. Dafei reports that engineers using the full flow saw a 200% increase in PRs submitted per person.

The Claude Code desktop client also got a quieter set of updates: session grouping, plan/diff/file views, experimental section markers that auto-generate a navigable outline of long sessions, a flicker-free terminal renderer using virtualized scrolling, and remote control from a phone to take over and continue a local session.

## GitHub's Session: How to Run Claude at Scale Without Going Broke

GitHub Copilot product director Mario Rodriguez delivered what Dafei treats as the conference's most concrete engineering segment: how GitHub itself runs Claude at scale.

Rodriguez set the cache-hit target between 94% and 96%. Below 70%, he argues, the system is misconfigured. He gave three rules:

1. The system prompt must be fully static. Any dynamic content kills the cache.
2. Tool prefixes must never change mid-conversation, or the entire session's cache clears.
3. When mixing models, preserve cache affinity so a user's follow-up requests land on the same cache node.

He also pushed back on a common assumption: longer context windows don't necessarily cost more. Because the model compresses context less often, total token spend can actually fall.

Rodriguez then walked through **Advisor**, a cost strategy GitHub and Anthropic co-developed. The principle is execution/decision separation: Haiku handles routine work cheaply, and only escalates to Opus when it hits something it can't solve. He showed a side-by-side: Advisor finished while a Haiku-only agent was still retrying, at a fraction of pure-Opus cost. Legal-tech firm AveLego, he said, cut inference cost by 5x using this pattern without sacrificing frontier quality.

Finally, GitHub demoed an internal review agent called **RobotDuck** — already shipping in the Copilot CLI experimental mode — which inserts critical feedback at three points: end of planning, between feature implementation and formal review, and after tests are written but before they run. The pitch is to catch bugs when they're cheap.

## The Bun Live Demo: 25 Minutes, Four PRs, Zero Humans

Bun runtime author Jarred Sumner and Boris Cherny ran a live demo of Bun's automation pipeline. The repo's automation bot, **Robotbot**, attempts to reproduce filed issues, drafts a fix, writes tests, opens a PR, and runs through multiple review rounds — all unattended. Dafei reports that over the past three months, Robotbot has contributed more PRs than Sumner himself. The on-stage run: 25 minutes, four PRs merged after passing the review bots, no human intervention.

## Fireside: Dario, Daniela, and an 80x Year

Daniela Amodei opened the fireside with a metaphor Dafei finds telling: Anthropic is on a near-vertical roller coaster, and she and Dario sit at opposite ends of the car. Dario then revealed a number Dafei treats as the day's most important: the company had planned for 10x annualized growth in 2026, and Q1 came in at 80x. That mismatch, Dario said, was the direct reason for the urgent SpaceX deal. He admitted he would prefer the curve return to merely 10x — 80x is hard to absorb gracefully.

Daniela's framing of why developers matter to Anthropic, summarized by Dafei:

- Developer feedback is the most direct and informed signal the company gets.
- Anthropic is itself a developer-led organization, sharing a vocabulary with its users.
- Developers are building the highest-stakes verticals — medical, legal, financial, industrial — on Claude.

Dario laid out three predictions for how AI development will change:

- Single agents give way to multi-agent collaboration; Claude becomes a team manager and eventually resembles a "national-team-level group of geniuses inside a data center."
- Productivity gains move from individual to organizational. The next bottleneck is non-linear team coordination.
- An Amdahl's-law dynamic kicks in: when code generation is 3–4x faster, security review, change validation, and compliance — previously not bottlenecks — become the new constraints.

He explained why coding has been the fastest-moving frontier: verifiability. Unit tests give the model an unambiguous pass/fail signal. Anthropic is now trying to find similarly verifiable signals for design quality, security analysis, and logical reasoning — the breakthrough that, in his view, would unlock writing, scientific reasoning, and creative work alike.

Daniela closed her segment by introducing what she called Anthropic's core internal value: **Hold Light and Sheet** — embracing the upside while acknowledging the shadows. As an example, she cited an unreleased internal model, Messos, which the company has not shipped because its safety implications are not yet fully evaluated. Safety, she said, is always prioritized over speed.

Dario ended on the prediction that has since circulated widely. A year ago he was asked when the first solo-founder, billion-dollar AI company would appear; he said 2026. Two-person billion-dollar AI companies and solo-founder unicorns now exist. With seven or eight months left in his window, he stands by it. His reasoning: AI is turning company-building itself — registration, product design, R&D, ops, customer service — into a task a model can assist end-to-end, not just code.

## Where the Talk Leaves the Reader

Dafei reads the conference as a coherent argument: the competitive front in AI has moved off raw model performance and onto deployment, developer experience, cost, and safety as a single bundle. Whether Dario's solo-billionaire prediction lands by year-end is the open question Dafei leaves with viewers — alongside which of the day's many features they actually plan to use.
