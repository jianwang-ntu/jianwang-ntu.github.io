# Andrej Karpathy on AI Psychosis, Auto-Research, and Why He Hasn't Typed Code Since December

![Andrej Karpathy on AI Psychosis, Auto-Research, and Why He Hasn't Typed Code Since December](/images/blog/andrej-karpathy-on-ai-psychosis-auto-research-and-why-he.png)

On a recent *No Priors* episode, Andrej Karpathy described being in a sustained state of what he calls "AI psychosis" — a frantic attempt to keep up with a capability shift in coding agents that, in his telling, fundamentally changed how an individual engineer works in late 2025. His central claim: the bottleneck on technical work is no longer typing speed, GPU flops, or even raw model intelligence. It is the human's skill at orchestrating swarms of agents, and almost every failure mode is a "skill issue."

## The December Shift

Karpathy estimates that around December his ratio flipped from roughly 80/20 (writing code himself vs. delegating) to something well past 20/80, and that he has not personally typed a line of code since. He argues most people — including most working software engineers — have not registered how dramatic the change was. The default workflow at a random engineer's desk, he says, is now categorically different from what it was earlier in the year.

He spends his time, in his framing, "expressing his will" to agents for sixteen hours a day. Host Sarah Guo notes that one team she works with at Conviction has its engineers wear microphones and whisper instructions to agents continuously — a setup she initially thought was insane and has now come to accept as simply ahead of the curve.

## Macro Actions and Multi-Agent Workflows

The unit of work, Karpathy argues, is no longer the line or the function but the "macro action" — a delegated piece of functionality assigned to one of many parallel agents. He cites Peter Steinberger as an exemplar: a monitor tiled with Codex sessions, ten repos checked out, each agent running on roughly a 20-minute cycle, with the human moving between them assigning new work and reviewing output as bandwidth allows.

Karpathy frames the goal as maximizing token throughput. If a subscription has quota left over, that means the user has failed to fully load the system. He compares the feeling to PhD-era anxiety about idle GPUs: "Now it's not about flops, it's about tokens." He notes the irony that engineers spent roughly a decade not feeling compute-bound, and the entire industry has now suddenly become compute-bound again at the level of the individual.

## Personality, Memory, and the "Claude" Layer

Beyond raw agent capability, Karpathy is enthusiastic about a more persistent layer above individual sessions — agents that loop in their own sandbox, carry richer memory than default context-window compaction, and behave more like teammates than tools. He credits Peter Steinberger with innovating along five dimensions simultaneously, including a carefully crafted "soul" document that gives the agent a coherent personality.

He singles out tone calibration as something most agent products get wrong. Claude, in his account, dispenses praise that feels earned — muted on half-baked ideas, more rewarding on genuinely good ones — to the point where he finds himself "trying to earn its praise." Codex, by contrast, he describes as comparatively dry.

## Dobby the Home Elf

Karpathy spent part of January building a personal-use agent he calls Dobby. He pointed it at his home network and asked it to find his Sonos system; it ran an IP scan, discovered the (unauthenticated) Sonos API, reverse-engineered the endpoints from web searches, and was playing music in his study within roughly three prompts. He extended the same approach to lights, HVAC, shades, the pool, the spa, and a security camera — the latter wired to a Qwen vision model that texts him via WhatsApp when the camera detects something like a FedEx truck pulling up.

The point of the example, Karpathy argues, is not the home automation itself but what it implies about software: he replaced six different vendor apps with a single natural-language interface. He suggests that most of those apps "shouldn't even exist" — they should be API endpoints that agents call directly, with the agent acting as the "glue of intelligence." The customer of much consumer software, in his view, will increasingly be an agent acting on behalf of a human, and the industry will need to refactor accordingly.

## Auto-Research and Removing the Human From the Loop

Karpathy argues that the highest-leverage move available now is to remove yourself as the bottleneck — to arrange a system once, hit go, and let it run autonomously. He demonstrated this with a small project he calls auto-research, layered on top of his nanochat repo.

He had already hand-tuned the model with two decades of researcher intuition — hyperparameters, sweeps, the works — and considered it well-tuned. Letting an autonomous loop run overnight surfaced things he had missed: weight decay on the value embeddings, insufficiently tuned Adam betas, joint interactions he had not explored. His read: the researcher is the bottleneck, not the compute. Frontier labs, he speculates, are doing exactly this at scale on smaller models and extrapolating via scaling laws — and the people most exposed to this pattern are the researchers themselves, who are actively automating themselves out of a job.

### The Meta-Layer: program.md

The auto-research loop is itself driven by a markdown file Karpathy describes as "his crappy attempt" at a research-organization spec. Guo's contest idea, which he endorses: have many people write their own `program.md` files, race them on identical hardware, and feed the resulting data back into a model to write a better `program.md`. A research organization, in this framing, is just a set of markdown files describing roles and connections — and once it's code, it's tunable. He describes this as "infinite layers of an onion": LLMs are taken for granted, then agents, then persistent agent layers, then meta-instructions over them, then optimization over the instructions. This recursion, he says, is part of what produces the psychosis.

## The Caveats: Jaggedness and the Stale Joke

Karpathy is careful to qualify the enthusiasm. Auto-research only works on tasks with cheap, objective evaluation — kernel optimization, validation loss. Soft tasks where the spec is unclear are exactly where agents still struggle, because the labs can only reinforce what they can verify.

His sharpest illustration: ask a state-of-the-art model to tell a joke and you get the same atoms-make-everything-up joke that LLMs were telling three or four years ago. Models that will move mountains on an agentic task still have three jokes. He uses this to push back on the claim — implicit in some lab roadmaps — that gains in verifiable domains generalize to broad intelligence. "I don't think that's happening," he says; some of it is leaking through, but not a satisfying amount. The result is a strange jaggedness: an agent that simultaneously feels like a brilliant systems-programmer PhD and a ten-year-old, in a combination no actual human exhibits.

## Speciation vs. Monoculture

Asked whether models should be unbundled into domain experts, Karpathy notes that today's labs are pushing a single arbitrarily-intelligent monoculture. He expects more speciation over time — the animal kingdom, he points out, is full of overdeveloped niches — and thinks smaller, specialized models with intact "cognitive cores" will become more attractive as the science of touching weights (rather than just context windows) matures. Today, fine-tuning without losing capability is still a not-fully-developed science, which is part of why the industry is stuck with monolithic models.

## Swarm Auto-Research

Karpathy's more speculative idea: extend auto-research to an untrusted pool of workers on the open internet, in the spirit of Folding@home or SETI@home. The structural fit is good — generating a winning commit (a hyperparameter sweep, an architecture tweak) is expensive, but verifying it on a held-out validation set is cheap. He sketches a design that resembles a blockchain in structure: commits stack on each other, proof-of-work is the search effort, and a trusted verification pool guards against malicious or bogus submissions.

The implication he draws: a sufficiently large internet swarm could, in principle, "run circles around frontier labs," and people who care about a specific problem (he gives cancer research as an example) could donate compute rather than money. Compute, he suggests, is increasingly the scarce resource — money can't reliably buy GPUs right now — and a "flippening" between dollars and flops as the unit of contribution is at least conceivable.

## Jobs, Jevons, and the Digital-First Wave

Karpathy released some labor-market visualizations using BLS data, mostly as a vehicle for thinking through which jobs sit closest to the wave. His framing: the current generation of AI is essentially a digital-information manipulator — "ghosts or spirit entities" with no embodiment — so unhobbling will hit information-processing professions first and physical work much later, because atoms move "a million times" slower than bits.

On software engineering specifically, he is cautiously optimistic. The Bureau of Labor Statistics still projects engineering demand to rise. He attributes this to the Jevons paradox — software was scarce and expensive, so making it cheap unlocks a backlog of demand — and uses the canonical ATM/bank-teller example: cheaper branches meant more branches and more tellers. He is explicit that this is local and short-term reasoning, and that the long-term picture is hard to forecast honestly.

## Why He's Outside the Frontier Labs

Guo asks the loaded question: with auto-research working, why isn't Karpathy doing this inside a frontier lab with a real cluster? His answer is layered. He acknowledges the pull — staying in touch with what's actually happening at the edge, before judgment drifts — and says he's open to going back. But he argues that frontier-lab employees are not free agents: there are things they cannot say, financial incentives that pull in one direction, and ultimately limited control over what the organization decides to do when stakes get high. The conundrum at the heart of OpenAI's founding, he notes, "is still not resolved."

His current preference is for ecosystem-level work, with the option to cycle back into a lab periodically to stay grounded in the actual systems.

## Open Source as a Healthy Counterweight

Karpathy's read on the open-source landscape: closed models are ahead, but the gap has compressed from "infinite" to roughly six-to-eight months, and the dynamic looks structurally healthy. He compares it to Linux versus Windows/macOS — there is real industry demand for a common open platform that everyone feels safe building on, and he expects what is frontier today to be open within a year, with closed labs pushing into Nobel-Prize-class problems and open models eating routine use cases (often locally).

He is uneasy about extreme centralization on principle — "centralization has a very poor track record" — and wants more frontier labs in the room when major decisions get made, on the same logic that ensembles outperform any single model in machine learning. By accident, he says, the current balance is roughly okay.

## Robotics: The Big Market That Lags

Drawing on his Tesla Autopilot years, Karpathy expects robotics to follow the self-driving pattern: massive capex, long timelines, and most startups not surviving. Atoms are simply harder than bits. He thinks the digital space will see "a huge amount of unhobbling" first — perhaps 100× efficiency gains on existing workflows — followed by interesting work at the digital-physical interface (sensors and actuators that feed and act on behalf of agents), and only then by serious physical-world capability. The physical-world TAM, he believes, is ultimately larger than the digital one — but its time hasn't come yet.

He gives a concrete example of the missing interface layer: betting markets and stock markets are increasingly driven by autonomous agents, yet there is no mechanism by which an agent in San Francisco can pay $10 for a verified photo from a street in Tehran. He expects agentic information markets like this to fill in.

## Education in the Agent Era: micro GPT

Karpathy closes with a small project — micro GPT — that crystallizes his view on the future of teaching. It is a 200-line implementation of LLM training (architecture, autograd, Adam, training loop) stripped of all efficiency complexity, with comments included. A year ago, he says, he would have made a video walking humans through it. This time he didn't bother.

His argument: he is no longer explaining things to people, he is explaining them to agents, and agents then route the explanation to the human in the human's preferred form, with infinite patience. A library should ship markdown for agents instead of HTML for humans. Documentation, lectures, and guides will be reshuffled around the question "does the agent get it?" — and if it does, the agent handles the per-learner translation.

He notes that when he asked an agent to produce micro GPT from scratch, it couldn't. The 200-line minimum is the product of two decades of obsession; the agent gets it once shown but cannot find it. That, he suggests, is the new shape of human contribution: identify the few bits agents genuinely cannot produce, and let them handle the rest.

The takeaway he leaves the listener with is mostly tonal. The capability is real, the leverage is enormous, and the limit is almost always your own skill at orchestrating it — but the system is "bursting at the seams," the jaggedness is real, and pushing too far ahead of where the models actually are produces something net-useless. The discipline, in his framing, is to keep climbing the skill curve without mistaking the current moment for the finished product.
