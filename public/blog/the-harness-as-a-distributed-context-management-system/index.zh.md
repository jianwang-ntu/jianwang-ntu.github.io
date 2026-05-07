# Glean 把系统提示词砍掉了 45%:Tony Gentilcore 谈 harness 如何变成"分布式上下文管理系统"

![The Harness as a Distributed Context Management System](/images/blog/the-harness-as-a-distributed-context-management-system.png)

Glean 联合创始人 Tony Gentilcore 在 LinkedIn 上分享了一个看似反直觉的数字:他们把自家 agent 的系统提示词缩减了 45% 以上,但能力并未因此减少。Gentilcore 把这件事归因于 harness 设计正在发生的一次范式转变——当上下文管理成为主要工程挑战时,harness 本身正在演化成一个"分布式上下文管理系统"。

## 文中的核心观点

Gentilcore 写道,Glean 之所以能砍掉将近一半的提示词,关键不是"少做",而是"把能力从一次性塞进提示词里,改为按需渐进加载到 skills 里"。他把这种做法称为 *search-first skill discovery*,并把它列为 harness 设计中正在出现的四种转变之一:

- **Programmatic Tool Calling (PTC)**:不再让模型在对话中一轮一轮地决定调哪个工具,而是由 agent 写代码来直接编排工具调用。循环、条件分支、控制流都写在代码里,而不是塞进模型的推理链里。
- **用子 agent 隔离上下文执行**:把任务拆分给多个独立 agent,每个 agent 跑在自己的执行上下文与上下文窗口里,各自处理一小块问题。
- **Compaction(压缩)**:保留有承重作用的对话状态——意图、已做的决策、失败过的方案;把原始中间输出压缩成摘要或落到文件系统。
- **Search-first skill discovery**:agent 先搜索哪些 skill 与当前任务相关,只加载所需 skill 的描述,等真正要执行时才取回完整 schema,而不是一上来就把所有工具的完整 schema 灌进上下文。

## 作者给出的判断

Gentilcore 把这套思路总结为一句话:

> "随着长时间运行的 agent 普及,上下文也在膨胀。harness 的工作就是在正确的时间让 agent 关注正确的上下文。"

按他的说法,这正是 harness 已经变成"分布式上下文管理系统"的原因——上下文窗口仍然有限,但任务规模在持续增长,二者之间的张力必须由 harness 来吸收,而不是丢给模型自己处理。
