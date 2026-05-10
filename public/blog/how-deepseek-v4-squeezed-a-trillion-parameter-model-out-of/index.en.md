# How DeepSeek V4 Squeezed a Trillion-Parameter Model Out of Limited Hardware

![How DeepSeek V4 Squeezed a Trillion-Parameter Model Out of Limited Hardware](/images/blog/how-deepseek-v4-squeezed-a-trillion-parameter-model-out-of.png)

A new explainer video walks through the architecture paper behind DeepSeek V4, the latest open-source model from a Chinese lab that the speaker repeatedly calls "cracked." The central claim: with a team roughly 40 times smaller than OpenAI's, no access to top-tier NVIDIA chips, and a fraction of the compute, DeepSeek still shipped a 1.6-trillion-parameter model with a 1-million-token context window that benchmarks alongside Anthropic's Opus 4.6 Max and Google's Gemini 3.1 Pro — and then open-sourced both the weights and the recipe.

## The Specs, and Why They're Hard

The speaker frames V4 Pro by its two headline numbers. It carries 1.6 trillion parameters — what he describes as "the dials and knobs inside the model's brain" — putting it among the largest models in production. And it offers a 1-million-token context window, roughly 750,000 words, enough to hold the entire Harry Potter series in working memory.

Both numbers are easy to advertise and brutal to actually engineer. The talk argues that the parameter count makes training unstable, while the context length blows up the cost of attention. Most of the video is about how DeepSeek dodged each of those walls.

## The Attention Problem at One Million Tokens

The speaker walks through the bottleneck slowly. Every transformer asks, for each new token, how it relates to every prior token. At ten words, that's ten comparisons. At 100,000 words, it's 100,000 comparisons. At a million, the number of comparisons is "astronomical," and even high-end hardware chokes.

There's a second cost on top of compute: the KV cache. The model has to store a running record of what every past token meant in context. At a million tokens, this becomes "gigabytes sitting in expensive GPU memory just so the model doesn't forget what it read earlier."

According to the talk, DeepSeek's response was not to throw more hardware at the problem — they didn't have it — but to question whether the model needed to look at everything in the first place.

### Hybrid Attention: Compress, Then Ignore

The architecture uses three parallel views of the past, interleaved layer by layer:

- **Compressed Sparse Attention (CSA)** — groups roughly four tokens at a time into one denser representation, cutting the sequence length 4x. A "Lightning Indexer" then scores those compressed blocks and selects only a small subset of the most relevant ones for each new token. Everything else is skipped.
- **Heavily Compressed Attention (HCA)** — packs around 128 tokens (roughly a paragraph) into a single representation. The sequence shrinks by orders of magnitude, so the model can afford to attend to all of it at once for a coarse, big-picture view.
- **Sliding Window Attention** — keeps the most recent ~128 tokens completely uncompressed, word for word, so fine detail in the immediate context is preserved.

The speaker compares it to a student studying for an exam: the open page in front of you is the sliding window, the chapter summaries are HCA, and the highlighted sections you flip back to are the Lightning Indexer.

The reported payoff: V4 Pro uses about 27% of the FLOPs of DeepSeek V3.2 — a 3.7x reduction — and shrinks the KV cache by roughly 90%, despite being a much larger model with a much longer context.

## Stopping a Trillion-Parameter Model From Exploding

Solving attention isn't the whole story. The speaker argues that at 1.6 trillion parameters, the bigger threat is signal explosion: the values flowing through the network amplify like a microphone held too close to a speaker, the loss diverges, and the run crashes.

Standard fixes — residual connections, then hyperconnections — apparently aren't enough at this scale. According to the paper, even hyperconnections produce catastrophic spikes past a trillion parameters.

DeepSeek's answer is **Manifold Constrained Hyperconnections (MHC)**. The idea: force the residual signal to behave like a *doubly stochastic matrix*, where every row and every column sums to one. The speaker translates this as a hard conservation rule — the total signal can never amplify, because the math forbids it.

To actually enforce that constraint at scale, the model runs a roughly 20-iteration **Sinkhorn-Knopp** normalization before each layer. On its face, that sounds ruinous: a 20-step inner loop on top of a 1.6-trillion-parameter model. The talk credits aggressive low-level engineering — fused GPU kernels, selective recomputation — with shrinking the overhead to about 6.7% of runtime, which the speaker frames as "a relatively small price to pay" against losing an entire training run.

## Muon: A New Optimizer

DeepSeek also replaced AdamW, the long-standing industry default, with a custom optimizer called **Muon**. The speaker describes it in two phases: aggressive updates that push the system toward convergence, then careful stabilizing tweaks. His analogy is tuning a guitar — big rough turns to get close, then small precise twists to lock in the pitch.

## Hiding the Network Behind the Compute

A trillion-plus-parameter model can't sit on one chip or even one rack, so layers are spread across a data center and data has to flow rack-to-rack. Every millisecond a GPU spends waiting for that data is "wasted money."

DeepSeek's fix, as described in the talk, is to choreograph the transfers in waves. As soon as wave one's data lands, the GPUs start computing on it; while they crunch, wave two is already moving across the network, then wave three, and so on. Computation and communication are overlapped so that — at least in the ideal case — the network cables stay saturated and the compute cores stay busy.

To pull this off, the team wrote **fused kernels** in a language called TileLang, merging multiple math operations into single GPU commands so the chip stops shuttling intermediate results to and from main memory. Because hand-written kernels are notoriously bug-prone — and a one-in-a-billion error at this scale "could happen constantly and silently corrupt the model" — the speaker says they used a **Z3 SMT solver** to formally prove the kernel code correct, and open-sourced the result on GitHub.

## A Curriculum, Not a Firehose

V4 Pro was trained on 33 trillion tokens. Rather than dump that on the model at full context length, DeepSeek used a curriculum. The model starts with sequences of about 4,000 tokens — enough to learn grammar and local structure — then expands to 16K, 64K, and eventually the full 1M window. The speaker likens it to slowly stretching working memory while the brain is still learning how to think.

### Anticipatory Routing for Loss Spikes

Even with curriculum learning, runs at this scale hit **loss spikes** — sudden divergences where the math blows up. The industry's usual response is to roll back to an earlier checkpoint and retry, which is expensive and doesn't fix the underlying instability.

DeepSeek introduced **anticipatory routing**: when the system detects early statistical signs of an impending spike, routing decisions briefly use slightly older snapshots of the model's parameters instead of the current ones. The speaker compares it to reading a stock chart's moving average instead of its noisy daily prices — the underlying trend is stable even when the step-by-step values are chaotic. Once the danger passes, control hands back to real-time routing.

## Where It Lands on the Benchmarks

The video closes with results. Across knowledge, reasoning, and agentic benchmarks, the speaker says V4 Pro is roughly on par with Opus 4.6 Max and Gemini 3.1 Pro, and posts a higher average win rate than Opus 4.6. He highlights two specific results:

- **Putnam 2025**, described as one of the hardest undergraduate math competitions in the world: 120 out of 120, a perfect score.
- **Long-context retrieval at the full 1M-token limit**: V4 Pro's accuracy beats Gemini 3.1 Pro, which also offers a million-token window.

On the Artificial Analysis leaderboard cited in the video, V4 Pro sits second among open-source models, behind Kimi K2.6, and close to the leading closed models from Google, Anthropic, and OpenAI.

## The Argument the Talk Is Making

The speaker's framing is that no single trick built this model. Hybrid attention solved the memory problem. Manifold-constrained hyperconnections kept the signal from exploding. Muon accelerated learning. Hand-tuned fused kernels and wave-based scheduling kept the data center busy. Anticipatory routing kept training from crashing. Each piece is a workaround for a constraint a better-funded lab could have brute-forced.

What the talk treats as the real story is that DeepSeek published all of it — the paper, the weights on Hugging Face, even the GitHub repo with the kernel proofs — including infrastructure detail that closed labs guard closely. For a team described as compute-poor and headcount-poor, releasing that recipe is, in the speaker's words, the cracked move on top of the cracked model.
