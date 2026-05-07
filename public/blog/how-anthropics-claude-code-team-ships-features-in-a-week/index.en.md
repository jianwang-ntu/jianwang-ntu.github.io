# How Anthropic's Claude Code Team Ships Features in a Week — and What It Means for the PM Role

In a recent appearance on Lenny's Podcast, Cat Woo, head of product for Claude Code and Co-work at Anthropic, lays out how her team has compressed product timelines from quarters to days, why "product taste" has overtaken project management as the central PM skill, and where she thinks human judgment still beats the model. Her central claim: the PM role isn't disappearing — it's mutating, and most candidates she interviews are still approaching it with pre-AI assumptions.

## A team built for one-week features

Woo describes her partnership with tech lead Boris Cherny — creator of Claude Code — as roughly 80% "mind-meld," with each of them owning a 20% slice the other cares less about. Boris sets the three-to-six-month vision; Woo's job is plotting the path to it and keeping marketing, sales, finance, and capacity teams aligned so nothing blocks shipping.

That alignment work matters because the cycle has collapsed. According to Woo, Claude Code feature timelines have gone from six months to one month, sometimes one week, sometimes one day. The implication for PMs is the inverse of how the role used to work:

- Less weight on multi-quarter roadmap coordination.
- More weight on shrinking the gap between an idea and a user trying it.
- A "concept corner" of the product where any PM or engineer can ship to users by week's end.

Woo argues the PMs who succeed on AI-native products are the ones who can compress that idea-to-user loop and clearly define which tasks must work out of the box.

## Tight goals, research previews, low process

Woo says LLMs' generality creates ambiguity that can paralyze teams — they can theoretically serve any user and solve any problem. A good PM cuts that down: who is the key user, what is the specific problem, what is "done." Her example: the user is professional developers, the problem is permission-prompt fatigue, the goal is letting them safely reach zero permission prompts. A sharp goal rules out approaches.

The team's repeatable shipping pattern relies on three things:

- **Research-preview branding.** Most features ship marked clearly as previews. That signals to users this is early, possibly temporary, and lowers the team's commitment cost. Two weeks from idea to release is normal.
- **A pre-wired cross-functional process.** When engineers feel a feature is internally dogfooded, they post it in an "evergreen launch room" and the docs lead, PMM, and DevRel can turn around marketing the next day.
- **Weekly metrics readouts and written team principles.** Everyone sees the same numbers; everyone knows who the key users are and what trade-offs are acceptable. That lets people decide without waiting on a PM to unblock them.

PRDs aren't dead, just rarer. Woo says the team still writes them for genuinely ambiguous features or anything requiring heavy infrastructure that takes months. For most work, a one-pager covering goals, delightful use cases, and current failure modes is enough.

## Roles are merging — and engineering taste is the bottleneck

Asked about the future of the PM job, Woo offers a counterpoint to the "we'll need fewer PMs" view: the roles are blending. Engineers do PM work, designers ship code, PMs occasionally land code themselves. Her team's deliberate bet is to hire engineers with strong product taste rather than expand PM headcount, on the theory that one person who can carry an idea from Twitter feedback to shipped feature in a week is more efficient than a coordinated handoff.

Most Claude Code PMs were engineers first; the designers were front-end engineers first. Woo herself was an engineer for years before a brief stint in VC and then Anthropic.

She is careful, though, about which skill is *most* valuable. "As code becomes much cheaper to write," she argues, "the thing that becomes more valuable is deciding what to write." Product taste is the rare skill — and she says Anthropic will hire almost anyone who has clearly demonstrated it, regardless of background.

The engineering background helps mainly because it gives a calibrated sense of effort: if something would take an hour, just build it instead of debating; if it's expensive, prioritize harder. But Woo flags that the valuable skill set shifts every few months, and predicting more than a quarter ahead is a fool's game.

## Being the right amount of "AGI-pilled"

Woo's most pointed framing for the PM job is what she calls being "the right amount of AGI-pilled." It's easy, she says, to design for the hypothetical super-intelligent model — at that point you just need a text box. The hard work is the present-tense version:

> For the current model, how do you elicit the maximum capability? How do you guide users onto the golden path? How do you patch the model's weaknesses?

She describes three concrete habits for building this skill:

1. **Talk to the model constantly, and ask it to introspect.** When Claude does something unexpected — making a front-end change but skipping the UI test, for instance — Woo asks the model why. The answers often reveal a confusing system prompt or a sub-agent that didn't verify its own work, and that diagnostic points to a fix in the harness.
2. **Find five trusted human evaluators.** Many people will give feedback; only a handful are good at articulating *why* a model or harness combination feels good or bad. Woo names Amanda Askell (who shapes Claude's character) and the Claude Code team itself, where she gathers vibes at team lunches whenever a new model lands.
3. **Build a small number of strong evals.** Ten good ones beat hundreds of mediocre ones. They give the team a quantitative target and surface gaps. Woo writes evals herself when a feature needs sharper definition — memory features benefit a lot, others less so.

## The Claude Code, Co-work, and Desktop split

Woo offers a clean mental model for when to use which Anthropic surface:

- **Claude Code in the terminal** — for one-off coding tasks where she wants the latest features. The CLI lands new capabilities first and is the most powerful surface.
- **Claude Desktop** — for front-end work (the live preview pane is the killer feature) and for users who find the terminal unfamiliar. It also doubles as a one-stop view of all in-flight sessions across CLI, web, and mobile.
- **Mobile and web** — for kicking off tasks away from a laptop. Woo calls out the now-meme image of people on planes or street corners tethering laptops to phones as proof the surface is needed.
- **Co-work** — for any output that isn't code: Slack-zero, inbox-zero, slide decks, launch plans, meeting briefs.

Her rule of thumb: if the output is code, use Claude Code; if not, use Co-work.

### A worked example: the slide deck

Woo describes building a deck overnight for an upcoming Claude Code conference talk. She connected Co-work to her Google Calendar, Gmail, Drive, and Slack, fed it her PMM's draft talking points, and let it work for an hour. It pulled launches from Twitter, from internal launch-announcement channels, and from team demo posts, and produced a 20-page deck that matched Anthropic's existing design system because she had given it access to a standardized template. She iterated once on wordiness; the visual polish was already there.

The PM role in that workflow, she argues, isn't generation — it's selection. Claude proposed an outline; she picked which arc the talk should follow (local task success → green PRs → engineers landing more PRs) and which demos best illustrated each step.

## What's being sacrificed

Woo is candid that the speed has costs. The biggest is product consistency. When code was expensive, you carefully planned which product served which use case and how they integrated. Now Claude Code occasionally has overlapping features — sometimes deliberately, because two internally beloved form factors are competing for external feedback. New users have a harder time figuring out the canonical path to accomplish something, and longer-term users feel a treadmill effect: they sense they have to check Twitter daily or fall behind.

The team's recent `/powerup` onboarding flow is a quiet concession on this. Earlier, the team's principle was that good products shouldn't need tutorials. With over a hundred features now, they relented and built one.

## Why Anthropic moves the way it does

Asked to explain the company's run — from the least-funded frontier lab to one beating its larger competitors — Woo names two ingredients:

- **A unifying mission.** Anthropic hires people whose top priority is bringing safe AGI to humanity, not the success of any individual product. When two priorities compete, the conversation is "which one is more important for Anthropic's mission," and the loser stands behind the winner. Woo says she would be happy if Claude Code failed and Anthropic succeeded. She implies (without saying outright) that this is also why Anthropic isn't building a social feed or other off-mission products.
- **Aggressive focus on removing shipping barriers.** The team is "very low on process" and expects every individual to take an idea to production in under a week.

She doesn't credit Anthropic's most powerful internal model ("Mythos") for the speed; it helps a little, but the team has been moving this fast for several quarters. The advantage is in working with frontier models *and* using them to build, creating a flywheel.

Two recent controversies came up. On the leaked Claude Code source: Woo says it was human error during a packaging-update PR that passed two layers of human review, and the team has since hardened the process. On the Open Claude Code decision — restricting subscription users from running their Claude subscription against third-party Claude wrappers — she frames it as a hard prioritization call. Anthropic subsidizes subscription compute, third-party usage patterns differ from first-party ones, and the company chose to protect first-party products and the API.

## Where humans still beat the model

Woo's answer to "what is durable human work" has two parts.

First, **picking what to build.** With tens of thousands of GitHub issues asking for everything, deciding which to build and how is taste-bound work the model can't yet do well.

Second, **common sense and stakeholder EQ.** A product launch has a thousand moving pieces — small things, big things, and a rotating cast of stakeholders with different communication preferences. The model doesn't yet have a great sense of who they all are or what venue keeps them on board. Woo expects this gap to close, but says it's wide today.

She also flags a softer skill the team hires for explicitly: equanimity. She describes weeks where Sunday's P0 is dwarfed by Monday morning's P0, which is dwarfed by Monday afternoon's. The team, she says, is full of people who lean into chaos with a smile, brutally prioritize, and accept that a buggy ship beats a delayed one because the feedback loop will fix it. Anthropic tends to hire industry veterans who've already learned how to maintain energy across cycles.

## The product trajectory: from one task to hundreds

Woo lays out the building-block view of where Claude Code and Co-work are heading:

1. **Single-task success.** Give it a prompt, get usable output. As models get smarter, this rate climbs.
2. **Multi-task parallelism.** Multi-coding became a trend in late 2025 and has only accelerated.
3. **Tens to hundreds of agents in parallel.** That's where the team is now extrapolating. Local laptops won't have the RAM; the work will run remotely. The product questions become: what interface tells humans which tasks need attention, how does the agent verify its own work so a "done" status can be trusted, and how does the system incorporate user feedback so the same mistake never repeats?

A related observation: every new model Anthropic ships lets the team *remove* features from Claude Code. Earlier models needed crutches — the to-do list was added because Claude Code would fix five of twenty call sites and stop. By Opus 4 and later, Claude used a to-do list naturally without prompting, and the team de-emphasized it. New models also unlock features that were previously too unreliable to launch — the recently-reliable code-review capability is Woo's example, where Opus 4.5/4.6 and Sonnet 4.6 finally crossed the threshold.

## Advice for PMs and other knowledge workers

Woo's closing pitch to listeners worried about their careers in an AI-driven world:

- **Find the repetitive parts of your job and automate them.** That frees the 20% bandwidth you need for the creative or strategic work nobody else has time for.
- **But push automations to 100%, not 95%.** A 95% automation isn't an automation; it's a thing you still have to babysit. Woo admits she's currently failing at this herself — she's been trying to teach Co-work to get her to inbox-zero, and it's not there yet.
- **Build apps you actually use every day.** Prototypes you don't return to teach you very little. The leverage comes from real, repeated use.
- **Don't over-customize.** There's a polar-opposite failure mode where people obsess over their MCP setup, skill files, and tooling instead of doing the actual work. Simple setups usually work better.

She also notes a generational shift in product feel: the 2024 generation was chat-based; the Claude Code generation is action-based. The aha moment, she argues, is when users feel the agent *do* something on their behalf rather than tell them what to do. People who tried ChatGPT in 2023 and gave up are missing that.

## The takeaway

Woo's framing throughout is that the work hasn't gotten easier — it's gotten faster, more amorphous, and more dependent on judgment that the model can't yet replicate. The PMs who thrive, by her account, are the ones who can hold a clear opinion about what the product should be a month from now, ship rough versions in a week, build evals to measure whether it's working, and stay calm enough to keep doing it next week. Or, in her own motto: "Just do things. Jobs are fake."
