const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { lessons } = require("./content/workplace-practice");
const { guide } = require("./content/workplace-guide");
const { indexedResources } = require("./content/resource-indexing");
const { pages } = require("./content/pages");
const { siteUrl } = require("./site.config");
const dist = path.join(__dirname, "dist");
const read = file => fs.readFileSync(path.join(dist, file), "utf8");
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const expectedIds = ["client-sick-reply", "boss-sick-notice", "coworker-you-barely-know", "signing-a-team-card", "thanking-work-well-wishers"];
assert.deepEqual(lessons.map(lesson => lesson.id), expectedIds);
const routes = ["resources/", "resources/teacher-care-pack/", "practice/workplace-english/", "resources/care-studio/", ...expectedIds.map(id => `practice/workplace-english/${id}/`)];
const sitemap = read("sitemap.xml");
const searchIndex = read("search-index.json");
const base = siteUrl.replace(/\/$/, "");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(indexedResources.map(resource => resource.route), ["/resources/teacher-care-pack/", "/practice/workplace-english/", "/resources/care-studio/"]);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "Sitemap must not duplicate URLs");
const indexableRoutes = new Set(indexedResources.map(resource => resource.route.slice(1)));

for (const route of routes) {
  const html = read(`${route}index.html`);
  const indexable = indexableRoutes.has(route);
  const robots = [...html.matchAll(/<meta name="robots" content="([^"]+)">/g)].map(match => match[1]);
  assert.deepEqual(robots, [`${indexable ? "index" : "noindex"},follow`], `${route}: incorrect indexing decision`);
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)">/g)].map(match => match[1]);
  assert.deepEqual(canonicals, [`${base}/${route}`], `${route}: canonical mismatch`);
  assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1, `${route}: one primary heading`);
  assert(html.includes('href="#main"') && html.includes('id="main"'), `${route}: working skip link`);
  assert(html.includes("completed human editorial review is not recorded"), `${route}: honest review status`);
  assert.equal(sitemapUrls.filter(url => url === `${base}/${route}`).length, indexable ? 1 : 0, `${route}: sitemap must agree with indexing decision`);
  assert(!searchIndex.includes(`/${route}`), `${route}: must stay out of original search index`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${route}: duplicate element IDs`);
  const primaryNav = html.match(/<nav aria-label="Primary navigation">([\s\S]*?)<\/nav>/)?.[1] || "";
  for (const fragment of ["message-finder", "situations", "guidance", "faq"]) assert(primaryNav.includes(`href="/#${fragment}"`), `${route}: missing main-site navigation`);
  for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*width="(\d+)"[^>]*height="(\d+)"/g)) {
    if (!match[1].startsWith("/assets/printables/")) continue;
    const image = fs.readFileSync(path.join(dist, match[1]));
    assert.equal(image.readUInt32BE(16), Number(match[2]), `${route}: image width mismatch`);
    assert.equal(image.readUInt32BE(20), Number(match[3]), `${route}: image height mismatch`);
  }
}

for (const lesson of lessons) {
  assert.equal(lesson.options.length, 3);
  assert(Number.isInteger(lesson.correctIndex) && lesson.correctIndex >= 0 && lesson.correctIndex < 3);
  assert.equal(lesson.examples.length, 2);
  assert(lesson.sources.length > 0);
  for (const source of lesson.sources) assert.equal(new URL(source.url).protocol, "https:");
  assert(pages.some(page => lesson.related.href === `/${page.slug}/`), `${lesson.id}: related guide must exist`);
  const html = read(`practice/workplace-english/${lesson.id}/index.html`);
  assert(html.includes(`data-correct-index="${lesson.correctIndex}"`));
  assert.equal([...html.matchAll(/type="radio" name="answer"/g)].length, 3);
  assert(html.includes('class="answer-explanation" hidden'));
  assert(html.includes('class="answer-status" role="status"'));
  for (const option of lesson.options) {
    assert(option.text.trim() && option.explanation.trim());
    assert(html.includes(escape(option.text)) && html.includes(escape(option.explanation)));
  }
  lesson.examples.forEach((example, i) => {
    assert(html.includes(`id="example-${i}" class="message-text">${escape(example.text)}</p>`), `${lesson.id}: copied text or line breaks lost`);
    assert(html.includes(`data-copy-target="example-${i}"`));
  });
}

const pack = read("resources/teacher-care-pack/index.html");
assert(pack.includes("<h1>Printable get-well cards for teachers</h1>"));
const workplace = read("practice/workplace-english/index.html");
assert(workplace.includes("<h1>Practice get-well replies at work</h1>"));
assert.equal(guide.steps.length, 3);
for (const text of [guide.intro, guide.usageNote, ...guide.steps.flatMap(step => [step.title, step.text])]) assert(workplace.includes(escape(text)), "Workplace guide must be readable in the initial HTML");
for (const source of guide.sources) assert(workplace.includes(`href="${escape(source.url)}"`));
for (const paper of ["a4", "letter"]) {
  const file = `/assets/printables/teacher-care-pack-${paper}-v1.pdf`;
  assert(pack.includes(`href="${file}" download data-resource-download="teacher-care-pack" data-paper-size="${paper}"`));
  assert.equal(fs.readFileSync(path.join(dist, file)).subarray(0, 5).toString(), "%PDF-");
}
assert(read("_headers").includes("/assets/printables/*.pdf\n  X-Robots-Tag: noindex"));
assert(pack.includes('id="class-invitation"') && pack.includes('data-copy-target="class-invitation"'));
console.log(`Validated ${routes.length} resource pages: three indexable resources, six unindexed navigation/exercise pages, guide content, copy text, images, and PDFs.`);
