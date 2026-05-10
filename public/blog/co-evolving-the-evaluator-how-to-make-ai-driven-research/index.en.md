# Co-Evolving the Evaluator: How to Make AI-Driven Research Actually Work for Databases

![Co-Evolving the Evaluator: How to Make AI-Driven Research Actually Work for Databases](/images/blog/co-evolving-the-evaluator-how-to-make-ai-driven-research.png)
*Image from [https://arxiv.org/pdf/2604.06566](https://arxiv.org/pdf/2604.06566)*


A new paper by Cheng et al. (UC Berkeley, KTH, Meta, Workday, U-Michigan, Maven AGI) argues that the bottleneck in applying LLM-driven algorithm discovery to databases is no longer solution generation — it's evaluation. The authors propose co-evolving the evaluator alongside the candidate algorithms, and back the claim with three case studies that beat state-of-the-art baselines on buffer management, index selection, and query rewriting.

## Why evaluation is the bottleneck

ADRS — AI-Driven Research for Systems — refers to frameworks like AlphaEvolve, GEPA, and OpenEvolve that wrap an LLM in an evolutionary loop: generate code, benchmark it, feed the score back into the prompt, repeat. Unlike learned-model approaches that embed neural networks into the runtime path, ADRS produces auditable source code with no inference overhead at deployment. The authors note that ADRS has already discovered, for instance, a Mixture-of-Experts load balancer 13× faster than the previous best.

![Co-Evolving the Evaluator: How to Make AI-Driven Research Actually Work for Databases — overview diagram](/images/blog/co-evolving-the-evaluator-how-to-make-ai-driven-research_diagram.png)


For databases, though, naive ADRS doesn't work. The paper points out that optimizing PostgreSQL's buffer policy with full-system evaluation would mean roughly 3 minutes to recompile, 30 minutes to load TPC-H at SF=10, and another 30 minutes to run the workload — over an hour per iteration, when convergence needs hundreds. Computational cost models are faster but routinely diverge from real latency. The paper frames the choices as four standard techniques — simulators, E2E performance models, workload subsetting, and search-space pruning — each of which is "as difficult to apply as solving the underlying optimization problem itself."

## The co-evolution framework

The authors' proposal is structurally simple: wrap the existing ADRS solution-generation loop in an *outer* loop that refines the evaluator using empirical data from the inner loop. Rather than hand-build a simulator or fix a fitness signal up front, the framework treats the simulator, the performance model, the workload subset, and the search space as evolvable artifacts. The paper restricts the approach to performance problems where correctness is easy to verify (no semantic changes), and explicitly flags concurrency control and write-ahead logging as out of scope for now.

## Case 1 — Buffer cache: "more is more"

Target: PostgreSQL's buffer eviction policy. Baseline: PBM-Sampling (Vanderkooy et al., 2025), which approximates Belady's optimal by predicting next-access times for sampled buffers.

The authors' first attempt — a simulator that mirrored PostgreSQL's internal buffer descriptors — trapped evolution in local optima because it omitted scan-progress metadata that lives in the query executor, not the buffer manager. The fix was to feed the outer loop *multiple* ground-truth baselines (Clock, PBM-PQ, PBM-Sampling) and full-system performance metrics, which surfaced the missing state and the cost asymmetry between clean reads (~20μs) and synchronous dirty writes (~200μs).

The evolved policy adds three things on top of PBM-Sampling: an empty-buffer fast path with lock-free sampling, multi-factor scoring that breaks Belady ties using PostgreSQL's native `usage_count`, and separate clean/dirty candidate tracking so clean pages are evicted first. Reported gains over PBM-Sampling on TPC-H SF=10: **19.8% higher hit rate, 11.4% lower I/O volume** (averaged across parallel-stream counts).

## Case 2 — Index selection: "mind the gap"

Target: an index advisor for PostgreSQL. Baselines: Extend, AutoAdmin, Anytime, DB2Advis. The authors note that DB2Advis cuts estimated optimizer cost by 49.7% on TPC-H but is actually 8% *slower* than Extend at execution time — exactly the proxy/reality gap their framework is designed to close.

Optimizing latency directly introduces measurement noise. Standard medians-over-runs proved insufficient: variance between identical runs exceeded the gap between baselines. The outer loop iteratively designed a measurement protocol that warms up and benchmarks each query in isolation in a fixed order, removing cache thrash. With latency stabilized as a fitness signal, the inner loop converged on a policy whose distinctive move is *table-importance weighting*: a multiplier of $1.0 + \sqrt{\text{cost}_{\text{table}}/\text{cost}_{\text{max}}}$ applied to candidate indexes, where the table cost is summed from queries referencing its columns. This boosts indexes on dimension-style tables that the planner's cost model undervalues.

Reported results against the best baseline: **6.3% latency reduction on TPC-DS, 5.8% on TPC-H, and 2.2× faster selection time on TPC-H** (3.4s vs 7.3s), within the same 500MB storage budget. Notable: the evolved policy *gives up* about 9 percentage points of estimated cost reduction on TPC-DS to win on real latency — the paper presents this as direct evidence that the proxy metric was misleading prior work.

## Case 3 — Query rewriting: "go off what you know"

Target: a deterministic rewrite policy in Apache Calcite's `HepPlanner` running over PostgreSQL 17. Baseline: R-Bot (Sun et al., 2025), an LLM-driven runtime rewriter that retrieves rule recipes from Stack Overflow / forum threads and invokes the LLM per query.

The query rewrite search space is combinatorial — finding optimal rule sets is NP-hard — so a single global policy plateaued quickly. The outer loop instead constructs targeted experiments: it expands from queries where a rule sequence won, isolates regressions, and prunes the search space using static feature filters (e.g., skip subquery-unnesting rules on queries without subqueries) plus phase ordering (pre-processing rules before structural transforms). The accumulated empirical dataset maps query features to performant rule sequences, and the inner loop synthesizes those mappings into a single deterministic policy that runs as Java code in under 1ms per query.

Reported execution-latency speedups vs R-Bot: **2.6× on TPC-H, 4.0× on DSB**, both at SF=10. Because R-Bot's per-query LLM inference takes over a minute on average, the *overall* (rewrite + execute) gap is much wider: **5.4× faster than PostgreSQL on TPC-H, 6.8× on DSB**, and 9–34× faster than R-Bot end-to-end. The authors also report individual-query wins: TPC-H Q22 from over 300s down to 7.3s, DSB Q054 down to 0.25s. They flag a representative R-Bot failure where it predicted an improvement but degraded DSB Q100 by 19.6×.

## What the paper actually demonstrates

The headline numbers come from comparisons against specific baselines on specific benchmarks (TPC-H SF=10, TPC-DS, DSB SF=10, all on `c5.18xlarge` EC2 instances), and the policies were trained with separate test/train splits to control for overfitting (query-variant splits for Calcite, TPC-DS-only training for index selection with TPC-H held out). The three case studies were selected, the authors say, specifically to cover all four standard evaluation techniques — they don't claim the framework generalizes uniformly across database problems.

## What's left open

The paper is candid that ADRS works here because performance optimizations preserve semantics, making correctness easy to verify with row-equality checks. Extending the approach to concurrency control, write-ahead logging, or any subsystem with non-trivial correctness conditions would require evaluators that include formal verification or fuzz testing — and those evaluators are themselves harder to build. The authors also raise a broader specification question for *workload* optimization: application correctness is often expressed implicitly in code rather than as database constraints, and ADRS would need to reverse-engineer those invariants before it could safely rewrite queries against them.

## Takeaway

The paper's central message is that for ADRS in databases, evaluator design is the load-bearing problem — and treating the evaluator as another evolvable artifact is a tractable way to address it. For practitioners, the three "insights" (more baselines, mind the proxy gap, exploit known wins) read as concrete recipes rather than slogans, each tied to a specific class of evaluation bottleneck. The open question the work raises: how far can co-evolution stretch before correctness verification, not speed-vs-fidelity, becomes the binding constraint?
