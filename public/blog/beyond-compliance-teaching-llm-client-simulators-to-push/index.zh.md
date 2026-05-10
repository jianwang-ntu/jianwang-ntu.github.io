# 当心理咨询模拟器学会"不配合":ResistClient 用动机推理重建真实临床张力

![Beyond Compliance: Teaching LLM Client Simulators to Push Back](/images/blog/beyond-compliance-teaching-llm-client-simulators-to-push.png)

心理咨询训练长期被一个尴尬的事实拖累:用大模型扮演的"虚拟来访者"几乎都太听话了。东南大学 Liu 等人的这篇论文提出 **ResistClient**,把临床心理学中的"客户阻抗理论"(Client Resistance Theory)塞进训练流程,用一个两阶段框架 **RIMR**(Resistance-Informed Motivation Reasoning)让模型先做动机推理、再生成回应,从而把"过度顺从"的模拟器拉回真实临床场景。

## 为什么"听话的模拟器"是个问题

论文开篇引用 WHO 的数据:全球超过 10 亿人受心理障碍困扰,但合格咨询师严重短缺,因此 LLM 客户模拟器被广泛用于训练学员、评测心理类 LLM。问题在于,现有模拟器几乎都建立在"profile + prompt 条件生成"的范式上,而预对齐 LLM 内置的"顺从偏置"与真实临床中的非合作行为根本冲突。作者指出,Patient-Ψ、AnnaAgent、Yang et al. (2025b) 等工作只能在 prompt 层面做出"表面困难度",无法复现真实来访者由认知—情感冲突驱动的阻抗行为。

![Beyond Compliance: Teaching LLM Client Simulators to Push Back — overview diagram](/images/blog/beyond-compliance-teaching-llm-client-simulators-to-push_diagram.png)


更关键的是,既有方法只拟合外显回答,不建模阻抗背后的动机机制——而 Otani(1989)和 Chamberlain 等人早就把阻抗定义为认知—情感过程,而非孤立行为。

## 论文的两个判断

作者把现状归结为两个具体缺陷:

1. **顺从偏置导致的"假困难"**:预训练分布里没有真实阻抗样本,prompt 调优只能给出表面非合作。
2. **缺乏内部机制建模导致的"浅层模拟"**:模型只学输出形式,不学产生这种输出的心理过程,无法判断行为是否心理学上自洽。

ResistClient 的回应是:**先重塑数据分布,再让模型在生成前显式做动机推理**。

## RPC 数据集:让阻抗"显形"

第一阶段需要的数据,作者基于已有的中文心理咨询语料 ProPsyC 重写而来,产出 **RPC 数据集**:1,849 段完整咨询会话、覆盖 14 个常见主题,其中 1,761 段含阻抗行为。

构造流程有三步:

- **5P 画像抽取**:沿用 Johnstone & Dallos(2013)的 5P 个案概念化框架(Presenting / Predisposing / Precipitating / Perpetuating / Protective Factors),用 DeepSeek-V3.2 配合少样本示例提取结构化来访者画像。验证阶段由 4 位持证咨询师对 200 段对话进行 coverage / faithfulness 评估,经过两轮 prompt 迭代后成功率从 53% 提升到 82%,Fleiss κ = 0.74。
- **阻抗触发识别**:作者与咨询师合作梳理出"阻抗触发场景"列表(表 5),要求重写时同时考量当前对话上下文和 5P 画像中的高风险特征,而不是仅看表面措辞。
- **阻抗导向重写**:沿用 Chamberlain 等人(1984)的分类,定义 5 种阻抗反应(Controlling、Emotional、Defensive、Avoidant、Compliant)和 2 种合作反应(Non-resistant、Facilitative)。重写被严格局部化:每段会话最多一次主要阻抗事件,改动只覆盖触发点及其后 3 轮。每条客户回应都附带反应类型标签和动机说明。

最终阻抗类型分布反映了中文文化语境的特点:Compliant Resistance 最多(1,277),Controlling 最少(116),作者把这归因于"以和为贵"的文化倾向,并明确提示这一分布在跨文化场景下不可直接套用。

## 阶段一:监督微调把分布"扳回来"

在 RPC 上做条件监督微调,模型学习从画像 *p*、对话历史 *Hₜ₋₁* 和咨询师当前发言 *uᶜₜ* 映射到一个三元组(反应类型、回应文本、动机说明)。损失即标准的逐 token 负对数似然。这一步直接把模型的行为分布从"普遍合作"重排到 RPC 中观察到的多样化阻抗模式。

## 阶段二:动机推理的过程监督强化学习

光学输出还不够。作者要求模型在生成回应前显式产出三步推理:

1. **Profile Reflection**:从 5P 画像中识别稳定的认知/情感倾向。
2. **Situation Awareness**:基于对话历史和当前发言推断瞬时心理状态。
3. **Reaction Decision**:决定反应类型和预期行为特征。

随后由 4 位咨询师对 SFT 模型采样的输出,在 5 个维度上(三步推理质量、回应质量、推理—回应一致性)给出 0–5 分的过程级奖励(Fleiss κ = 0.73),归一化到 [-1,1] 作为强化学习信号。

奖励的关键设计是 **Consistency-aware Reward Reweighting**:基于 GRPO 的离线版本,把一致性奖励 *rᵢ,₅* 同时附加到"决策步"和"回应步"的末尾 token,再通过逐 token 累加未来奖励的方式构造优势函数。这样,推理与表层回应的语义一致性既影响决策步、也影响回应步,并通过反向传播渗透到更早的推理 token,让"想得通"和"说出来"被显式耦合。

## 实验:阻抗模拟与现实性

论文围绕四个研究问题做了对比与消融。骨干模型为 Qwen3-8B,在一张 A100(80GB)上 SFT 与 MRRL 各训 2 个 epoch。

**RQ1 阻抗模拟能力**(表 1,RPC 中 100 个画像、每画像 3 段会话):

| 模型 | Precision | Recall | F1 | RTF | Fid. | Rat. | Qua. |
|---|---|---|---|---|---|---|---|
| GPT-5.1 | 59.31 | 62.88 | 61.04 | 35.94 | 1.42 | 1.35 | 2.52 |
| DeepSeek-V3.2 | 52.87 | 57.56 | 55.12 | 36.91 | 1.29 | 1.21 | 2.40 |
| Kimi-K2-thinking | 47.08 | 51.19 | 49.05 | 36.86 | 1.24 | 1.19 | 2.18 |
| Qwen3-8B | 36.52 | 48.54 | 41.68 | 45.06 | 1.10 | 1.04 | 1.88 |
| Qwen3-8B-SFT | 63.54 | 73.90 | 68.33 | 39.43 | 1.46 | 1.41 | 2.39 |
| **ResistClient** | **70.38** | **78.95** | **74.42** | 38.03 | **1.63** | **1.58** | **2.61** |

值得注意的是,小模型(Qwen3-8B、DeepSeek-R1-8B)虽然 RTF 高,但 Precision 低,说明它们倾向"乱触发"阻抗;ResistClient 则在精度与召回上同时领先所有对比对象,包括 GPT-5.1。

**RQ2 消融**:混淆矩阵显示,从 prompt-only 到 SFT、再到完整 RIMR,对角线质量逐步提升;prompt-only 模型明显偏向合作类反应,印证了顺从偏置的存在。

**RQ3 完整会话中的挑战质量**(表 2,counselor–client–moderator 框架,SoulChat2.0 任咨询师):ResistClient 在 CCR(60.84%,越低代表挑战越强)、平均轮数(17.88)、连贯性(0.73)以及人工评估的真实感(2.39)上均最优。Patient-Ψ 仍过度合作(CCR 87.94%),AnnaAgent 通过随机情绪扰动降低 CCR 但牺牲了一致性,Yang et al. (2025b) 的低接受度控制则陷入重复模式。

**RQ4 用 ResistClient 评测心理 LLM**(表 3):无论是 SoulChat2.0、Psyche-R1 等专用模型还是 GPT-5.1、Gemini-3-flash 等通用模型,在与 ResistClient 交互时的 RTF 都在 39–52% 之间,普遍表现出"咨询漂移"且推进有限。这意味着 ResistClient 实际上可以作为一个新的评测视角,暴露出标准基准看不到的弱点。

## 论文承认的边界

作者在 Limitations 部分明确指出三点:数据基础是中文咨询语料,跨文化迁移不能直接套用;评测依赖少数(4 位)持证咨询师,视角有限;工作只覆盖来访者侧,不包含能够主动管理阻抗的咨询师 agent。

## 一句话总结

ResistClient 把"客户阻抗"从一个 prompt 标签升级为带有动机推理过程的可训练目标,展示了在心理对话模拟里,**比起继续堆叠 profile 描述,把过程监督奖励对准"为什么这么回"可能更有价值**——也顺手揭示了当前心理 LLM 在阻抗管理上的系统性短板。
