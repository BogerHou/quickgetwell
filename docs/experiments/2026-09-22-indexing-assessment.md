# 新资源页索引评估

日期：2026-09-22。用户已同意完善新页面，并开放正式资源页索引。本记录评估内容用途与索引分工，不代表页面已发布或已被搜索引擎收录；实际模板、sitemap 和线上状态由主任务检查。

结论：教师 PDF 落地页、加入实用短指南后的职场生病回复专题页允许索引；五个单题练习继续可访问并使用 `noindex,follow`；纯导航 `/resources/` 暂维持 `noindex,follow`。这是本站的编辑和信息架构选择，不是 Google 要求短页面或练习一律 noindex。

## 判断依据与规则边界

- 按页面是否完成一个独立任务、是否为直接到访者提供明确用途、与已有页面的分工判断；不设最低字数。Google 明确没有偏好的字数，并强调原创价值、明确标题、站点主题及读者能否完成目标。[Google：以用户为中心的内容](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- `noindex` 需要搜索引擎能抓取页面才能识别，不能同时用 robots.txt 阻止抓取。PDF 可通过 HTTP `X-Robots-Tag` 控制；HTML 落地页是否开放索引，与下载文件的配置是两个决定。本评估不要求改变 PDF 索引策略。[Google：阻止内容编入索引](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- 不把自引用 canonical 当作索引批准，不把添加 sitemap 等同于已收录。上线后的实际响应与索引状态仍需单独核查。本轮也没有取得搜索量、Search Console 查询数据或学习效果测试数据。

## 资源与专题页

| 页面 | 本轮判断 | 用户任务与独立价值 | 证据边界 |
| --- | --- | --- | --- |
| `/resources/teacher-care-pack/` | 允许索引 | 组织全班为生病的老师送卡：选择纸型、查看四页内容、邀请同学、打印并增加签名空间。组织页和可重复签名页使它超出原教师例句页的查句任务；两张卡片沿用已有设计应继续明示。标题和首屏须明确是送给生病老师的 get-well 卡片包。 | 对完成任务的判断来自当前页面和可下载资源；没有证明用户偏好这个纸质方案，也没有承诺流量或下载量。 |
| `/practice/workplace-english/` | 加入短指南后允许索引 | 帮助非母语读者判断职场生病告知、慰问及感谢回复的语气，先用三个检查选择措辞，再进入五个情境。即使暂不做题，读者也能获得可操作的方法；与原有例句页的直接查找、复制用途有区别。名称应限定 illness/get-well replies，避免暗示涵盖面试、谈判等泛商务英语。 | 客户和上司的公开问题证明有人遇到这种表达困惑，不证明整个课程的需求量或教学效果。三步指南是本站编辑组织，不是来源机构认证的方法。 |
| `/resources/` | 暂 noindex，保留导航与访问 | 当前主要让读者在两项资源间选择；直接链接到资源本身可完成任务。作为站内目录仍有用。 | 导航型页面并非天然不适合索引；这里只是暂未建立独立于两个目的页的搜索用途，不能据此声称 Google 会惩罚导航页。 |

## 五个练习逐项判断

以下路径均位于 `/practice/workplace-english/` 下。每题都有独立可用的情境、选项解释与例句；保留 noindex 不否认其学习价值，也不因篇幅短而判定为低质量。

| 练习 | 直接线索与具体价值 | 独立索引判断及边界 |
| --- | --- | --- |
| `client-sick-reply/` | [EnglishLearning 原帖](https://www.reddit.com/r/EnglishLearning/comments/lbr195/what_to_say_to_someone_when_they_say_theyre_sick/)直接提出：非母语客户生病、回复变慢，怎样表示关心而不过度强烈。练习进一步让读者识别未经确认的期限承诺。 | 暂 noindex。需求线索在五题中较直接，但“不能更改期限”是新增题设；一题目前主要训练这个窄条件。现有客户例句页满足即时找回复，专题承接学习语气的任务，尚无证据需要第三个独立搜索入口。 |
| `boss-sick-notice/` | [The Workplace 原问答](https://workplace.stackexchange.com/questions/152034/how-should-i-reply-appropriately-if-my-boss-tells-me-that-they-are-sick-in-an-e)询问如何回复上司的直接生病邮件。题目训练保持已有称呼习惯、不擅自代表团队承诺代办。 | 暂 noindex。题目只处理平时用名字、没有待答工作问题、尚未安排代办的情况；它不是所有上司病假通知的完整指南。原问答含德国背景，不能扩展为普遍职场规则。 |
| `coworker-you-barely-know/` | [Hallmark get-well 指南](https://ideas.hallmark.com/articles/encouragement-ideas/get-well-wishes/)支持按收信者和情况选择留言。题目让读者区分适度温暖、未建立的亲密感和缺少共同背景的玩笑。 | 暂 noindex。与同事例句页有相近对象，独特价值在选项比较；“仅见过两次”等关系条件是本轮创设，来源并未证明用户在寻找独立的同类练习页。 |
| `signing-a-team-card/` | [GroupGreeting 官方 FAQ](https://www.groupgreeting.com/faq)说明多人签名及留言可见机制。题目区分个人署名与代表团队发言，帮助识别未经同意的集体承诺。 | 暂 noindex。产品机制证明这种共享空间存在，不证明所有平台都采用相同设置，也不证明该单题的搜索需求。目前作为专题中的群体语气练习最清楚；个人和集体口吻的教学区分是编辑判断。 |
| `thanking-work-well-wishers/` | [Hallmark thank-you 指南](https://ideas.hallmark.com/articles/thank-you-ideas/thank-you-messages-what-to-write-in-a-thank-you-card/)支持点明收到的具体善意。题目训练在仍不舒服、返岗日期未知时，只感谢团队送卡。 | 暂 noindex。它补足收信者视角，但题设仅处理感谢卡片，原有回复慰问页仍负责较广泛的即时措辞需求。将感谢与病情说明分开是编辑推断，不是免除工作通知义务的医疗、HR 或法律结论。 |

日后是否单独开放某题，应看它是否形成可独立完成的、区别于现有例句页及专题的任务，并结合真实读者反馈或查询线索重新判断。无需为了索引凑字数、复制例句或机械增加题量；也不能用尚未索引页面的“没有搜索曝光”反证用户没有需求。

## 本轮指南的来源与原创部分

新增 `content/workplace-guide.js`，固定导出 `guide`，含一段引言、三个步骤、一段使用说明和三项来源。正文围绕“目的和读者 → 已有关系 → 承诺与请求”展开，不扩展成泛英语课程，不重复五题例句。

| 来源 | 直接支持 | 本站应用与限制 |
| --- | --- | --- |
| [British Council：Email etiquette](https://learnenglish.britishcouncil.org/free-resources/business/english-emails/unit-9-email-etiquette) | 检查邮件收件人、留意 reply-all；简短邮件仍应礼貌友好。 | 用于检查慰问回复的读者范围。来源不是病假流程指南，也未验证本站三步法。 |
| [British Council：商务邮件称呼与语气](https://englishonline.britishcouncil.org/blog/articles/8-common-faux-pas-in-english-business-emails/) | 称呼与熟悉程度、正式程度有关。 | 以既有往来为线索选择语气，不照搬来源中的绝对措辞，也不把国家、职位当作唯一决定因素。 |
| [Hallmark：Thank-you messages](https://ideas.hallmark.com/articles/thank-you-ideas/thank-you-messages-what-to-write-in-a-thank-you-card/) | 感谢时提及具体收到的礼物或善意。 | 不必在感谢中加入未经确认的恢复或返岗日期，是结合题设作出的编辑判断；来源没有提供病假制度依据。 |

本轮重新打开核对 Google 两篇官方文档、British Council Email etiquette 及 Hallmark thank-you 正文；商务邮件称呼来源沿用前轮已核对记录，本轮再次抓取超时。五题原始来源的更完整边界见 [第一轮来源记录](2026-09-22-workplace-sources.md)。指南没有复制来源例句。

状态：AI 起草并核对来源，尚未完成真人英语编辑批准或目标学习者测试。用户允许开放索引，不等于已完成上述审核，也不据此添加虚假的专家审核或教学效果声明。本记录不新增发布审批门槛。

交付验证：运行 `node --check content/workplace-guide.js`；核对导出结构、恰好三个步骤及三项来源。此任务仅新增这两份文件，不更改模板或索引配置，不运行构建。
