---
title: "pstack 完整指南（一）"
source: "https://x.com/poteto/status/2094457600259842065"
author:
  - "[[@poteto]]"
published: 2026-07-19
created: 2026-11-24
description: "在这个系列中，我将展示自己如何使用 pstack——我个人用于开展严谨工程工作的一套技能。它让我能够满怀信心地每月向生产环境交付 2,000 个 PR……"
tags:
  - "clippings"
date: "2026-11-27T15:03:19+08:00"
---
![图片](https://pbs.twimg.com/media/HQ_0MA_aMAA9zMt?format=jpg&name=large)

在这个系列中，我将展示自己如何使用 [pstack](https://x.ai/bot/plugin/9717366)——我个人用于开展严谨工程工作的一套技能。它让我能够满怀信心地每月向生产环境交付 2,000 个 PR。

![图片|863](https://pbs.twimg.com/media/HRD9GflbQAAKEXZ?format=jpg&name=large)

就我个人而言，我从未过分强调自己写了多少行代码、合并了多少个 PR。在 agent 出现之前，没有人在意这些数字，而且这种态度完全合理，因为原始产出量并不总能等同于质量，也不总能转化为用户可见的成果。它不过是一项虚荣指标。

但在构建 **pstack** 的过程中，我发现产出量确实很重要，尤其是当你能够借助 agent 维持甚至提升产品质量时。举例来说，我大约两个月前开始参与 Grok [@Bot](https://x.com/@Bot) 的开发，那时项目还处于早期，代码库很新，但已经开始增长。尽管团队不断壮大，如今每天要向 Grok [@Bot](https://x.com/@Bot) 代码库合并数百个 PR，**pstack** 仍让我能够为所有人保持高代码质量，因为我会持续监控代码、开展重构、添加新的 lint 和检查，同时也会开发功能。

> 8 月 21 日
> 
> 每个团队都需要一位园丁。这个人会静静地注视着涌入代码库的 PR 之流，察觉其中的坏味道：本周第三次出现的 isRecord，以及像常春藤一样在你精心规划的花园里蔓延的 lint 抑制注释。用一双稳健的手，清除那些终将吞噬……的杂草。

只有借助 **pstack**，我才能胜任 Grok [@Bot](https://x.com/@Bot) 的园丁和维护者。完成原型后，我们的早期发展势头非常强劲，也有许多人加入了团队。我迎来了一个关键的机会窗口：在整个代码库持续构建和扩展、且不停机的情况下，对它进行全面重构，使其建立在坚实的基础之上。无论有多少工程师（更重要的是，非工程师）参与贡献，这个高质量的代码库都能随之扩展。所有这些工作都要求我在 Grok Bot 的构建过程中不断重构并改善其基础；只有基础能力的提升跟得上贡献数量的增长，你才能做到这一点。

![图片](https://pbs.twimg.com/media/HRACOM4awAAPxUR?format=jpg&name=large)

Grok Bot 是市面上最高效、性能最出色的 AI 桌面应用之一

Grok [@Bot](https://x.com/@Bot) 本身就是最好的证明。接下来的几周里，我会告诉你使用 **pstack** 构建和维护高质量应用所需了解的一切。

# 第一部分——你只需要验证

工具箱中最关键的技能，是一项高质量的验证技能。这项技能非常重要，也需要精心维护，因此我把它视为关键基础设施，而不“只是”一项技能。一项优秀的验证技能会放大整个团队的产出，其中也包括非工程师。做得好，整个团队的产出可以提升到原来的 100～1000 倍。

如果你不熟悉这个说法，验证指的是 agent 能够验证自己的工作。它可以持续推进，直到成功完成任务，因为现在它无需让你成为瓶颈，就能自行完成反馈闭环。如果你想进一步了解我如何为 Cursor 创建第一项验证技能，可以阅读我之前发布的文章[《值得信任的循环》](https://x.com/poteto/status/2069824386283319343)。

## 让我们一起构建一项验证技能

首先，安装 pstack，然后运行 [/create-verification-skill](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)。我还建议把 [Dr Eggbot](https://x.ai/bot/93gOz3op1UQdBdbekQFLK) 加入你的机器人列表；它能帮助你创建高质量的机器人。Dr Eggbot 随 [pstack](https://x.ai/bot/plugin/9717366) 一起提供。它会教编程机器人如何使用 pstack，也能以同样严谨的标准创建非编程机器人。

你可以让 Dr Eggbot 为你创建一个工程师机器人，再让这个机器人运行 /create-verification-skill，并设置一项每天运行 /maintain-verification-skill 的例行任务。

![图片](https://pbs.twimg.com/media/HRBrZTOagAET8Vw?format=jpg&name=large)

我爱 Dr Eggbot

在它运行的同时，我们来看看这项技能会做什么，以及它如何为你创建一项高质量的验证技能。

我把我们用于构建 Grok [@Bot](https://x.com/@Bot) 和 Cursor 的所有验证技能提炼成了这项技能，可以把它看作一种元技能。它会教你的 agent 如何为你自己的应用创建一项高质量的验证技能。

接下来，技术栈的选择就很重要了。例如，如果你正在构建 Electron 应用或 Web 应用，就可以利用 JS 生态系统中丰富的调试工具。比如，[Chrome DevTools Protocol（CDP）](https://chromedevtools.github.io/devtools-protocol/)能让你使用与浏览器开发者工具相同的工具链。如果你正在构建 iOS 应用，则可以利用模拟器。

理想情况下，你应当能够与应用交互、调试应用、采集性能跟踪，并使用手动开发应用时通常会用的其他调试和开发工具。如果没有可供利用的丰富运行时，你可能需要让 agent 为你创建工具（例如使用 lldb，或创建一个在开发环境中作为边车运行的自定义软件包），也可以直接利用现有条件。

我个人认为，agent 验证实在太过重要，因此我会非常认真地建议你构建自己的丰富调试工具，甚至改选另一种技术栈，以便在软件开发中获得不公平的优势和极高的生产力。如前所述，让 agent 能够验证自己的工作，就能让组织中的每个人都有能力参与贡献，并验证自己的更改确实有效。你的技术栈越难调试和控制，就越难借助 agent 实现高生产力。

**确保可复现**

在 **pstack** 中，我们有一条名为[“打造杠杆”（Build the Lever）](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-build-the-lever/SKILL.md)的原则。在创建技能的语境下，这意味着我们更愿意为 agent 提供工具，而不只是 Markdown。对验证技能而言，这意味着要创建一个小型 CLI，把应用交互和调试操作脚本化，封装成一个对 agent 友好的小工具。这样一来，agent 执行任务时消耗的 token 更少（运行一条 CLI 命令，而不是编写一次性脚本来点击某个东西），你的验证技能也会更具可复现性和可测试性。

下面是一个假设的示例，展示 agent 可能为 Electron 应用创建怎样的 CLI：

```shell
# 健康检查
node .cursor/skills/verify-atlas/control-atlas.mjs doctor

# 打开一个空白会话并发送消息
node .cursor/skills/verify-atlas/control-atlas.mjs new-session
node .cursor/skills/verify-atlas/control-atlas.mjs send "list open tasks in this project"

# 键盘操作路径
node .cursor/skills/verify-atlas/control-atlas.mjs press "Meta+KeyN"

# 实时 UI 的无障碍快照
node .cursor/skills/verify-atlas/control-atlas.mjs snapshot

# 截图作为证据
node .cursor/skills/verify-atlas/control-atlas.mjs screenshot /tmp/atlas-proof.png

# 等待流式输出 / 布局稳定
node .cursor/skills/verify-atlas/control-atlas.mjs wait-settle

# 为当前会话切换功能开关
node .cursor/skills/verify-atlas/control-atlas.mjs feature-flag rooms_v2 on
```

现在，所有 agent 都可以使用这个 CLI 快速浏览和调试你的应用。你还需要开始思考应用开发过程中的开发体验：

- 向开发数据库填充种子数据
- 如何处理身份验证、测试用户，以及针对测试 / 预发布环境的 API 调用
- 以一致的方式安装并启动开发环境

无论如何，在你自己编写代码时，这些事情很可能就已经需要考虑。因此，可以把它看作 agent 在你的应用上开展开发工作的主要工具。请好好维护并测试它！

你还可以考虑下面一些命令示例：

```markdown
- **检查：** `info`、`snapshot`、`screenshot`、`components`
- **导航：** `home`、`new-session`、`select-project`、`select-runtime`、`scroll`
- **交互：** `send`、`click`、`click-xy`、`aria-click`、`type`、`press`、`eval`、`upload-image`、`add-context`、`feature-flag`
- **性能：** `trace`、`profile`、`record`、`perf-metrics`、`wait-settle`
- **流式输出：** `console`、`network-log`、`network-summary`
- **健康检查与清理：** `doctor`、`cleanup`、`watch --restart`
```

完成这套基础配置后，你应该已经能看到 agent 的显著进步。它们应当能够轻松地在应用中四处导航并进行调试。

我建议先花时间把这个 CLI 做好，消除其中的错误，再尝试更高级的功能。你还需要考虑（或让 agent 考虑）如何设计一个对 agent 友好的 CLI。网上有许多资源可以提供给 agent 参考，而我最看重的关键特性是：

- API 易于组合——想想 John Ousterhout 的深模块哲学
- 任何可能产生破坏性副作用的命令都应提供 --dry-run 选项
- 利用子命令逐步展示功能，而不是一次性全部列出
- 错误信息应当非常明确，并告诉 agent 接下来该做什么
- 丰富的 --help 帮助文本
- 以机器可读的形式返回输出（例如 JSON）

**借助**[云端 agent](https://cursor.com/docs/cloud-agent)**并行提速，而不是使用 worktree**

当你已经成功运行验证技能并合并了几个 PR 后，可能会开始思考能否进一步提高并行度。例如，如果 agent 现在能够接受你的提示，并基本独立地把工作推进到可合并状态，这不就意味着你有余力运行更多 agent 了吗？

你的第一反应可能是增加 worktree 支持，也就是让 agent 使用 git 创建一个受版本控制的仓库副本，在其中独立于主工作区进行更改。理论上，这能让你同时运行多个 agent，而它们的更改不会相互覆盖。

我不建议这样做。首先，它会占用你机器上大量的存储空间和资源。根据仓库大小和机器性能，你或许可以通过 worktree 并行运行最多 10 个 agent。但还有一种好得多的办法！

Cursor 的[云端 agent](https://cursor.com/docs/cloud-agent)运行在 Cursor 基础设施的云端。这些 agent 可以访问一台真实的计算机，也就是说，它们能够安装依赖、运行你的应用、录制视频和截图，并像真实用户一样与应用交互。如果你在上一步投入了足够精力，把开发体验做好了，那么配置云端 agent 应该也不会太费力。首次配置云端环境时，我们会派一个 agent 来帮助你正确完成设置并使其正常运行。首次构建后，我们会制作一份[快照](https://cursor.com/docs/cloud-agent/builds)，这意味着后续云端 agent 的每次运行都能快速启动。

我强烈建议花时间配置云端 agent，因为它能通过并行执行大幅提升生产力。在后面的文章中，我会展示自己如何在云端并行运行数百个子 agent！不过现在，先配置好环境，让它达到足以让你有信心在云端运行所有 agent 的状态。

**用功能地图让 agent 保持聪明**

随着应用变得越来越复杂，agent 需要更多指导，才能找到各项功能并与之交互。为此，我提出了一种称为“功能地图”（Feature Map）的东西。顾名思义，它是一张易于搜索的地图，收录应用中的所有功能、各项功能的作用，以及如何从用户视角找到它们。

这是我为一个名为 Atlas 的虚构应用准备的[功能地图示例](https://github.com/poteto/verification-skill-example/blob/main/.cursor/skills/verify-atlas/references/features/README.md)。它只是几份 Markdown 文件，并在验证技能的 SKILL.md 中被引用。

你可以把这些文件放在任何位置，不过 /create-verification-skill 会自动创建一个 references/features 目录，并在其中生成 README.md。README 本身就是地图：高层次概览所有主要功能，并链接到具体细节。单项功能的示例如下：

```markdown
# 偏好设置

全屏偏好设置浮层及其选项卡组。

## 子功能

- settings-overlay：通过齿轮图标或 Cmd/Ctrl+, 打开的全屏浮层
- settings-nav：左侧选项卡导航（General、Appearance、Models、Plan & Usage……）。
- settings-search：浮层内搜索（设置打开时按 Cmd/Ctrl+K）。
- theme-picker：Appearance 中的快捷主题控件。

## 如何找到它（用户视角）

点击账户头像旁边的齿轮图标，或按 Cmd/Ctrl+,。从左侧导航中选择一个选项卡。在偏好设置搜索框中输入内容即可跳转。按 Escape 或关闭控件可退出。

## 使用 control-atlas 驱动它

bash
node .cursor/skills/verify-atlas/control-atlas.mjs press "Meta+Comma"
node .cursor/skills/verify-atlas/control-atlas.mjs snapshot
node .cursor/skills/verify-atlas/control-atlas.mjs press "Escape"


- 浮层根节点：在 a11y 树中查找名为 Preferences 的对话框或区域。
- 选项卡：按可见名称点击。在某些账户状态下，Plan & Usage 可能不会显示。
- 设置打开时，Cmd/Ctrl+K 对应的是偏好设置搜索，而非全局命令面板（参见 `multi-surface-journeys.md`）。

## 注意事项

- 在测试套件运行途中关闭设置，可能会让焦点丢失。`new-session` 或 `home` 可以恢复。
- 某些选项卡受账户权益限制。跳过时应明确说明账户方面的原因。
```

不必担心需要自己编写这些内容！运行 **/create-verification-skill** 时，agent 会自动遍历你的应用，为所有内容编目并创建这些参考文件。

功能地图与 CLI 相结合，是 pstack 验证技能如此出色的主要原因之一。agent 现在掌握了每一项功能及其入口的上下文，既能节省上下文窗口中宝贵的 token，又能准确了解各项功能的用途和访问方式。

你可以把功能地图看作一种“物化记忆”。如果你已经使用 agent 一段时间，大概率熟悉记忆这个概念——它通常可能存储为简单的 Markdown 文件（例如 Obsidian 仓库），也可能是向量数据库之类更复杂的东西。我个人认为，代码库本身就是记忆的终极形态。代码是你和团队所做决策的投影，也是既成事实和实际工作方式的唯一事实来源。功能地图只是它的一种更紧凑的形式，专为节省 token 而设计。而且，因为它只是技能中的 Markdown，所以所有为代码库做贡献的人都能从这份共享记忆中受益。

这意味着维护验证技能确实非常重要。我建议每天至少运行一次 **/maintain-verification-skill**，确保 agent 始终掌握控制应用的最新细节。随着你越来越多地使用验证技能，你可能还会发现，agent 在开发应用时会自动更新它们。/maintain-verification-skill 则会补齐所有遗漏。

# 如何使用你的验证技能

作为参考，这里有一项为虚构应用创建的验证技能示例：[https://github.com/poteto/verification-skill-example](https://github.com/poteto/verification-skill-example)。再次提醒，运行 **/create-verification-skill** 即可创建一项这样的技能，其中包括基础 CLI 和功能地图。

下面介绍我通常如何在 **pstack** 中使用它。

首先，当然是用 **/poteto-mode** 作为提示词的开头。如果你通过 Cursor 使用 pstack，在自动补全 /poteto-mode 后，也可以按 Opt + Enter，而不只是按 Enter——这会把该技能添加为[自定义模式](https://cursor.com/changelog/08-19-26#custom-modes)，从而固定这项技能，让 agent 在每一轮新对话中都会收到使用它的提醒。

![图片](https://pbs.twimg.com/media/HRAqVoyb0AEwvnc?format=png&name=large)

输入 /poteto-mode 并按 Opt + Enter，将其固定为自定义模式

在 Grok [@Bot](https://x.com/@Bot) 中，安装[这个插件](https://x.ai/bot/plugin/9717366)，然后输入 /poteto-mode。

![图片](https://pbs.twimg.com/media/HRArLIFa4AApHT3?format=png&name=large)

你也可以在 Grok Bot 中使用 pstack！

**示例：构建新功能**

构建新功能时，我通常会把验证技能与 /poteto-mode 搭配使用，让 agent 验证自己的工作。例如，我可能会这样提示：

> /poteto-mode 构建 \<功能描述及任何有用的上下文>。使用 /control-app 验证你的更改，并向我展示视频和截图作为证明

其中，/control-app 是 /create-verification-skill 的产物。在 Grok [@Bot](https://x.com/@Bot) 中，我会这样提示：

> 派生一个云端 agent，使用 /poteto-mode 构建 \<功能描述及任何有用的上下文>。使用 /control-app 验证你的更改，并向我展示视频和截图作为证明

这里有一个小区别：在 Grok [@Bot](https://x.com/@Bot) 中，你会让机器人派生一个云端 agent，而不是亲自完成工作。我偏好这样做的主要原因是，它能让你的机器人腾出手来做其他事情，并保持其上下文窗口整洁。从这个意义上说，我把自己的机器人更多看作负责管理和监督云端 agent 的协调者。云端 agent 还意味着，你可以利用 Cursor 提供的完整模型阵容，而这些模型各自拥有独立的机器，因此你的机器人所用的计算机也能空出来处理其他事情。

**示例：性能优化工作**

> 派生一个云端 agent，使用 /poteto-mode 改善我们应用的初始加载时间。首先使用 /control-app 采集现状的性能跟踪，找出改进机会。然后进行有针对性的修复，并使用 /control-app 和 [/swarm](https://github.com/cursor/plugins/blob/main/pstack/skills/swarm/SKILL.md) 确认优化效果

[/swarm](https://github.com/cursor/plugins/blob/main/pstack/skills/swarm/SKILL.md) 是最适合与验证技能搭配的技能之一。它可以派出任意数量的云端 agent 来运行你的验证技能，因此你可以用足够大的样本量确认性能提升，也可以对应用进行模糊测试，确保没有破坏任何功能或引入回归。

**示例：自动复现用户报告**

当你对验证技能感到满意后，就可以把它们放进 Grok [@Bot](https://x.com/@Bot) 的例行任务或 [Cursor Automations](https://cursor.com/docs/cloud-agent/automations) 中。例行任务和自动化功能既可以按计划运行，也可以在事件发生时触发。

例如，如果你会把用户反馈导入 Slack，并且 / 或者拥有自己的内部反馈渠道，就可以让机器人监听每一条报告，并自动派云端 agent 尝试复现。如果你的验证技能和功能地图足够好，你甚至可以进一步决定让系统自动修复问题。

我之前说验证是工具箱中最重要的技能之一，是有原因的。它为你构建其他技能和例行任务奠定了基础。最重要的是，团队中的每个人都能从中受益。

# 投资你的验证技能

创建验证技能后，要使用 /maintain-verification-skill 让它保持锋利。持续改进 CLI，并像对待关键基础设施一样投资这项技能。你甚至可能想为它安排值班轮换——它对于释放团队 100～1000 倍的生产力就是如此重要。

这项技能是我们将在 **pstack** 指南中介绍的许多其他技能的基础，并且能与它们完美组合。

- pstack：[https://x.ai/bot/plugin/9717366](https://x.ai/bot/plugin/9717366)（[GitHub 链接](https://github.com/cursor/plugins/tree/main/pstack)）
- Dr Eggbot：[https://x.ai/bot/93gOz3op1UQdBdbekQFLK](https://x.ai/bot/93gOz3op1UQdBdbekQFLK)

我建议把 [Dr Eggbot](https://x.ai/bot/93gOz3op1UQdBdbekQFLK) 加入你的机器人列表；它能帮助你创建高质量的机器人。Dr Eggbot 随 pstack 一起提供。它会教编程机器人如何使用 pstack，也能以同样严谨的标准创建非编程机器人。

你可以让 Dr Eggbot 为你创建一个工程师机器人，再让这个机器人运行 /create-verification-skill，并设置一项每天运行 /maintain-verification-skill 的例行任务。

感谢阅读，敬请期待第二部分！
