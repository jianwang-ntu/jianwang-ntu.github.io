# Sequoia's AI Thesis: A Computation Revolution, Not a Faster Internet

![Sequoia's AI Thesis: A Computation Revolution, Not a Faster Internet](/images/blog/sequoias-ai-thesis-a-computation-revolution-not-a-faster.png)

At Sequoia Capital's AI Summit, partners Pat Grady, Sonya Huang, and Konstantine Buhler argued that the AI wave is categorically different from every prior tech cycle — large enough to swallow software *and* services, fast enough to compress decades into years, and aimed not at how information moves but at how it gets processed. The talk laid out a builder's playbook (the "MAD" principle), a forecast that 2026 is the year agents become real products, and a closing claim that 99.9% of cognitive work will eventually be done by machines.

## Why this wave is different

Grady opened by zooming out across the post-war arc: integrated circuits → systems → networks → the public internet → social and cloud → mobile → AI. His point: every wave compounds on the last, and AI sits on decades of accumulated compute, bandwidth, data, and talent. But within that lineage, he argued AI is unique on three axes.

**Scale.** It is the first wave that targets software *and* services in the same breath. Software's TAM grew from roughly $350B to $650B across the cloud era; cloud itself is around $400B. Services dwarf both. Grady cited US legal services alone as a $400B market — one vertical in one country, the size of all of software. The full services TAM, he said, is large enough that the round-number figure ($10T) is mostly a placeholder; the real number could be $5T, $10T, or $50T.

**Speed.** Companies that took a decade to reach $1B in revenue during the cloud and mobile cycles are doing it dramatically faster now. The empty market space, in his telling, is filling at a rate without precedent.

**Kind.** This is the line Grady leaned hardest on: prior revolutions — internet, cloud, mobile — were *communication* revolutions. They changed how information was distributed and connected. AI, he argued, is a *computation* revolution. It changes how information is processed. The practical consequence for founders is that the technical floor underneath them shifts every day.

Grady framed three discontinuous inflection points in the last few years: the ChatGPT moment in November 2022 (pretraining proven at scale), the o1 release (a second scaling law around inference-time reasoning), and the more recent generation — Claude Code, Claude Opus 4.5 and peers — which made long-horizon agents commercially viable. Sequoia's pragmatic read: from a functional and business standpoint, this is close enough to AGI to act on. Their working definition is unfussy — when you can dispatch an agent to do a job, have it recover from its own failures, and watch it grind until the task is done, that is AGI in any economically meaningful sense.

Grady's analogy: most AI deployments so far have been "faster horses" — efficiency lifts of 10–40% on top of existing workflows. The car is now arriving. It does not make horses faster; it changes what movement means.

## The MAD principle for application builders

If the substrate keeps shifting, what does a durable application company actually look like? The answer Sequoia gave is the MAD principle: **Moats, Affordance, Diffusion**.

### Moats: customer-back, not tech-out

Grady warned against the founder instinct to build moats out of model capabilities. In a computation revolution, today's technical edge is tomorrow's commodity. Customers and their problems, by contrast, change more slowly than models do. The defensible position comes from depth with the customer — workflow integration, domain understanding, proprietary scenario data, end-to-end delivery. He invoked Don Valentine's old challenge — *"So what?"* — and reframed it for AI: a stronger model means nothing if you cannot say what irreplaceable value it delivers to a specific customer.

### Affordance: zero-friction usability

The second pillar borrows from design theory. Grady's example was a hammer: hand one to a two-year-old and they grip it and start swinging. The object's shape tells you what it does. Many AI capabilities, he argued, currently fail this test. Claude Code is enormously powerful, but a typical Fortune 500 employee handed a terminal will not know where to start. The opportunity for the application layer is to wrap raw model power in shapes that specific users can pick up and immediately use to get a business result — without learning prompts, models, or tool chains.

### Diffusion dividend

The third pillar is the gap between how fast model capability advances and how slowly enterprises, markets, and individuals adopt it. That gap widens every day. The labs push the frontier; the application layer's job is to fill the valley — pulling capability into industries, workflows, and individual tasks. The bigger the diffusion gap, the larger the prize for whoever closes it.

Sequoia's compressed advice: build moats from customers, not technology; build affordances that demand nothing of users; ride the diffusion gap.

## Why 2026 is the year of agents

Sonya Huang took the next section, with a single thesis: agents are no longer a demo. She reminded the audience of the 2022 wave — AutoGPT, BabyAGI — when agents looked exciting on GitHub but crashed in practice. The models were not ready. By 2026, two products had proven the category was real: Claude Code for technical users, and OpenCloud (and its derivatives) for everyone else.

Her working definition of an agent: a system that perceives its environment, chooses actions, and pushes itself toward a goal. Three components matter:

- **Reasoning and planning** — the ability to decompose a task and improvise, not just template-match.
- **Action** — calling tools, writing code, searching, operating software. Two decades of tools built for humans (terminals, file systems, Slack, browsers, email) are now usable by agents almost without modification.
- **Persistence toward a goal** — the ability to fail, recover, adjust, and keep going across long horizons.

Huang broke the agent stack into three pieces: the model (the brain), the tools (the limbs), and the harness (the scaffolding that keeps an agent on task). All three have moved sharply in the last year. The single most important shift, in her telling, is time horizon: models can now run on a coherent task for hours rather than minutes. Reinforcement learning is producing further gains, and Sequoia has begun to see the early signs of recursive improvement — machines bootstrapping models. She cited an example of an autonomous run training a GPT-2-class model in roughly two hours.

She framed agent autonomy as a continuum. In coding, that arc has gone from 2023's tab-completion to today's chat-driven autonomous development, and is heading toward background agents, asynchronous agents, and agents that spawn sub-agents. The end state is what she called the "lights-out factory" — humans removed from the review loop entirely. In domains like cybersecurity, she said, this is already running in production.

The summary slogan: **services are the new software**. Compared to humans, agents scale with compute rather than headcount, do not require emotional management, and replace salaries with token costs. When agents can transact with each other, negotiate, and patrol systems in the background, Huang argued, deployment will happen at unprecedented speed — driven by economics that are simply too clean to resist. Futures that previously felt a hundred years out, she said, may now arrive in a hundred days.

## The cognitive revolution and what stays human

Konstantine Buhler closed with the longest-arc claim of the talk. He divided work into physical labor (force, motion, manufacture) and cognitive labor (thinking, planning, design, analysis). Before the industrial revolution, physical labor was overwhelmingly human and animal. After steam, internal combustion, and electric motors, more than 99% of the physical labor that supports modern life is now done by machines. Cognitive labor, he argued, is about to follow the same curve — and his forecast was that machines will eventually do 99.9% of it.

He told four stories to make the future legible.

### Aluminum

In the mid-19th century aluminum was the most precious metal known. The Washington Monument was capped with it. Tiffany displayed aluminum ingots as luxury goods. Then electrolysis was discovered, the cost collapsed, and within decades aluminum was being used to wrap sandwiches. Buhler's analogy: human cognitive skill is the aluminum, and AI is the electrolysis. PhD-level expertise that today takes decades to acquire will become something you summon on demand. Scarce intelligence is becoming common infrastructure.

### Alien design

Today's world is shaped to human cognition — interfaces, geometries, processes that fit how a human brain works. Once machines do the designing, the outputs will look strange. Buhler cited NASA's use of evolutionary algorithms to design a satellite antenna: the result violated human aesthetic and geometric intuition but outperformed conventional designs. Expect the same in chips, vehicles, buildings, cities, and procedures. The world will increasingly contain artifacts no human would have drawn.

### A new science of intelligence

Steam engineers spent a century improving engines empirically before Sadi Carnot systematized the field into thermodynamics, which became foundational physics. Buhler placed AI today in the pre-Carnot phase — billions of neurons, trillions of tokens, no real underlying theory. He predicted that within decades a fundamental science of intelligence will emerge, taught in high schools, that will give humanity genuine command over these systems and possibly insight into consciousness itself.

### Art after the camera

When photography arrived, painters who had spent careers chasing realism found themselves obsolete overnight. The verdict at the time was that art had died. Instead, painting was forced inward — into Impressionism, Expressionism, Cubism, and toward emotion and interiority. Buhler used this as a template for the AI era: as machines absorb skill, technique, and reproduction, human creative work moves toward feeling, meaning, and connection.

### What human value becomes

Buhler closed on a line from Protagoras: *man is the measure of all things*. Stripped of human experience, emotion, connection, and judgment, he argued, no output has meaning. AI can do the work, deliver the efficiency, and produce the result — but trust, love, definition of value, and human-to-human bonds are what stay. Credentials depreciate. Skills depreciate. Knowledge depreciates. Feeling, connection, and meaning do not.

## Where the talk leaves the reader

Sequoia's combined message was directive. For founders: stop building moats out of model capabilities; build them out of customers, frictionless affordances, and the widening gap between what models can do and what the world has adopted. For knowledge workers: stop trying to outrun the agents and move toward the parts of work that are about meaning, connection, and judgment. For everyone else: a hundred-year future arriving in a hundred days is not magic — it is, in the partners' framing, the result of finally pointing the technology at the right problem. Use machines to absorb the labor; use humans to define what any of it is worth.
