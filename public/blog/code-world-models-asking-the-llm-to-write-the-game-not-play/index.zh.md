# 让大语言模型写出游戏规则代码：DeepMind 的 Code World Model 通用博弈方法

![Code World Models: Asking the LLM to Write the Game, Not Play It](/images/blog/code-world-models-asking-the-llm-to-write-the-game-not-play.png)

Google DeepMind 团队（Lehrach、Hennes、Lázaro-Gredilla 等）在 arXiv:2510.04542 上提出了一种不同寻常的 LLM 玩棋牌游戏方式：与其让模型直接出招，不如让它把自然语言规则与少量轨迹翻译成一份可执行的 Python "世界模型"，然后把这份代码交给 MCTS 这类经典规划器去搜索。论文在 10 个游戏（含 4 个为防止数据污染而新设计的 OOD 游戏）上的实验显示，这种 **CWM-(IS)MCTS** 代理在 9/10 个游戏上击败或追平了直接当策略用的 Gemini 2.5 Pro。

## 论文要解决的痛点

把 LLM 当成策略直接选动作有两个根本性问题：作者指出，这种"直觉玩家"模式依赖模式匹配，**容易走非法走法**，而且**缺乏深度前瞻**——即便最近的"thinking" LLM 也仍然如此。在不在训练集中的新游戏上，这种弱点更为明显。

作者主张把 LLM 的角色从"策略生成器"挪到"代码归纳引擎"：让它读规则文本 + 几条随机对局轨迹，输出一份遵循 OpenSpiel API 的 Python 世界模型，再由 MCTS（完全信息游戏）或 Information Set MCTS（不完全信息游戏）负责搜索。论文把这一对象称为 **Code World Model (CWM)**。

## CWM 长什么样

一份 CWM 是目标游戏的"可玩近似副本"，包含若干确定性函数：状态转移、合法动作枚举、观察函数、奖励函数、终止判定。所有随机性都被关进一个特殊的 *chance* 玩家。

合成过程不是一次性的，而是**迭代精化**：

- 从离线轨迹自动生成一系列单元测试（每条转移、每个状态、每个观察都要对得上）。
- 用 LLM 写代码 → 运行测试 → 把失败的 stack trace 反馈回去 → 再生成。

作者比较了两种精化策略：**Conversation**（串行 chat 模式）和 **Tree Search**（按 REx 风格保存多棵候选树，用 Thompson sampling 选下一个要精化的节点）。两种都行，但 tree search 因为能回溯，在更难的设置里更稳健，因此被选为后续实验的默认。

## 为不完全信息游戏多做的两件事

这是论文相对早期 CWM 工作（WorldCoder、GIF-MCTS、POMDP Coder）的关键区别。

**合成推断函数。** ISMCTS 需要从信念状态 $p_M(s_t \mid o_{1:t}^i, a_{1:t}^i)$ 中采样隐状态。作者让 LLM 写采样代码，并给出两种路径：

- **Hidden history inference**：从动作历史（含 chance 动作）采样 $\tilde h_t$，再用 CWM 重放出 $\tilde s_t$。单元测试可验证重放出的观察与实际观察一致；如果通过，作者论证 $\tilde s_t$ 一定属于后验的 support。
- **Hidden state inference**：直接采样 $\tilde s_t$，再由 CWM 反推观察去核对。更简单，但既无法保证位于 support 中，也不保证是合法状态。

实验显示 hidden history 略胜一筹，因此作为主方法。

**合成价值函数。** 让 LLM 一次性写出一个启发式 $V(s)$，用在 (IS)MCTS 的叶节点估值上，替代随机 rollout。价值函数没有 ground truth，所以不做精化，改成生成多个候选、跑锦标赛挑最好的。

## "Closed deck" 学习：当隐藏信息永远看不到

绝大多数 CWM 工作（包括同期的 Curtis et al.，2025）假设训练轨迹包含事后可见的隐状态，论文称之为 **open deck**。但如果智能体只能拿到自己一方的观察呢？作者称这种更严格的设定为 **closed deck**——据其所知，此前 CWM 文献都没正面处理过。

他们的应对是把 CWM 和推断函数当作**正则化自编码器**来训练：

- **编码器**：推断函数把 $(o^i_{1:t}, a^i_{1:t})$ 映射到隐动作历史 $\tilde h_t$。
- **解码器**：CWM 把 $\tilde h_t$ 重放回观察和动作。
- 删掉所有需要看到隐状态才能验证的单元测试，只保留"观察 → 隐藏 → 观察"对得上、以及随机对局无执行错误这两类。
- 游戏规则与 OpenSpiel API 在 prompt 里充当结构化正则项，防止编码器塌缩成平凡的潜空间。

作者还给出一个副产品：只要 $\tilde h_t$ 通过所有单元测试，$p_M(\tilde h_t)$ 就是 CWM 似然的一个下界。

## 实验设置

合成和对局都用 **Gemini 2.5 Pro**。比较对象有三个：随机合法动作的 *Random*、能调用 ground truth 代码的 *GT-(IS)MCTS*（性能上限）、以及把 Gemini 2.5 Pro 直接当策略（开启 "dynamic thinking"）。所有方法都拿到同一份资料：规则文本 + 5 条随机离线轨迹。(IS)MCTS 每步固定跑 1000 次模拟。

10 个游戏覆盖了完全/不完全信息、训练分布内/OOD：

- 完全信息：Tic-tac-toe、Connect four、Backgammon、Generalized tic-tac-toe (OOD)、Generalized chess (OOD)。
- 不完全信息：Leduc poker、Bargaining、Gin rummy、Quadranto (OOD)、Hand of war (OOD)。

## 合成准确率：除了 Gin rummy 都还行

**完全信息游戏**：5 个游戏全部学到正确的 CWM，测试集 transition accuracy 接近 1.0，平均只要 2–17 次 LLM 调用。

**不完全信息（open deck）**：Bargaining、Leduc poker、Quadranto、Hand of war 的 CWM 测试 accuracy 都 ≥ 0.97。**Gin rummy 是异类**——训练 transition accuracy 只有 0.78，测试 0.75；推断 accuracy 更低到约 0.54。作者把原因归到这游戏的"打牌、垫牌、算 deadwood、查 undercut"多阶段计分逻辑——LLM 难以从少量轨迹中把这么繁琐的子流程一次写对。

**Closed deck** 设置下，合成质量整体下降，Gin rummy 的训练 inference accuracy 暴跌到 0.055。但作者特意指出，对局表现的退化幅度远小于合成准确率的退化。

## 对局结果：9/10 游戏匹敌或胜过 Gemini 2.5 Pro

**完全信息游戏**：CWM-MCTS 在全部 5 个游戏对 Gemini 都赢。对手 GT-MCTS（使用真实代码）的胜率与 CWM-MCTS 相近——作者把这看作合成质量很高的反证。

**不完全信息 open deck**：除了 Hand of war，CWM-ISMCTS 在所有其余游戏上击败或匹敌 Gemini。Gin rummy 的 "胜出" 主要来自 Gemini 自己的高弃权率（无法给出合法动作）；Leduc poker 平均收益占优但方差很大。Bargaining 中加入合成的价值函数对玩家 1 有明显增益。

**Closed deck**：相对 open deck 有退化，但 CWM-ISMCTS-Closed 仍然击败或匹敌 Gemini 2.5 Pro。作者观察到 Hand of war 在 closed deck 下反而表现略好，并猜想可能是更简单的状态空间反而更容易合成。

附录 D 还报告了一个变种：在学到的 CWM 里用 PPO 训练一个反应式策略，把规划摊销到训练时。PPO-CWM 在多数游戏上击败或匹敌 Gemini，但在完全信息游戏中通常输给 CWM-MCTS——当 CWM 本身近乎完美时，在线搜索仍然有压倒性优势。

## 这条路打开了什么、又卡在了哪儿

论文最坦白的局限就是 Gin rummy：当游戏含有大量分阶段、过程式的计分逻辑时，仅靠 5 条离线轨迹 + 规则文本，LLM 很难一把写对。Closed deck 设置下这个缺口更被放大。作者把这当作 CWM 合成的下一个前沿，并建议加入**在线主动学习**让代理在与真实环境互动中持续修正世界模型，以及把方法扩展到带自由文本/视觉接口的开放世界游戏。

值得注意的是论文展示的范围：作者 *演示* 了在 10 个两人游戏上的优越性，*主张* 这种"翻译规则为代码"的范式比 LLM 当策略更具可验证性、更深度和更易泛化。但他们的设置仍然假设规则文本是干净可解析的，离线轨迹足够覆盖关键转移——把这种方法搬到带感知噪声的真实环境之前，还需要回答不少工程问题。

## 一句话总结

把 LLM 当作"代码翻译器"而不是"直觉棋手"，再让 MCTS 去搜索——在两人游戏上，这种分工比直接让 LLM 出招更可靠，也更容易泛化到训练集中没见过的新游戏。
