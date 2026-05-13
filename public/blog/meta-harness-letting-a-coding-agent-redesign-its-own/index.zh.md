# Meta-Harness：让编码 Agent 自动优化 LLM 的"骨架代码"

Stanford、KRAFTON 和 MIT 团队（Lee 等人）提出的这篇论文把"harness 工程"——围绕大模型编写的存储、检索和上下文构造代码——变成了一个可自动搜索的问题。作者们的核心主张是：现有文本优化器之所以不擅长这件事，是因为它们把反馈压缩得太狠；只要让一个编码 Agent 通过文件系统读到所有历史代码、分数和执行轨迹，自动化的 harness 搜索就能在三个差异巨大的领域上击败手工设计的最强方案。

## 论文要解决的问题

同一个模型，换个 harness 就可能在同一个 benchmark 上拉开 6× 差距（论文引用文献 [47]）。但 harness 工程目前几乎完全靠人工：观察失败案例、调启发式、迭代几个版本。

![Meta-Harness: Letting a Coding Agent Redesign Its Own Scaffolding — overview diagram](/images/blog/meta-harness-letting-a-coding-agent-redesign-its-own_diagram.png)


一个自然的想法是搬用 OPRO、TextGrad、AlphaEvolve、GEPA、Feedback Descent 这些文本优化器。论文 Table 1 列出了一个关键观察：这些方法每次迭代喂给 proposer 的上下文只有 **2K 到 26K tokens** 不等，要么只看当前候选，要么只看标量分数，要么压缩成几句反思摘要。而 harness 是长程的——一个"存什么、何时取、怎么呈现"的决定可能在十几步推理之后才显现后果。压缩反馈会把诊断信号丢掉。

## Meta-Harness 在做什么

作者们提出的方案直白得有些反直觉：**让 proposer 是一个编码 Agent（Claude Code + Opus-4.6），让它通过文件系统看到所有历史**。

具体循环是：

1. proposer 用 `grep`、`cat` 这类终端工具在文件系统里翻看所有此前候选 harness 的源码、分数和执行轨迹；
2. 它生成一份新的 harness（一个单文件 Python 程序）；
3. 评估这份 harness，把代码、轨迹、分数全部落盘到一个新目录里；
4. 循环。

没有父代选择规则、没有 archive、没有持久化 memory 机制——作者们把"读哪些历史、改哪些地方"完全交给 Agent 自己。论文统计在 TerminalBench-2 的运行中，proposer **每次迭代中位数读取 82 个文件**（范围 69–99），引用了 20 余个先前候选；单次评估可以产生高达 1000 万 tokens 的诊断信息，比前述文本优化器高出大约三个数量级。

## 三个领域的结果

### 在线文本分类

设置沿用 ACE（Zhang 等人 [59]）：GPT-OSS-120B 作为分类器，依次看到带标签的样本、更新 memory、在留出测试集上评估。三个数据集是 LawBench、Symptom2Disease、USPTO-50k。

- 与手工设计的 harness 相比：Meta-Harness 拿到 48.6% 平均准确率，**比 ACE 高 7.7 分、比 MCE 高 8.6 分，同时只用 11.4K 上下文 tokens**（ACE 用 50.8K，MCE 用 28.5K）。
- 与文本优化器相比：Meta-Harness 在 **4 次评估**之内就追平了 OpenEvolve 和 TTT-Discover 跑完 60 次后的最终表现，最终精度再领先 10 分以上。
- 在 9 个 OOD 分类数据集上，Meta-Harness 平均 73.1%，仍优于 ACE 的 70.2%。

论文还做了一个值得注意的消融（Table 3）：把 proposer 接口换成"只给分数"或"分数+摘要"，最佳准确率分别只有 41.3% 和 38.7%；保留完整执行轨迹的 Meta-Harness 拿到 56.7%。作者们把这解读为"原始执行轨迹是关键，摘要不仅不能替代，还可能压掉关键诊断信息"。

### 检索增强的数学推理

retrieval 在数学推理这种重推理领域历来效果不显著（论文引用 [42; 49; 6]）。作者们让 Meta-Harness 在 250 道 Olympiad 难度题上跑 40 轮、产出 109 个候选检索 harness，挑出一个最好的，再放到 200 道未见的 IMO 级别题（来自 IMO-AnswerBench、IMO-ProofBench、ArXivMath）上测，跨 5 个搜索时未见过的模型（GPT-5.4-nano/mini、Gemini-3.1-Flash-Lite、Gemini-3-Flash、GPT-OSS-20B）。

结果：**单一发现的 harness 在五个模型上平均提升 4.7 分**，比 BM25 baseline 还高 1.3 分，而且没有像 dense retrieval 那样在某些模型上倒退。

这个 harness 自己长成了一个有趣的结构（论文附录 B.2）：先用关键词和正则把题分路由到四条 BM25 路径——组合、几何、数论、其他——每条路径有不同的重排序规则、去重阈值和样本数量。所有这些设计都是搜索过程中自动决定的。

### TerminalBench-2 上的 Agentic 编码

这是当下竞争最激烈的 long-horizon Agent benchmark 之一。Meta-Harness 从 Terminus 2 和 Terminus-KIRA 两个开源 harness 起步搜索：

- 在 **Claude Haiku 4.5** 上，发现的 harness 拿到 **37.6%**，超过此前最好的 Goose（35.5%），**排名 Haiku 4.5 类目第一**。
- 在 **Claude Opus 4.6** 上拿到 76.4%，超过 Terminus-KIRA 的 74.7%，排名第二（ForgeCode 81.8% 暂列第一，但作者们指出无法用其公开代码复现该成绩）。

有意思的是 proposer 找到的胜出 harness 极其朴素：它在 Agent 循环开始前先跑一条 shell 命令收集一份环境快照（工作目录、`/app` 列表、可用编程语言版本、包管理器、内存），把这块拼到初始 prompt 里。Terminus-KIRA 的原生 tool calling、30KB 输出截断、多视角完成清单等机制全部保留，只是多了大约 80 行环境探测代码。

## 搜索过程里的"因果推理"

论文附录 A.2 给出了一段难得的诊断证据，展示了搜索过程不是随机突变：

- 第 1、2 次迭代都把"修结构 bug"和"改 prompt 模板"打包在一起，两次都从 64.4% baseline 倒退；
- 第 3 次迭代 proposer 在日志里明确写道："prior attempts ... 都倒退了 —— 根本原因是 prompt 模板的清理指令让 Agent 在任务完成前删掉了必要状态。结构修复被有害的 prompt 改动搞混了。"于是它把 prompt 还原，单独测结构修复——损失大幅缩小；
- 第 4–6 次继续在控制流上尝试，仍然倒退；
- 第 7 次 proposer 总结："连续 6 次倒退都修改了 completion flow、prompt 模板或 observation 处理 —— 这个变化采取一种纯加性的不同思路。" 这次就是最终胜出的环境快照方案。

作者们把这一段当作"完整历史的文件系统访问能让 proposer 形成并验证因果假设"的定性证据，这是压缩反馈的优化器结构上做不到的。

## 论文承认的边界

作者们自己讲明的几点 scope：

- TerminalBench-2 上没有独立的 search/test split，因为 benchmark 太小、太贵；论文用手工检查和正则审计来排除任务字符串泄漏，但这仍然是"发现问题"而非纯泛化测试。
- 搜出来的 harness 是和特定 base model（Opus 4.6 / Haiku 4.5 / GPT-OSS-20B）配合训练的；数学推理结果显示能跨模型迁移，但分类和编码任务的跨模型迁移没有系统测试。
- 整个方法在论文里只用了一个强力的 proposer Agent（Claude Code），不同 Agent 之间的差异留给后续工作。
- 作者们脚注里直白写到："基于早期探索，我们认为这套 workflow 直到 2026 年初编码 Agent 能力大幅提升后才变得实用。"——也就是说这是一个"为时已到"的方法，而不是任何 LLM 都能跑的方法。

## 一句话总结

Meta-Harness 给"用 Agent 优化 Agent"提供了一个干净的样本：把历史完全摊开在文件系统里、把诊断决定交给编码 Agent，比任何带着精巧搜索结构的文本优化器都更能榨出长程依赖里的信号。对正在做 harness 调优、检索策略或长链 Agent 工程的人来说，这篇论文提出了一个值得复用的工作流——而它最有意思的地方是，未来编码 Agent 越强，这套搜索本身就越有效。
