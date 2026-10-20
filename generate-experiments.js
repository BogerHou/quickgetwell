// Resource pages use explicit indexing decisions and preserve established articles.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { lessons } = require("./content/workplace-practice");
const { guide } = require("./content/workplace-guide");
const { indexedResources } = require("./content/resource-indexing");
const careStudio = require("./content/care-studio");
const { siteUrl, siteName, gaMeasurementId } = require("./site.config");

const root = __dirname;
const dist = path.join(root, "dist");
const base = siteUrl.replace(/\/$/, "");
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const asset = file => `/${file}?v=${crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex").slice(0, 10)}`;
const invitation = "We're putting together a card for [Teacher's name]. If you'd like to take part, please add a short note, your name, or a drawing by [day]. You do not need to write about their health. Taking part is optional. Please give your note to [organizer].";

function analytics(studio = false) {
  if (!gaMeasurementId) return "";
  return `<script>
    if (window.location.hostname === ${JSON.stringify(new URL(base).hostname)}) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", ${JSON.stringify(gaMeasurementId)}${studio ? `, { page_location: ${JSON.stringify(base + "/resources/care-studio/")} }` : ""});
      const tag = document.createElement("script");
      tag.async = true;
      tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(${JSON.stringify(gaMeasurementId)});
      ${studio ? 'tag.addEventListener("load", () => { window.qgwCareAnalyticsReady = true; });' : ""}
      document.head.appendChild(tag);
    }
  </script>`;
}

function documentFor({ route, title, description, content, lessonId = "", studio = false }) {
  const indexable = indexedResources.some(resource => resource.route === route);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} | ${escape(siteName)}</title>
  <meta name="description" content="${escape(description)}">
  <meta name="robots" content="${indexable ? "index" : "noindex"},follow">
  <link rel="canonical" href="${base}${route}">
  <link rel="icon" href="/assets/favicon-32.png" type="image/png">
  <link rel="stylesheet" href="${asset("assets/experiments/pilot-v1.css")}">
  ${studio ? `<link rel="stylesheet" href="${asset("assets/experiments/care-studio-v1.css")}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${base}${route}">
  <meta property="og:image" content="${base}/assets/hero-flowers-card.jpg">` : ""}
  ${analytics(studio)}
</head>
<body data-lesson-id="${escape(lessonId)}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="resource-header">
    <a class="resource-brand" href="/"><img src="/assets/logo-icon-96.png" width="32" height="32" alt="">Quick Get Well</a>
    <nav aria-label="Primary navigation">
      <a href="/#message-finder">Finder</a>
      <a href="/resources/care-studio/"${studio ? ' aria-current="page"' : ""}>Make a card</a>
      <a href="/#situations">Situations</a>
      <a href="/#guidance">Guidance</a>
      <a href="/#faq">FAQ</a>
    </nav>
  </header>
  <main id="main" class="resource-main">${content}</main>
  <footer class="resource-footer">
    <p>${studio ? "Illustrations and starter wording are AI-assisted; completed human editorial review is not recorded. Adapt the words to your own relationships. Not medical advice." : "Wording to adapt to your own relationships. These examples are AI-assisted; completed human editorial review is not recorded. Not medical advice."}</p>
    ${studio
      ? '<p>Words you type here stay in this page’s memory and are not uploaded. If you bring a message from the Finder, it is briefly held in this browser tab’s session storage and cleared when the editor opens. Your words are never included in the card link. Downloads and copied text contain what you enter; share them only with people you choose. Reloading clears your draft. We may count tool use, export actions and optional feedback using fixed categories. We do not send your names, words, tasks or contact preferences with those events. Standard site analytics also applies; see our Privacy page.</p>'
      : '<p>We may count the option chosen and whether it fits the scenario, plus download and copy actions, using fixed categories and the page path. No names, message text, or health details are requested. There is no saved progress to resume on your next visit.</p>'}
    <nav aria-label="Footer navigation"><a href="/resources/">Resources</a><a href="/editorial-policy/">Editorial policy</a><a href="/privacy/">Privacy</a><a href="/contact/">Contact</a></nav>
  </footer>
  <div class="copy-status" role="status" aria-live="polite"></div>
  <script src="${asset(studio ? "assets/experiments/care-studio-v1.js" : "assets/experiments/pilot-v1.js")}" defer></script>
</body>
</html>
`;
}

function messageCard(label, text, id) {
  return `<div class="example-note"><h3>${escape(label)}</h3><p id="${id}" class="message-text">${escape(text)}</p><button type="button" class="text-button" data-copy-target="${id}">Copy ${escape(label.toLowerCase())}</button></div>`;
}

function breadcrumbs(items) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${trail.map((item, i) => `<li>${i ? '<span class="breadcrumb-separator" aria-hidden="true">/</span>' : ""}${item.href ? `<a href="${escape(item.href)}">${escape(item.label)}</a>` : `<span aria-current="page">${escape(item.label)}</span>`}</li>`).join("")}</ol></nav>`;
}

function sourcesList(sources) {
  return `<ul>${sources.map(source => `<li><a href="${escape(source.url)}" rel="noreferrer">${escape(source.title)}</a><p>${escape(source.note)}</p></li>`).join("")}</ul>`;
}

function preview(file, alt, caption) {
  const bytes = fs.readFileSync(path.join(root, file));
  return `<figure><img src="/${file}" width="${bytes.readUInt32BE(16)}" height="${bytes.readUInt32BE(20)}" alt="${escape(alt)}" loading="lazy"><figcaption>${escape(caption)}</figcaption></figure>`;
}

function downloads() {
  return `<div class="download-actions">
    <a class="button" href="/assets/printables/teacher-care-pack-a4-v1.pdf" download data-resource-download="teacher-care-pack" data-paper-size="a4">Download A4 PDF <span>4 pages · Free</span></a>
    <a class="button secondary" href="/assets/printables/teacher-care-pack-letter-v1.pdf" download data-resource-download="teacher-care-pack" data-paper-size="letter">Download US Letter PDF <span>4 pages · Free</span></a>
  </div>`;
}

function renderResources() {
  return documentFor({ route: "/resources/", title: "Get-Well Cards, Care Notes and Reply Practice", description: "Make a get-well card or care note, print a teacher card, or explore kind workplace replies when someone is unwell.", content: `
    ${breadcrumbs([{ label: "Resources" }])}
    <div class="page-intro"><p class="eyebrow">Free get-well resources</p><h1>A few ways<br>to show you care.</h1><p class="lede">Make something personal, organize a class card, or find a caring way to reply. Choose what would help today.</p></div>
    <section class="resource-section"><h2>Make a card or care note</h2><p>Add your own words to a card, put together an offer of help, or write down how you'd like people to keep in touch. Preview, download an image, or print one sheet.</p><p><a class="button" href="/resources/care-studio/">Try the card and care-note tools</a></p></section>
    <div class="resource-choices">
      <a class="resource-choice teacher-choice" href="/resources/teacher-care-pack/"><div><p class="eyebrow">For class organizers · Free</p><h2>Get-well cards<br>for teachers</h2><p>A four-page pack with a simple organizer guide, a coloring card, a class card, and extra space for signatures.</p><span class="link-arrow">See the printable cards <span aria-hidden="true">↗</span></span></div><img src="/assets/printables/teacher-card-coloring-preview.png" width="480" height="679" alt="Preview of a sunshine and flower coloring card for a teacher"></a>
      <a class="resource-choice practice-choice" href="/practice/workplace-english/"><p class="eyebrow">For English learners · Free</p><h2>Practice get-well<br>replies at work</h2><p>A short guide and five situations about illness, care, and work. Choose a reply, understand its tone, and find wording to adapt.</p><div class="sample-note" aria-hidden="true">“Thanks for letting me know.<br>I hope you feel better soon.”</div><span class="link-arrow">Explore the guide and exercises <span aria-hidden="true">↗</span></span></a>
    </div>
    <aside class="quiet-note"><h2>Just need a message?</h2><p>Our existing guides cover friends, family, work, cards, and different health situations.</p><a class="text-link" href="/#situations">Browse all message guides</a></aside>` });
}

function renderTeacherPack() {
  return documentFor({ route: "/resources/teacher-care-pack/", title: "Free Printable Get-Well Cards for Teachers", description: "Download free get-well cards for a teacher in A4 or US Letter. The four-page PDF includes an organizer guide, coloring card, class card, and extra signatures.", content: `
    ${breadcrumbs([{ label: "Resources", href: "/resources/" }, { label: "Get-well cards for teachers" }])}
    <div class="pack-hero"><div><p class="eyebrow">A little kindness from the class</p><h1>Printable get-well cards for teachers</h1><p class="lede">When a teacher is unwell, a card can let them know the class is thinking of them. This free PDF pack includes cards to write or draw on, plus simple instructions for the person organizing them.</p>${downloads()}<p class="small-note">No account or email needed. Print only the pages you want.</p><a class="text-link" href="#inside">See what's inside ↓</a></div><img class="hero-card" src="/assets/printables/teacher-card-coloring-preview.png" width="480" height="679" alt="Teacher card with a sunshine and flower outline to color"></div>
    <aside class="quiet-note"><h2>Prefer to type your own card?</h2><p>Add a name, your note and a signature, then download an image or print. The class-card PDFs above are still ready to use.</p><a class="text-link" href="/resources/care-studio/">Make a personal get-well card</a></aside>
    <section id="inside" class="resource-section"><p class="eyebrow">Four pages, one simple project</p><h2>Choose the pages your class needs.</h2><p>The two card designs are also available in our <a class="text-link" href="/get-well-soon-messages-for-teacher/#printable-cards">teacher message guide</a>. This pack adds an organizer page and a repeatable signature sheet.</p>
      <div class="pack-previews">
        ${preview("assets/printables/teacher-care-pack-organizer-preview.png", "Organizer guide with steps and an invitation to join the class card", "1. Organizer guide and invitation wording")}
        ${preview("assets/printables/teacher-card-coloring-preview.png", "Individual coloring card with room for a short note and drawing", "2. A coloring card for an individual note")}
        ${preview("assets/printables/teacher-card-class-preview.png", "Class card with 24 spaces for names or small drawings", "3. A class card with 24 spaces")}
        ${preview("assets/printables/teacher-care-pack-extra-signatures-preview.png", "Extra signature sheet with 12 wider spaces for notes or drawings", "4. Extra signatures — print more as needed")}
      </div>
    </section>
    <section class="resource-section two-column"><div><p class="eyebrow">Start with a simple invitation</p><h2>Make it easy to join in.</h2><p>Replace the names and day before sending. Check the school's usual way of delivering a card; a child does not need to explain why their teacher is away.</p><p>Participation can be optional. A name, a drawing, or a short note is enough.</p></div>${messageCard("Class invitation", invitation, "class-invitation")}</section>
    <section id="remote-notes" class="resource-section remote-notes" aria-labelledby="remote-notes-heading"><h2 id="remote-notes-heading">If someone can't sign in person</h2><p>Classmates who live far away or miss the collection day can still contribute to a paper card.</p><ol><li><strong>Collect notes in your usual class channel.</strong> Choose one organizer and a collection date. Ask contributors to send a short message or drawing, and check that they are happy for their words and name to appear in the shared card.</li><li><strong>Keep each note with its sender's name.</strong> With their permission, print their contribution on a separate sheet or write it onto page 4. Keep their wording as agreed and attach the extra sheets to the card.</li><li><strong>Arrange one delivery.</strong> Check the school's usual contact or agreed delivery route. Participation remains optional; nobody needs to explain the teacher's health situation.</li></ol><details class="source-notes"><summary>Why include an option for distant classmates?</summary><p>A <a href="https://www.reddit.com/r/AskProfessors/comments/1in36wb/professor_is_sick_and_we_dont_know_when_he_will/" rel="noreferrer">student's question about classmates living far apart</a> highlighted the difficulty of signing one paper card. The collection steps above are our suggested approach, not a quotation from that discussion.</p></details></section>
    <section class="resource-section"><p class="eyebrow">Before you print</p><h2>A quick print check.</h2><ol class="steps"><li><strong>Match the paper.</strong> Choose A4 or US Letter to match the paper in your printer.</li><li><strong>Choose the pages.</strong> Page 1 is for the organizer. Use page 2 for individual cards or page 3 for a group card. Repeat page 4 if more space is needed.</li><li><strong>Print single-sided at 100% or Actual Size.</strong> No folding, cutting, or double-sided alignment is required. Check one sheet before printing copies.</li><li><strong>Let the words be their own.</strong> Invite a true classroom memory or a kind wish. Avoid asking about medical details or when the teacher will return.</li></ol>${downloads()}</section>
    <aside class="quiet-note"><h2>Need help with the words?</h2><p>Find examples from one student, a parent, or the whole class in the original teacher guide.</p><a class="text-link" href="/get-well-soon-messages-for-teacher/">Read teacher message examples</a></aside>` });
}

function renderPracticeIndex() {
  return documentFor({ route: "/practice/workplace-english/", title: "Practice Get-Well Replies at Work: Guide & Exercises", description: "Learn how to choose a caring workplace reply when someone is unwell. Read a short guide and try five exercises for clients, managers, colleagues, and team cards.", content: `
    ${breadcrumbs([{ label: "Resources", href: "/resources/" }, { label: "Get-well replies at work" }])}
    <div class="page-intro"><p class="eyebrow">A guide and five short exercises</p><h1>Practice get-well replies at work</h1><p class="lede">${escape(guide.intro)}</p><nav class="quick-wording" aria-labelledby="quick-wording-heading"><h2 id="quick-wording-heading">Need wording now?</h2><p>Go straight to examples for your situation.</p><ul><li><a href="/get-well-soon-messages-for-client/#quick">Reply to a client</a></li><li><a href="/get-well-soon-messages-for-boss/#reply-to-sick-notice">Reply to your manager</a></li><li><a href="/get-well-soon-messages-for-coworker/#not-close">Write to a colleague you barely know</a></li></ul></nav><p class="small-note">Exercises take about 2 minutes each · No account · No saved progress</p><a class="text-link practice-jump" href="#exercises">Choose an exercise ↓</a></div>
    <section class="resource-section practice-guide" aria-labelledby="reply-guide-heading"><h2 id="reply-guide-heading">Before you write a reply</h2><ol class="reply-steps">${guide.steps.map(step => `<li><h3>${escape(step.title)}</h3><p>${escape(step.text)}</p></li>`).join("")}</ol><p>${escape(guide.usageNote)}</p></section>
    <section id="exercises" class="practice-exercises" aria-labelledby="exercises-heading"><h2 id="exercises-heading">Choose a situation to practice</h2>
    <ol class="lesson-list">${lessons.map((lesson, index) => `<li><a href="/practice/workplace-english/${lesson.id}/"><span class="lesson-number">${String(index + 1).padStart(2, "0")}</span><div><h3>${escape(lesson.title)}</h3><p>${escape(lesson.summary)}</p></div><span aria-hidden="true">↗</span></a></li>`).join("")}</ol></section>
    <details class="source-notes"><summary>Sources and how this guide was written</summary><p>These sources inform the communication tasks and writing guidance. The guide and exercises are our own editorial work, not quotations or endorsements.</p>${sourcesList(guide.sources)}</details>
    <aside class="quiet-note"><h2>There can be more than one kind answer.</h2><p>These exercises ask for the best fit for the stated situation. A different relationship or different facts can change which wording works.</p><a class="text-link" href="/get-well-soon-messages-for-client/">Go straight to client message examples</a></aside>` });
}

function renderLesson(lesson, index) {
  const next = lessons[index + 1];
  return documentFor({ route: `/practice/workplace-english/${lesson.id}/`, lessonId: lesson.id, title: lesson.title, description: lesson.summary, content: `
    ${breadcrumbs([{ label: "Resources", href: "/resources/" }, { label: "Get-well replies at work", href: "/practice/workplace-english/" }, { label: `Exercise ${index + 1} of ${lessons.length}` }])}
    <div class="lesson-intro"><p class="eyebrow">Choose a reply · Understand the tone</p><h1>${escape(lesson.title)}</h1><p class="lede">${escape(lesson.summary)}</p></div>
    <div class="lesson-layout"><div>
      <section class="scenario"><h2>The situation</h2><p>${escape(lesson.scenario)}</p></section>
      <form class="practice-form" data-correct-index="${lesson.correctIndex}"><fieldset><legend>${escape(lesson.question)}</legend>${lesson.options.map((option, i) => `<label class="answer-option"><input type="radio" name="answer" value="${i}"><span><strong class="option-number">${i + 1}.</strong> ${escape(option.text)}</span></label>`).join("")}</fieldset><button type="submit" class="button">Check my choice</button><p class="answer-status" role="status" aria-live="polite"></p></form>
      <section class="answer-explanation" hidden tabindex="-1"><p class="eyebrow">Why the wording matters</p><h2>Read the choices in context.</h2><p class="principle">${escape(lesson.principle)}</p>${lesson.options.map((option, i) => `<div class="choice-explanation" data-choice-index="${i}"><h3>Option ${i + 1}${i === lesson.correctIndex ? " — best fit here" : ""}</h3><p>${escape(option.explanation)}</p></div>`).join("")}<p class="takeaway">${escape(lesson.takeaway)}</p></section>
      <noscript><p>You can read the message examples below without JavaScript. To check the exercise, enable JavaScript in your browser.</p></noscript>
    </div><aside class="lesson-examples"><p class="eyebrow">Take a useful phrase with you</p><h2>Examples to adapt</h2>${lesson.examples.map((example, i) => messageCard(example.label, example.text, `example-${i}`)).join("")}<p class="small-note">Replace bracketed details and check that every statement is true for you.</p><a class="text-link" href="${escape(lesson.related.href)}">${escape(lesson.related.label)}</a></aside></div>
    <details class="source-notes"><summary>Sources and how this exercise was written</summary><p>The sources below help identify the communication task. The scenario, choices, and example messages were written for this exercise; they are not quotations or endorsements by the sources.</p>${sourcesList(lesson.sources)}</details>
    <nav class="lesson-navigation" aria-label="Lesson navigation"><a class="text-link" href="/practice/workplace-english/">All five exercises</a>${next ? `<a class="button secondary" href="/practice/workplace-english/${next.id}/">Next: ${escape(next.title)} →</a>` : '<a class="button secondary" href="/resources/">Explore resources →</a>'}</nav>` });
}

function write(route, html) {
  const destination = path.join(dist, route.replace(/^\//, ""));
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, "index.html"), html);
}

function appendResourceSitemap() {
  const sitemapPath = path.join(dist, "sitemap.xml");
  let xml = fs.readFileSync(sitemapPath, "utf8");
  // Remove only exact resource entries before appending, making reruns idempotent.
  const resourceUrls = new Set(indexedResources.map(resource => `${base}${resource.route}`));
  xml = xml.replace(/  <url>\n[\s\S]*?<\/url>\n/g, entry => {
    const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    return resourceUrls.has(loc) ? "" : entry;
  });
  if (!xml.endsWith("</urlset>\n")) throw new Error("Unexpected sitemap format; established entries must be preserved.");
  const additions = indexedResources.map(resource => `  <url>\n    <loc>${base}${resource.route}</loc>\n    <lastmod>${resource.modified}</lastmod>\n  </url>\n`).join("");
  fs.writeFileSync(sitemapPath, xml.replace("</urlset>\n", `${additions}</urlset>\n`));
}

if (!fs.existsSync(path.join(dist, "index.html"))) throw new Error("Build the established site first with node generate-pages.js.");
write("/resources/", renderResources());
write("/resources/teacher-care-pack/", renderTeacherPack());
write("/practice/workplace-english/", renderPracticeIndex());
write("/resources/care-studio/", documentFor({
  route: "/resources/care-studio/", title: careStudio.title, description: careStudio.description,
  studio: true, content: careStudio.render()
}));
lessons.forEach((lesson, index) => write(`/practice/workplace-english/${lesson.id}/`, renderLesson(lesson, index)));
appendResourceSitemap();
console.log(`Built ${lessons.length + 4} resource/practice pages; ${indexedResources.length} indexable resources added to the sitemap, with established entries preserved.`);
