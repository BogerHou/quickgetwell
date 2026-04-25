const fs = require("fs");
const https = require("https");
const path = require("path");
const { siteUrl } = require("./site.config");

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
  /placeholder/i,
  /undefined/i,
  /copy-ready/i,
  /real medicine/i,
  /terrible patient/i
];

function request(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method, headers: { "Cache-Control": "no-cache" } }, (res) => {
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
    js: html.match(/src="(script\.js\?v=[^"]+)"/)?.[1]
  };
}

function checkForbidden(name, html) {
  for (const pattern of forbiddenLivePatterns) {
    if (pattern.test(html)) {
      errors.push(`${name} contains forbidden pattern ${pattern}`);
    }
  }
}

async function main() {
  const refs = localAssetRefs();
  if (!refs.css || !refs.js) {
    errors.push("Could not read local CSS/JS asset hashes from dist/index.html.");
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

  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log(`Live validation passed for ${baseUrl}`);
  console.log(`Current assets: ${refs.css}, ${refs.js}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
