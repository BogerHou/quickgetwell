const fs = require("fs");
const path = require("path");
const { pages } = require("./content/pages");

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

function validateSearchIndex() {
  if (!fs.existsSync(dist)) return;
  const file = path.join(dist, "search-index.json");
  if (!fs.existsSync(file)) return;

  const index = JSON.parse(fs.readFileSync(file, "utf8"));
  if (index.length !== pages.length) {
    errors.push(`search-index.json has ${index.length} items, expected ${pages.length}`);
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
        JSON.parse(match[1].trim());
      } catch (error) {
        errors.push(`Invalid JSON-LD in ${path.relative(dist, file)}: ${error.message}`);
      }
    }
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
validateStructuredData();
validateForbiddenText();
validateSitemap();
validateArticleQuality();

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${pages.length} generated pages and local links.`);
