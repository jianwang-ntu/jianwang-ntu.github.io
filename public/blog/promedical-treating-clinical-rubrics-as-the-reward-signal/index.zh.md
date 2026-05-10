# ProMedical：用细粒度临床量规把"安全"硬约束写进医疗大模型的奖励信号

![ProMedical: Treating Clinical Rubrics as the Reward Signal, Not a Post-Hoc Check](/images/blog/promedical-treating-clinical-rubrics-as-the-reward-signal.png)

He Geng、Yangmin Huang 等人(科大讯飞医疗)的这篇论文针对一个日益突出的问题:医疗大模型的训练信号(粗粒度二元偏好)和评测标准(细粒度临床量规)之间存在显著错位。作者提出 **ProMedical**——一套把临床量规直接嵌入偏好数据、奖励建模与评测的统一框架,并用其训练出的 8B 奖励模型在自建基准上把 Qwen3-8B 的整体准确率推高 22.3%、安全合规率推高 21.7%。

## 论文要解决的"对齐鸿沟"

作者把现状描述为"对齐鸿沟":主流医疗对齐管线依赖整体偏好对(chosen vs. rejected)的二元监督信号,而临床评测越来越强调按条目核查的细粒度量规。论文论证,这种粗粒度信号迫使模型从二元标签里隐式推断复杂的医学逻辑,容易把"安全"和"流畅度"混为一谈,在长尾临床错误上失灵。论文称之为 *scalar conflation*(标量混淆)。

![ProMedical: Treating Clinical Rubrics as the Reward Signal, Not a Post-Hoc Check — overview diagram](/images/blog/promedical-treating-clinical-rubrics-as-the-reward-signal_diagram.png)


## 三件套:数据、算法、评测

论文的贡献以三个组件呈现,围绕同一套量规体系展开。

### ProMedical-Preference-50k:量规化的偏好数据

作者从 9 个公开医疗数据集汇聚 82.3 万条指令,经过语义去重、难度过滤(保留 5–9 分)、专家分层分类后,得到约 5 万条核心指令。回复由 Qwen3-235B-Thinking、Claude-Sonnet-4.5-Thinking、DeepSeek-R1 三个异构模型采样生成,以缓解单模型自强化偏差。

最关键的步骤是量规生成:作者用 **Gemini-3-Pro-thinking** 配合"静态专家系统提示 + 动态少样本示例池"做迭代生成,每轮由临床医师审校 500 个样本,把修订后的金标准回注到示例池。最终在严格专家评估下达到 **96.40% 的通过率**,再由 GPT-4.1 作为判官打标签,与人类专家一致率 **93.2%**。

### 三维评测体系与字典序排序

论文把回复的临床效用分解为三个正交维度:

- **Main Proficiency (S₁)**:加权基线分,衡量准确性与完备性,权重之和归一为 1。
- **Excellence Bonus (S₂)**:奖励同理心、逻辑连贯等"超越合格"的属性。
- **Safety Veto (S₃)**:对严重幻觉、有害建议等触发硬否决。

不同于 HealthBench、K-QA 把安全做成可被效用补偿的扣分,作者用 **字典序比较**(lexicographical comparison)严格执行优先级 S₃ > S₁ > S₂——只要一方安全得分更低,就直接判负,无论其他维度多高。论文论证这是"切断通向不安全区域的梯度轨迹"的硬约束。

### Explicit Criteria Injection:多维奖励模型

ProMedical 的算法核心是 **显式准则注入**——把奖励建模任务从估计 P(yw ≻ yl | x) 改为估计 P(yw ≻ yl | x, c),其中 c 是具体的量规维度。一个回复对会被沿 K 个适用维度展开成 K 个独立训练样本,各自给出条件偏好标签。这样训练出的 **ProMedical-RM**(基于 Qwen3-8B 与 Llama-3-8B-Instruct 两个底座)再作为 oracle 驱动 GRPO 进行策略优化。

奖励信号的形式是:

> rᵢ = Clip(S₁ + αS₂, 0, 1+β) − λ·S₃

其中 β 是为防止奖励饱和而设的"卓越红利上限",λ ≥ 1+β 保证一次安全违规足以压过任何效用增益。

## ProMedical-Bench:双盲专家裁定

为避免训练目标与评测标准互相迁就,作者另起炉灶建了 **ProMedical-Bench**:795 条与训练集严格不相交的样本,扩展为 5,505 个维度级偏好对(3,625 Proficiency / 1,650 Excellence / 230 Safety)。每条都由有执照医师双盲核对每一条量规检查点,加权 Cohen's Kappa 达 **0.88**。

## 实验呈现的两个对照

**奖励建模能力**:在 ProMedical-Bench 上,**ProMedical-RM-8B (Qwen3)** 整体偏好准确率 **86.55%**,而 GPT-5 为 76.42%、DeepSeek-R1 为 78.55%、Meditron-70B 仅 53.40%、PairRM-LLaMA3-8B 为 58.95%。论文据此论证:仅靠参数规模或生物医学预训练,无法自动迁移到细粒度安全约束的合规上。Llama 底座的变体也拿到 85.40%,与 Qwen3 版仅差 1.2 个百分点,作者把增益归因于范式而非底座。

**安全否决的精度/召回**:在 S₃ 维度上,ProMedical-RM-8B (Qwen3) 取得 F1 **89.09%**(P 91.50 / R 86.80),领先 GPT-5 的 F1 76.45 和 medical o1 verifier 的 52.95。

**策略对齐效果**:用 ProMedical-RM 作 GRPO 的奖励信号训练 Qwen3-8B,在 HealthBench 上从 46.27 提升到 53.64,在 ProMedical-Bench 上从 69.5 提升到 76.39,均超过以 UltraMedical-Preference、ScaleAI-RaR、InfiMed-ORBIT 为奖励的对比组。

## 论文未声称的部分

论文坦诚两点局限。一是该量规依赖明确的专家共识,在指南本身有争议的医疗领域适用性受限;二是框架完全在文本模态内运行,对放射影像、生化指标等异构数据无能为力。换句话说,论文展示的是 *文本场景* 下严格安全约束的对齐方案,并未声称能替代多模态诊断。

此外值得注意的是,论文报告的"超越前沿模型"是在其自建的 ProMedical-Bench 上;在外部 UltraMedical 基准上,作者声称的是"与 SOTA 可比",而非全面胜出——这一点在原文摘要里也是这样表述的。

## 这篇论文留给医疗对齐的问题

ProMedical 提供了一个具体证据:把临床量规拆成可独立监督的维度,并对"安全"施加字典序硬约束,8B 规模的开源模型也能在医疗场景的对齐保真度上接近闭源前沿模型,且不易被"奖励欺骗"。论文真正打开的下一个问题是——当临床指南本身存在争议、或当文本之外的影像与化验也参与决策时,这套以专家共识为锚的量规框架要怎样扩展。在那之前,这套数据、奖励模型与基准的开源,值得任何做安全敏感型医疗对齐的人作为新的起点。
