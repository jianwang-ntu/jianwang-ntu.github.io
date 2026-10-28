# A16Z's Case for Continual Learning: LLMs Are Stuck in *Memento*

![A16Z's Case for Continual Learning: LLMs Are Stuck in *Memento*](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/a16zs-case-for-continual-learning-llms-are-stuck-in-memento.png)

In a new essay for a16z, Malika Aubakirova and Matt Bornstein argue that today's large language models live in the same fractured present as Leonard Shelby in Christopher Nolan's *Memento* — capable in any single scene, but unable to compound experience because they cannot update their own weights after deployment. The post makes the case that **continual learning** — letting models compress new experience back into their parameters — is one of the most important open problems in AI right now.

The authors frame the field as a spectrum from pure retrieval to weight-level updates, and walk through why the industry's current bet on ever-larger context windows, while real, may not be the ceiling.

## The central analogy

The post opens with Leonard Shelby, who copes with anterograde amnesia by tattooing notes on his body and snapping Polaroids. Aubakirova and Bornstein argue that LLMs survive on the same scaffolding: chat history as sticky notes, retrieval systems as external notebooks, system prompts as guiding tattoos. The model itself, they write, "never fully internalizes the new information."

They concede in-context learning works — and keeps winning. They quote Cursor's recent write-up on autonomous coding agents to make the point: *"A surprising amount of the system's behavior comes down to how we prompt the agents. The harness and models matter, but the prompts matter more."* OpenClaw, they note, broke out on harness design rather than special model access. "Janky but native" interfaces tend to win because they couple to the underlying system rather than fighting it.

## Why context alone may hit a ceiling

The post's structural argument is that agentic workflows are stressing the in-context paradigm. Agents now routinely fail after 20–100 steps as context fills up and coherence degrades. The major labs' response — interleaving state space models and linear-attention variants with traditional attention to push context windows from ~20 to ~20,000 steps — is, the authors say, real and powerful. They even concede it counts as a kind of continual learning, since the external memory layer rarely needs resetting.

But they argue this misses what made LLMs work in the first place. Drawing on a long-running point from Ilya Sutskever, they frame LLMs as compression algorithms: training forces the model to find structure, generalize, and build transferable representations. Then deployment freezes that compression and replaces it with external memory. The post calls this the **filing cabinet fallacy**:

> "Imagine a system with infinite storage… It can look up anything. Has it learned? No. It has never been forced to do the compression."

A second limitation, they note, is that in-context learning is bounded by what can be expressed in language. The visual texture distinguishing a tumor from a benign artifact, or the micro-fluctuations of a speaker's cadence, are patterns that resist textual decomposition. No context window, they argue, will fix that.

## Where the discovery argument bites

Aubakirova and Bornstein lean on an example from researcher Yu Sun: Fermat's Last Theorem went unproved for over 350 years not because the literature was missing but because the conceptual distance was too vast. Andrew Wiles needed seven years of near-isolation to bridge elliptic curves and modular forms. The authors flag that the question of whether such cases prove a real gap in LLMs — or merely show the scale at which recombination already works — is empirical and unresolved.

They also offer a sharp aside on consumer memory features: users find ChatGPT-style "the bot remembers you" features uncomfortable rather than delightful, the post argues, because what users want is competence, not recall. *"A model that has internalized your patterns can generalize to novel situations; a model that merely recalls your history cannot."*

## The taxonomy: context, modules, weights

The post's most useful contribution is a clean taxonomy of where compaction can happen:

- **Context** — smarter retrieval pipelines, agent harnesses, prompt orchestration. The most mature category. Limited by context length. Multi-agent swarms are an emerging extension; the authors point to Karpathy's autoresearch project and Cursor's web browser as examples.
- **Modules** — attachable knowledge modules (compressed KV caches, adapter layers, external memory). The post claims an 8B model with the right module can match 109B-level performance on targeted tasks.
- **Weights** — genuine parametric updates. The authors map a research landscape that runs from EWC (Kirkpatrick et al., 2017) through test-time training (Sun et al., 2020 and the TTT family), meta-learning (MAML; Behrouz et al.'s 2025 *Nested Learning*), and distillation methods (LoRD, SDFT). They group recursive self-improvement work — STaR, DeepMind's AlphaEvolve, Silver and Sutton's *Era of Experience* — alongside.

## The unsolved problems

The essay is candid that naive weight updates fail in well-known ways: catastrophic forgetting, the stability-plasticity dilemma, temporal disentanglement (invariant rules and mutable state colliding in the same weights), and the lack of any differentiable subtraction operator for unlearning.

The less-discussed cluster, the authors stress, is governance. The training/deployment split is a safety, auditability, and privacy boundary. Continuous updates create a slow-burning data-poisoning surface, make models impossible to version or regression-test, and risk compressing user interactions into parameters in ways that complicate privacy. They frame these as open problems on the same research agenda — not fundamental blockers.

## The takeaway

The authors' own framing of where this lands: a layered system. In-context learning stays as the first line of adaptation. Modules cover personalization and domain specialization. Weight-level updates become necessary for the hard problems — discovery, adversarial adaptation, knowledge too tacit to put into words. The closing line returns to the analogy: the filing cabinet keeps getting bigger, but a bigger filing cabinet is still a filing cabinet. The breakthrough, they argue, is letting the model do after deployment what made it powerful during training — compress, abstract, and learn — or risk staying stuck in a Memento of our own.
