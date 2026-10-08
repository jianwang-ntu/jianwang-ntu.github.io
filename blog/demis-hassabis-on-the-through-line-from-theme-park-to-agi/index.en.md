# Demis Hassabis on the Through-line from Theme Park to AGI

![Demis Hassabis on the Through-line from Theme Park to AGI](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/demis-hassabis-on-the-through-line-from-theme-park-to-agi.png)

In a wide-ranging interview, DeepMind founder and CEO Demis Hassabis traces his path from teenage chess prodigy to running one of the most consequential AI labs in the world, and lays out a thesis that reframes what AI is for: a tool for doing science, not just a product. His central claim is that the same engine now writing code and answering questions is the one that will, within a decade, compress drug discovery from ten years to weeks and turn biology into a science as mathematically tractable as physics.

## The common thread, post-hoc or not

Hassabis concedes the line connecting chess, games, neuroscience, and DeepMind may be partly a story he tells in retrospect — but he insists the plan was real. He decided around age 15 or 16 that AI was the most important and most interesting thing he could work on, and then picked subjects and jobs to feed that goal.

Games were the detour, and he frames them as deliberate. In the late 1990s, the cutting edge of compute, graphics, and consumer AI all lived in the games industry; the first GPUs were graphics chips. At Bullfrog he co-built **Theme Park** at age 17 — a simulation in which thousands of small AI agents shopped, queued, and rated rides — and it sold more than 10 million copies. Watching players delight in interacting with the AI, he says, was one of the moments that committed him to the field.

### Five years ahead, not fifty

His own studio, Elixir Studios, taught him the lesson he now repeats to founders. Elixir's flagship project, **Republic**, tried to simulate an entire country — a million people, living cities, all running on a late-90s Pentium — so the player could overthrow a dictator through emergent gameplay. It was, Hassabis admits, too ambitious for its hardware. The takeaway he carried forward: aim to be five years ahead of the field, not fifty. If something is obvious to everyone, it's too late; if it's a half-century out, you can't ship it.

## Founding DeepMind in a hostile climate

By 2009–2010, Hassabis says, he and his co-founders thought they were five years ahead. They were probably closer to ten. Three ingredients had quietly converged:

- **Deep learning**, just invented by Geoff Hinton and collaborators, which almost no one yet recognized as a big deal.
- **Reinforcement learning**, which DeepMind's founders believed could be combined with deep learning — a pairing that had barely been tried outside toy academic problems.
- **Accelerated compute** in the form of GPUs, which they expected to keep scaling.

He adds a fourth: principles from computational neuroscience suggesting reinforcement learning could, in principle, scale all the way to AGI.

The reception was unfriendly. Hassabis recalls academics in Cambridge and at MIT — then still strongholds of expert systems and symbolic AI — literally rolling their eyes when he proposed working on AGI or "strong AI." That hostility, he says, was actually clarifying: at minimum, DeepMind would fail in an *original* way, not by repeating the failures of the 1990s.

DeepMind's founding mission was uncompromising: **step one, solve intelligence; step two, use it to solve everything else.** Hassabis predicted in 2010 that AGI was a 20-year mission. He thinks the field is "basically exactly on track."

## The real point was always science

The mission's purpose, in Hassabis's telling, was never the AI itself — it was the scientific breakthroughs the AI would unlock. DeepMind formally stood up its AI for Science division roughly the day after the team returned from Seoul and the AlphaGo match, almost exactly ten years ago. Cracking Go was the signal that the algorithms were finally general enough to point at real problems.

### AlphaFold and what comes after it

Hassabis argues biology has already had its language-model moment: **AlphaFold** solved a 50-year grand challenge by predicting the 3D structure of proteins. But protein structure is only one slice of drug discovery. **Isomorphic Labs**, DeepMind's spin-out, is building the adjacent layers — designing compounds that bind tightly to a target site on a protein and ideally bind to nothing else (because off-target binding is what toxic side effects look like).

The end state he describes: do 99% of the exploration in silico, leaving the wet lab for validation only. If that lands — and he thinks it will in the next few years — drug discovery timelines could drop from a roughly ten-year average to months, then weeks, eventually days. At that point, he claims, "all disease could be in reach," and personalized variants of base medicines become routine.

### Biology as a machine-learning problem

Hassabis pushes a stronger claim: **machine learning is to biology what mathematics is to physics**. Biology, like other emergent natural systems, is full of weak signals, weak correlations, and far more data than human analysts can hold in their heads — but with real causal structure buried inside. Mathematics, in his view, either can't manage that complexity or lacks the expressive power for it. ML, by contrast, is built for it.

### Simulations as a new method

He thinks AI will spawn genuinely new sciences, with simulation as the most exciting candidate. Many domains — economics, large parts of social science — resist proper experimentation because you can't rerun reality. Raise interest rates by half a point and you get one trial. Learned simulators change that: if you can build an accurate enough simulator, you can sample from it thousands of times and run controlled experiments on questions that today only support theorizing.

DeepMind already does this in domains where the underlying math is too complex to write down. Hassabis points to **WeatherNext**, which he describes as the most accurate weather simulator in the world and far faster than what meteorologists currently use. (He pointedly does not claim DeepMind can yet *control* the weather — and isn't sure that would be a good idea.) He's similarly excited about a "virtual cell" project. He even floats the possibility that, once a learned implicit simulator exists, explicit equations could be extracted from it — a new path to laws of nature.

## Information as the substrate

Asked about deeper foundations, Hassabis offers a metaphysical preference rather than a proof. The 1920s physicists treated energy and matter as primary, with information downstream. He suspects the ordering should be reversed: **information is the most fundamental quantity**, and energy and matter are convertible expressions of it. Living systems, on this view, are essentially information-processing systems resisting entropy. If that framing is right, AI — which is also fundamentally about organizing and constructing information — is even more profound than it already appears.

### Turing's champion

He calls himself and his colleagues "Turing's champions." Alan Turing's result that any computable function can be computed by a strikingly simple machine remains, for Hassabis, one of the most profound results ever stated. He thinks brains are likely approximate Turing machines. The interesting empirical evidence: protein folding is, at the molecular level, a quantum system, yet AlphaFold — a classical neural network running on classical hardware — reaches near-optimal solutions. Many problems thought to require quantum computers, he suggests, may turn out to be modelable classically if framed correctly.

## Tool first, agency later

Hassabis is firm on sequencing. The right move, he argues, is to build an extraordinarily intelligent, precise tool *first*, and only then take on the next set of questions — increasing autonomy, agency, whether a system is conscious. The agent era is already here, but those deeper questions, in his view, are best approached *with* the tool's help, ideally alongside a much sharper scientific definition of consciousness than humans currently possess.

On consciousness itself, he claims no advance over millennia of philosophy. Self-awareness, a model of self-versus-other, and continuity over time are likely necessary but not sufficient. He notes a structural problem unique to artificial systems: humans grant each other consciousness partly on behavior and partly because we share a substrate. AI systems may match the behavior, but never the substrate — leaving a gap that may be hard to fully close.

## Kant, Spinoza, and reading the language of the universe

Asked about his philosophical influences, Hassabis names Kant and Spinoza for different reasons. From Kant he takes the idea that the mind constructs reality — a working motivation for studying how brains build their world models. From Spinoza he draws something closer to a spiritual frame: doing science, for him, is "reading the language of the universe."

## Rapid fire

- **AGI year, over/under:** 2030. He says he's been consistent on this.
- **Post-AGI reading:** *The Fabric of Reality* by David Deutsch — the questions in that book are the ones he wants AGI to help answer.
- **Proudest DeepMind moment:** AlphaFold.
- **Pick a historical scientist for your strategy-game team:** John von Neumann. He invented game theory; Hassabis figures that's hard to beat.

The takeaway Hassabis leaves the room with is the one he's been repeating for fifteen years, only now with the receipts: solve intelligence, then point it at the hard problems — disease, materials, energy, the structure of the universe itself — and let the tool do the rest of the science.
