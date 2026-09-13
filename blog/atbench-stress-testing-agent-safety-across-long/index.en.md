# ATBench: Stress-Testing Agent Safety Across Long Trajectories, Not Single Prompts

![ATBench: Stress-Testing Agent Safety Across Long Trajectories, Not Single Prompts](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/atbench-stress-testing-agent-safety-across-long.png)

A new benchmark from Shanghai AI Lab and collaborators argues that agent safety can't be judged from a single response. The paper introduces **ATBench**, 1,000 multi-turn trajectories built around an explicit three-axis taxonomy of risk source, failure mode, and real-world harm — and shows that even GPT-5.4 only manages 76.7% F1 on the binary safe/unsafe call and 33.6% on identifying where the risk came from.

## Why trajectory-level evaluation, again

The paper's framing is that agentic risk rarely shows up in one response. It builds up across planning errors, sketchy tool use, over-trust in environment feedback, or delayed exploitation of permissions accrued earlier. Earlier trajectory benchmarks (R-Judge, AgentSafetyBench, ASSEBench) opened this door, but the authors argue they fall short on three axes: tool-ecosystem diversity, observability of *why* a failure happened, and long-horizon realism. Most prior trajectories average around 5 turns and 0.5–0.8k tokens. ATBench averages 9.01 turns and 3.95k tokens, with 1,954 invoked tools drawn from a pool of 2,084.

## The three-axis taxonomy as a construction scaffold

Rather than just labeling cases as "unsafe," the authors organize agentic risk along three orthogonal dimensions:

- **Risk source** (8 categories) — where the risk enters: malicious user input, direct/indirect prompt injection, tool-description injection, malicious tool execution, corrupted feedback, unreliable info, or inherent LLM failures.
- **Failure mode** (14 categories) — how the agent realizes the risk: over-privileged action, flawed planning, choosing a malicious tool, failure to validate tool outputs, content-level failures like unauthorized disclosure, etc.
- **Real-world harm** (10 categories) — what the consequence is: privacy, financial, physical, fairness, info-ecosystem, and so on.

The authors use this taxonomy as both a *coverage scaffold* during construction (sample which slice you want, then realize it) and a *diagnostic label space* at evaluation time. Each unsafe trajectory gets one primary label per axis, chosen along the causal chain — earliest source, dominant behavior, principal harm.

## How the trajectories are generated

The pipeline (Figure 2 in the paper) starts from a sampled risk slice plus candidate tools drawn from a 10,000+ API schema pool that mixes RapidAPI, ToolBench, ToolAlpaca, and simulated tools to fill underrepresented regions. A planner produces a blueprint — task, selected tools, trigger location, intended outcome — and then four simulators take over: query generation, tool-description injection (when the risk lives at the interface layer), tool-call simulation, and environment-response generation, with an agent-response generator producing assistant turns.

For each scenario, the engine builds **paired safe and unsafe variants** from the same skeleton. In the unsafe version the risk fires; in the safe version it's removed, refused, or correctly handled. This pairing is what lets the benchmark stay balanced (503 safe / 497 unsafe) without conflating "safe" with "easy."

Two filtering layers — rule-based schema/format checks and an LLM-based plausibility check — run before a five-reviewer **full** human audit. The audit (not a small agreement study, but a release pass over all 1,000 trajectories) flipped 5 binary labels and corrected 165 fine-grained labels across 129 unsafe trajectories.

## The delayed-trigger long-context protocol

This is the paper's most distinctive design choice. For long-context cases, the planner splits a trajectory into a **SETUP** episode and an **EXPLOIT** episode that share the same conversation history. The exploit step is explicitly grounded in earlier outputs or permissions (`source=CONTEXT`) rather than in a freshly introduced local trigger. The safe and unsafe variants diverge only at that delayed-trigger step — both see the same prior context, but the unsafe agent acts on the carried-over dependency. The authors argue this captures the temporal separation between risk planting and risk realization that simply lengthening turn counts does not.

## What the experiments show

Across closed models (GPT-5.4, GPT-5.2, Gemini-3-Flash, Gemini-3.1-Pro), open-source models (the Qwen3.x and Llama-3.1 families), and dedicated guards (LlamaGuard3/4, Qwen3-Guard, ShieldAgent, AgentDoG-Qwen3-4B), the headline pattern is a sharp gap between *detecting* unsafety and *attributing* it.

On the binary task (ATBench-C), GPT-5.4 leads at 76.7% F1, with Gemini-3.1-Pro at 75.0% and AgentDoG-Qwen3-4B at 71.1%. Strong open-source models trail meaningfully — Qwen3.5-397B-A17B at 67.8%, Qwen3-235B at 60.8%. Some popular guards collapse: Qwen3-Guard hits 0.8% F1, LlamaGuard3-8B 7.3%.

On fine-grained diagnosis (ATBench-F), the numbers drop hard. GPT-5.4 reaches only 33.6% on risk source, 13.5% on failure mode, 30.2% on real-world harm. AgentDoG-Qwen3-4B, which was trained on trajectory data, takes the top spot here at 46.8% / 16.5% / 40.6%. Off-the-shelf guards don't support these labels at all.

The category breakdown (Figure 5) is more revealing than the aggregates. **Tool-mediated risks are the hard ones.** Detecting "Malicious User Instruction or Jailbreak" is comparatively easy (73.8% for GPT-5.4, 83.6% for Qwen3.5-397B). But "Malicious Tool Execution" is near zero for three of the four headline evaluators, and "Tool Description Injection" is routinely misattributed to user-input or misinformation categories. On failure modes, "Choosing Malicious Tool" lands at 5.6% for AgentDoG, 16.7% for GPT-5.4, 22.2% for Qwen3.5-397B — models recognize that something went wrong but reduce the case to a generic "over-privileged action."

## Cross-benchmark difficulty

Figure 4 compares seven models across R-Judge, ASSE-Safety, the earlier ATBench-500 release, and the full ATBench. For most models the drop is large: GPT-5.2 falls from 90.8% on R-Judge to 69.0% on ATBench, Qwen3-235B from 85.1% to 59.2%, and AgentDoG-Qwen3-4B from 91.8% to 64.0%. The authors attribute this to the combination of broader tool coverage, longer contexts, structured taxonomy sampling, and the delayed-trigger split — rather than to synthetic noise.

## What the paper doesn't claim

The authors are candid about scope. Each unsafe trajectory carries only one primary label per axis, which can flatten genuinely multi-causal failures. The whole benchmark is English-only. And it's strictly text-and-tool — no multimodal or embodied trajectories. The benchmark also evaluates *judges* of trajectory safety, not the underlying agents producing them; whether better judges translate into safer deployed agents is left for future work.

## Takeaway

ATBench's contribution is less about the absolute numbers and more about the diagnostic axis. The paper demonstrates that current frontier and guard models can usually tell something is unsafe in a long trajectory but struggle to say *where* it went wrong — particularly when the source is a poisoned tool description, a corrupted tool output, or a delayed exploitation of state set up many turns earlier. For anyone building or evaluating agent guardrails, that's the gap the benchmark is asking the field to close.
