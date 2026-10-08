# WebForge：一个把"真实—可复现—可扩展"三难困局打开的浏览器智能体评测框架

![WebForge: Generating Browser Agent Benchmarks That Are Realistic, Reproducible, and Scalable at the Same Time](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/webforge-generating-browser-agent-benchmarks-that-are.png)
*Image from [https://arxiv.org/pdf/2604.10988](https://arxiv.org/pdf/2604.10988)*


腾讯 BAC 与清华联合发布的论文 *WebForge* 提出了一个观察：现有的浏览器智能体基准在真实性、可复现性与可扩展性三者之间始终只能取其二。作者把这一矛盾命名为 **benchmark trilemma**(基准三难),并给出一条完全自动化的解法——一个由 Plan、Generate、Refine、Validate 四个智能体串起来的流水线,可以端到端地造出"自带噪声、自带答案、自带验证机制"的可交互网页环境。基于这个流水线生成的 WebForge-Bench 包含 934 个任务,横跨 7 个领域和 3 个难度等级。

## 三难困局到底是什么

论文把现有基准分成两类:

![WebForge: Generating Browser Agent Benchmarks That Are Realistic, Reproducible, and Scalable at the Same Time — overview diagram](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/webforge-generating-browser-agent-benchmarks-that-are_diagram.png)


- **真实网站类**(Mind2Web、WebVoyager、BrowseComp、GAIA):贴近真实网络环境,但任务会随网站内容漂移而失效——作者引用 Online-Mind2Web 的统计:Mind2Web 接近一半的原始任务在两年内已经过期;WebCanvas 报告其抽样的 Mind2Web 任务一年内有 12% 失效。同时评测一致性也成问题,BrowserArena 显示 GPT-4o 作为评判与人类一致率仅 68%。
- **沙盒受控类**(WebArena、VisualWebArena、WorkArena++、EntWorld):可复现,但环境太"干净"——没有弹窗、没有 cookie 同意框、没有网络延迟,而且需要昂贵的人工标注。

更深的问题是:即便是已经做了自动化生成的 BenchAgents、AutoBencher、DyVal、OS-Genesis,也都只覆盖非交互文本任务或缺少多维难度控制,没有谁真正生成出"完整可交互的网页环境"。

## 四个智能体的流水线

WebForge 把基准生成形式化为 $(d, l) \xrightarrow{f_{plan}} P \xrightarrow{f_{gen}} W \xrightarrow{f_{refine}} W^* \xrightarrow{f_{val}} \{0,1\}$。每个阶段由专门的智能体负责:

- **Plan Agent** 采用"双 LLM 双温度"策略:先用创造力导向的模型在高温(T=2.0)下起草,再用精度导向的模型在低温(T=1.0)下做逻辑校验和质量提升,且强制对原稿至少改动 30–50%。输出是带七维难度向量 $\delta \in \{1,2,3\}^7$ 的任务蓝图。
- **Generation Agent** 把蓝图实例化为可运行的静态网站。它会去真实网站(Amazon、Booking.com 等)抓取真实图片、商品信息、新闻文本作为内容素材,并参考真实网页学习视觉风格;通过 `localStorage` 模拟有状态交互(购物车、表单);所有静态 HTML 文件就是部署单元,打开即用。
- **Refinement Agent** 按 Assess→Plan→Execute→Verify 的方式对网站做规则驱动的修补,核心动作是注入**真实网络噪声**:弹窗广告、cookie 同意框、网络延迟模拟。这一步专门用来填平受控环境与真实网络之间的差距。
- **Validation Agent** 在与待测模型相同的 Chromium 浏览器引擎里实际执行解题路径,用 50 步上限和"3 次重试机制"过滤掉源代码层面看不出来、但渲染后无法完成的任务。

## 难度不再是单一标量

WebForge 显式定义了七个相互独立的难度维度:**Jump Depth**(跳转深度)、**Jump Breadth**(每页可选项数)、**Page Interaction**(单页交互复杂度)、**Visual Complexity**(视觉理解依赖)、**Info Complexity**(信息密度)、**Reasoning/Calc**(推理与计算)、**Risk Factor**(不可逆操作风险)。每个维度三档,总难度通过组合规则聚合:Level 1 最多两个维度在 L2、不允许 L3;Level 3 至少两个维度在 L3、且至少两个在 L2。论文把这七维设计称为"a priori 可控"——即在生成阶段就能定向施压,而非事后打分。

## 防作弊设计

值得一提的是论文采取的"final-state evaluation"范式:只比对智能体的最终输出与 ground truth,不监控中间步骤。为防止智能体绕过流程直接读源码作答,Generation Agent 把所有关键值(确认码、总价、目标日期)以 Base64 加密写入 `data.json`,并设置**欺骗性确认码**——如果用户选了非周六的合法日期、错误的餐饮选项或错误的人数,系统会返回格式相同但错误的代码(如 `GEG-2026-05842` 对应"非周六的合法日期"),让"看起来对了"和"真的对了"在最终输出层面就分得开。

## WebForge-Bench 上的实验结果

流水线生成 1,260 个候选任务,经 Validation Agent 过滤后 934 个进入基准,通过率 **74.1%**。论文评测了 14 个模型配置(含两个文本-only 变体)。

**总体表现**(Screenshot + DOM):

- Gemini-3-Pro 总分 **75.9%**,领先
- Claude-4.5-Sonnet **69.9%**
- Gemini-3-Flash **67.1%**
- Kimi-K2.5(开源最强)**66.4%**,反超闭源 GPT-5.2(59.5%)
- 最弱的 Qwen3-Omni-30B 仅 12.7%

**难度分层效果显著**:Level 1 上多数模型 ≥73%,到 Level 3 时强弱差距拉到 56 个点(Gemini-3-Pro 58.0% vs Qwen3-Omni-30B 2.4%)。论文以此论证七维难度框架确实在产生有判别力的难度梯度。

**跨领域揭示能力偏差**:把 D1–D7 七个领域分开看,信息检索(D4,56.9%)和内容创作(D7,57.2%)是最容易的——契合 LLM 的预训练分布;消费交易(D1,48.3%)和内容审核(D2,48.3%)是普遍最难的,前者因为"多步有状态工作流 + 不可逆操作"容错率极低,后者因为"政策导向的细微判断"在通用语料里训练不足。GPT-5-Mini 在 D4 上拿 73.8%,在 D3 上掉到 50.4%,跨域落差超过 23 点——这种"领域偏科"在单一聚合分数下完全看不见。

**视觉输入贡献了 14–16 个点**:把 Gemini-3-Pro 与 Gemini-3-Flash 切换成纯 DOM 输入后,准确率分别从 75.9%→59.2%、67.1%→51.2%,且差距随难度等级单调拉大(L1 约 6 点,L3 超过 20 点)。

**流水线消融**:在 210 任务子集上,完整流水线通过率 74.1%;去掉 Plan Agent 的二阶段精修后跌到 59.5%;再去掉 Refinement Agent 跌到 51.4%。论文据此论证两个阶段都不可裁剪。

## 论文承认的边界

作者把 *Sim-to-Real* 缺口单列一节,坦白指出三类无法忠实复现的场景:**实时信息**(秒级变化的股价、机票)、**真正的多用户交互**(协同文档编辑里的并发与冲突解决)、**持久的服务端状态**(数据库事务、回滚、跨会话一致性)。WebForge 的静态自包含设计能模拟轻量后端(用静态 JSON 模拟 API 响应、用 `localStorage` 近似有状态流程),但碰到上述场景就要靠未来扩展嵌入式无服务器函数或瞬态容器。

论文也承认维度并不完全正交:总难度的组合约束会引入维度间的协同上扬,Spearman 相关矩阵显示平均 $|\rho| = 0.495$。但作者强调,即便存在中等正相关,各维度仍呈现出不同的能力画像——Visual Complexity 给出的 L1→L3 落差最陡,Reasoning/Calc 在区分强弱模型上最有效。

## 一句话带走

如果一个浏览器智能体研究者关心"基准什么时候会被刷穿",WebForge 给出的答案是:别再追求单一聚合分数,改成"按维度、按领域看每个模型的能力切片",并用全自动流水线随时再造一批新任务——这意味着评测体系本身可以和模型一起持续进化,而不再被人工标注预算卡死。
