const fs = require("fs");
const path = require("path");
const { pages } = require("./content/pages");
const { siteName, siteUrl, gaMeasurementId } = require("./site.config");

const root = __dirname;
const dist = path.join(root, "dist");
const today = new Date().toISOString().slice(0, 10);
const baseUrl = siteUrl.replace(/\/$/, "");
const pageBySlug = new Map(pages.map((page) => [page.slug, page]));
const staticFiles = ["styles.css", "script.js"];
const staticDirectories = ["assets"];
const contentMonthLabel = "April 2026";
const contentDate = "2026-04-25";
const trustStatement = "Reviewed for tone and sensitivity. Writing guidance only, not medical advice.";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function pageUrl(slug) {
  return `${baseUrl}/${slug}/`;
}

function renderAnalytics() {
  if (!gaMeasurementId) return "";

  const id = escapeHtml(gaMeasurementId);
  return `    <script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag("js", new Date());
      gtag("config", "${id}");
    </script>
`;
}

function renderHeader() {
  return `
    <header class="site-header">
      <a class="brand" href="../"><span class="brand-mark" aria-hidden="true"></span><span>${escapeHtml(siteName)}</span></a>
      <nav class="top-nav" aria-label="Primary navigation">
        <a href="../#message-finder">Finder</a>
        <a href="../#situations">Situations</a>
        <a href="../#guidance">Guidance</a>
        <a href="../#faq">FAQ</a>
      </nav>
    </header>`;
}

function renderRootHeader(options = {}) {
  const homeHref = options.homeHref || "./";
  const sectionBase = options.sectionBase || "";

  return `
    <header class="site-header">
      <a class="brand" href="${homeHref}" aria-label="${escapeHtml(siteName)} home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>${escapeHtml(siteName)}</span>
      </a>
      <nav class="top-nav" aria-label="Primary navigation">
        <a href="${sectionBase}#message-finder">Finder</a>
        <a href="${sectionBase}#situations">Situations</a>
        <a href="${sectionBase}#guidance">Guidance</a>
        <a href="${sectionBase}#faq">FAQ</a>
      </nav>
    </header>`;
}

function renderMessageButton(message) {
  const escaped = escapeHtml(message);
  return `<button class="copy-line" data-copy="${escaped}" aria-label="Copy message: ${escaped}">${escaped}</button>`;
}

function renderTopicGrid() {
  return pages
    .map((page) => {
      const searchText = [page.title, page.summary, page.description, page.eyebrow, page.nav]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .replace(/\bcopy[-\s]?ready\b/g, "ready to send")
        .replace(/\blong[-\s]?tail\b/g, "specific")
        .replace(/\bs\.?e\.?o\b/g, "search");

      return `          <a href="./${page.slug}/" data-topic-card data-search="${escapeHtml(searchText)}">
            <span>${escapeHtml(page.nav || page.title)}</span>
            <small>${escapeHtml(page.summary)}</small>
          </a>`;
    })
    .join("\n");
}

function renderHomeSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: `${baseUrl}/`,
    description: "A message finder for thoughtful get well soon notes, cards, texts, and emails."
  };

  return JSON.stringify(schema, null, 6)
    .split("\n")
    .join("\n      ");
}

function renderHomePage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Get Well Soon Messages for Every Situation</title>
    <meta name="description" content="Find thoughtful get well soon messages for friends, family, coworkers, surgery recovery, serious illness, funny notes, cards, and texts.">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${baseUrl}/">
    <meta property="og:title" content="Get Well Soon Messages">
    <meta property="og:description" content="Choose a message that fits the person, the situation, and the tone.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${baseUrl}/">
    <meta property="og:image" content="${baseUrl}/assets/hero-flowers-card.jpg">
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link rel="stylesheet" href="styles.css">
${renderAnalytics()}
    <script type="application/ld+json">
      ${renderHomeSchema()}
    </script>
  </head>
  <body>
${renderRootHeader()}

    <main>
      <section class="hero" aria-label="Get Well Soon Messages">
        <div class="hero-media" aria-hidden="true"></div>
        <div class="hero-overlay" aria-hidden="true"></div>
        <div class="hero-content">
          <p class="eyebrow">A better way to write the note</p>
          <h1>Get Well Soon Messages</h1>
          <p class="hero-copy">Choose words that fit the person, the illness, and the moment. Short texts, warm cards, work notes, surgery recovery, and safer alternatives for serious illness.</p>
          <div class="hero-actions">
            <a class="button primary" href="#message-finder">Find a message</a>
            <a class="button ghost" href="./what-to-say-instead-of-get-well-soon/">When not to say it</a>
          </div>
        </div>
      </section>

      <section id="message-finder" class="finder-section">
        <div class="section-heading">
          <p class="eyebrow">Message finder</p>
          <h2>Start with the situation, then tune the tone.</h2>
          <p>Pick the closest match. You can add a name or a concrete offer of help before copying.</p>
        </div>

        <div class="finder-layout">
          <form class="finder-controls" id="finderForm">
            <label>
              <span>Recipient</span>
              <select name="recipient" id="recipient">
                <option value="friend">Friend</option>
                <option value="family">Family</option>
                <option value="partner">Partner</option>
                <option value="coworker">Coworker</option>
                <option value="boss">Boss</option>
                <option value="client">Client</option>
              </select>
            </label>

            <label>
              <span>Situation</span>
              <select name="situation" id="situation">
                <option value="minor">Cold, flu, or minor illness</option>
                <option value="surgery">After surgery</option>
                <option value="injury">Injury</option>
                <option value="hospital">Hospital stay</option>
                <option value="serious">Serious illness</option>
                <option value="chronic">Chronic illness or long recovery</option>
              </select>
            </label>

            <label>
              <span>Tone</span>
              <select name="tone" id="tone">
                <option value="heartfelt">Heartfelt</option>
                <option value="short">Short</option>
                <option value="supportive">Supportive</option>
                <option value="professional">Professional</option>
                <option value="funny">Funny</option>
                <option value="religious">Religious</option>
              </select>
            </label>

            <label>
              <span>Format</span>
              <select name="format" id="format">
                <option value="text">Text message</option>
                <option value="card">Card</option>
                <option value="email">Email</option>
                <option value="flowers">Flower or gift note</option>
                <option value="group">Group card</option>
              </select>
            </label>

            <label>
              <span>Name, optional</span>
              <input id="personName" type="text" placeholder="Sam">
            </label>

            <label>
              <span>Offer of help, optional</span>
              <input id="helpOffer" type="text" placeholder="drop off dinner this week">
            </label>

            <div class="quick-tune" aria-label="Quick tone controls">
              <button type="button" data-action="shorter">Make shorter</button>
              <button type="button" data-action="warmer">Make warmer</button>
              <button type="button" data-action="safer">Safer wording</button>
            </div>
          </form>

          <div class="results-panel" aria-live="polite">
            <div class="results-heading">
              <h3 id="resultsTitle">Thoughtful messages for a friend</h3>
              <p id="resultsNote">Best for a personal text or card.</p>
            </div>
            <div id="messageResults" class="message-results"></div>
          </div>
        </div>
      </section>

      <section id="situations" class="link-section">
        <div class="section-heading">
          <p class="eyebrow">Browse by situation</p>
          <h2>Find the right words for the moment.</h2>
          <p>Start with the closest relationship or situation, then adjust the wording so it feels kind, specific, and easy to send.</p>
        </div>
        <label class="topic-search">
          <span>Search topics</span>
          <input id="topicSearch" type="search" placeholder="Try surgery, coworker, mom, prayer, serious illness">
        </label>
        <div class="topic-grid" id="topicGrid">
${renderTopicGrid()}
        </div>
      </section>

      <section id="guidance" class="guidance-section">
        <div class="guidance-copy">
          <p class="eyebrow">The rule</p>
          <h2>Match the message to the recovery.</h2>
          <p>For a cold, "feel better soon" is fine. For surgery, long recovery, cancer, or chronic illness, avoid rushing the person toward a quick fix. Acknowledge what is hard, offer specific help, and remove pressure to reply.</p>
        </div>
        <div class="guidance-list">
          <div>
            <span>1</span>
            <h3>Name the moment</h3>
            <p>Say you are thinking of them, and acknowledge that the situation is difficult.</p>
          </div>
          <div>
            <span>2</span>
            <h3>Offer something concrete</h3>
            <p>"I can bring groceries Thursday" is better than "let me know if you need anything."</p>
          </div>
          <div>
            <span>3</span>
            <h3>Lower the burden</h3>
            <p>For serious situations, add "no need to reply" so your message does not create another task.</p>
          </div>
        </div>
      </section>

      <section class="examples-section">
        <div class="section-heading">
          <p class="eyebrow">Quick copy</p>
          <h2>Safe starting points.</h2>
        </div>
        <div class="example-columns">
          <div>
            <h3>Short</h3>
            ${renderMessageButton("Thinking of you and hoping today feels a little easier.")}
            ${renderMessageButton("Sending comfort, rest, and steady healing your way.")}
            ${renderMessageButton("No need to reply. Just wanted you to know you are on my mind.")}
          </div>
          <div>
            <h3>Warm</h3>
            ${renderMessageButton("I am so sorry you are going through this. I am here for the quiet days, the hard days, and anything in between.")}
            ${renderMessageButton("Take all the time you need to rest and heal. You are cared for more than you know.")}
          </div>
          <div>
            <h3>Work</h3>
            ${renderMessageButton("Wishing you a smooth recovery. Please take the time you need, and know the team is thinking of you.")}
            ${renderMessageButton("We miss having you around, but your health comes first. Wishing you rest and steady progress.")}
          </div>
        </div>
      </section>

      <section id="faq" class="faq-section">
        <div class="section-heading">
          <p class="eyebrow">FAQ</p>
          <h2>Common wording questions.</h2>
        </div>
        <div class="faq-list">
          <details>
            <summary>What is a good get well soon message?</summary>
            <p>A good message is specific, kind, and not demanding. Try: "Thinking of you and wishing you steady healing. No need to reply, I just wanted you to feel supported."</p>
          </details>
          <details>
            <summary>Is it okay to say get well soon after surgery?</summary>
            <p>Yes, but softer wording often works better: "Wishing you a smooth recovery" or "Take the time you need to heal."</p>
          </details>
          <details>
            <summary>What should I say instead of get well soon?</summary>
            <p>For serious or chronic illness, try "I am thinking of you," "I hope today is gentle," or "I am here with you through this."</p>
          </details>
          <details>
            <summary>How do I write a professional get well message?</summary>
            <p>Keep it warm and brief. Avoid mentioning work pressure. Say the team is thinking of them and that their health comes first.</p>
          </details>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>${escapeHtml(siteName)} helps you write thoughtful notes. It is writing guidance, not medical advice.</p>
    </footer>

    <div class="toast" id="toast" role="status" aria-live="polite" aria-hidden="true">Copied</div>
    <script src="script.js"></script>
  </body>
</html>
`;
}

function renderSections(page) {
  return page.sections
    .map((section) => `
          <h2 id="${escapeHtml(section.id)}">${escapeHtml(section.title)}</h2>
          ${section.intro ? `<p>${escapeHtml(section.intro)}</p>` : ""}
          <div class="message-list">
            ${section.messages.map(renderMessageButton).join("\n            ")}
          </div>`)
    .join("\n");
}

function isSensitivePage(page) {
  const pageSignals = [page.slug, page.title, page.eyebrow, page.nav, page.summary, page.intro]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /\b(cancer|serious illness|after surgery|surgery|hospital stay|flu)\b/.test(pageSignals);
}

function renderSensitiveNote(page) {
  if (!isSensitivePage(page)) return "";

  return `          <div class="content-note">
            <p><strong>Note:</strong> These are wording suggestions only, not medical advice. Keep the message gentle and avoid promises about recovery.</p>
          </div>
`;
}

function renderDosDonts(page) {
  if (!page.dos?.length && !page.donts?.length) return "";

  return `
          <div id="avoid" class="dos-donts">
            <div>
              <h3>Do</h3>
              <ul>
                ${(page.dos || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                ")}
              </ul>
            </div>
            <div>
              <h3>Avoid</h3>
              <ul>
                ${(page.donts || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                ")}
              </ul>
            </div>
          </div>`;
}

function buildFaqs(page) {
  if (page.faqs?.length) return page.faqs;

  const firstMessage = page.sections?.[0]?.messages?.[0] || "Thinking of you and wishing you comfort, rest, and steady healing.";
  const avoid = page.donts?.[0] || "Do not rush recovery or force positivity.";
  const topic = page.title
    .replace(/^Get Well Soon Messages$/, "get well soon message")
    .replace(/^Get Well Soon Messages /, "get well soon message ")
    .replace(/^Get Well Soon /, "get well soon ")
    .replace(/^Funny Get Well Soon Messages$/, "funny get well soon message")
    .replace(/^Short Get Well Soon Messages$/, "short get well soon message")
    .replace(/^Religious Get Well Soon Messages$/, "religious get well soon message")
    .toLowerCase();

  return [
    {
      question: `What is a good ${topic.charAt(0).toLowerCase()}${topic.slice(1)}?`,
      answer: `A good option is: "${firstMessage}" Keep it brief, kind, and easy to receive.`
    },
    {
      question: "How do I make the message feel more personal?",
      answer: "Add the person's name, one specific thing you know about their situation, and one concrete offer of help if you can follow through."
    },
    {
      question: "What should I avoid saying?",
      answer: `${avoid} In general, avoid medical predictions, pressure to be positive, or anything that asks the person to comfort you.`
    },
    {
      question: "Can I send this in a text message?",
      answer: "Yes. For text messages, choose the shortest version and add no need to reply if the person may be tired, in treatment, or recovering."
    }
  ];
}

function buildPersonalizationSteps(page) {
  const custom = {
    "what-to-say-instead-of-get-well-soon": [
      "Acknowledge the situation without trying to make it sound simple.",
      "Use a low-pressure line like no need to reply if they may be tired or overwhelmed.",
      "Offer one concrete kind of support, then let them choose whether to accept it."
    ],
    "get-well-soon-messages-for-serious-illness": [
      "Lead with presence, not predictions about recovery.",
      "Make room for hard days instead of asking them to stay positive.",
      "Offer specific help and make it clear they do not owe you updates."
    ],
    "get-well-soon-messages-for-cancer": [
      "Avoid battle language unless you know they use it for themselves.",
      "Mention practical support around appointments, meals, rides, or quiet company.",
      "Keep the note steady and low-pressure, especially during treatment or waiting."
    ],
    "get-well-soon-messages-after-surgery": [
      "Match the message to where they are in recovery, not where you hope they will be.",
      "Avoid pushing them to bounce back quickly.",
      "Offer one practical task, like food, errands, childcare, or a ride."
    ],
    "get-well-soon-messages-for-hospital-stay": [
      "Keep the message short enough to read when they are tired.",
      "If you mention visiting, make it easy for them to say no.",
      "Offer a small practical help option for their room, family, or return home."
    ],
    "get-well-soon-messages-for-flu": [
      "Keep it light and brief because flu messages are usually quick check-ins.",
      "Offer simple help like soup, medicine pickup, or leaving supplies at the door.",
      "Skip symptom guesses or timelines unless they brought them up first."
    ]
  };

  return custom[page.slug] || [
    "Add their name or relationship so the note does not feel copied.",
    "Name the situation lightly, such as surgery, the hospital, or a rough week.",
    "Offer one specific help option, like dinner, groceries, a ride, or quiet company."
  ];
}

function renderPersonalization(page) {
  const steps = buildPersonalizationSteps(page);

  return `
          <h2 id="personalize">How to personalize it</h2>
          <div class="formula-list">
            ${steps
              .map((step, index) => `<div>
              <span>${index + 1}</span>
              <p>${escapeHtml(step)}</p>
            </div>`)
              .join("\n            ")}
          </div>`;
}

function renderFaq(page) {
  return `
          <h2 id="faq-page">Questions people ask</h2>
          <div class="faq-list article-faq">
            ${buildFaqs(page)
              .map((faq) => `<details>
              <summary>${escapeHtml(faq.question)}</summary>
              <p>${escapeHtml(faq.answer)}</p>
            </details>`)
              .join("\n            ")}
          </div>`;
}

function renderRelated(page) {
  const related = (page.related || [])
    .map((slug) => pageBySlug.get(slug))
    .filter(Boolean);

  if (!related.length) return "";

  return `
          <h2>Related pages</h2>
          <div class="related-pages">
            ${related.map((item) => `<a href="../${item.slug}/">${escapeHtml(item.nav || item.title)}</a>`).join("\n            ")}
          </div>`;
}

function renderTrustInfo() {
  return `
          <section class="trust-info" aria-label="Content review information">
            <p>${escapeHtml(trustStatement)}</p>
            <p>Last updated: ${escapeHtml(contentMonthLabel)}</p>
            <p>Written and published by ${escapeHtml(siteName)}.</p>
          </section>`;
}

function renderNav(page) {
  const sectionLinks = page.sections
    .map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.title.replace(/^Quick /, "Quick "))}</a>`)
    .join("\n          ");
  const avoid = page.dos?.length || page.donts?.length ? `\n          <a href="#avoid">What to avoid</a>` : "";
  return `${sectionLinks}\n          <a href="#personalize">Personalize it</a>${avoid}\n          <a href="#faq-page">FAQ</a>`;
}

function renderSchema(page) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: page.title,
        description: page.description,
        url: pageUrl(page.slug),
        datePublished: contentDate,
        dateModified: contentDate,
        author: {
          "@type": "Organization",
          name: siteName,
          url: `${baseUrl}/`
        },
        publisher: {
          "@type": "Organization",
          name: siteName,
          url: `${baseUrl}/`
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: buildFaqs(page).map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${baseUrl}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.title,
            item: pageUrl(page.slug)
          }
        ]
      }
    ]
  };

  return JSON.stringify(schema, null, 8)
    .split("\n")
    .join("\n    ");
}

function renderPage(page) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${pageUrl(page.slug)}">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${pageUrl(page.slug)}">
    <meta property="og:image" content="${baseUrl}/assets/hero-flowers-card.jpg">
    <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
    <link rel="stylesheet" href="../styles.css">
${renderAnalytics()}
    <script type="application/ld+json">
    ${renderSchema(page)}
    </script>
  </head>
  <body>
${renderHeader()}

    <main>
      <section class="article-hero">
        <a class="breadcrumb" href="../">Home / ${escapeHtml(page.nav || page.eyebrow)}</a>
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1>${escapeText(page.title)}</h1>
        <p>${escapeHtml(page.intro)}</p>
      </section>

      <section class="article-body">
        <aside class="article-nav" aria-label="Page sections">
          ${renderNav(page)}
        </aside>

        <article class="article-content">
${renderSensitiveNote(page)}
${renderSections(page)}
${renderPersonalization(page)}
${renderDosDonts(page)}
${renderFaq(page)}
${renderRelated(page)}
${renderTrustInfo()}
        </article>
      </section>
    </main>

    <footer class="site-footer">
      <p>${escapeHtml(siteName)} provides writing guidance for thoughtful notes. Not medical advice.</p>
      <p><a href="../">Back to message finder</a></p>
    </footer>
    <div class="toast" id="toast" role="status" aria-live="polite" aria-hidden="true">Copied</div>
    <script src="../script.js"></script>
  </body>
</html>
`;
}

function renderSearchIndex() {
  return JSON.stringify(
    pages.map((page) => ({
      title: page.title,
      slug: page.slug,
      url: `/${page.slug}/`,
      summary: page.summary,
      description: page.description,
      sections: page.sections.map((section) => section.title)
    })),
    null,
    2
  );
}

function renderSitemap() {
  const urls = [
    { loc: `${baseUrl}/`, priority: "1.0" },
    ...pages.map((page) => ({ loc: pageUrl(page.slug), priority: "0.8" }))
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${url.priority}</priority>
  </url>`)
  .join("\n")}
</urlset>
`;
}

function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}

function renderHeaders() {
  return `/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`;
}

function renderRedirects() {
  const host = new URL(baseUrl).hostname;
  return `/favicon.ico /assets/favicon.svg 302
https://www.${host}/* ${baseUrl}/:splat 301!
`;
}

function renderNotFoundPage() {
  const featured = pages.slice(0, 6);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page Not Found | ${escapeHtml(siteName)}</title>
    <meta name="robots" content="noindex,follow">
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link rel="stylesheet" href="styles.css">
${renderAnalytics()}
  </head>
  <body>
${renderRootHeader({ homeHref: `${baseUrl}/`, sectionBase: `${baseUrl}/` })}
    <main>
      <section class="not-found">
        <p class="eyebrow">404</p>
        <h1>That message page is not here.</h1>
        <p>The fastest path is the message finder, or one of the common situations below.</p>
        <div class="hero-actions">
          <a class="button primary" href="${baseUrl}/#message-finder">Open the finder</a>
          <a class="button ghost dark" href="${baseUrl}/#situations">Browse all pages</a>
        </div>
        <div class="related-pages">
          ${featured.map((page) => `<a href="${pageUrl(page.slug)}">${escapeHtml(page.nav || page.title)}</a>`).join("\n          ")}
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <p>Writing guidance for thoughtful notes. Not medical advice.</p>
      <p><a href="${baseUrl}/">Back home</a></p>
    </footer>
  </body>
</html>
`;
}

function copyRecursive(source, destination) {
  const stat = fs.statSync(source);

  if (stat.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(destination, entry));
    }
    return;
  }

  fs.copyFileSync(source, destination);
}

function writePages() {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });

  for (const file of staticFiles) {
    fs.copyFileSync(path.join(root, file), path.join(dist, file));
  }

  for (const directory of staticDirectories) {
    copyRecursive(path.join(root, directory), path.join(dist, directory));
  }

  fs.writeFileSync(path.join(dist, "index.html"), renderHomePage());

  for (const page of pages) {
    const dir = path.join(dist, page.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), renderPage(page));
  }

  fs.writeFileSync(path.join(dist, "404.html"), renderNotFoundPage());
  fs.writeFileSync(path.join(dist, "_headers"), renderHeaders());
  fs.writeFileSync(path.join(dist, "_redirects"), renderRedirects());
  fs.writeFileSync(path.join(dist, "robots.txt"), renderRobots());
  fs.writeFileSync(path.join(dist, "search-index.json"), renderSearchIndex());
  fs.writeFileSync(path.join(dist, "sitemap.xml"), renderSitemap());
}

writePages();
console.log(`Generated dist with homepage, ${pages.length} article pages, 404.html, _headers, _redirects, robots.txt, search-index.json, and sitemap.xml`);
