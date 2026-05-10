# The Road to AlphaFold: How DeepMind Bet on AGI and Cracked Biology's Hardest Problem

![The Road to AlphaFold: How DeepMind Bet on AGI and Cracked Biology's Hardest Problem](/images/blog/the-road-to-alphafold-how-deepmind-bet-on-agi-and-cracked.png)

A documentary-style talk traces Demis Hassabis and Shane Legg from a stealth London startup pitching "solve intelligence" to investors, through AlphaGo's Sputnik moment, to AlphaFold's solution of the 50-year-old protein folding problem. The throughline: DeepMind's bet that general-purpose learning algorithms — proven first in games — could be turned on real-world science, and that the timeline for artificial general intelligence is now measured in years, not decades.

## A founding pitch nobody wanted to hear

Hassabis and Legg met at University College London, both privately obsessed with AGI at a time when, as Hassabis recalls, "AI was almost an embarrassing word to use in academic circles." Convinced no university would fund the work, they started a company instead. The pitch — "we're going to solve all of intelligence" — drew the looks one would expect.

A venture capitalist in the film summarizes the problem: he reviews 700 to 1,000 projects a year and funds about eight. DeepMind's pitch demanded patience for a long-shot bet with no near-term product. Peter Thiel became the first major investor — but only after pushing the pair to relocate to Silicon Valley. They refused. Hassabis insisted London had the academic talent (Cambridge, Oxford, UCL) and that Silicon Valley's "found-a-company-every-year, throw-it-out-if-it-fails" culture was incompatible with a long-horizon research mission.

In its first two years, DeepMind operated in total stealth. One interview candidate, the talk recounts, texted his wife the office address in case the whole thing turned out to be a kidnapping scam.

## Games as the proving ground

Hassabis and Legg made an early bet that games — used with discipline — were the right training ground for general agents. The first major result came from Atari. The team combined Q-learning, one of the oldest reinforcement learning methods, with deep neural networks at scale, and tried to teach a single algorithm to play several dozen Atari titles from raw pixels and the score alone.

Pong nearly killed it. The agent failed for so long that Hassabis says he and Legg started wondering whether they were simply wrong. Then a single point. Then a few. Three months later, no human could beat it. Breakout went further: after 300 games the agent matched any human; after another 200, it discovered the now-famous tunnel-around-the-side strategy on its own. The team generalized the recipe — DQN — to 50 games. According to the talk, this was the first system anyone could plausibly call generally intelligent.

The bottleneck became compute. Google acquired DeepMind in 2014 for a reported £400 million. Hassabis frames the decision as a tradeoff: investors didn't want to sell, and the company was almost certainly underpriced, but Google offered scale and the freedom to remain in London doing pure research without product pressure. "There's no time to waste," he says in the film — the brain is in gear now.

### AlphaGo and the Sputnik moment

Go was the field's litmus test: more board configurations than atoms in the universe, and a graveyard of failed AI approaches. AlphaGo trained first by mimicking 100,000 amateur games, then improved through self-play. In its 2016 match against Lee Sedol, move 37 of game two became famous — commentators said no human would have played it; AlphaGo's own model put the probability at 1 in 10,000.

The match against world #1 Ke Jie a year later carried different weight. Mid-game, the Chinese government cut the live feed. The talk argues this was China's Sputnik moment: AlphaGo launched what became the global AI race. AlphaZero followed, stripping out human game data entirely. By morning it played randomly; by tea, superhuman; by dinner, the strongest chess engine ever made.

### StarCraft and what games can't teach

StarCraft pushed further: imperfect information, continuous decisions, no clear notion of optimal play. AlphaStar trained on human replays the same way large language models train to predict the next word — only here predicting the next StarCraft action. It eventually beat top professionals in a public showcase.

But the talk's framing turns sharper here. The team voices direct discomfort about military applications. "You can't look at gunpowder and only make a firecracker," one researcher says. Hassabis notes that when Google acquired DeepMind, he secured a commitment that the technology would not be used for military or surveillance purposes, and he calls autonomous weaponry "a very bad idea." The Oppenheimer parallel is invoked explicitly — and rejected as a model: the lesson, the talk argues, is that scientists must understand powerful technologies in controlled conditions first, rather than build now and reckon later.

## The biography behind the bet

The film weaves Hassabis's personal history through the technical narrative. He bought his first computer at age eight with chess winnings. By 12, he was the world's #2-rated player in his age group, but a draining 10-hour game against a former Danish champion in Liechtenstein — which he resigned in exhaustion despite a forced stalemate being available — pushed him toward a different question: was this the best use of all the brainpower in the room? He calculated that the 300 minds in that tournament hall, redirected, might have solved cancer.

A gap year before Cambridge took him to Bullfrog, the Guildford studio behind *Populous*. Too young to be legally employed, he was paid in brown paper envelopes. He worked on *Theme Park*, building autonomous AI behaviors for the simulated visitors — early evidence, he says, that AI could shape something beyond entertainment. Peter Molyneux offered him £1 million to skip Cambridge. He went anyway, where he met David Silver, later the architect of AlphaGo and AlphaZero.

## AlphaFold: the project that almost failed

Protein folding had been a fixed star in Hassabis's mind since Cambridge, where a friend would talk about it "almost religiously." The premise: given an amino acid sequence, predict the 3D structure. Solving it would unlock drug discovery, disease research, and synthetic biology. Decades of experimental methods had produced a fixed, painfully small dataset — months or years per structure, with many proteins never solved at all.

DeepMind entered CASP, the biennial Olympics of structure prediction, in 2018. The first AlphaFold won the competition decisively — beating second place by nearly 50%. And, Hassabis admits in the film, it was useless. "We were the best in the world at a problem the world's not good at." Predictions weren't accurate enough for working biologists. "It doesn't help if you have the tallest ladder when you're going to the moon."

Some on the team wondered whether the timing was simply wrong — whether AGI wasn't ready for biology. The talk's lesson is sharper: ambition is good; timing matters. Being 50 years ahead is indistinguishable from being wrong.

### Rebuilding with biology in the loop

The strike team, led by John Jumper, rewrote AlphaFold from scratch. A key change, according to the talk, was bringing in domain expertise — computational biologists working alongside ML engineers — and rebuilding the data pipeline around biological structure rather than treating proteins as a generic prediction problem. By CASP 14, in late 2020, the system folded proteins in seconds rather than days, and folded them accurately enough to be experimentally useful.

The CASP organizer's email, read aloud at the team's lockdown Zoom social, declared the problem solved.

The decision that followed mattered as much as the result. Rather than build a service where researchers submit one protein at a time, the team folded every known protein sequence — over 200 million — and released the structures publicly. Within hours of launch, the database had hundreds of thousands of concurrent users, with heavy traffic from Japan first.

## The thing they're now arguing about

The film's final third turns to AGI itself, and the tone becomes notably more uneasy. Hassabis says the question is no longer whether AGI is possible but whether it arrives faster than institutions can adapt. He estimates roughly a dozen breakthroughs remain, and hopes to see them in his lifetime.

The concerns the speakers raise are concrete:

- Wars conducted faster than humans can comprehend
- AI systems that out-invent human researchers, out-manipulate human leaders, or outsmart financial markets
- Disinformation generated at scale
- Industrial-revolution-scale displacement, but compressed
- The governance problem of global coordination at a moment when, the talk argues, humanity is getting worse at coordination, not better

Hassabis offers an analogy: if humanity received word that an alien civilization would arrive on Earth, every government would convene emergency meetings. AGI, he argues, deserves the same response — and isn't getting it. The talk closes on his standing position: get things right the first time, because it may be the only chance available.

## Where the talk leaves the reader

The throughline DeepMind's founders have followed for two decades — that solve general intelligence first, then apply it to science — has now produced its proof point. AlphaFold is not the endpoint they were aiming at; it's the kind of thing the endpoint produces along the way. The implication, as Hassabis frames it, is that AGI itself is no longer a distant question. It is, on his telling, the most consequential transition humanity has ever faced, and the window for getting the institutions ready is shrinking faster than the technology is.
