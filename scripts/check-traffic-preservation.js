// The baseline is generated from production commit 76d95d9 in a clean export.
// Approved additions: homepage resource section + its CSS link, two sitemap URLs,
// and the exact teacher organizer link approved in the October 8 GSC follow-up.
// Strip only those bounded additions before hashing; never replace the old baseline.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const root = path.resolve(__dirname, "..");
const baseline = require("../tests/fixtures/production-baseline.json");
const { siteUrl } = require("../site.config");
const { indexedResources } = require("../content/resource-indexing");
const failures = [];
for (const [file, expected] of Object.entries(baseline.files)) {
  const target = path.join(root, "dist", file);
  if (!fs.existsSync(target)) {
    failures.push(`Established production file was removed: ${file}`);
    continue;
  }
  let content = fs.readFileSync(target);
  if (file === "get-well-soon-messages-for-teacher/index.html") {
    const html = content.toString("utf8");
    const addition = `
            <!-- Teacher organizer resource: start -->
            <p>Organizing a class card? The <a href="../resources/teacher-care-pack/" style="text-decoration: underline; text-underline-offset: 3px;">four-page teacher card pack</a> includes these two cards, an organizer guide, and an extra signature sheet.</p>
            <!-- Teacher organizer resource: end -->`;
    const index = html.indexOf(addition);
    if (html.split(addition).length !== 2 || !html.slice(0, index).endsWith("</ol>")
        || !html.slice(index + addition.length).startsWith("\n          </div>")) {
      failures.push("Teacher page must contain exactly the approved organizer link after its print instructions.");
    }
    content = Buffer.from(html.replace(addition, ""));
  }
  if (file === "index.html") {
    const html = content.toString("utf8");
    const entryPattern = /\n      <!-- Home resource entry: start -->[\s\S]*?\n      <!-- Home resource entry: end -->/g;
    const entries = [...html.matchAll(entryPattern)];
    if (entries.length !== 1) {
      failures.push("Homepage must contain exactly one approved resource entry.");
    } else {
      const entry = entries[0];
      const afterFaq = html.slice(0, entry.index).match(/<section id="faq"[\s\S]*<\/section>$/);
      const beforeMainEnd = html.slice(entry.index + entry[0].length).startsWith("\n    </main>");
      if (!afterFaq || !beforeMainEnd || /<(?:script|style|link)\b/.test(entry[0])) {
        failures.push("Homepage resource entry must sit directly after the FAQ and before the main footer, without new scripts or styles.");
      }
      const links = [...entry[0].matchAll(/<a href="([^"]+)"/g)].map(match => match[1]);
      if (JSON.stringify(links) !== JSON.stringify(["./resources/teacher-care-pack/", "./practice/workplace-english/"])) {
        failures.push("Homepage resource entry must contain only the two approved resource links.");
      }
      const stylesPattern = /\n    <!-- Home resource styles: start -->[\s\S]*?\n    <!-- Home resource styles: end -->/g;
      const styles = [...html.matchAll(stylesPattern)];
      const cssFile = "assets/experiments/home-resources-v1.css";
      const cssVersion = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, cssFile))).digest("hex").slice(0, 10);
      const expectedStyles = `\n    <!-- Home resource styles: start -->\n    <link rel="stylesheet" href="${cssFile}?v=${cssVersion}">\n    <!-- Home resource styles: end -->`;
      if (styles.length !== 1 || styles[0][0] !== expectedStyles || styles[0].index > html.indexOf("</head>")) {
        failures.push("Homepage must load only the approved, versioned resource stylesheet in its head.");
      }
      content = Buffer.from(html.replace(entry[0], "").replace(expectedStyles, ""));
    }
  }
  if (file === "sitemap.xml") {
    let xml = content.toString("utf8");
    for (const resource of indexedResources) {
      const addition = `  <url>\n    <loc>${siteUrl.replace(/\/$/, "")}${resource.route}</loc>\n    <lastmod>${resource.modified}</lastmod>\n  </url>\n`;
      if (xml.split(addition).length !== 2) failures.push(`Sitemap must add exactly one entry for ${resource.route}`);
      xml = xml.replace(addition, "");
    }
    content = Buffer.from(xml);
  }
  const actual = crypto.createHash("sha256").update(content).digest("hex");
  if (actual !== expected) failures.push(`Established production file changed: ${file}`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Preserved ${Object.keys(baseline.files).length - 3} production files byte-for-byte; homepage, teacher page and sitemap match baseline ${baseline.commit.slice(0, 7)} after removing only approved additions.`);
}
