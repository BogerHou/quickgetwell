// Checks review records and version matches; it cannot authenticate a reviewer.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { pages } = require("../content/pages");

const root = path.resolve(__dirname, "..");
const registerFile = path.join(root, "docs/内容研究/review-register.json");
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const hashFiles = (files) => hash(Buffer.concat(files.flatMap((file) => [
  Buffer.from(`${file}\n`), fs.readFileSync(path.join(root, file)), Buffer.from("\n")
])));

function currentItems() {
  return [
    ...pages.map((page) => ({
      id: `page:${page.slug}`,
      sha256: hash(JSON.stringify(page))
    })),
    {
      id: "shared-site-copy",
      sha256: hashFiles(["generate-pages.js", "script.js"])
    },
    ...pages.flatMap((page) => (page.printableCards?.files || []).map((file) => ({
      id: `printable:${page.slug}:${file.paper}`,
      sha256: hashFiles([file.path])
    })))
  ];
}

function main() {
  const items = currentItems();
  if (process.argv.includes("--snapshot")) {
    console.log(JSON.stringify(items, null, 2));
    return;
  }

  const register = JSON.parse(fs.readFileSync(registerFile, "utf8"));
  const records = register.items;
  const errors = [];
  if (!Array.isArray(records)) throw new Error("Review register must contain an items array.");
  if (new Set(records.map((record) => record.id)).size !== records.length) {
    errors.push("Review register contains duplicate item IDs.");
  }
  for (const item of items) {
    const record = records.find((entry) => entry.id === item.id);
    if (!record || record.status !== "human_approved") {
      errors.push(`${item.id}: human review pending`);
      continue;
    }
    if (!record.reviewer?.trim() || !record.reviewRecord?.trim()) {
      errors.push(`${item.id}: missing reviewer or review record`);
    }
    if (typeof record.reviewRecord === "string" && record.reviewRecord.trim()) {
      const reviewFile = path.resolve(root, record.reviewRecord);
      if (!reviewFile.startsWith(root + path.sep) || !fs.existsSync(reviewFile)
          || !fs.statSync(reviewFile).isFile()) {
        errors.push(`${item.id}: review record must name an existing local file inside the project`);
      }
    }
    const date = new Date(record.reviewedAt);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.reviewedAt || "")
        || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== record.reviewedAt
        || record.reviewedAt > new Date().toISOString().slice(0, 10)) {
      errors.push(`${item.id}: invalid review date`);
    }
    if (record.reviewedSha256 !== item.sha256) {
      errors.push(`${item.id}: content differs from the reviewed version`);
    }
  }
  if (errors.length) {
    console.error(`Editorial release check not passed (${items.length} items):\n${errors.join("\n")}`);
    console.error("Software tests and AI review do not constitute human approval.");
    process.exitCode = 1;
    return;
  }
  console.log(`Review records match all ${items.length} current items. Human identity and review quality still require the owner's verification.`);
}

try {
  main();
} catch (error) {
  console.error(`Editorial review check failed: ${error.message}`);
  process.exitCode = 1;
}
