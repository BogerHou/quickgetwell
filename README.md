# Get Well Soon Messages

Static SEO site for copy-ready get well soon messages by relationship, situation, tone, and format.

Production domain: `https://quickgetwell.com`

## Local workflow

Generate all article pages, homepage, sitemap, robots, and search index into `dist`:

```powershell
npm run generate
```

Check JavaScript syntax:

```powershell
npm run check
```

Open the generated site locally:

```powershell
start .\dist\index.html
```

## Content workflow

Edit `content/pages.js` to add or revise SEO pages. Each page object controls:

- URL slug
- title and meta description
- page intro
- copy-ready message sections
- do / avoid guidance
- related internal links

After editing content, run:

```powershell
npm run generate
```

## Domain

The canonical production URL is set in `site.config.js`.

If the production domain changes, update `siteUrl`, then regenerate:

```powershell
npm run generate
```

## Deploy

This is a static site. Deploy the `dist` folder after running the build command:

```powershell
npm run build
```

Generated files include:

- `dist/index.html`
- `dist/404.html`
- article directories with `index.html`
- `dist/sitemap.xml`
- `dist/robots.txt`
- `dist/search-index.json`

Cloudflare Pages settings:

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`

Full Cloudflare Pages deployment notes, including the first-launch issues we hit, are in `docs/cloudflare-pages-deployment-guide.md`.

## Editorial rules

- Do not make medical claims.
- Do not imply that words speed physical recovery.
- For serious illness, chronic illness, or uncertain recovery, avoid "get well soon" when it sounds rushed.
- Prefer concrete support over vague offers.
- Keep messages copy-ready and easy to personalize.
