# Cloudflare Pages 上线教程

这份教程记录 quickgetwell.com 第一次上线时的完整流程和踩坑点。后续这个项目，或者类似的静态 SEO 站点，可以按这里走。

更新时间：2026-04-25

## 这次最终跑通的配置

项目仓库：

```text
https://github.com/BogerHou/quickgetwell
```

线上域名：

```text
https://quickgetwell.com
```

Cloudflare Pages 项目：

```text
quickgetwell
```

Cloudflare Pages 构建设置：

```text
Framework preset: None
Build command: npm run build
Build output directory: dist
Root directory: /
Production branch: main
Deploy command: 留空
Non-production branch deploy command: 留空
```

关键点：这个项目是静态站点生成器。Cloudflare 只需要执行 `npm run build`，然后发布 `dist` 目录。

## 本地上线前检查

每次改完内容或生成器，先在本地跑：

```powershell
npm run check
```

成功时会看到类似输出：

```text
Generated dist with homepage, 33 article pages, 404.html, _headers, _redirects, robots.txt, search-index.json, and sitemap.xml
Validated 33 generated pages and local links.
```

这个命令会做几件事：

- 检查 JavaScript 语法
- 重新生成 `dist`
- 校验本地链接
- 校验每个文章页是否生成
- 校验 `search-index.json`
- 校验 JSON-LD 能解析
- 校验 `sitemap.xml`

如果这里失败，不要推送。先修本地问题。

## 推送到 GitHub

确认只有预期文件变化：

```powershell
git status --short
```

提交并推送：

```powershell
git add .
git commit -m "Describe the change"
git push origin main
```

Cloudflare Pages 连接了 GitHub main 分支后，push 会自动触发部署。

## 第一次创建 Cloudflare Pages 项目

在 Cloudflare 控制台里走 Pages，不要走普通 Worker 模板。

推荐路径：

```text
Workers & Pages -> Pages -> Create a project -> Connect to Git -> 选择 BogerHou/quickgetwell
```

如果界面显示的是 `Create a Worker`、`Start with Hello World`、`Select a template` 这类内容，说明进的是 Worker 创建流。这个项目不需要 Worker，需要 Pages。

设置页面填写：

```text
Project name: quickgetwell
Production branch: main
Framework preset: None
Build command: npm run build
Build output directory: dist
Root directory: /
```

不要填写 Deploy command。

## 我们踩过的坑 1：Deploy command 填错

第一次失败日志里出现过：

```text
Executing user deploy command: nFramework preset: None Build command: npm run build Build output directory: dist Root directory: / Production branch: main
/bin/sh: 1: nFramework: not found
```

原因：Cloudflare 的 `Deploy command` 字段被误填进了一整段配置说明，系统把它当 shell 命令执行，所以报 `nFramework: not found`。

正确做法：

```text
Build command: npm run build
Deploy command: 留空
Non-production branch deploy command: 留空
Build output directory: dist
```

如果界面强制要求 Deploy command，大概率进错了产品入口，或者正在配置 Worker，不是 Pages。回到 Pages 创建流重新建。

## 绑定自定义域名

Pages 部署成功后，会先有一个预览域名：

```text
https://quickgetwell.pages.dev
```

然后在项目里添加自定义域名：

```text
Cloudflare Pages project -> Custom domains -> Add custom domain
```

添加两个域名：

```text
quickgetwell.com
www.quickgetwell.com
```

因为域名是在 Cloudflare 买的，DNS 通常会自动配好。添加后等 Cloudflare 显示 Active。

## 我们踩过的坑 2：www 不跳转到 apex

目标是：

```text
https://www.quickgetwell.com/*
```

301 跳转到：

```text
https://quickgetwell.com/*
```

并保留路径和查询参数。

正确的 Redirect Rule：

```text
Rule type: URL redirect
When incoming requests match: Custom filter expression
Expression: (http.host eq "www.quickgetwell.com")
Type: Dynamic
Expression: concat("https://quickgetwell.com", http.request.uri.path)
Status code: 301 - Permanent Redirect
Preserve query string: 勾选
Place at: First
```

注意，不要把 `(http.host eq "www.quickgetwell.com")` 填到 `URL Full wildcard` 的 value 里。那样表达式会变成匹配完整 URL 字符串，规则不会按 host 生效。

上线后测试：

```powershell
try {
  $r = Invoke-WebRequest -Uri "https://www.quickgetwell.com/get-well-soon-messages/?x=1" -MaximumRedirection 0
  "status=$($r.StatusCode) location=$($r.Headers.Location)"
} catch {
  "status=$([int]$_.Exception.Response.StatusCode) location=$($_.Exception.Response.Headers.Location)"
}
```

应该看到：

```text
status=301 location=https://quickgetwell.com/get-well-soon-messages/?x=1
```

## Google Search Console 提交

建议添加 Domain property 或 URL-prefix property。

如果是 Domain property，需要 DNS TXT 验证。因为域名在 Cloudflare，Search Console 有时可以直接识别或很快验证成功。

站点地图提交：

```text
https://quickgetwell.com/sitemap.xml
```

如果 Search Console 显示“无法抓取”，先不要急着改代码。先自己测试 sitemap：

```powershell
Invoke-WebRequest -Uri "https://quickgetwell.com/sitemap.xml"
```

这次实际情况是：线上 sitemap 返回 200，robots.txt 也正常，但 Search Console 一开始显示无法抓取，之后刷新/等待后恢复。

可检查：

```powershell
Invoke-WebRequest -Uri "https://quickgetwell.com/robots.txt"
Invoke-WebRequest -Uri "https://quickgetwell.com/sitemap.xml"
```

robots.txt 应该包含：

```text
User-agent: *
Allow: /

Sitemap: https://quickgetwell.com/sitemap.xml
```

## 我们踩过的坑 3：favicon.ico 404

线上页面主体正常，但浏览器控制台出现：

```text
GET https://quickgetwell.com/favicon.ico 404
```

原因：即使 HTML 里没有写 favicon，浏览器也会自动请求 `/favicon.ico`。

我们已经修复：

- 新增 `assets/favicon.ico`、`assets/favicon-32.png`、`assets/apple-touch-icon.png`
- 每个页面 head 里加 favicon 和 Apple touch icon 链接
- `_redirects` 中加：

```text
/favicon.ico /assets/favicon.ico 302
```

验证：

```powershell
Invoke-WebRequest -Uri "https://quickgetwell.com/favicon.ico" -MaximumRedirection 0
```

应该返回：

```text
302
Location: /assets/favicon.ico
```

## 部署后验证清单

每次 push 后，等 Cloudflare Pages 构建完成，然后做这些检查：

```powershell
Invoke-WebRequest -Uri "https://quickgetwell.com/"
Invoke-WebRequest -Uri "https://quickgetwell.com/sitemap.xml"
Invoke-WebRequest -Uri "https://quickgetwell.com/robots.txt"
Invoke-WebRequest -Uri "https://quickgetwell.com/get-well-soon-messages/"
```

检查 sitemap URL 数量：

```powershell
$s = Invoke-WebRequest -Uri "https://quickgetwell.com/sitemap.xml"
([regex]::Matches($s.Content, "<loc>")).Count
```

当前应该是：

```text
34
```

含义：1 个首页 + 33 个文章页。

检查新页面是否上线：

```powershell
Invoke-WebRequest -Uri "https://quickgetwell.com/get-well-soon-messages-for-cancer/"
```

如果新页面 404，但 GitHub 已 push 成功，通常是 Cloudflare 部署还没完成。等 30 到 90 秒后再测。

## 以后新增内容的标准流程

1. 修改 `content/pages.js`
2. 跑本地校验：

```powershell
npm run check
```

3. 提交并推送：

```powershell
git add content/pages.js
git commit -m "Add more get well soon pages"
git push origin main
```

4. 等 Cloudflare Pages 自动部署完成
5. 测新页面 200
6. 测 sitemap 是否包含新 slug
7. 去 Google Search Console 重新提交 sitemap，必要时用 URL Inspection 手动提交重点页面

## 固定文件说明

`site.config.js`：

```text
控制 canonical URL 和 sitemap 里的域名。当前是 https://quickgetwell.com
```

`generate-pages.js`：

```text
生成首页、文章页、404、_headers、_redirects、robots.txt、search-index.json、sitemap.xml。
```

`content/pages.js`：

```text
所有 SEO 长尾页面内容都在这里。
```

`dist`：

```text
构建输出目录。Cloudflare 发布这个目录。本地会生成，但不会提交到 Git。
```

`wrangler.toml`：

```text
告诉 Cloudflare Pages 构建输出目录是 dist。
```

## 最短版操作

平时只要记住这套：

```powershell
npm run check
git status --short
git add .
git commit -m "Your change"
git push origin main
```

然后等 Cloudflare Pages 自动部署，最后检查：

```powershell
Invoke-WebRequest -Uri "https://quickgetwell.com/sitemap.xml"
Invoke-WebRequest -Uri "https://quickgetwell.com/robots.txt"
```

这就是完整上线闭环。
