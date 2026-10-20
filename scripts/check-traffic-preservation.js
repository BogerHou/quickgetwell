// The baseline is generated from production commit 76d95d9 in a clean export.
// Approved additions: homepage resource section + its CSS link, explicit sitemap URLs,
// the exact teacher organizer link approved in the October 8 GSC follow-up, and
// the October 20 card-maker navigation and message actions approved by the owner.
// Strip only those bounded additions before hashing; never replace the old baseline.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const root = path.resolve(__dirname, "..");
const baseline = require("../tests/fixtures/production-baseline.json");
const { siteUrl } = require("../site.config");
const { indexedResources } = require("../content/resource-indexing");
const { getMessageId, getEntries } = require("../content/card-message-catalog");
const failures = [];
const catalog = new Map(getEntries().map(entry => [entry.id, entry]));
const decodeHtml = value => value.replace(/&(amp|quot|#39|lt|gt);/g, (_, entity) => ({
  amp: "&", quot: '"', "#39": "'", lt: "<", gt: ">"
}[entity]));
const assetVersion = file => crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex").slice(0, 10);

function stripCardAdditions(html, file) {
  const navigation = '<!-- Card maker navigation: start --><a class="card-maker-nav" href="/resources/care-studio/">Make a card</a><!-- Card maker navigation: end -->';
  const navigations = [...html.matchAll(/<!-- Card maker navigation: start -->[\s\S]*?<!-- Card maker navigation: end -->/g)];
  if (navigations.length !== 1 || navigations[0][0] !== navigation
      || !/<a href="[^"]+">(?:Finder|New message)<\/a>$/.test(html.slice(0, navigations[0]?.index))) {
    failures.push(`${file}: card navigation must be the exact approved link immediately after Finder.`);
  }

  const actions = [...html.matchAll(/<!-- Card maker action: start -->[\s\S]*?<!-- Card maker action: end -->/g)];
  for (const action of actions) {
    const precedingButton = html.slice(0, action.index).match(/<button class="copy-line(?: compact-copy)?" data-copy="([^"]+)" aria-label="[^"]+">([^<]+)<\/button>$/);
    const text = precedingButton && decodeHtml(precedingButton[2]);
    const id = text && getMessageId(text);
    const expected = `<!-- Card maker action: start --><a class="card-message-action" href="/resources/care-studio/#message=${id}" aria-label="Make a card with this message">Make a card<span aria-hidden="true"> ↗</span></a><!-- Card maker action: end -->`;
    if (!precedingButton || decodeHtml(precedingButton[1]) !== text || !catalog.has(id)
        || catalog.get(id).text !== text || action[0] !== expected) {
      failures.push(`${file}: a card action must follow the unchanged copy button and identify its exact public message.`);
    }
  }
  const eligibleButtons = [...html.matchAll(/<button class="copy-line(?: compact-copy)?" data-copy="([^"]+)" aria-label="[^"]+">([^<]+)<\/button>/g)]
    .filter(button => catalog.has(getMessageId(decodeHtml(button[2]))));
  if (eligibleButtons.length !== actions.length) {
    failures.push(`${file}: every eligible public message must have exactly one card action.`);
  }
  for (const button of eligibleButtons) {
    if (!html.slice(button.index + button[0].length).startsWith("<!-- Card maker action: start -->")) {
      failures.push(`${file}: a public message is missing its adjacent card action.`);
    }
  }

  const stylesFile = "assets/experiments/card-entry-v1.css";
  const expectedStyles = `<!-- Card maker styles: start --><link rel="stylesheet" href="/${stylesFile}?v=${assetVersion(stylesFile)}"><!-- Card maker styles: end -->`;
  const styles = [...html.matchAll(/<!-- Card maker styles: start -->[\s\S]*?<!-- Card maker styles: end -->/g)];
  if (styles.length !== 1 || styles[0][0] !== expectedStyles
      || !/<link rel="stylesheet" href="(?:\.\.\/)?styles\.css\?v=[a-f0-9]+">$/.test(html.slice(0, styles[0]?.index))) {
    failures.push(`${file}: card entry styles must be the single versioned stylesheet after the existing stylesheet.`);
  }

  const scriptFile = "assets/experiments/card-entry-v1.js";
  const expectedScript = `<!-- Card maker script: start --><script src="/${scriptFile}?v=${assetVersion(scriptFile)}"></script><!-- Card maker script: end -->`;
  const scripts = [...html.matchAll(/<!-- Card maker script: start -->[\s\S]*?<!-- Card maker script: end -->/g)];
  if (file === "index.html") {
    if (scripts.length !== 1 || scripts[0][0] !== expectedScript
        || !/<script src="script\.js\?v=[a-f0-9]+"><\/script>$/.test(html.slice(0, scripts[0]?.index))) {
      failures.push("Homepage: card entry script must follow the unchanged Finder script exactly once.");
    }
  } else if (scripts.length) failures.push(`${file}: the dynamic Finder handoff script belongs only on the homepage.`);

  let preserved = html.replace(navigation, "").replace(expectedStyles, "").replace(expectedScript, "")
    .replace(/<!-- Card maker action: start -->[\s\S]*?<!-- Card maker action: end -->/g, "");
  const privacyCopies = {
    "index.html": {
      previous: "Runs in your browser. Names and help offers are not submitted or stored. We measure category selections and copy actions to improve the tool. Do not enter private medical details.",
      current: "Runs in your browser. Names and help offers are not uploaded. Choosing Make a card briefly keeps the message in this tab, then removes it when the editor opens. We measure category selections and copy actions to improve the tool. Do not enter private medical details."
    },
    "privacy/index.html": {
      previous: "The message finder runs in your browser. The optional name and help-offer fields are used only to generate the message on the page; they are not submitted through a form and are not stored by Quick Get Well.",
      current: "The message finder runs in your browser. The optional name and help-offer fields are used to generate the message on the page and are not uploaded. Choosing Make a card temporarily keeps that message in this tab using session storage. The transfer is removed when the editor opens or the tab is closed; card drafts otherwise remain in page memory."
    }
  };
  const privacy = privacyCopies[file];
  if (privacy) {
    if (preserved.split(privacy.current).length !== 2) {
      failures.push(`${file}: the Finder handoff must have the exact updated privacy explanation.`);
    }
    preserved = preserved.replace(privacy.current, privacy.previous);
  }
  return preserved;
}

for (const [file, expected] of Object.entries(baseline.files)) {
  const target = path.join(root, "dist", file);
  if (!fs.existsSync(target)) {
    failures.push(`Established production file was removed: ${file}`);
    continue;
  }
  let content = fs.readFileSync(target);
  if (file.endsWith(".html")) content = Buffer.from(stripCardAdditions(content.toString("utf8"), file));
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
  console.log(`All ${Object.keys(baseline.files).length} established production files match baseline ${baseline.commit.slice(0, 7)} byte-for-byte after removing only exact, validated additions. Existing messages, metadata, Copy controls and legacy CSS/JS remain unchanged.`);
}
