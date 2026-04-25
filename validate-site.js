const fs = require("fs");
const path = require("path");
const { pages } = require("./content/pages");

const root = __dirname;
const dist = path.join(root, "dist");
const errors = [];

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
  const clean = target.split("#")[0];
  if (!clean || target.startsWith("#")) return null;
  if (/^(https?:|mailto:|tel:)/.test(target)) return null;
  return path.resolve(path.dirname(baseFile), clean);
}

function validateLinks() {
  if (!fs.existsSync(dist)) return;
  const htmlFiles = walk(dist).filter((file) => file.endsWith(".html"));
  const attrPattern = /\b(?:href|src)="([^"]+)"/g;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(attrPattern)) {
      const resolved = resolveLocal(file, match[1]);
      if (!resolved) continue;

      if (!fs.existsSync(resolved)) {
        errors.push(`Missing local target: ${path.relative(dist, file)} -> ${match[1]}`);
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
    for (const match of html.matchAll(scriptPattern)) {
      try {
        JSON.parse(match[1].trim());
      } catch (error) {
        errors.push(`Invalid JSON-LD in ${path.relative(dist, file)}: ${error.message}`);
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
  const expected = pages.length + 1;
  if (urlCount !== expected) {
    errors.push(`sitemap.xml has ${urlCount} URLs, expected ${expected}`);
  }
}

validateLinks();
validateGeneratedPages();
validateSearchIndex();
validateStructuredData();
validateSitemap();

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${pages.length} generated pages and local links.`);
