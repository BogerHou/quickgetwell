const fs = require("fs");
const path = require("path");
const { pages } = require("./content/pages");

const root = __dirname;
const dist = path.join(root, "dist");
const errors = [];
const infoPages = ["about", "editorial-policy", "contact", "privacy"];

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
  const expected = pages.length + infoPages.length + 1;
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
