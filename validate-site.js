const fs = require("fs");
const path = require("path");
const { pages } = require("./content/pages");
const { siteName, siteUrl } = require("./site.config");

const root = __dirname;
const dist = path.join(root, "dist");
const errors = [];
const infoPages = ["about", "editorial-policy", "contact", "privacy"];
const expectedFaqSchemaSlugs = new Set([
  "get-well-soon-messages",
  "get-well-soon-messages-after-surgery",
  "get-well-soon-messages-for-serious-illness",
  "get-well-soon-messages-for-cancer",
  "get-well-soon-messages-for-hospital-stay",
  "what-to-say-instead-of-get-well-soon"
]);
const forbiddenHtmlPatterns = [
  /github/i,
  /repository/i,
  /BogerHou/i,
  /public project/i,
  /Long-tail/i,
  /SearchAction/i,
  /cdn-cgi\/l\/email-protection/i,
  /hello@quickgetwell\.com/i,
  /mailto:hello@quickgetwell\.com/i,
  /I can I can/i,
  /\ba email\b/i,
  /coming soon/i,
  /not implemented/i,
  /undefined/i,
  /fast recovery/i,
  /quick recovery/i,
  /smooth recovery/i,
  /recover fully/i,
  /recover quickly/i,
  /recover soon/i,
  /bounce back/i,
  /beat it/i,
  /copy-ready/i,
  /real medicine/i,
  /terrible patient/i,
  /Being nice to you while you are sick is exhausting/i
];

if (!fs.existsSync(dist)) {
  errors.push("Missing dist directory. Run npm run build first.");
}

function walk(dir, output = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      walk(full, output);
    } else {
      output.push(full);
    }
  }
  return output;
}

function resolveLocal(baseFile, target) {
  const [clean, fragment] = target.split("#");
  const pathOnly = clean.split("?")[0];
  if (!pathOnly && fragment) return { resolved: baseFile, fragment };
  if (!pathOnly) return null;
  if (/^(https?:|mailto:|tel:)/.test(target)) return null;

  const resolved = pathOnly.startsWith("/")
    ? path.join(dist, pathOnly.replace(/^\/+/, ""))
    : path.resolve(path.dirname(baseFile), pathOnly);

  return { resolved, fragment };
}

function targetHtmlFile(resolved) {
  if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
    return path.join(resolved, "index.html");
  }

  return resolved;
}

function validateLinks() {
  if (!fs.existsSync(dist)) return;
  const htmlFiles = walk(dist).filter((file) => file.endsWith(".html"));
  const attrPattern = /\b(?:href|src)="([^"]+)"/g;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(attrPattern)) {
      const local = resolveLocal(file, match[1]);
      if (!local) continue;

      const resolved = local.resolved;

      if (!fs.existsSync(resolved)) {
        errors.push(`Missing local target: ${path.relative(dist, file)} -> ${match[1]}`);
        continue;
      }

      if (local.fragment) {
        const htmlTarget = targetHtmlFile(resolved);
        if (!fs.existsSync(htmlTarget)) continue;

        const targetHtml = fs.readFileSync(htmlTarget, "utf8");
        if (!targetHtml.includes(`id="${local.fragment}"`)) {
          errors.push(`Missing fragment target: ${path.relative(dist, file)} -> ${match[1]}`);
        }
      }
    }
  }
}

function validateGeneratedPages() {
  if (!fs.existsSync(dist)) return;
  for (const page of pages) {
    const file = path.join(dist, page.slug, "index.html");
    if (!fs.existsSync(file)) {
      errors.push(`Missing generated page: ${page.slug}/index.html`);
      continue;
    }

    const html = fs.readFileSync(file, "utf8");
    if (!html.includes(`<h1>${page.title}</h1>`)) {
      errors.push(`Generated page missing expected h1: ${page.slug}`);
    }

    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    if (decodeHtml(title || "") !== `${page.seoTitle || page.title} | ${siteName}`) {
      errors.push(`Generated page has incorrect search title: ${page.slug}`);
    }

    const copiedMessages = [...html.matchAll(/\bdata-copy="([^"]*)"/g)]
      .map((match) => decodeHtml(match[1]));
    for (const section of page.sections) {
      for (const message of section.messages) {
        if (!copiedMessages.includes(message)) {
          errors.push(`Generated page loses message text or line breaks: ${page.slug}#${section.id}`);
        }
      }
      for (const link of section.links || []) {
        if (!html.includes(`href="../${link.slug}/"`) || !decodeHtml(html).includes(link.label)) {
          errors.push(`Generated page missing contextual link: ${page.slug} -> ${link.slug}`);
        }
      }
    }

    if (page.printableCards) validatePrintableCards(page, html);
  }

  for (const slug of infoPages) {
    const file = path.join(dist, slug, "index.html");
    if (!fs.existsSync(file)) {
      errors.push(`Missing generated info page: ${slug}/index.html`);
    }
  }

  for (const required of ["index.html", "404.html", "robots.txt", "sitemap.xml", "search-index.json"]) {
    if (!fs.existsSync(path.join(dist, required))) {
      errors.push(`Missing required dist file: ${required}`);
    }
  }
}

function validatePrintableCards(page, html) {
  if (!html.includes('id="printable-cards"') || !html.includes('href="#printable-cards"')) {
    errors.push(`Printable cards are missing their section or navigation: ${page.slug}`);
  }

  for (const file of page.printableCards.files) {
    if (!html.includes(`href="../${file.path}" download data-card-download="${page.printableCards.id}" data-paper-size="${file.paper}"`)) {
      errors.push(`Printable download is missing its link or tracking data: ${file.path}`);
    }
    const output = path.join(dist, file.path);
    if (!fs.existsSync(output) || fs.readFileSync(output).subarray(0, 5).toString() !== "%PDF-") {
      errors.push(`Printable download is missing or is not a PDF: ${file.path}`);
    }
  }

  for (const design of page.printableCards.designs) {
    const file = path.join(dist, design.preview);
    if (!fs.existsSync(file)) continue; // The local link check reports missing files.
    const png = fs.readFileSync(file);
    if (png.length < 24 || png.subarray(1, 4).toString() !== "PNG"
        || png.readUInt32BE(16) !== design.width || png.readUInt32BE(20) !== design.height) {
      errors.push(`Printable preview dimensions differ from the HTML: ${design.preview}`);
    }
  }

  const headers = fs.readFileSync(path.join(dist, "_headers"), "utf8");
  if (!headers.includes("/assets/printables/*.pdf\n  X-Robots-Tag: noindex")) {
    errors.push("Printable PDFs are missing their intended noindex response header");
  }
}

function decodeHtml(text) {
  return text.replaceAll("&quot;", '"').replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">").replaceAll("&amp;", "&");
}

function validateSearchIndex() {
  if (!fs.existsSync(dist)) return;
  const file = path.join(dist, "search-index.json");
  if (!fs.existsSync(file)) return;

  const index = JSON.parse(fs.readFileSync(file, "utf8"));
  if (index.length !== pages.length) {
    errors.push(`search-index.json has ${index.length} items, expected ${pages.length}`);
  }
}

function validateDiscoveryAndFinderLinks() {
  if (!fs.existsSync(dist)) return;
  const home = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  const topicCards = [...home.matchAll(/<a href="([^"]+)" data-topic-card data-search="([^"]+)"/g)]
    .map((match) => ({ href: match[1], search: decodeHtml(match[2]) }));
  for (const [query, slug] of [
    ["printable", "get-well-soon-messages-for-teacher"],
    ["pdf", "get-well-soon-messages-for-teacher"],
    ["chemotherapy", "get-well-soon-messages-for-cancer"],
    ["get well soon wishes", "get-well-soon-messages"],
    ["thank you", "how-to-respond-to-get-well-soon"]
  ]) {
    if (!topicCards.some((card) => card.href === `./${slug}/` && card.search.includes(query))) {
      errors.push(`Topic search cannot discover ${slug} using ${query}`);
    }
  }

  const allowed = {
    recipient: ["friend", "family", "partner", "coworker", "boss", "client"],
    situation: ["minor", "surgery", "injury", "hospital", "serious", "chronic"],
    tone: ["heartfelt", "short", "supportive", "professional", "funny", "religious"],
    format: ["text", "card", "email", "flowers", "group"]
  };
  for (const page of pages) {
    const html = fs.readFileSync(path.join(dist, page.slug, "index.html"), "utf8");
    const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] || "";
    const href = header.match(/href="([^"]*#message-finder)"/)?.[1];
    if (!href) {
      errors.push(`Missing Finder navigation on ${page.slug}`);
      continue;
    }
    const url = new URL(decodeHtml(href), `${siteUrl}/${page.slug}/`);
    for (const [key, value] of url.searchParams) {
      if (!allowed[key]?.includes(value)) errors.push(`Invalid Finder context on ${page.slug}: ${key}`);
    }
    if (page.slug === "get-well-soon-messages-for-cancer"
        && (url.searchParams.get("situation") !== "serious" || url.searchParams.get("tone") !== "supportive")) {
      errors.push("Cancer article loses its situation when navigating to Finder");
    }
    if (page.slug === "get-well-soon-messages-for-boss"
        && url.searchParams.get("recipient") !== "boss") {
      errors.push("Boss article loses its recipient when navigating to Finder");
    }
  }
}

function validateStructuredData() {
  if (!fs.existsSync(dist)) return;
  const htmlFiles = walk(dist).filter((file) => file.endsWith(".html"));
  const scriptPattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const relative = path.relative(dist, file).replace(/\\/g, "/");
    const slug = relative === "index.html" ? "" : relative.replace(/\/index\.html$/, "");
    const hasFaqSchema = html.includes('"@type": "FAQPage"');
    if (hasFaqSchema !== expectedFaqSchemaSlugs.has(slug)) {
      errors.push(`Unexpected FAQPage schema state in ${relative}`);
    }

    for (const match of html.matchAll(scriptPattern)) {
      try {
        const schema = JSON.parse(match[1].trim());
        const article = schema["@graph"]?.find((item) => item["@type"] === "Article");
        if (article) {
          validateArticleDates(slug, html, article);
        }
      } catch (error) {
        errors.push(`Invalid JSON-LD in ${path.relative(dist, file)}: ${error.message}`);
      }
    }
  }
}

function validateArticleDates(slug, html, article) {
  for (const field of ["datePublished", "dateModified"]) {
    const value = article[field];
    const date = new Date(value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
      errors.push(`Invalid ${field} on ${slug}`);
      return;
    }
  }
  if (article.dateModified < article.datePublished) {
    errors.push(`Modification date precedes publication on ${slug}`);
  }

  const visibleDate = html.match(/Last updated: <time datetime="([^"]+)">([^<]+)<\/time>/);
  if (!visibleDate || visibleDate[1] !== article.dateModified || Date.parse(visibleDate[2] + " UTC") !== Date.parse(article.dateModified)) {
    errors.push(`Visible update date and Article date disagree on ${slug}`);
  }

  const page = pages.find((item) => item.slug === slug);
  const explicitDate = page?.dateModified || page?.updated;
  if (explicitDate && article.dateModified !== explicitDate) {
    errors.push(`Article date does not reflect the content revision on ${slug}`);
  }

  const sitemapFile = path.join(dist, "sitemap.xml");
  if (!fs.existsSync(sitemapFile)) return;
  const sitemap = fs.readFileSync(sitemapFile, "utf8");
  const expectedUrl = `${siteUrl.replace(/\/$/, "")}/${slug}/`;
  const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .find((match) => match[1].includes(`<loc>${expectedUrl}</loc>`));
  if (!entry || !entry[1].includes(`<lastmod>${article.dateModified}</lastmod>`)) {
    errors.push(`Sitemap and Article date disagree on ${slug}`);
  }
}

function validateForbiddenText() {
  if (!fs.existsSync(dist)) return;
  const htmlFiles = walk(dist).filter((file) => file.endsWith(".html"));

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const pattern of forbiddenHtmlPatterns) {
      if (pattern.test(html)) {
        errors.push(`Forbidden text pattern ${pattern} found in ${path.relative(dist, file)}`);
      }
    }
  }
}

function validateSitemap() {
  if (!fs.existsSync(dist)) return;
  const file = path.join(dist, "sitemap.xml");
  if (!fs.existsSync(file)) return;

  const xml = fs.readFileSync(file, "utf8");
  const urlCount = (xml.match(/<url>/g) || []).length;
  const expected = pages.length + infoPages.length + 1;
  if (urlCount !== expected) {
    errors.push(`sitemap.xml has ${urlCount} URLs, expected ${expected}`);
  }
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ");
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function validateArticleQuality() {
  if (!fs.existsSync(dist)) return;

  for (const page of pages) {
    const file = path.join(dist, page.slug, "index.html");
    if (!fs.existsSync(file)) continue;

    const html = fs.readFileSync(file, "utf8");
    const words = wordCount(visibleText(html));
    if (words < 500) {
      errors.push(`Generated page is too thin: ${page.slug} has ${words} visible words`);
    }

    if (!html.includes("cluster-pages")) {
      errors.push(`Generated page missing topic cluster links: ${page.slug}`);
    }
  }
}

validateLinks();
validateGeneratedPages();
validateSearchIndex();
validateDiscoveryAndFinderLinks();
validateStructuredData();
validateForbiddenText();
validateSitemap();
validateArticleQuality();

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${pages.length} generated pages and local links.`);
