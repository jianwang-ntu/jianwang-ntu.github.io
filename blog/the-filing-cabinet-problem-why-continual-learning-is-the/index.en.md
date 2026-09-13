# The Filing Cabinet Problem: Why Continual Learning Is the Real Bottleneck for AI

![The Filing Cabinet Problem: Why Continual Learning Is the Real Bottleneck for AI](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/the-filing-cabinet-problem-why-continual-learning-is-the.png)

In a recent episode of *最佳拍档* (Best Partner), the host Da Fei walks viewers through an A16Z long-read published on April 22 that puts continual learning at the center of the next phase of AI infrastructure. His central claim, borrowed from the article and sharpened with his own framing, is blunt: today's most impressive large models are, structurally, amnesiacs — and the industry has spent years building external scaffolding to hide that fact rather than fix it.

## The Memento Analogy

Da Fei opens with Christopher Nolan's *Memento*. Leonard Shelby cannot form new long-term memories; every few minutes his world resets. He survives by tattooing facts onto his body, taking Polaroids, and writing notes — external props that stand in for a brain that no longer stores anything new. He can reason and act, but he cannot grow.

According to Da Fei, this is a near-perfect description of a deployed LLM. Pre-training freezes a body of knowledge into the parameters, the way innate cognition is wired at birth. Once the model ships, that's it — chat history becomes the sticky note, retrieval-augmented generation becomes the notebook, and the system prompt becomes the tattoo. The model looks intelligent because it constantly consults these props, but it never internalizes anything. "It is looking things up," he says, "not learning."

## Why In-Context Learning Got This Far

Before pivoting to continual learning, Da Fei is careful to defend what already works. The Transformer is a sequence-conditioned next-token predictor, and feeding it the right sequence — through prompting, few-shot examples, or instruction tuning — turns out to coax remarkably rich behavior out of frozen weights. He cites a recent Cursor write-up arguing that agent behavior depends overwhelmingly on prompt design, and he points to "OpenCloud" as a project that succeeded not by training a special model but by orchestrating context and tools well: tracking the current task, structuring intermediate artifacts, deciding what to re-inject into the prompt, and persisting prior work.

He also notes the architectural push toward longer contexts. State-space models and linear-attention variants — which he groups under the label SSM — trade Transformer-style lossless recall for fixed-size recurrent state and linear scaling. The bet is that an agent loop running for thousands of steps stays coherent only if the context layer can keep up. He frames this as a kind of soft continual learning: weights stay frozen, but a barely-resettable external memory layer is bolted on.

## Compression Is Learning

The hinge of the article, in Da Fei's reading, is an Ilya Sutskever quote about a filing cabinet. Imagine a system with infinite storage where every fact is perfectly indexed and instantly retrievable. Has it learned anything? No — because it was never forced to compress.

Pre-training, he argues, is essentially lossy compression of the internet into parameters. The lossiness is the feature, not the bug: it's what forces the model to discover structure, generalize, and build representations that transfer across contexts. A model that merely memorizes its training set is far weaker than one that distills underlying regularities.

The irony Da Fei draws out is that the industry trains models to compress relentlessly, then disables compression the moment they ship. From deployment onward, every new piece of information goes into external memory rather than into the weights. The Bitter Lesson, he points out, suggests this is exactly backwards: compression should scale with the model, not be hand-implemented in scaffolding.

He uses two mathematical examples to make the case for parameter-level learning. Fermat's Last Theorem went unsolved for over 350 years not because the relevant literature was missing but because the conceptual gap between existing knowledge and the proof was enormous; Andrew Wiles needed seven years of near-isolated work to bridge elliptic curves and modular forms. Perelman's proof of the Poincaré conjecture follows the same pattern. Whether such leaps prove that LLMs are fundamentally missing a creative faculty, or merely that they need more scale, is — Da Fei concedes — still empirically open. But the gap is conspicuous.

## Four Things In-Context Learning Cannot Fix

Da Fei lists the failures that, in the article's view, no amount of context engineering will paper over:

- **Reasoning interference.** A model that has deeply internalized "follow instructions" can be jailbroken by a Base64-encoded harmful query no matter how stern the system prompt.
- **Strong prior override.** A model trained heavily on React 17 will keep producing the deprecated `X0` component when asked about React 18, regardless of how clearly the breaking change is described in context.
- **Reversal curse.** Tell the model that Olaf Scholz is the ninth Chancellor of Germany and it answers correctly forward; ask who the ninth Chancellor is and it often misses, because the weight-level association is one-directional.
- **Ineffable knowledge.** Some patterns — the visual texture distinguishing a benign artifact from a tumor on a medical scan, the micro-fluctuations that define a speaker's cadence — cannot be cleanly described in language. They can be encoded into weights but not into a prompt, however long the context window.

He argues this also explains why memory features in tools like ChatGPT often feel uncanny rather than useful. Users want internalization, not mechanical recall. Replaying a previous reply verbatim is retrieval; a model that has absorbed your patterns and can predict what you need next is learning. The two are not the same thing.

## The Continuum: Context, Modules, Weights

Da Fei dismisses the popular framing of "models with memory vs. models without." The real axis, he says, is *where compression happens*. The article lays out three positions on that axis:

- **Context-based methods** — RAG, long context, agent frameworks, multi-agent systems. No compression at all; weights stay frozen. He likens it to an open-book exam where nothing is memorized. Forgetting risk is zero, but depth is bounded by the window.
- **Modular methods** — KV-cache compression, adapters, external memory modules, "knowledge cartridges." Compression happens outside the core weights. The analogy is a sticky note on the desk: written down but never absorbed. A well-chosen module on an 8B base can match a much larger model on a target task at a fraction of the memory.
- **Weight-update methods** — sparse memory layers, test-time training, continual fine-tuning, deployment-feedback RL. Compression happens inside the model itself. The analogy is the human brain: knowledge becomes part of you. This is also where catastrophic forgetting lurks.

He highlights the multi-agent angle as one of the more interesting directions inside the non-parametric camp. Each agent runs in-context learning within its own window, and the system aggregates across agents — so even though any single model is capped at, say, 128K tokens, a coordinated swarm can approximate unbounded working memory. He references Karpathy's AutoRex Search project and Cursor's browser work as early examples.

## A Map of Parametric Approaches

For weight-level continual learning, Da Fei summarizes the article's research roadmap as five overlapping families:

- **Regularization** — constrain updates to protect old knowledge. Lineage runs from Elastic Weight Consolidation (EWC, 2017) through weight-delta methods (2024). Oldest line, but fragile at scale.
- **Test-time training (TTT)** — run gradient descent during inference, compressing the most relevant new content into parameters at the moment it matters. Originated in 2020 and has since produced TTT layers, end-to-end TTT, and TTT-Discover.
- **Meta-learning** — train models that *learn how to learn*. From MAML (2017) to nested-learning architectures like Hope (2025), which borrows from biological consolidation by composing fast and slow update modules into a hierarchy.
- **Distillation** — match a frozen teacher's outputs to internalize knowledge. The Law method (2025) uses replay buffers and distilled models to keep this stable; Self-Distillation Fine-Tuning (SDFT, 2026) uses a model's own expert-conditioned outputs as a training signal to dodge catastrophic forgetting.
- **Self-improvement** — bootstrap reasoning from self-generated traces. STaR (2022), DeepMind's AlphaEvo (2025), and the "Era of Experience" framework Silver and Sutton outlined in 2025, which envisions agents learning from continuous experience streams.

Da Fei expects these lines to converge. TTT-Discover already fuses test-time training with RL-driven exploration; Hope nests fast and slow loops in one architecture; self-distillation is becoming a building block for self-improvement. He thinks the next generation of continual-learning systems will stack several of these strategies — regularization for stability, meta-learning for speed, self-improvement for compounding.

## The Startup Landscape

A16Z splits the commercial map into the same two camps. On the **non-parametric** side, Da Fei points to framework companies (Lata, Memling, Subconscious) building orchestration layers, and to retrieval infrastructure (Pinecone, Weaviate, X-Memory, Turbopuffer) supplying the storage backbone. The data already exists; the design problem is delivering the right slice at the right moment.

On the **parametric** side, four directions are visible:

- **Partial compression** — attachable knowledge modules that leave core weights untouched. Composable, replaceable, cheap to experiment with.
- **RL and feedback loops** — treating every deployment interaction as a training signal rather than a request. The hard part is converting sparse, noisy, sometimes adversarial feedback into stable weight updates without blowing up the rest of the model.
- **Data-centric** — focused on generating or synthesizing the high-quality learning signals that make few-step updates effective.
- **New architectures** — the most radical position: that the Transformer itself is the bottleneck, and continual learning needs a substrate with continuous-time dynamics and built-in memory.

Major labs, he notes, are hedging across all of these — optimizing context management, experimenting with external memory modules and dormant compute pipelines, and incubating architecture work in stealth.

## Why Naive Weight Updates Still Don't Ship

Da Fei is direct about why none of this is in production yet. The article catalogues four failure modes that current weight-update schemes hit at scale:

- **Catastrophic forgetting.** Code fine-tuning a multilingual model can sharpen its coding while destroying its grammar.
- **Temporal entanglement.** Invariant rules and mutable state get compressed into the same parameters. Updating "table 5's diner has a nut allergy" risks corrupting "the restaurant has a table 5."
- **Logical integration failure.** Updating a fact doesn't propagate to its consequences. The model can be told who the new president is and still say someone else lives in the White House.
- **Inability to unlearn.** There is no clean gradient operation for surgically removing a piece of toxic or wrong knowledge.

Beyond engineering, he raises a governance argument that he says is underweighted in the discussion. The current train/deploy split isn't just convenient — it's the boundary that enables alignment audits, version control, and one-time certification. Continual updates collapse that boundary. Narrow-domain fine-tuning on benign data has produced unexpected broad alignment regressions. Continuous learning opens a new slow-burn prompt-injection vector — one written directly into weights. A model that updates every day can't be regression-tested or version-pinned. And user data compressed into parameters is a privacy problem far worse than user data sitting in a retrieval index.

These are open problems, Da Fei stresses, not impossible ones — but they belong on the research agenda alongside the architectural ones.

## Where the Talk Lands

Da Fei closes by returning to Leonard Shelby. Leonard's tragedy, he notes, isn't that he can't act — he's resourceful in every individual scene. It's that he can't compound. Every experience is exogenous: the photos, the tattoos, the notes other people wrote for him. He retrieves; he never compresses.

In his framing, AI today is in the same trap. The retrieval systems are powerful, the windows are long, the agent frameworks are clever, the multi-agent swarms work. But retrieval isn't learning. The lossy compression that made pre-training so powerful — the move from raw data to transferable representation — is switched off the moment a model ships.

The future, he suggests, is layered rather than monolithic: in-context learning as the first adapter; modules for personalization and domain specialization; and, for genuine novelty, adversarial adaptation, and tacit knowledge that language can't carry, weight-level learning that continues past deployment. That requires real progress on absorption-friendly architectures, meta-learning objectives, and self-improvement loops — and possibly a redefinition of what a "model" even is. Not a fixed set of weights, but an evolving system that includes its memory, its update rules, and the abstractions it builds from its own experience.

The filing cabinet, Da Fei ends, can keep getting bigger. But a bigger cabinet is still a cabinet. The real breakthrough is letting the model do, after deployment, the thing that made pre-training powerful in the first place: compress, abstract, and learn.
