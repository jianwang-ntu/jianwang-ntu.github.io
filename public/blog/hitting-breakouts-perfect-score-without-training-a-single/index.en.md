# Hitting Breakout's Perfect Score Without Training a Single Neuron

![Hitting Breakout's Perfect Score Without Training a Single Neuron](/images/blog/hitting-breakouts-perfect-score-without-training-a-single.png)

In a recent explainer video, the presenter walks through a result that cuts against deep reinforcement learning's reigning orthodoxy: an AI that updates no weights, runs no backprop, and still pushes Atari Breakout to its theoretical maximum score. The work belongs to Weng Jiayi, a research engineer on OpenAI's post-training team, and the talk frames it as a possible early signal of a new paradigm — what Weng calls **Heuristic Learning (HL)**.

## The result that started the argument

The presenter opens with the numbers, because the numbers are what make the rest hard to dismiss. Weng's pure-code policies were not toy demos:

- **Atari Breakout:** 387 → 507 → 839 → **864**, the theoretical maximum.
- **MuJoCo Ant:** a code policy that learned a gait and ran short-horizon model planning landed at ~6,000+, inside the range of mainstream deep-RL results.
- **MuJoCo HalfCheetah:** **11,836.7**, climbing into the top tier on interpretable gait and pose rules.
- **VizDoom (first-person shooter):** **557** average using OpenCV-based screen vision, no network trained.
- **Atari-57 benchmark:** at fixed environment-interaction budgets, the median score of pure-code policies sits near the **1M-step** mark, well ahead of mainstream baselines like PPO.

The presenter is careful to call out what is missing from this list: no backpropagation, no gradient descent, no weight updates. Just code that a coding agent kept rewriting.

## How the project actually started

According to the talk, Weng didn't set out to overturn deep RL. He maintains **EnvPool**, an ultra-fast environment execution engine, alongside his work on **Tianshou**, the open-source RL library he authored. While maintaining EnvPool, he wanted cheap, reproducible heuristic rules to sanity-check that game environments were behaving correctly — running a neural network on every CI build was overkill. He asked Codex to draft a pure-code version of a policy. The output kept improving past the point where it should have stopped.

That accident is the seed of the framework that follows.

## What "Heuristic Learning" actually means

Weng's framing, as the presenter relays it, looks structurally similar to reinforcement learning: there is a state, an action, feedback, and an update step. The substitution is in what gets updated.

- **The policy** is code — a state machine, a control loop, an MPC controller — not a tensor of weights.
- **The feedback** is richer than a scalar reward: test cases, environment logs, even replayed failure videos.
- **The update** is performed by a coding agent that edits the code directly. No gradients.

The artifact that the agent maintains over time is called a **Heuristic System (HS)**. The presenter stresses that an HS is not a single policy file. It bundles the state representation, the feedback intake, an experiment log, a regression test suite, and a memory mechanism into one coherent software system. Rules, the feedback that produced them, the historical log, and the next round of edits are all linked.

## Three things this buys you

The presenter lists what Weng argues HL gets in exchange for giving up gradient descent.

**Interpretability.** Neural networks are opaque; code can be read line by line. For domains that need auditability — autonomous driving, medical decisions — that matters.

**Sample efficiency.** One useful code edit can produce a qualitative jump in behavior, rather than the slow climb of tuning a learning rate over millions of environment interactions.

**A new weapon against catastrophic forgetting.** This is the part the presenter spends the most time on. In deep RL, old skills survive only if the network's weights happen to remember them; train on a new task and Breakout performance can quietly evaporate. In HL, old capabilities can be frozen into **regression tests**, fixed-seed replays, and explicit written-down failure cases. If a new code edit breaks a stored scenario, a test fails immediately. The system, in effect, gets a memory bank that doesn't degrade.

## Why expert systems failed before — and why this time is different

The presenter acknowledges the obvious objection: handwritten rules are not a new idea. Expert systems were tried and abandoned because maintenance costs exploded. Patch one bug today, break another scenario tomorrow, and within weeks the rulebase becomes a fragile house of cards no one will touch.

His argument for why the verdict should be revisited is economic, not technical. **Coding agents flatten the maintenance cost curve.** Where humans maintaining a rule system are like artisans before the industrial revolution — they can't scale past a certain complexity — a coding agent is a tireless mill: it reads replays, edits code, runs tests, loops. Rules that weren't worth writing because they weren't worth maintaining are now worth keeping for the long term.

The presenter calls this the real nature of a paradigm shift: not that the technique got smarter, but that the production cost of using the technique fell.

## Continual learning, reframed as a software problem

The framing the presenter highlights as the most important: **continual learning has been stuck inside the question "how do we update parameters?"** HL reframes it as "how do we maintain a software system that keeps absorbing feedback?"

That reframe imposes its own discipline. A healthy heuristic system can't just grow — it has to compress. Letting patches pile up indefinitely produces code that even the coding agent can no longer reason about. Periodic refactors that turn dozens of local hacks into simpler, more elegant abstractions are the metabolism of the system.

This is where the talk introduces **coupling complexity** as the binding constraint. How far an HS can be pushed depends on how tangled its internal dependencies are, because that's what a coding agent has to reason over. Good modularization, thorough tests, and clean logs lower coupling complexity by offloading cognitive load to external tools. The presenter frames it bluntly: this is no longer a pure algorithm contest, it's a systems-engineering contest.

Breakout scales to 864 partly because the rules are simple and partly because failures replay cleanly, support local reproduction, and admit regression checks. Ant is more complex, but it factors into modules — gait, balance, contact, MPC — each of which can be tested and improved independently. Modularity is what keeps the system from collapsing into the old expert-system tar pit.

## What HL doesn't solve

The presenter is explicit that HL is not a wholesale replacement for neural networks. Complex visual perception and long-horizon generalization remain out of reach for handwritten code. "You can't write an ImageNet classifier in if-statements" is the way he puts it.

The picture he sketches as more likely is a layered hybrid:

- Small, specialized neural networks handle low-level perception and state estimation.
- HL handles fresh data, safety boundaries, and local recovery.
- A large-language-model agent sits on top as the high-level brain, supplies feedback, and periodically absorbs the high-quality data the HL layer has been generating.

He suggests breaking this further into a hierarchy of heuristic systems — joint-level, limb-level, whole-body balance, task-level — with low layers handling safety and latency, middle layers handling gait and contact, and high layers handling task recovery and long-term memory. The coding agent in this picture isn't a controller; it's the **update pipeline plugged into the system**, continuously feeding in failure videos, sensor streams, simulation results, and test outcomes, and emitting code, parameters, safety rules, and memory entries.

## The takeaway the talk leaves on

The closing line the presenter returns to: *anything that can be continuously iterated can begin to be solved.* HL, in his telling, isn't just an algorithmic curiosity — it's a different theory of what learning is. Gradient updates were one way to absorb feedback; code edits driven by a tireless agent are another. The interesting open question he poses to the audience is not whether code will replace networks, but what the ratio between them will look like once the cost of maintaining code at scale has effectively gone to zero.
