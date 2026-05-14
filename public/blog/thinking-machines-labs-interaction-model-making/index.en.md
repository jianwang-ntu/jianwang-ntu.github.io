# Thinking Machines Lab's Interaction Model: Making Conversation Native to the Model

![Thinking Machines Lab's Interaction Model: Making Conversation Native to the Model](/images/blog/thinking-machines-labs-interaction-model-making.png)

On May 11, Thinking Machines Lab — the venture founded by former OpenAI CTO Mira Murati — published research on what it calls the **Interaction Model**. The central claim, as relayed in the video: every frontier AI lab has optimized for the wrong thing. They've benchmarked autonomous task completion while leaving human-in-the-loop collaboration stuck in a clunky, turn-by-turn paradigm. The lab argues interaction should be a *native* capability of the model itself, not a scaffold of bolted-on components.

## The Diagnosis: AI Conversation Still Works Like Email

The video opens by naming a frustration most heavy LLM users will recognize. Models are getting smarter, but the way humans talk to them hasn't changed much: type or speak, wait for the model to finish thinking, read the output, type again. One round at a time, with no interruptions, no overlapping speech, no live feedback. According to the talk, this is closer to exchanging emails than to a real conversation.

Thinking Machines Lab frames this as an industry-wide blind spot. Because labs benchmark agents on tasks the model is supposed to complete *alone*, they have not optimized for the case where a human is continuously involved. In synchronous, edit-as-you-go workflows, the limitations get loud: the model feels slow, the user gets less value out of it than they expected, and the cleanest results still come from letting the agent run unattended on long-horizon coding tasks.

The host argues this exposes a real gap. Few real projects can be specified once and then walked away from. Quality outputs almost always require ongoing clarification and course correction. The problem isn't that today's AI refuses human involvement — it's that the interface leaves no room for it.

## The Theoretical Backbone

To make the case that the bar should be higher, the video cites several older works:

- **Clark and Brennan (1991)** on grounding: efficient communication requires *co-presence* (interacting with the same object), *immediacy* (information received as it is produced), and *synchrony* (both sides can send and receive at once).
- **Walter J. Ong (1982)**, *Orality and Literacy*: the power of spoken communication lies in participation, not detached observation.
- **Friedrich Hayek (1945)** on knowledge: humans carry vast amounts of tacit, time-and-place-specific knowledge that resists being written down.
- **James C. Scott (1998)**, *Seeing Like a State*: practical wisdom relies on experience, intuition, and improvisation — exactly what rigid turn-taking cuts off.

Run these against today's chat interface and the verdict is unflattering. Mainstream LLMs operate in lockstep: the model only perceives the world when the user stops typing or talking, and once it starts generating it stops listening unless forcibly interrupted. That single-threaded design, the talk argues, makes it nearly impossible to transfer the messy, situated knowledge that actually makes human collaboration work.

## Why Scaffolds Aren't Enough

A natural objection: real-time voice and multimodal models already exist. The video's answer leans on Rich Sutton's 2019 *Bitter Lesson*. Today's "real-time" interaction in commercial systems is typically stitched together from external pieces — voice activity detection to guess when the user is done speaking, separate modules for interruption, multimodal glue between encoders. These hand-engineered scaffolds, Thinking Machines Lab argues, will eventually be outscaled by approaches where interaction is part of the model itself, trained jointly with everything else. Without that, conversational ability won't scale alongside intelligence; it will plateau every time the scaffolding hits its limits.

## What the Interaction Model Unlocks

Five capabilities are presented as native, rather than glued on:

1. **Seamless dialogue management.** The model implicitly tracks whether the speaker is thinking, wrapping up, self-correcting, or inviting a reply — no separate turn-taking module, no hard-coded boundaries.
2. **Proactive interruption across voice and vision.** Instead of waiting for the user to finish, the model can break in when context warrants — for example, correcting a mistake mid-sentence. The talk notes traditional VAD-based systems cannot do this.
3. **Synchronous voice cooperation.** User and model can speak at the same time. The canonical example is live translation: the model outputs the translated stream while the speaker is still talking, full-duplex.
4. **Native time awareness.** The model has a built-in sense of elapsed time and can respond to instructions like "remind me to breathe every four seconds" or time how long an action takes, without an external timer.
5. **Synchronous tool use.** While listening, the model can concurrently run web searches, call tools, and generate interactive UI, weaving results into the live conversation without pausing it.

The host's framing: stacked together, these stop feeling like "AI features" and start feeling like working with a person rather than dispatching prompts.

## The Architecture

The technical core is what Thinking Machines Lab calls a **time-aligned micro-turn** design. A conventional model flattens everything — user turn 1, model turn 1, user turn 2, model turn 2 — into a strictly alternating sequence of tokens. The Interaction Model instead slices wall-clock time into 200-millisecond windows. Inside each window the model processes 200 ms of input *and* generates 200 ms of output; the two token streams interleave. Silences, overlaps, and interruptions all become part of the model's context rather than artifacts to be cleaned up.

Other full-duplex audio efforts exist — the video lists Moshi, Personal Plex, Nimotro Voice Chat, and ByteDance's C-Daplex — but it argues these are either small or optimize latency at the cost of intelligence. The Interaction Model, according to the talk, is the first attempt to make this design native inside a general-purpose large model.

### Two Models, One Conversation

Around the real-time core, the system runs an **asynchronous background model** that handles work needing deeper reasoning, tool use, or long-horizon planning. Both models share the same conversation context. When the front-end model hits something it can't handle in real time, it hands the context to the backend, which streams results back for the front-end to fold in at the right moment — without breaking the conversational flow. The framing is that users get both no-latency responsiveness *and* deep reasoning, rather than choosing between them. The team emphasizes the front-end interaction model is itself competitive on raw intelligence, not a lightweight "fast but dumb" companion.

### Encoder-Free Early Fusion and Streaming Paging

Other technical choices in the talk:

- **No separate encoders.** Instead of training distinct audio, vision, and text encoders and stitching them together at inference time, the Interaction Model preprocesses audio as DML features through a lightweight embedding layer and slices images into 40×40 patches encoded via an HMLP layer. Everything trains jointly with the transformer from scratch, which Thinking Machines Lab credits for lower latency and tighter multimodal fusion.
- **Streaming paging.** Because the 200 ms micro-turns require frequent small-batch prefill and decode, existing inference libraries paid too much overhead per turn. The team built a streaming paging mechanism — the client sends each 200 ms chunk as its own request, the inference server stitches them into a persistent sequence in GPU memory — and contributed the implementation to the open-source SGLang project.
- **Latency-tuned kernels.** In the MoE layers they replaced grouped matrix multiplications with a *gather + general matmul* strategy. Bit-exact alignment between trainer and sampler kernels was important enough that they shipped batch-invariant kernels with under 5% end-to-end overhead; some custom kernels are faster than the stock ones.
- **Safety work along two axes.** A text-to-speech model generates "natural but firm" refusal data covering modality-specific abuse scenarios, and automated red-teaming produces multi-turn refusal data so voice and text refusals stay consistent.

## The Benchmarks

The released model is **TML Interaction Small** — a 276B-parameter MoE with roughly 12B active parameters. The video pulls the numbers Thinking Machines Lab reports:

**Latency.** At FD Batch=1, TML Interaction Small clocks in at 0.4 s per turn, against 1.18 s for GPT Real-Time 2.0 (minimum config) and 0.57 s for Gemini 2.5 Flash Live (minimum config).

**Interaction quality (FD Batch=1.5).** TML scores 77.8 on the streaming benchmark, versus 46.8 for GPT Real-Time 2.0 (min) and 54.3 for Gemini 2.5 Flash Live (min). With the backend agent enabled at FD Batch=3, response quality reaches 82.8% with a 68% pass rate.

**Intelligence under turn-based testing.** On the Audio Multi-Challenge APR metric, TML scores 43.4%, ahead of GPT Real-Time 2.0 (37.6%) and Gemini 2.5 Flash Live (26.8%). Text IF Eval lands at 89.7%, roughly level with frontier text models. Text refusal on Harm Batch is 99%.

**New benchmarks for new capabilities.** The team built internal evaluations for behaviors no one had measured before:

- *TimeSpeak* (initiate speech at a specified time): 60.7% macro accuracy.
- *QSpeak* (respond synchronously while the user is speaking): 77.7% macro accuracy.
- Competing models score near zero on both.
- Visual proactive response is covered by *Rapcon A* (real-time action recognition, error within one frame), *Proactive Video QA* (PAUC 29.5), and *Cardes* (action-window detection, mean IoU 28.4). According to the talk, competitors mostly stay silent or answer incorrectly; the Interaction Model is the only system that produces useful output.

## What's Still Open

Thinking Machines Lab names five limitations and directions, which the video relays:

- **Long sessions.** Continuous audio-video input accumulates context fast. Streaming paging handles short-to-medium conversations well; managing very long ones is unsolved and a stated research focus.
- **Compute and deployment.** Low-latency audio-video streaming is fragile to network conditions; future work targets reliability and robustness so the experience degrades more gracefully.
- **Alignment and safety.** Real-time interaction surfaces new alignment problems the team plans to keep iterating on.
- **Scale.** TML Interaction Small is mid-sized. Larger pretrained models have too much latency to run interactively today. A bigger interaction model is planned for 2026.
- **Background agent.** Current focus is on the real-time loop; deeper integration between the backend agent and the interaction model is the path to handling more complex autonomous work without losing conversational continuity.

A limited research preview is coming in the next few months, with a broader release planned for the second half of 2026.

The talk leaves the reader with a single bet: if interaction is treated as a real modality and trained into the model, AI collaboration starts to feel less like dispatching prompts and more like working alongside someone — and the labs that keep optimizing only for autonomous benchmarks will discover they've been measuring the wrong thing.
