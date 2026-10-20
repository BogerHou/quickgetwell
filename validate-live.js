const fs = require("fs");
const https = require("https");
const path = require("path");
const { siteUrl } = require("./site.config");
const { indexedResources } = require("./content/resource-indexing");

const root = __dirname;
const dist = path.join(root, "dist");
const baseUrl = (process.argv[2] || siteUrl).replace(/\/$/, "");
const cacheBust = `livecheck=${Date.now()}`;
const errors = [];

const forbiddenLivePatterns = [
  /github/i,
  /repository/i,
  /BogerHou/i,
  /Long-tail/i,
  /programmatic SEO/i,
  /cdn-cgi\/l\/email-protection/i,
  /coming soon/i,
  /not implemented/i,
  /undefined/i,
  /copy-ready/i,
  /real medicine/i,
  /terrible patient/i
];

function request(url, method = "GET") {
  const target = new URL(url);
  if (target.protocol !== "https:" || target.origin !== new URL(baseUrl).origin) {
    throw new Error(`Live checks only request HTTPS URLs on the configured origin: ${url}`);
  }
  return new Promise((resolve, reject) => {
    const req = https.request(target, { method, headers: { "Cache-Control": "no-cache" } }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body });
      });
    });

    req.on("error", reject);
    req.setTimeout(20000, () => {
      req.destroy(new Error(`Timed out requesting ${url}`));
    });
    req.end();
  });
}

function localAssetRefs() {
  const homeFile = path.join(dist, "index.html");
  if (!fs.existsSync(homeFile)) {
    errors.push("Missing dist/index.html. Run npm run build first.");
    return {};
  }

  const html = fs.readFileSync(homeFile, "utf8");
  return {
    css: html.match(/href="(styles\.css\?v=[^"]+)"/)?.[1],
    js: html.match(/src="(script\.js\?v=[^"]+)"/)?.[1],
    resourceCss: html.match(/href="(assets\/experiments\/home-resources-v1\.css\?v=[a-f0-9]+)"/)?.[1]
  };
}

function tagAttributes(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b([^>]*)>`, "gi"))].map((match) => {
    const attributes = {};
    for (const attribute of match[1].matchAll(/\b([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g)) {
      attributes[attribute[1].toLowerCase()] = attribute[2] ?? attribute[3] ?? attribute[4];
    }
    return attributes;
  });
}

function hasRel(attributes, rel) {
  return String(attributes.rel || "").toLowerCase().split(/\s+/).includes(rel);
}

function checkResourceIndexing(route, response) {
  if (response.statusCode !== 200) errors.push(`${route} returned ${response.statusCode}`);
  const expectedCanonical = `${siteUrl.replace(/\/$/, "")}${route}`;
  const canonicals = tagAttributes(response.body, "link").filter(attributes => hasRel(attributes, "canonical"));
  if (canonicals.length !== 1 || canonicals[0].href !== expectedCanonical) {
    errors.push(`${route} must have exactly one self-canonical: ${expectedCanonical}`);
  }
  const robots = tagAttributes(response.body, "meta").filter(attributes => String(attributes.name || "").toLowerCase() === "robots");
  if (robots.length !== 1 || String(robots[0].content || "").toLowerCase().replace(/\s/g, "") !== "index,follow") {
    errors.push(`${route} must have exactly one robots meta tag with index,follow.`);
  }
  const indexingTags = tagAttributes(response.body, "meta").filter(attributes => /^(robots|googlebot)$/i.test(attributes.name || ""));
  if (indexingTags.some(attributes => /\b(noindex|none)\b/i.test(attributes.content || ""))) {
    errors.push(`${route} has a robots or Googlebot meta tag blocking indexing.`);
  }
  if (/\b(noindex|none)\b/i.test(String(response.headers["x-robots-tag"] || ""))) {
    errors.push(`${route} has an HTTP X-Robots-Tag blocking indexing.`);
  }
}

function checkForbidden(name, html) {
  for (const pattern of forbiddenLivePatterns) {
    if (pattern.test(html)) {
      errors.push(`${name} contains forbidden pattern ${pattern}`);
    }
  }
}

async function checkCareStudio(response) {
  const route = "/resources/care-studio/";
  const localPage = path.join(dist, route, "index.html");
  if (!fs.existsSync(localPage)) {
    errors.push(`Missing local ${route} build. Run npm run build first.`);
    return;
  }
  const html = fs.readFileSync(localPage, "utf8");
  const mainContent = (source) => source.match(/<main\b[^>]*\bid="main"[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  const expectedContent = mainContent(html);
  if (!expectedContent || mainContent(response.body) !== expectedContent) {
    errors.push("Care Studio editor content does not match the local build.");
  }
  const assets = [
    { file: "assets/experiments/pilot-v1.css", tag: "link", attribute: "href" },
    { file: "assets/experiments/care-studio-v1.css", tag: "link", attribute: "href" },
    { file: "assets/experiments/care-studio-v1.js", tag: "script", attribute: "src" }
  ];
  for (const asset of assets) {
    const localTags = tagAttributes(html, asset.tag).filter(attributes =>
      String(attributes[asset.attribute] || "").startsWith(`/${asset.file}?v=`));
    const ref = localTags[0]?.[asset.attribute];
    if (localTags.length !== 1 || !/\?v=[a-f0-9]{10}$/.test(ref || "")) {
      errors.push(`Care Studio needs exactly one versioned local asset: ${asset.file}`);
      continue;
    }
    const liveTags = tagAttributes(response.body, asset.tag).filter(attributes =>
      String(attributes[asset.attribute] || "").split("?")[0] === `/${asset.file}`);
    if (liveTags.length !== 1 || liveTags[0][asset.attribute] !== ref
        || (asset.tag === "link" && !hasRel(liveTags[0], "stylesheet"))) {
      errors.push(`Care Studio must reference the current asset exactly once: ${ref}`);
    }
    const liveAsset = await request(`${baseUrl}${ref}`);
    if (liveAsset.statusCode !== 200) {
      errors.push(`Care Studio asset ${ref} returned ${liveAsset.statusCode}`);
    }
    if (liveAsset.body !== fs.readFileSync(path.join(dist, asset.file), "utf8")) {
      errors.push(`Care Studio asset does not match the local build: ${asset.file}`);
    }
  }
}

function checkCareStudioEntry(route, response) {
  if (response.statusCode !== 200) errors.push(`${route} returned ${response.statusCode}`);
  const links = tagAttributes(response.body, "a");
  if (!links.some(attributes => attributes.href === "/resources/care-studio/")) {
    errors.push(`${route} is missing its link to Care Studio.`);
  }
}

async function main() {
  const refs = localAssetRefs();
  if (!refs.css || !refs.js) {
    errors.push("Could not read local CSS/JS asset hashes from dist/index.html.");
  }
  if (!refs.resourceCss) {
    errors.push("Could not read the versioned homepage resource CSS from dist/index.html.");
  }

  const home = await request(`${baseUrl}/?${cacheBust}`);
  if (home.statusCode !== 200) errors.push(`Homepage returned ${home.statusCode}`);
  checkForbidden("Homepage", home.body);

  if (refs.css && !home.body.includes(refs.css)) {
    errors.push(`Homepage does not reference current CSS asset ${refs.css}`);
  }
  if (refs.js && !home.body.includes(refs.js)) {
    errors.push(`Homepage does not reference current JS asset ${refs.js}`);
  }
  if (refs.resourceCss) {
    const resourceStyles = tagAttributes(home.body, "link").filter(attributes =>
      hasRel(attributes, "stylesheet") && attributes.href === refs.resourceCss);
    if (resourceStyles.length !== 1) {
      errors.push(`Homepage must reference current resource CSS exactly once: ${refs.resourceCss}`);
    }
    const resourceCss = await request(`${baseUrl}/${refs.resourceCss}`);
    if (resourceCss.statusCode !== 200) errors.push(`Homepage resource CSS returned ${resourceCss.statusCode}`);
    const localCss = fs.readFileSync(path.join(dist, "assets/experiments/home-resources-v1.css"), "utf8");
    if (resourceCss.body !== localCss) {
      errors.push("Homepage resource CSS does not match the local build.");
    }
  }

  const contact = await request(`${baseUrl}/contact/?${cacheBust}`);
  if (contact.statusCode !== 200) errors.push(`Contact returned ${contact.statusCode}`);
  checkForbidden("Contact", contact.body);
  if (!contact.body.includes("data-email-link")) {
    errors.push("Contact does not contain the data-email-link contact link.");
  }

  const searchIndex = await request(`${baseUrl}/search-index.json?${cacheBust}`, "HEAD");
  const robotsHeader = String(searchIndex.headers["x-robots-tag"] || "").toLowerCase();
  if (!robotsHeader.includes("noindex")) {
    errors.push("search-index.json is missing X-Robots-Tag: noindex.");
  }

  const resourceResponses = new Map();
  for (const { route } of indexedResources) {
    const response = await request(`${baseUrl}${route}?${cacheBust}`);
    resourceResponses.set(route, response);
    checkResourceIndexing(route, response);
  }
  const careStudio = resourceResponses.get("/resources/care-studio/");
  if (careStudio) await checkCareStudio(careStudio);
  else errors.push("Care Studio is missing from the explicit indexable resource list.");
  const resourceHub = await request(`${baseUrl}/resources/?${cacheBust}`);
  checkCareStudioEntry("/resources/", resourceHub);
  const teacherPack = resourceResponses.get("/resources/teacher-care-pack/");
  if (teacherPack) checkCareStudioEntry("/resources/teacher-care-pack/", teacherPack);
  else errors.push("Teacher card pack is missing from the explicit indexable resource list.");

  const sitemap = await request(`${baseUrl}/sitemap.xml?${cacheBust}`);
  if (sitemap.statusCode !== 200) errors.push(`sitemap.xml returned ${sitemap.statusCode}`);
  if (sitemap.body !== fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8")) {
    errors.push("Live sitemap.xml does not match the local build.");
  }
  const sitemapUrls = [...sitemap.body.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1]);
  for (const { route } of indexedResources) {
    const expectedUrl = `${siteUrl.replace(/\/$/, "")}${route}`;
    if (sitemapUrls.filter(url => url === expectedUrl).length !== 1) {
      errors.push(`sitemap.xml must contain exactly one entry for ${expectedUrl}`);
    }
  }

  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log(`Live validation passed for ${baseUrl}`);
  console.log(`Current assets: ${refs.css}, ${refs.js}, ${refs.resourceCss}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
