# Ralph Loops: Why Chris Parsons Stopped Orchestrating Agents and Started Looping Them

In a two-hour workshop at what appears to be an AI engineering conference, Chris Parsons argued that the future of working with AI is not elaborate orchestration but a deceptively simple pattern: a loop that does one thing, picks the next most important thing, and goes again. Parsons — a CTO with about 30 years of software experience, now consulting on AI adoption — claimed he runs these loops 24 hours a day across his email, calendar, newsletter, client work, and code, and that the pattern scales from fixing a Pomodoro timer to running, in his words, "an entire startup."

## What a Ralph Loop Actually Is

The name comes from Ralph Wiggum, the Simpsons character who tries the same thing over and over until it works. Parsons credited Jeffrey Huntley with the original idea: when an AI finishes a task, just ask it to do the same task again. The model frequently notices something it missed, fixes it, and only then declares itself truly done.

Parsons walked through the lineage:

- **The dumbest Ralph loop** is a `while true; do claude -p "implement ticket 001"; done` shell loop. It works, but only just.
- **A useful Ralph loop** points the AI at a folder of tickets and prompts: *implement the next most important ticket using TDD, commit when done.* The AI reads the backlog, picks the next item, ships it, and the loop fires again.
- **A production Ralph loop** is wrapped in a skill that codifies how the user actually works — recovery from a dirty git tree, when to start a fresh context, how to verify behaviour beyond test passing, and so on.

He demonstrated all three live against a toy Pomodoro timer he had vibe-coded the night before, with a `doc/tickets/` folder of one-shotted change requests. He also showed Claude Code's `/loop` command, which schedules a cron tick — `loop every minute build the next ticket` — so the loop runs without a wrapper script.

## Why the Models Matter

Parsons drew a hard line on which models make this pattern viable: roughly GPT-5.x onwards, and Claude Opus 4.6 / Sonnet 4.6 onwards. Earlier models, he claimed, would routinely stop short of finishing — which is why the original Ralph trick of "ask it again" was so valuable. Newer models tend to finish the task the first time, so the loop's job shifts from rescuing missed work to feeding the AI the *next* task.

He was openly sceptical of Mythos (a model he expected from a competitor) — "mostly marketing, but we'll see" — though he conceded he hadn't used it.

## The Failure That Taught Him to Stop Orchestrating

Parsons described an earlier project where he tried to use AI to break a large initiative into tickets, then sub-tickets, then a dependency graph, and then dispatched six or seven parallel agents against it. It collapsed: agents picked the same blocking ticket, implemented it twice, and couldn't tell what was already done.

His diagnosis was unflattering — he had recreated 1990s waterfall, the kind of process where requirements documents were heavy enough to "stagger to carry into the meetings." If humans couldn't run that process, expecting AI to was naive.

The fix was to throw out the dependency graph and just ask the AI, every iteration, *what is the next most important thing to do?* Parsons argued that figuring this out on the fly is something LLMs are actually good at. What they are not good at is coordinating that decision in parallel across many agents — but, he contended, parallelism is rarely the bottleneck anyway:

> The bottleneck is usually not the number of agents. It's usually you just keeping up with the AI just doing things over and over again.

His advice: don't reach for Gas Town or multi-agent frameworks until a single sequential loop has actually maxed out your capacity to review its output.

## From Newsletter Pipelines to Skills

Parsons illustrated the same shift in his own non-coding work. He used to maintain an n8n workflow that produced his weekly newsletter — featured-article flow, link-roundup flow, the works. Every Monday at 2 p.m. it would fail, and he'd spend the afternoon debugging it. He claimed the workflow was so brittle that "it was probably easier for me to just write the newsletter than maintain the thing that wrote the newsletter."

He replaced it with a single Claude Code *skill*. He pasted the n8n JSON into Claude and asked it to translate the flow into a skill; Claude Code now runs that skill on a loop, reading the next instruction, calling a tool, deciding what to do next. He says he barely edits the skill — at the end of each session he asks the model to update the skill with anything it should have done differently.

The broader claim Parsons made: Claude Code itself is already a loop (read context, call tool, repeat), so building "agents" on top of it is mostly a matter of giving the loop the right context and stopping conditions.

## The Skill Is Where the Real Work Lives

Parsons argued the prompt itself — packaged as a Claude skill — is the asset that compounds. He showed his Ralph skill: it defines the role ("you are one engineer in a relay team — do exactly one change, then drop the context"), the ticket format, status values, recovery rules for dirty working trees, and instructions to verify actual behaviour rather than trusting test passes.

He extended this to other domains:

- A **morning loop** at 6 a.m. that briefs him on the day, summarising overnight emails and calendar.
- A **heartbeat loop** every 15 minutes that checks calendar and sends Telegram messages.
- A **worker loop** driven by a vibe-coded Kanban app, where each "project" file contains front-matter, decision trail, and the next step. The loop picks a project and advances it.
- An experimental **startup skill** built on Ash Maurya's frameworks, intended to run a whole product through an entire startup process — including, hilariously, an unprompted investor update deck the AI produced when Parsons asked it for a status report.

## The Knobs That Matter

When pressed on practical details, Parsons surfaced several principles:

- **Sub-agents beat in-context validation.** An audience member said his Ralph loop only started catching real problems when the validation step ran in a sub-agent with its own fresh context. Parsons agreed: same-context review tends to "pat itself on the back."
- **Tokens are effectively free, your time is not.** He runs Claude on the $200/month Max plan, hits ~80% of quota most weeks, and refuses to spend time micro-optimising tokens. He expects strong cheaper alternatives (he name-checked the new GLM model from Z.ai) to keep arriving.
- **Sessions should be ephemeral.** He argued for capturing important state into the repository or documentation rather than relying on session history — partly so future sessions and humans can find it.
- **Feedback loops are the real product.** "I'm always looking to figure out how AI could tell whether something was good or not, rather than me. When I'm able to take myself out of that loop, it just massively improves the whole process."

## What Parsons Won't Let the Loop Do

He drew explicit boundaries. His rule: *is this reversible without embarrassment to me?* If yes, the loop can ship. If no, it drafts and hands back. So the loops draft his emails (about 15 a morning) but don't send them; they generate slide decks but don't post on LinkedIn; they prepare release artefacts but don't run production database migrations.

On code review specifically, he said he still reads diffs — not because he enjoys it, but because he doesn't trust AI with security and won't be the person who lost customer data. He flagged Simon Willison's *lethal trifecta* (untrusted tokens + internet access + sensitive data = data loss) as the framing every Ralph-loop builder should internalise, and noted that for sandboxing he uses a VPS with separate API keys, fine-grained Claude permissions, Docker sandboxes, and a project he's building called Lockbox that blocks file-system access after untrusted tokens enter the context.

## Skepticism About Spec-Driven Development

Asked about BMAD, Kiro, OpenSpec and similar spec-driven frameworks, Parsons was deliberately cautious. He worried these tools fossilise a particular way of working — one that fits the agents of late 2025 but may not fit the agents of 2030. Over-specifying a project, he argued, is the same waterfall mistake he made with his dependency graph, dressed in newer clothes. He prefers *just-in-time* specs: think briefly, plan in Claude Code, execute, iterate.

## Theory of Constraints, Applied to AI Adoption

A recurring theme — drawn from Eli Goldratt's *The Goal* (1984) — was that AI tools amplify whatever bottleneck a team already has. Parsons claimed that some teams adopting Claude Code actually go *slower*, because their real constraint is the release process or PR review, not coding speed. Shipping 200 PRs in a monthly release instead of 20 is not an improvement.

His prescription for engineering leaders: find the actual bottleneck, fix it, then look for the next one. Don't expect a uniform speed-up; expect the constraint to move somewhere unpredictable. And give teams air cover to run messy experiments — try Ralph loops on all your work for a week, accept that it may fail in two days.

## The Existential Bit

The most uncomfortable thread of the talk was about what's left for the human. Parsons admitted to "having a bit of an existential crisis" — when the loop is writing the spec, picking the next ticket, and shipping the change, the human's role contracts to reviewing diffs and approving emails, which doesn't feel like a real job.

His response was to be deliberate about which work he *wants* to keep. He likes strategic thinking and client conversations, so the loops don't draft those for him — they just gather the inputs. He doesn't enjoy reviewing AI-generated drafts of strategy work, so he doesn't generate them. The loops do "the rubbish work."

The framing he offered the audience: the question is no longer *what can AI do?* It's *which parts of your work do you actually want to do?*

## Where It Leaves the Reader

Parsons closed not with a slogan but with an invitation. The full Ralph skill he uses is shareable; he pointed at his Air Skills project as an attempt to make skills versionable and distributable beyond a single GitHub repo. He encouraged disagreement — he said he genuinely wants people telling him "Chris, that's nuts" — because the practice is still young enough that confident opinions are mostly bluff.

The takeaway, in his framing: stop building elaborate workflows. Start with one loop. Make the prompt good. Watch where it bottlenecks. Fix that. Then notice that almost everything you do — as an engineer, a PM, a CEO — is already a loop, and ask which iterations you actually want to be in.
