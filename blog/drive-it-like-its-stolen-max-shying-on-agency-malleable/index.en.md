# Drive It Like It's Stolen: Max Shying on Agency, Malleable Software, and the Tiny Core

![Drive It Like It's Stolen: Max Shying on Agency, Malleable Software, and the Tiny Core](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/drive-it-like-its-stolen-max-shying-on-agency-malleable.png)

On *Lenny's Podcast*, Notion's head of product Max Shying makes a flat claim: in a world where AI has compressed most skill gaps, the thing that separates people who thrive from people who stall is agency. Almost everything else he argues about building software in 2026 — why designers should learn to code, what makes a product great, why the "SaaS apocalypse" is overhyped, why he thinks knowledge work is already a form of UBI — follows from that one shift.

## Skills got cheap; agency got expensive

For most of the past decade, Shying says, the easy excuse was "I can never do that — insert skill issue." With AGI-adjacent tools at hand, that excuse has evaporated. What remains, and what is unevenly distributed, is the willingness to act on the world as if it's malleable.

He borrows a Steve Jobs line as the throughline: one day you realize the world is made up of people no smarter than you. The people who internalize that, he argues, will do well. The people who keep asking "what does it mean to be a PM" or "what's my job as an engineer" will have a harder time.

Asked how someone cultivates this, he points to *making things*. Tinker. Cook. Build a chair. He distrusts the framing where agency means "circumventing my terrible boss." Better, he says, to make something — and notice that when you get better at making things, people start paying attention, and the world starts feeling negotiable.

Inside Notion, he points to specific people as exemplars: Brian Leven, a designer who blurs into engineering and is also the team's top recruiter — not because the role demands it, but because he wants to affect outcomes. And Eric Lou, a PM who, after Shying told him he wouldn't hire a PM into the first ten people at a hypothetical startup, simply reorganized his skill set so the answer would change. His own mantra for this: *drive Notion like it's stolen.*

## Why he wants designers and PMs to code — and it's not what you think

A common read on Shying is that he's the reason Notion's designers and PMs ship code. He pushes back on the credit and reframes the goal. He doesn't actually care whether designers' code lands in production. What he cares about is that they think *in the medium*.

He cites Bret Victor's talk "Stop Drawing Dead Fish": a static Figma mockup of a chat is a dead fish. To design an AI product, you have to feel the model. So Notion set up a deliberately simple, LLM-friendly playground codebase — separate from the main Notion repo, which is older and less agent-friendly — so that designers and PMs could one-shot prototypes without having to overcome the fear of the terminal.

The deeper claim: the material designers are now working with is the *agent loop*. And the only way to develop intuition for an agent loop is to build one in the substrate it's made of, which today is code. Shying calls today's coding harnesses — Claude Code, Codex, and their cousins — "basically the operating systems of the '90s." He'd rather hire a designer who understands how agent loops work than one who can tweak CSS but treats the agent as a black box.

He's also worried about what gets lost. As roles merge, he says, the field risks losing its specialists — the people who push craft past usable into delightful, or who do the unglamorous engineering work of making something function for 100 million users. Vibe coding has produced more software, he argues, but not more reliable software.

## The first 10% is free; the last 10% is still 90%

Asked what has most changed about his job, Shying gives a tight answer: "The first 10% of every project are now free." Writing a PRD before you can produce a working demo is, for most projects, no longer the right move. At GitHub, he says, the in-house slogan was *demos not memos* — give people something to react to. AI just made that vastly cheaper.

The flip side, he notes, is that the last 10% is still 90% of the work. It's easier than ever to ship a v0.8 of a startup. It is not meaningfully easier to ship the version that works for a billion people. And while the volume of software has gone up in the past year, he doesn't think its average quality has — including, he points out, from the labs themselves, where regressions reappear weeks after being fixed and TUIs still can't render at a reasonable frame rate.

## "Obviously good" beats more features

Inside Notion, Shying hands out stickers that say *obviously good*. The bar, he says, is that you know it when you see it: no one argued the first iPhone wasn't obviously good. No one argued ChatGPT wasn't.

He pairs that bar with what he calls *incremental correctness* — iterate hard, but always toward the obviously-good version. The failure mode he watches for is the death spiral of "if we just add one more thing, it'll finally be great." That, he says, never works.

The pattern he sees across the great products he's contributed to is a *tiny core* that is exceptionally good, with everything else flowing from it:

- Heroku: `git push heroku master`. The one-liner that turned a thing on your laptop into a URL.
- Dropbox: the menu-bar icon that was so good at syncing that people used it as a proxy for "do I have internet?"
- GitHub: the pull request — the idea that anyone can suggest a change and you can see it.
- Notion: blocks and slash commands.
- Figma: the seamless blend of real-time collaboration and design.

He pushes back on metrics that masquerade as progress. Token spend, in his view, is the new lines of code — a vanity number that organizations end up bragging about. He admits sympathy for why a company like Meta builds a leaderboard ("a good way to get tens of thousands of people to identify the outer loop of their work"), but his own policy at Notion is closer to: don't optimize for it yet, see what people learn, and expect that in six to twelve months the ROI conversation will get uncomfortable for a lot of companies.

## Taste is a virtual machine you train through reps

Shying defines taste with a programmer's metaphor: it's the ability to run a virtual machine in your head where, given an idea, you can predict whether a specific in-group will like it. You pick your in-group — you don't have to build for 8 billion people — and you get good at simulating their reaction.

How do you build it? Reps. Iterations with feedback. It is, he notes, structurally identical to how models are trained: input, prediction, response, backpropagation. He's skeptical of the "taste is the one thing humans have left" framing for exactly this reason.

The designers he sees develop the strongest taste have two habits: side projects where they own the whole stack end-to-end, and a constant, slightly-annoying willingness to try new tools and suggest them to the team. He also recommends surrounding yourself with tasteful objects. Notion's conference rooms are named after iconic designs — the first typewriter, the Macintosh, a Porsche 911 — so that, sitting in one of them, the work in front of you can feel inadequate by comparison.

## Malleable software and the overstated SaaS apocalypse

Malleable software is Shying's term for software that serves the interests of the people using it rather than the company that makes it. The physical analogy he reaches for: imagine living in an apartment where you couldn't rearrange the living room and the kitchen had to stay exactly as someone else designed it. No one would accept that. But that is, more or less, the deal most apps offer.

He's careful not to overclaim. The "SaaS apocalypse" — the idea that everyone will rebuild Salesforce, or Slack, or Notion for themselves — he calls greatly exaggerated. People don't actually want to maintain a full software stack. They go to Costco for the steak in styrofoam; they don't want to hunt. Software is a garden, as Bret Taylor puts it, and what you pay for in "as a service" is the tending of it.

What he does predict is that tools will become more *general* — more like the word processor, the spreadsheet, FileMaker Pro of the '90s — while specialists keep solving the hard, narrow problems like security. He cites a tweet from journalist Joanna Stern, who said Notion AI was the first thing that made her actually understand Notion, as evidence that AI can serve as a tutor that opens up tools that used to be too hard to start with.

The Slack-at-Anthropic example clinches the point for him. Of all companies that might rebuild their own internal chat, Anthropic uses Slack like crazy — because their time is better spent building AGI.

## What's actually changing — and what isn't

Shying's read on model progress is uneven. Coding is improving at an exponential clip. Writing, he says, is not — he still hates reading AI slop. So his prediction for what AI does to other functions isn't "agents replace marketers next." It's that *software eats the world faster*, because Software 1.0 — old-school deterministic code that encodes business practices — is now nearly free to produce. HR will automate more because they no longer need to bug an engineering team to write the code. The labs' progress in non-coding domains, he argues, is mostly them applying coding principles to that domain.

He's also skeptical of the assumption that the frontier model is always the right tool. His analogy is the Retina display: past a certain pixel density, you can't see the pixels, and you stop caring. He thinks something similar applies to intelligence for most knowledge-work tasks. Once a model is good enough, what matters is whether it runs locally, runs cheaply, runs fast. He'd rather have an exoskeleton than a god in a box in a data center somewhere.

For product teams, the practical effect is more shots on goal: ten agents exploring ten paths in parallel, more iteration baked in from the start, less waterfall. But also, in his telling, the same number of obviously-good products at the end of it.

## "We already have universal basic income — it's called knowledge work"

Shying offers this half-jokingly, half-seriously. The argument: most knowledge workers are paid generously to type the right words into a computer in air-conditioned rooms, and what humans actually need to be content is a lot less than the elaborate hierarchy of jobs society has built. Whatever AI does to the labor market, he expects humans will keep inserting themselves into the loop, because that is what humans do.

The deeper point underneath the hot take is a warning against frenzy. He sees a lot of young people in Silicon Valley convinced that this is the last train out — that if they don't catch this AI wave they'll be locked into a permanent underclass. He thinks that mindset is hollow and self-defeating. Work hard, especially in your late teens and twenties. But work hard on things you actually care about, not on a frantic bid for certainty about how the future will resolve.

His contrarian aside on this theme: inclusivity is not always a virtue. He believes in small-group theory — the world, he says, is run by group chats of eight people or fewer — and thinks it's fine, sometimes, for a product to deliberately serve the top of a class and exclude the rest. (He caveats this carefully: he is not talking about hiring or access to a livelihood. He is talking about products.)

## What he'd actually do if he didn't have to work

Asked the AGI question — if you didn't have to work, what would you do? — Shying says: the same thing. Maybe with fewer meetings. He codes not because it's useful but because it's an intellectual challenge, like chess or Go. He'd tinker. He'd try to make the world around him more malleable.

The takeaway he leaves listeners with is an assignment. Go for a walk through a city, or anywhere humans have built things. Look carefully at what's around you and notice that essentially all of it was made by people no smarter than you, and that in six to nine months you could probably figure out how to remake most of it from scratch. That recognition, he argues, is what agency actually is — and almost everything else he believes about building good software is downstream of it.
