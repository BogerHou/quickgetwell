# Care Studio：插画与导出设计修订

用户反馈：第一版成品像表单和简单底图，缺少值得分享的设计。本轮优先重做成品，其次调整选款界面。

采用内置 Imagegen 生成三幅无文字插画，编辑文字由浏览器实时排版，不把用户输入发送给图片生成服务。三款分别为 Garden blooms（花束）、Little comforts（日常关怀）、Window light（窗边阳光）。保留原三个工具及固定反馈分类，旧文章与首页不改。

生产素材使用预先转换的同源静态 WebP，不调用 Vercel 图片转换，也不增加运行时生成接口。PNG 导出只在浏览器中合成。加载失败时明确提示并保留复制，不能把缺少插画的图片当成完成品导出。

## 素材与验收

| 设计 | 项目素材 | 大小 |
| --- | --- | --- |
| Garden blooms | [garden-v2.webp](../../assets/experiments/care-art/garden-v2.webp) | 225,050 字节 |
| Little comforts | [comfort-v2.webp](../../assets/experiments/care-art/comfort-v2.webp) | 183,450 字节 |
| Window light | [window-v2.webp](../../assets/experiments/care-art/window-v2.webp) | 226,924 字节 |

三幅原图均为 1122×1402；使用 Sharp 做 WebP 格式压缩，没有用程序绘制替代插画。原始无损图留在内置图片工具的生成目录，供后续重新编辑。导出画布为 1200×1500，保留可编辑标题、留言、称呼和署名，新增图像也纳入待人工审核的版本指纹。

实际检查：

- `npm run check` 全部通过；旧55个受保护文件逐字节一致，首页/教师页/sitemap保护边界未扩大。
- Chromium 实际下载三款卡片、帮助清单、联系便条及320字长留言，逐张检查插画、文字和留白，没有裁切或文字压住插画。
- 1440px桌面及390/320px手机无横向溢出；主题缩略图/select同步，重置后选中态一致。
- 打印媒体检查仅显示含插画的1200×1500成品，`afterprint`后恢复编辑器；不声称已测试实体打印机。
- 实际阻断插画请求后，PNG和打印禁用，复制仍可用且显示失败原因；延迟旧主题图片返回不会覆盖新主题和新草稿。
- 独立代码审阅和回归覆盖图片加载、解码、失败、主题竞态、固定统计参数、同源路径、体积及构建字节完整性。没有发送真实GA测试事件。
- 本次仅更新本地预览，未推送或上线；真人文案/插画审核状态未改变。为后续发布扩展了线上WebP MIME/字节校验，但未运行线上验收。
- 成品与桌面/手机验收图保留在 `output/care-studio-v2-2026-10-20/`，不进入Git；长文本一次性测试图已移入废纸篓，测试浏览器均关闭。4173预览服务继续用于查看修改。

## 最终生成提示词（内置工具）

### garden

Use case: illustration-story. Asset type: full-bleed artwork for a genuinely beautiful personal greeting card that someone would want to send. Portrait 4:5 aspect ratio. This is the flat finished artwork, NOT a photographed card or mockup, no perspective, no shadows outside the artwork. Art-directed contemporary gouache and cut-paper illustration with subtle tactile paper grain, confident elegant shapes, rich but restrained colour, intentional composition, adult boutique stationery quality. CRITICAL LAYOUT: the upper 58 percent, including the exact center, must be uninterrupted warm ivory paper with only extremely subtle texture; this is a legible type area where live editable text will later be placed. Illustration fills the bottom 40 percent lavishly and beautifully, not a tiny icon, with some very low outer-edge detail. Keep objects out of the upper text area. No lettering, no words, no numbers, no watermark, no logo, no border. Do not generate any card wording. Design Garden blooms: a generous informal bouquet of salmon-pink cosmos, butter-yellow ranunculus, tiny warm-white daisies and dark olive foliage, in a softly striped cobalt-blue ceramic pitcher. Close, expressive and asymmetrical arrangement in the lower left and lower middle, alongside a fallen petal and a curved green stem trailing toward the lower right. Warm ivory background across entire upper 58 percent. Deep blue, apricot, muted coral and leaf green, expressive opaque gouache, charming imperfections, clearly hand-painted. Flowers and pitcher should have strong visual presence and overlapping organic silhouettes, filling bottom 40 percent; no flat clipart.

### comfort

Use case: illustration-story. Asset type: full-bleed artwork for a genuinely beautiful personal greeting card that someone would want to send. Portrait 4:5 aspect ratio. This is the flat finished artwork, NOT a photographed card or mockup, no perspective, no shadows outside the artwork. Art-directed contemporary gouache and cut-paper illustration with subtle tactile paper grain, confident elegant shapes, rich but restrained colour, intentional composition, adult boutique stationery quality. CRITICAL LAYOUT: the upper 58 percent, including the exact center, must be uninterrupted warm ivory paper with only extremely subtle texture; this is a legible type area where live editable text will later be placed. Illustration fills the bottom 40 percent lavishly and beautifully, not a tiny icon, with some very low outer-edge detail. Keep objects out of the upper text area. No lettering, no words, no numbers, no watermark, no logo, no border. Do not generate any card wording. Design Little comforts: an inviting still life across the lower 40 percent: a terracotta ceramic cup of tea on a warm striped linen napkin, two clementines with a leaf, a closed sage-green book, one small flowering branch in a low blush bud vase. Beautiful carefully composed overlapping shapes, a quiet afternoon feeling, painterly colour-block tablecloth along the bottom edge. Gentle cream, deep russet, peach, pale sky blue and moss green. The still life should feel like a gift of everyday care. The upper 58 percent remains uninterrupted pale warm ivory paper, no steam or objects extending into the text area.

### window

Use case: illustration-story. Asset type: full-bleed artwork for a genuinely beautiful personal greeting card that someone would want to send. Portrait 4:5 aspect ratio. This is the flat finished artwork, NOT a photographed card or mockup, no perspective, no shadows outside the artwork. Art-directed contemporary gouache and cut-paper illustration with subtle tactile paper grain, confident elegant shapes, rich but restrained colour, intentional composition, adult boutique stationery quality. CRITICAL LAYOUT: the upper 58 percent, including the exact center, must be uninterrupted warm ivory paper with only extremely subtle texture; this is a legible type area where live editable text will later be placed. Illustration fills the bottom 40 percent lavishly and beautifully, not a tiny icon, with some very low outer-edge detail. Keep objects out of the upper text area. No lettering, no words, no numbers, no watermark, no logo, no border. Do not generate any card wording. Design Window light: a dreamy but sophisticated painted garden glimpse through an open powder-blue arched window, appearing only in the lower 40 percent. Ochre sunlight, a terracotta plant pot with small white blossoms on the sill, two swallows over distant soft sage hills, a pale apricot sky. The window, sill and foliage form one rich illustrated lower vignette, blending gently into uninterrupted warm ivory paper above. Keep the whole upper 58 percent empty for live type. Gouache with visible handmade edges and a little cut-paper texture. Calm, luminous, optimistic without clinical symbols or childish smiley faces.
