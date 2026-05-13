# Code World Models: Asking the LLM to Write the Game, Not Play It

![Code World Models: Asking the LLM to Write the Game, Not Play It](/images/blog/code-world-models-asking-the-llm-to-write-the-game-not-play.png)

A new preprint from Google DeepMind (Lehrach, Hennes, Lázaro-Gredilla, and colleagues, October 2025) argues that the standard "LLM-as-policy" recipe for game-playing agents is the wrong abstraction. Instead, the authors use the LLM as a code-synthesis engine that turns natural-language rules and a handful of trajectories into an executable Python simulator — a *Code World Model* (CWM) — and then let classical planners like MCTS do the deliberation. On ten games spanning perfect and imperfect information, including four newly authored "out-of-distribution" games, the resulting agent beats or matches Gemini 2.5 Pro in nine of them.

## What the paper is reacting against

The dominant approach to LLM game agents prompts the model for a move at each step, treating it as an intuitive player. The authors argue this leans on fragile pattern matching: agents make illegal moves, play shallow strategy, and degrade sharply on games not in the LLM's training set. Specialist trained models can play well, but generalist LLMs as policies, even with "thinking" modes, lack tactical depth. The paper's framing: shift the LLM's burden from producing a good *policy* to producing a good *model*, then let planners turn compute into playing strength.

## What the CWM actually contains

For each new game, the agent first plays a few games with a random policy to collect trajectories. It then prompts the LLM (Gemini 2.5 Pro for synthesis) to generate Python code matching the OpenSpiel API: a state representation, a transition function, a legal-actions enumerator, an observation function, a reward function, and a termination check. Randomness enters only through an explicit `chance` player, keeping the rest deterministic.

A single-shot generation is rarely correct. The authors run **iterative refinement** against unit tests automatically derived from the offline trajectories — each transition becomes a test that the synthesized code must reproduce. Two refinement strategies are compared:

- **Conversation**: append the failing stack trace to the prior chat and request a fix.
- **Tree search**: maintain multiple CWM candidates, pick the next one to refine via Thompson sampling (favoring high-accuracy or rarely-refined nodes), and feed a fresh prompt with the chosen CWM and a failing test.

Tree search wins on both accuracy and LLM-call count, and is used for the rest of the paper.

## Three pieces of synthesis, not just one

Beyond the CWM itself, the authors synthesize two more artifacts:

**Value functions** are generated one-shot to seed leaf values in (IS)MCTS. They aren't unit-test-refined (there's no ground truth), so multiple candidates compete in a tournament played inside the synthesized CWM and the winner is kept. The authors report value functions helped on Generalized tic-tac-toe and Bargaining; elsewhere they were neutral.

**Inference functions** are the novel contribution for imperfect-information games. ISMCTS needs to sample from the belief over hidden states `p(s_t | observations, actions)`. The authors prompt the LLM to write code that does this sampling — and they refine it against unit tests, just like the CWM. Two variants:

- *Hidden history inference*: sample a full action history (including chance moves), then deterministically replay it through the CWM to obtain the latent state. By construction the sampled state is a valid CWM state in the posterior's support.
- *Hidden state inference*: sample states directly. Simpler, but loses the validity and support guarantees.

Hidden history inference performs slightly better in the experiments and becomes the default.

## The closed-deck twist: CWM-as-autoencoder

Most prior CWM work — including the concurrent "POMDP Coder" of Curtis et al. (2025) — assumes hidden states are revealed *post hoc* in the training trajectories. The authors call this **open deck** synthesis. They also tackle the harder **closed deck** setting, where the agent only ever sees its own observations and actions, never the hidden truth, even in training.

The paper frames closed-deck learning as code-based autoencoder training. The inference function plays the role of the encoder (observations → latent history); the CWM plays the role of the decoder (latent history → observations). Unit tests that require hidden-state ground truth are dropped; what remains are reconstruction tests (observations recovered after encoding-then-decoding) plus random-play tests checking the synthesized game runs without errors and terminates. The game's rules and OpenSpiel API, embedded in the prompt context, act as the regularizer that keeps the latent space from collapsing to something trivial. The paper notes that valid latent histories passing all tests yield a lower bound on the data likelihood.

## The 10-game evaluation, and where it lands

The agent (CWM-(IS)MCTS) is benchmarked against three opponents: a random player, an (IS)MCTS agent with access to the *ground-truth* OpenSpiel code (an upper bound), and Gemini 2.5 Pro used directly as a policy with dynamic thinking. All methods get the same rules text and five offline trajectories; (IS)MCTS runs 1,000 simulations per move.

The lineup covers Tic-tac-toe, Connect four, Backgammon, Leduc poker, Bargaining, Gin rummy — plus four games the authors authored specifically to be out-of-distribution: Generalized tic-tac-toe (6×6, win-length 4), Generalized chess (a 5×5 variant with unusual piece moves), Quadranto (a hide-and-seek game on a 4×4 grid), and Hand of war (a card-capture game).

For **perfect-information games**, synthesized CWMs hit 1.0 training transition accuracy on every game, with test accuracy at or near 1.0. CWM-MCTS plays roughly on par with the ground-truth-MCTS agent and beats Gemini 2.5 Pro across the board. The authors note this matches their expectation: when the model is essentially correct, the planner does the work.

For **imperfect-information games, open deck**, four of five CWMs reach near-perfect transition accuracy. The exception is **Gin rummy** at 78% training and 75% test transition accuracy, with inference accuracy a much weaker 59% (train) / 54% (test). The authors attribute this to Gin rummy's multi-stage scoring (knocking, melds, deadwood, undercuts) — "intricate, multi-step procedural subroutines" the LLM doesn't capture from a small trajectory sample. Despite this, CWM-ISMCTS beats or matches Gemini 2.5 Pro on four of five imperfect-info games; Gin rummy is technically a win, but the authors are candid that this reflects Gemini being a very weak Gin rummy player rather than CWM-ISMCTS being a strong one.

For **closed deck**, synthesis quality degrades — Gin rummy inference accuracy drops to about 6% on training — yet game-play performance holds up reasonably well. CWM-ISMCTS-Closed still beats or matches Gemini 2.5 Pro on the imperfect-info games, with high variance on Leduc poker. The authors flag one counter-intuitive observation: on Hand of war, closed-deck play *outperforms* open-deck. Their hypothesis is that the freedom to invent a simpler latent state space, unconstrained by ground-truth hidden states, can sometimes help.

## Honest about scope

The paper is reasonably candid about what it does not show. Gin rummy is the standing failure case, and the authors call out procedural complexity as the open frontier for code synthesis. The CWM is learned up-front from offline trajectories and never updated during play — extending to active and online model learning is named as future work. All games are text-based and rule-bounded; the authors flag open-world games with free-form text or visual interfaces as the next horizon.

Two additional caveats worth keeping in mind. First, success rests on Gemini 2.5 Pro being competent enough to write working OpenSpiel-compatible Python from rules and trajectories — for novel games far outside its training distribution, this could be brittle in ways the four OOD games here don't stress-test. Second, the matchup against Gemini 2.5 Pro is the most-loaded comparison; the more telling baseline is the ground-truth-MCTS upper bound, which the synthesized CWMs largely match on perfect-information games but underperform on imperfect-information ones (notably Gin rummy).

The paper also reports PPO training on top of the synthesized CWMs as an alternative to (IS)MCTS at play time — a way to amortize planning into a reactive policy. PPO-CWM beats or matches Gemini in every game it was trained on, but generally trails the (IS)MCTS version on perfect-information games where the CWM is near-exact.

## What changes for someone working in this area

The shift the paper pushes is conceptual rather than algorithmic: when a domain has formal, enumerable rules, asking an LLM to synthesize a verifiable simulator and handing it to classical planners scales better than asking the LLM to play. The novel pieces — inference-function synthesis, the regularized-autoencoder framing for closed-deck POMDPs, and value-function synthesis as a planning accelerant — are the contributions that extend prior CWM work (WorldCoder, GIF-MCTS, POMDP Coder) into multi-agent and strictly partial-observability territory. The open question the paper leaves on the table is whether this approach holds up on games whose rules are themselves harder to verbalize, or whose state spaces resist a clean Pythonic encoding — Gin rummy, in their own results, is the canary.
