# Get Well Soon Messages

Static writing resource for ready-to-send get well soon messages by relationship, situation, tone, and format.

Website: [Get Well Soon Messages](https://quickgetwell.com) by Quick Get Well - a static writing resource for thoughtful messages by relationship, situation, tone, and format.

## Local workflow

Generate all article pages, homepage, sitemap, robots, and search index into `dist`:

```powershell
npm run generate
```

Check JavaScript syntax, finder behavior, and generated pages:

```powershell
npm run check
```

After Cloudflare finishes a production deployment, verify the live site matches the local build:

```powershell
npm run validate:live
```

Open the generated site locally:

```powershell
start .\dist\index.html
```

## Content workflow

Edit `content/pages.js` to add or revise message pages. Each page object controls:

- URL slug
- title and meta description
- page intro
- ready-to-send message sections
- do / avoid guidance
- related internal links

Optional fields for page-specific improvements:

- `seoTitle`: search title without the brand suffix; the shorter `title` remains the H1.
- `personalizationSteps`: guidance tailored to the relationship on that page.
- `dateModified`: the actual date of a substantive content revision, in `YYYY-MM-DD` format. The visible update date, Article schema, and sitemap use the same value. Preserve the original `datePublished`.
- `sections[].links`: contextual article links as `{ slug, label }` objects.
- `sections[].nav`: a short table-of-contents label when the full section title is long.
- `printableCards`: an optional download section with preview images, paper-size links, and printing instructions. PDF and preview assets live in `assets/printables`.
- Message strings can contain `\n` for complete cards or letters. Display and clipboard text preserve those line breaks.

Do not refresh dates just because a build ran. Update the explicit homepage or information-page dates in `generate-pages.js` when their content changes substantially.

After editing content, run:

```powershell
npm run generate
```

The content checks include a legacy 500-word page threshold. This is an internal guard, not a Google ranking requirement or a substitute for editorial review.

## Finder behavior

The Finder offers three alternatives: a main message, a low-pressure message, and a help or privacy-focused message. A custom help offer replaces generated help; it must not expand into extra commitments. Generated group-card wording uses `we`; complete sentences entered by the user keep their original wording and sender, with an explanation in the results note.

Flower/gift notes use brief enclosure wording. Email and named card greetings use separate lines; a custom offer gets its own paragraph in email and card formats. Text messages keep compact line structure. These are alternatives to choose from, not paragraphs to combine.

Short / Warm / Low-pressure are mutually exclusive tone shortcuts, not cumulative edits. Their pressed state follows the effective tone, including the existing safeguards for sensitive situations and workplace relationships.

Article Finder links can carry a matching `recipient`, `situation`, `tone`, or `format` category. The homepage accepts only allowlisted values, never imports names or help offers from the URL, and does not track initial category restoration as an interaction. Pages without a matching Finder category use a “New message” navigation label. Topic search includes aliases and available printable-resource labels.

## Research and human editorial review

The recent content expansions are AI-assisted, not human-approved copy. Internal keyword and user-task research is kept locally under `docs/关键词研究` and `docs/内容研究`; operating data is kept under `docs/网站运营数据`. These notes and data are excluded from the public repository. Public discussions help identify tasks but do not establish demand volume; software checks and AI reviews do not constitute human approval. The tracked review process and register remain available under `docs/内容研究`.

`docs/内容研究/review-register.json` records review status for all 34 articles, shared template/Finder copy, two original PDFs, five practice lessons, the workplace reply guide, shared pilot copy, and two pilot PDFs. The guide is a separate review item. All 46 items currently await a documented human review. After a real reviewer has checked the exact version, record their name, date, the path to their local review record, and the reviewed fingerprint. Use `node scripts/check-editorial-review.js --snapshot` to obtain current fingerprints; this command does not approve anything. Never populate approval fields just to make a build pass.

- `npm run check` and `npm run build` remain available for local development and previews.
- `npm run check:editorial` checks documented approval, required record fields, and version matches. It currently exits unsuccessfully because review is pending.
- `npm run build:release` runs that editorial check followed by the complete technical check/build. This is the intended production command once human review is complete.

The check cannot authenticate the person or judge review quality. The owner must verify the real review and control who can change the register. Cloudflare's remote build command has **not** been changed in this session; the release check is not automatically enforced by an existing deployment still using `npm run build`.

For the 2026-09-22 release, after being informed that human review remained pending, the owner explicitly requested committing and publishing the technically checked version. This release authorization is recorded in `docs/releases/2026-09-22.md`; it is not human editorial approval. The review register, strict release check, and public disclosure remain unchanged. Future releases should use the reviewed-content workflow unless the owner explicitly authorizes a documented exception.

## Usage measurement

GA4 is loaded only on the canonical production hostname, so local and Pages preview visits do not enter production analytics.

- `copy_message` records successful copying with `source` (`article`, `finder`, or `homepage`) and `page_path`.
- `finder_use` records explicit selector or tone-button changes with the selected categories and action.
- `card_download_click` records a click on a printable pack, with `card_pack`, `paper_size`, and `page_path`. It measures download intent, not confirmed file transfer or printing.

The parameters added by these custom events do not include names, help offers, message text, search text, URL query strings, or fragments. GA4's standard automatic metadata still applies. The custom events do not fire merely because results render. Confirm production delivery in GA4 Realtime or DebugView after deployment; local checks verify event construction but cannot verify the receiving account.

## Printable resources

The Teacher page includes two original designs (a coloring card and a class-signature card), packaged as separate two-page A4 and US Letter PDFs. These are single-sided, full-page cards with no folding. The PDFs and previews are static source assets, so the normal Node build requires no Python or PDF dependencies.

To revise the cards, use `scripts/generate-printable-cards.py` with Python, ReportLab, and Poppler's `pdftoppm`, then render and visually review both pages in both paper sizes. The script supports `--output-dir`; use a temporary output directory while revising and copy only reviewed PDFs and the two preview PNGs into `assets/printables`. Keep preview dimensions in `content/pages.js` in sync. Use new versioned filenames for both PDFs and previews when their contents change because assets use long-lived cache headers.

The Cloudflare `_headers` file marks the PDFs `noindex` so search visitors are directed toward the article and its context. Verify this response header after deploying; local HTML checks cannot verify Cloudflare's live response.

## Additive resource pilots

The resources live at `/resources/`, `/resources/teacher-care-pack/`, and `/practice/workplace-english/` (plus five lessons), with a separate generator, CSS, and JavaScript. With the owner's agreement, the teacher pack and workplace reply guide now explicitly use `index,follow` and each appears once in the sitemap: the original 39 entries are unchanged, with 41 entries in total. The five exercises and navigation-only resource hub retain `noindex,follow`; none of the eight pages is added to the existing site search index. The page-by-page reasoning is in `docs/experiments/2026-09-22-indexing-assessment.md`; decisions are based on the task each page serves, not a word-count threshold.

New page titles explicitly identify get-well cards and workplace replies about illness. Their main navigation uses **Finder / Situations / Guidance / FAQ**, matching the established site. The homepage has a small **Free get-well resources** content section after the FAQ and before the footer, linking only to **Printable get-well cards for teachers** and **Practice get-well replies at work**. Only the homepage loads `assets/experiments/home-resources-v1.css`. Its existing navigation, Finder, topic sections, and FAQ order remain unchanged.

`npm run build` runs the established generator first, then `generate-experiments.js`. The protection baseline remains production commit `76d95d9`; it has not been reset. `npm run check:preservation` checks all 58 existing output files against `tests/fixtures/production-baseline.json`: 56 must remain byte-identical; the homepage must match after removing only its marked resource section and approved CSS link; the sitemap must match after removing exactly the two new entries, preserving the original 39 entries byte-for-byte. The checker also verifies the homepage section's position, its two approved links, and its single versioned stylesheet. The full `npm run check` includes this comparison. Never refresh the baseline simply to silence a failure; changes outside these bounded exceptions need a separate review.

The teacher pack adds an organizer guide and a repeatable signature sheet to the existing two card designs. To regenerate only the new pack, use `scripts/generate-teacher-care-pack.py --output-dir output/pdf/teacher-care-pack` with ReportLab and Poppler. Review all four pages in both paper sizes before copying any new assets. The existing PDFs are unchanged.

Pilot custom events are `resource_download_click`, `resource_copy`, `practice_answer`, and `practice_complete`, with `experiment_id: resources_v1`. Completion means the visitor checked an answer and saw feedback, even if the answer was wrong; it does not measure learning or a message being sent. Events use fixed categories, choices, correctness and page paths, not message text. Local and Pages preview hosts send no pilot events to production GA4. Receiving-account verification and real user trials remain outstanding.

To withdraw the pilot, first remove the resource `section` and its `Home resource entry: start/end` markers from `generate-pages.js`, plus the CSS link and its `Home resource styles: start/end` markers. Then withdraw the pilot files and their build/check hooks. Rebuilding without the experiment hook leaves the established generator's original 39-entry sitemap, removing the two resource additions. Restore the preservation check to direct comparison of all 58 original files against the same baseline. This order avoids leaving homepage links or a stylesheet reference to removed files.

The implementation, hypotheses, review status, test protocol, and rollout/rollback boundaries are recorded in `docs/experiments/2026-09-22-pilot-plan.md`. The local build, site checks, and preservation check have passed. `validate-live.js` covers both indexable resource pages, the homepage resource stylesheet, and the sitemap. The owner authorized deployment on 2026-10-04; release scope and verification are recorded in `docs/releases/2026-10-04.md`. Allowing indexing does not mean Google has indexed the pages.

The 2026-10-04 demand follow-up adds direct links from the workplace topic to three existing message sections, plus instructions for collecting paper-card contributions from classmates who cannot sign in person. It does not add online signing or another example library. The evidence and deferred ideas are recorded locally in `docs/关键词研究/2026-10-04-需求核对与实施.md`; the pre-deployment technical and browser checks are in the fourth phase of the pilot QA record. Both changes are included in the authorized release, with the original article/PDF protection boundary unchanged.

## Domain

The canonical production URL is set in `site.config.js`.

If the production domain changes, update `siteUrl`, then regenerate:

```powershell
npm run generate
```

## Deploy

This is a static site. The normal reviewed-content production workflow is to complete human review, then deploy `dist` after the release command passes:

```powershell
npm run build:release
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
- Intended production build command: `npm run build:release` (remote setting still needs to be updated; see the review section above)
- Build output directory: `dist`

Full Cloudflare Pages deployment notes, including the first-launch issues we hit, are in `docs/cloudflare-pages-deployment-guide.md`.

## Editorial rules

- Do not make medical claims.
- Do not imply that words speed physical recovery.
- For serious illness, chronic illness, or uncertain recovery, avoid "get well soon" when it sounds rushed.
- Prefer concrete support over vague offers.
- Keep messages ready to send and easy to personalize.
