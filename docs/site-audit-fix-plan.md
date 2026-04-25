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

## 2026-04-25 Second Pass

已继续补齐上一轮遗漏：

- 新增 `about`、`editorial-policy`、`contact`、`privacy` 四个信任页面，并加入页脚与 sitemap。
- 首页 33 个主题入口改为分组展示：Start here、Relationships、Health situations、Work, tone, and faith。
- topic search 会隐藏没有匹配结果的分组，降低目录页和批量 SEO 观感。
- sitemap 移除统一 `priority` 与 `changefreq`，保留稳定 `lastmod`。
- 文章页 hero 改为克制的非图片背景，不再所有页面共用同一束花图。
- 全部 33 个内容页都有页面专属 FAQ，不再依赖通用 FAQ 模板。
- 重写剩余关系类页面与通用页 meta descriptions，减少关键词枚举感。
- 继续处理 prayers、religious、injury、broken bone、coworker、boss、teacher 等页面，新增更贴合场景的 FAQ，减少 `smooth recovery`、`quick recovery` 等重复表达。

仍建议后续处理：

- 若后续有真实邮箱或表单，替换 Contact 页中的 GitHub correction channel。
- 继续人工提升高潜力页面正文，例如 surgery、cancer、coworker、friend，可加入更多真实场景分支和更具体的 message variants。

## 2026-04-25 Content Depth Pass

已继续优化高潜力页面：

- `get-well-soon-messages-after-surgery` 增加 practical help、longer recovery 分支，以及 surgery 场景选择模块。
- `get-well-soon-messages-for-coworker` 增加 Slack/Teams、after surgery at work 分支，以及 workplace 场景选择模块。
- `get-well-soon-messages-for-friend` 增加 practical help、long recovery、after surgery 分支，以及 friend 场景选择模块。
- `get-well-soon-messages-for-cancer` 增加 treatment、uncertain days、not close 分支，以及 cancer 场景选择模块。
- 新增可复用 `decisionGuide` 渲染模块，让重点页从纯消息列表变成“先判断场景，再复制合适措辞”的页面。
- 移除新增内容里的强恢复速度暗示，例如 `recover quickly`、`bounce back`、`beat it` 等表达。
- 浏览器抽查 390px、768px、1280px 视口，无横向溢出；控制台无错误。

## 2026-04-25 Multi-Agent Site Review Pass

已根据内容信任、SEO、UX/移动端、技术 QA 四个角度继续修复：

- Contact 页移除 GitHub/repository 入口，改成普通用户可理解的 `hello@quickgetwell.com` 邮件入口。
- About、Editorial Policy、Privacy 增加编辑责任、敏感页面检查、纠错流程、analytics 和 finder 输入说明。
- Privacy 明确 finder 的 name/help-offer 输入只在浏览器内生成消息，不通过表单提交，也不由 Quick Get Well 存储。
- Article title 增加 `| Quick Get Well`，提升搜索结果品牌辨识。
- FAQPage JSON-LD 从全站文章页收敛到 6 个核心页面，减少结构化数据滥用观感。
- Finder `Offer of help` 修复 `I can dinner` 病句；`dinner` 生成 `I can help with dinner`，`bring dinner` 仍生成自然动词短语。
- Finder 结果区不再整体 `aria-live`，只让短状态文本 live，降低屏幕阅读器噪音。
- `Use low-pressure wording` 不再偷偷把 situation 改成 serious，只调整 tone 并显示 active 样式。
- Topic search 增加同义词：operation/procedure、mother/mum、faith/religion、fracture/cast 等。
- 文章锚点增加 scroll padding / margin，移动端文章目录改横向 chips，减少首条 copy message 出现过晚的问题。
- 增加 reduced-motion 兜底，footer 链接触控高度，CSS/JS immutable cache headers，HSTS 和 Permissions-Policy。
- `validate-site.js` 增加用户可见禁用词扫描和 FAQPage schema 约束，防止 GitHub/repository 等开发者痕迹回归。
- `validate-finder.js` 扩展到 1080 组 finder 选择组合，并覆盖 help offer 语法。

仍建议后续处理：

- 对 15 个偏薄长尾页做内容加深或合并/noindex 决策，优先 short、flowers、client、teacher、dad/grandpa 等。
- 为每页维护独立 `datePublished/dateModified/lastmod`，避免未来批量刷新日期信号。
- 进一步做主题集群内链：serious illness hub、relationship hub、card/text/flowers hub。
- 若 `hello@quickgetwell.com` 暂未配置，需在 Cloudflare Email Routing 中创建并转发到真实邮箱。

## 2026-04-25 Multi-Agent UX/Trust Follow-Up

针对第二轮 agent 报告继续修复用户可见问题：

- 敏感页标题从关键词式 `Get Well Soon Messages for Cancer / Serious Illness` 改为更符合处境的 `Messages for Someone with Cancer / a Serious Illness`。
- Contact 邮箱不再在 HTML 源码里输出明文 `mailto:`，改为浏览器端拼接，避免 Cloudflare Email Obfuscation 生成 `/cdn-cgi/l/email-protection` 静态 404 链接。
- Finder 在 funny + surgery/hospital/serious/chronic 或 client/boss 等组合下，结果标题和 chip 使用实际生效 tone，不再显示 `Funny` 但输出 supportive/professional 文案。
- Finder 对 coworker/boss/client 的 religious tone 自动降为 professional，并提示只有确定对方欢迎宗教语言时才使用。
- Finder 增加短文案专用模板，`Make shorter` 后每条文案控制在短句范围内。
- Finder 复制前优先读取当前可见 message 文本，并增加清空 name/help 后不残留旧内容的回归断言。
- 所有 copy 按钮点击后都有可见反馈：toast 显示，按钮短暂变为 `Copied`。
- 移动端 Finder 恢复“筛选器 -> 快捷调节 -> 结果”的顺序，避免调节按钮被 6 条结果压到后面。
- topic search 改为按可见标题/摘要和显式别名匹配，减少 `surgery` 搜出无明显相关卡片的问题。
- 文章移动端目录从横向滚动改为自动换行 chips，触控目标提升到 44px。
- `search-index.json` 增加 `X-Robots-Tag: noindex`，静态资源规则也补齐安全响应头。
- 新增 `validate-live.js` 和 `npm run validate:live`，用于 Cloudflare 部署后验证线上 HTML 引用的 CSS/JS hash、Contact、禁用词和 search-index header。

本轮保留为后续的内容型问题：

- 低词数长尾页仍需要分批加深、合并或 noindex。
- 每页独立发布时间/修改时间仍未做。
- 主题集群内链仍可增强。
- 若未来要进一步增强 E-E-A-T，需要真实作者/编辑责任页，而不是伪造资质。

## 2026-04-25 Content Quality / Internal Link Pass

继续处理 SEO agent 提到的薄页和弱内链问题：

- 所有文章页新增同主题内链模块 `More in ...`，把 relationship、health situations、format、work/faith 等页面连成主题集群。
- 生成后的文章页不再有 0 入链页面，最低站内入链已提升到 4。
- 为 client、teacher、child、broken bone、flowers、short、text、religious、prayers、boss 等页面新增场景选择模块，强化“如何选对话术”的实用性。
- 为 injury、funny、card、grandpa、sister、brother、husband 等接近 500 词的页面补充更具体 FAQ。
- 生成后所有 33 个文章页可见词数都在 500+，当前最低页约 502 词。
- Article JSON-LD 增加 `mainEntityOfPage` 和 `image` 字段，减少结构化数据警告。
- `generate-pages.js` 已支持页面级 `datePublished/dateModified/updated`，sitemap 和 Article schema 会读取单页日期字段。当前内容仍按真实上线日默认，不伪造历史日期。
- `validate-site.js` 增加文章质量门槛：生成页低于 500 可见词或缺少 topic cluster links 会直接失败。

## 发布验收

每次集成后必须跑：

```powershell
npm run check
```

线上部署后检查：

```powershell
npm run validate:live
```

浏览器 QA：

- 首页控制台无 error/warn
- 首页不出现 `Long-tail`
- Instead 页不出现错误 FAQ
- Finder 不生成 `I can I can`
- 375px 移动端仍可导航
- topic search 无结果时有空状态
