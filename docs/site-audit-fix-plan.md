# Site Audit Fix Plan

更新时间：2026-04-25

目标：清理 quickgetwell.com 上线站点里不该出现的内部话术、模板拼接错误、未实现交互和可信度缺口。优先处理会让用户立刻觉得“这是批量 SEO 站”的问题。

## Agent 分工

| Owner | 写入范围 | 目标 |
|---|---|---|
| Template agent | `generate-pages.js` | 首页话术、结构化数据、文章页信任信息、敏感页免责声明、复制按钮可访问标签 |
| Finder agent | `script.js` | Finder 生成逻辑、`I can I can`、`a email`、topic search 空状态、按钮反馈 |
| Style agent | `styles.css` | 移动端导航、移动 H1、eyebrow 对比度、复制操作视觉 affordance、空状态样式 |
| Content agent | `content/pages.js` | 高风险页面 FAQ 去模板化、明显拼接错误、敏感措辞降风险 |

## P0：上线事故感问题

| 问题 | 当前表现 | 修复 | 验收 |
|---|---|---|---|
| 首页出现 SEO 内部话术 | `Long-tail pages built around real moments.` | 改成用户语言，例如 `Find the right words for the moment.` | 线上首页不再出现 `Long-tail` |
| Instead 页 FAQ 拼接错误 | `What is a good what to say instead of get well soon?` | 改成 `What is a gentler alternative to "get well soon"?` | 对应页面 HTML 不再出现错误句 |
| Finder 帮助文本重复 | `I can I can cover Monday's meeting...` | 检测用户输入已含主语/动词时不再追加 `I can` | 输入 `I can cover Monday's meeting` 不重复 |
| 英语冠词错误 | `a email format` | 改成 `an email` 或自然句式 | 搜索线上 HTML 不再出现 `a email` |
| 不真实 SearchAction | JSON-LD 指向 `/?q=`，但没有搜索结果页 | 删除 `potentialAction.SearchAction` | 首页 JSON-LD 不再声明站内搜索 |

## P1：信任和 SEO 质量

| 问题 | 风险 | 修复 | 验收 |
|---|---|---|---|
| 医疗敏感页免责声明太弱 | cancer、serious illness、surgery、hospital stay、flu 需要更谨慎 | 在敏感页正文前增加写作指导说明，避免医疗建议误解 | 这些 slug 页面首屏后能看到 disclaimer/note |
| Article schema 与页面可见信息不匹配 | author/publisher 没有可见责任说明 | 增加可见 `Reviewed for tone and sensitivity`、`Last updated: April 2026`，并同步 JSON-LD date | JSON-LD 与页面可见信息一致 |
| FAQ 高度重复 | programmatic SEO 信号强 | 先重写 6 个重点页面 FAQ | 重点页面 FAQ 不再全是通用问题 |
| 敏感措辞接近疗效承诺 | `fever breaks`、`guide your healing` 等 | 改成情感支持，不承诺结果 | 重点页面不出现强结果承诺 |

## P2：交互和可访问性

| 问题 | 当前表现 | 修复 | 验收 |
|---|---|---|---|
| 移动端导航消失 | 小屏只有品牌，没有跳转入口 | 保留紧凑导航或可换行导航 | 375px 仍能看到 Finder/Situations/FAQ 等入口 |
| 复制按钮可访问名称重复 | 多个 `Copy message` | 加唯一 `aria-label` | 动态按钮 aria-label 包含消息片段 |
| Topic search 无空状态 | 搜不到时列表直接消失 | 显示 `No topics found...` | 输入无匹配词能看到空状态 |
| 复制卡片不像可点击 | 文章页消息块像普通文本 | CSS 增加明确复制 affordance | 文章页消息块可见 `Copy message` 提示或类似标识 |
| Eyebrow 对比度偏低 | Lighthouse color contrast | 加深浅背景 eyebrow 色值 | Lighthouse/人工检查更易读 |
| 移动端 H1 压迫 | 长标题 4 行且行距紧 | 小屏降低字号并提高 line-height | 375px 下标题不拥挤、不溢出 |

## P3：后续内容质量

这批先不一次性重写 33 页。后续需要继续做：

- 关系类页面：mom、dad、grandma、grandpa、sister、brother、wife、husband 分别增加独特语气边界。
- 工作类页面：coworker、boss、client 增加职场压力、隐私和团队卡片差异。
- 语气类页面：funny、religious、prayers 增加使用边界，避免冒犯或暗示疗效。
- sitemap：考虑移除统一 `priority`，避免所有文章页同权重的批量信号。
- meta descriptions：从关键词列表改为自然描述。

## 发布验收

每次集成后必须跑：

```powershell
npm run check
```

线上部署后检查：

```powershell
Invoke-WebRequest -Uri "https://quickgetwell.com/"
Invoke-WebRequest -Uri "https://quickgetwell.com/what-to-say-instead-of-get-well-soon/"
Invoke-WebRequest -Uri "https://quickgetwell.com/get-well-soon-messages-for-cancer/"
Invoke-WebRequest -Uri "https://quickgetwell.com/sitemap.xml"
```

浏览器 QA：

- 首页控制台无 error/warn
- 首页不出现 `Long-tail`
- Instead 页不出现错误 FAQ
- Finder 不生成 `I can I can`
- 375px 移动端仍可导航
- topic search 无结果时有空状态
