# 让评估器自己进化:ADRS 如何把 LLM 推向数据库优化的前线

![Co-Evolving the Evaluator: How to Make AI-Driven Research Actually Work for Databases](/images/blog/co-evolving-the-evaluator-how-to-make-ai-driven-research.png)
*Image from [https://arxiv.org/pdf/2604.06566](https://arxiv.org/pdf/2604.06566)*


数据库性能优化长期受困于人力瓶颈,而把 LLM 接入"自动算法发现"循环——即所谓的 AI-Driven Research for Systems (ADRS)——本可以把这件事自动化,但论文指出真正卡脖子的不是生成,而是评估:LLM 几分钟就能产出几百个候选方案,人工搭好的评估器跟不上。来自 UC Berkeley、KTH、Meta、Workday、密歇根大学和 Maven AGI 的 Cheng 等人在这篇 PVLDB 文章中提出,把评估器本身当作一个可演化对象,与解一起共同进化,并通过三个数据库经典问题验证这一思路。

## 论文要解决的核心矛盾

ADRS 的标准流程是 LLM 生成候选代码 → 评估器打分 → 反馈进入下一轮提示。作者强调,在数据库领域这个评估环节比在其他系统问题里更难:数据库状态相关、组件耦合紧、搜索空间巨大。文中以 PostgreSQL 为例:改一次 buffer 替换策略,要重新编译 (~3 分钟)、装载 TPC-H SF=10 数据 (~30 分钟)、跑 workload (~30 分钟),单轮超过一小时,数百轮根本不可行。

![Co-Evolving the Evaluator: How to Make AI-Driven Research Actually Work for Databases — overview diagram](/images/blog/co-evolving-the-evaluator-how-to-make-ai-driven-research_diagram.png)


社区已有四类常用技巧来在"评估速度"和"评估保真度"之间取舍——模拟器、端到端性能模型、负载子集、搜索空间剪枝——但这些手段本身往往跟原问题一样难做。论文的提议是:让 LLM 在外层循环里自动设计、迭代这些评估手段,内层循环继续用现有 ADRS 框架(他们用了 OpenEvolve)生成解。

## 三个案例,三条经验

作者刻意挑了三个覆盖不同评估轴的问题。每个案例都给出一句口诀化的经验,并附上对照基线的实测数字。

### 案例一:Buffer Cache——"More is more",模拟器需要多组真值校准

**目标**:进化 PostgreSQL 缓冲池的淘汰策略,基线是 SOTA 的 PBM-Sampling [73]。

朴素做法是直接复刻 PostgreSQL 的内部结构去搭模拟器,但这样会把策略困在局部最优——PostgreSQL 的 buffer manager 看不到全局扫描进度等信息,模拟器一旦严格照搬,就发现不了像 PBM-Sampling 那样依赖未来访问估计的策略。

作者的做法是把模拟器加入外层循环:每轮基于 Clock、PBM-PQ、PBM-Sampling 三个真值基线的实现和性能数据,让 LLM 调整模拟器暴露的状态(扫描上下文、I/O 延迟、ring buffer、后台 writer)和评分函数(从单纯命中率改为按 100µs 随机读、200µs 脏页写来加权)。这一步避免了 LLM 写出"遍历整个 buffer pool"这种系统里行不通的伪解法。

最终进化出的策略综合了几点改动:空 buffer 快速路径加无锁采样、把 PostgreSQL 原生 Clock 的 usage_count 当作 tie-breaker、对 clean/dirty 页分别维护最佳候选并优先淘汰 clean 页。在 c5.18xlarge、TPC-H SF=10 上测得 **命中率最高提升 19.8%,I/O 体积最高降低 11.4%**。

### 案例二:Index Selection——"Mind the gap",得对着真实延迟进化

**目标**:在 PostgreSQL 14 上进化索引选择策略,基线是综述 [22] 中表现最好的四个启发式算法 Extend、AutoAdmin、Anytime、DB2Advis。

最初按照惯例用优化器估算的"计算成本下降"作为适应度——结果误导了搜索。作者举的反例:DB2Advis 在 TPC-H 上把估算成本压低 49.7%,延迟反而比 Extend 慢 8%。原因是计算成本模型忽略缓存、I/O 权重固定、对相关谓词和多表 join 估行偏差大。

外层循环因此被设计成不断调整"什么算合适的代理指标"。一开始尝试加权混合、按存储大小惩罚等组合,最后实证发现:**只要把测量噪声治住,纯延迟就是最稳的信号**。但中位数去噪不够,作者发现单次执行间的方差经常大于算法间的差异,根因是缓存抖动和后台进程干扰。外层循环最终设计了一个"按固定顺序、单 query 隔离 warm-up 再 benchmark"的测量协议。

进化出的策略本身复用了几个搜索效率上的最佳实践(成本记忆化、按 benefit/size 预排序、前缀剪枝+top-K seeding),并加入一个新启发式:用 workload-derived 的"表重要性"做 √(cost_table / cost_max) 的乘数加成,把传统计算成本模型容易低估的中心维表抬起来。

实测结果(TPC-H 和 TPC-DS,500MB 索引预算):**TPC-DS 延迟比最佳基线低 6.3%,TPC-H 低 5.8%,索引选择时间在 TPC-H 上 3.4s vs Extend 的 7.3s,快 2.2 倍**。值得注意的是,该策略在 TPC-DS 上比 Extend 多牺牲了约 9 个百分点的"估算成本下降",却跑得更快——再次印证了优化器估算并不是好的代理。

### 案例三:Query Rewrite——"Go off what you know",从已知的胜利里扩展

**目标**:在 PostgreSQL 17 + Apache Calcite 上进化一套确定性查询改写策略,基线是 R-Bot [66](运行时跑 LLM,用 RAG 取 rewrite recipe)。

直接套 ADRS 在这里几乎跑不动:rewrite 规则数量大,组合爆炸,作者自己也承认"识别最优重写规则集是 NP-Hard"。作者把外层循环用在两件事上:**自动选 workload 子集(技巧 3)和自动剪搜索空间(技巧 4)**。每一轮 LLM 不是盲目枚举,而是基于上一轮哪些 query×rule 组合赢了,主动去测结构相似的 query;同时用三种剪枝——按 query 特征过滤无效规则(没子查询就别测子查询规则)、把规则按预处理/结构变换分阶段、把回归过的组合从未来轮次中排除。

外层循环逐步堆出一个"query 特征 → 高性能规则序列"的经验数据集,内层循环再据此合成一个在 Calcite HepPlanner 中执行的策略。最终策略的特点包括:针对自连接禁用 subquery unnesting、把 filter pushdown 与有针对性的 join 重构组合(对多 join 的 query 最高 10.8× 加速)、对复杂 filter 子句统一应用化简规则。

实测(TPC-H 22 模板、DSB 37 模板,SF=10):**单纯 query 延迟在 TPC-H 上比 R-Bot 平均快 2.6×、DSB 上快 4.0×**。把 rewrite 本身的耗时也算进去,**整体延迟在 TPC-H 上比 R-Bot 快 9.0×、DSB 上快 33.9×**——R-Bot 每个 query 在运行时就要花一分多钟跑 RAG 和 LLM,反而比 PostgreSQL 自己慢 6.7×~12.9×。这是论文反复强调"白盒可部署代码"相对于"运行时调用 LLM"的根本优势。

## 论文没有声称的部分

作者明确把范围圈定在"性能问题":生成的算法语义保持不变,正确性容易验证(buffer 替换不会改变查询结果,索引选择不改变结果,query rewrite 通过逐 query 比对结果行)。**论文没有声称这套方法可以直接搬到并发控制、WAL 等需要严格语义保证的子系统**——他们把这些列为 future work,需要把形式化验证或 fuzz 测试纳入评估器。文中也提到 ADRS 在更复杂的应用语义层面(比如金融应用里隐式表达的"不能透支")面临"规范从哪来"的问题。

另一处需要留意的尺度:三个案例的训练/测试都在 TPC-H、TPC-DS、DSB 这一类标准分析型基准上,且都在同一台 c5.18xlarge EC2 上跑。论文展示了 TPC-DS 上训练的索引策略能迁移到 TPC-H,但跨硬件、跨系统(非 PostgreSQL)的泛化能力没有数据支撑。

## 一个被作者顺手提起的更大问题

文章最后一节提出一个值得记住的观点:既然 ADRS 依赖"评估器能稳定地排序候选解",而数据库为了榨性能往往做得高度耦合且难以预测,那么**未来面向 ADRS 的数据库,可能要主动牺牲一部分开箱即用的效率,换来更模块化、更可预测的接口**——把查询优化器、buffer pool 等核心组件以可替换接口暴露出来,让 AI 自由地重写、评估、替换。这呼应了 Lakebase [16] 这类去耦合数据架构的趋势。

## 一句话外带

论文真正的贡献不是某个新算法,而是把"如何让评估器跟上 LLM 生成速度"这一具体工程问题,转化成了一个可以被 LLM 自身解决的元问题——三个案例把这条思路落到了可复现的数字上。下一个问题自然是:在涉及正确性、不只是性能的数据库子系统里,这套"共进化"还能不能成立?
