const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
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
const trustStatement = "Editorially reviewed for tone and sensitivity. Writing guidance only, not medical or clinician-reviewed advice.";
const contactEmail = {
  user: "hello",
  domain: "quickgetwell.com"
};
const securityHeaders = `  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`;
const faqSchemaSlugs = new Set([
  "get-well-soon-messages",
  "get-well-soon-messages-after-surgery",
  "get-well-soon-messages-for-serious-illness",
  "get-well-soon-messages-for-cancer",
  "get-well-soon-messages-for-hospital-stay",
  "what-to-say-instead-of-get-well-soon"
]);
const topicAliases = {
  "get-well-soon-messages-after-surgery": ["operation", "procedure", "post op", "post-op"],
  "get-well-soon-messages-for-mom": ["mother", "mum", "mama"],
  "get-well-soon-messages-for-dad": ["father", "papa"],
  "get-well-soon-messages-for-grandma": ["grandmother", "nana"],
  "get-well-soon-messages-for-grandpa": ["grandfather"],
  "religious-get-well-soon-messages": ["faith", "religion", "christian", "god"],
  "get-well-soon-prayers": ["prayer", "pray", "faith", "religion", "god"],
  "get-well-soon-messages-for-cancer": ["chemo", "treatment", "oncology"],
  "get-well-soon-messages-for-hospital-stay": ["hospitalized", "hospitalised", "clinic"],
  "get-well-soon-messages-for-injury": ["accident", "hurt", "sports injury"],
  "get-well-soon-messages-for-broken-bone": ["cast", "crutches", "fracture"],
  "get-well-soon-messages-for-flowers": ["bouquet", "plant", "gift note"]
};
const infoPages = [
  {
    slug: "about",
    title: `About ${siteName}`,
    description: `${siteName} helps people write thoughtful get well notes, cards, texts, and support messages.`,
    eyebrow: "About",
    intro: "Quick Get Well is a writing resource for people who want to say something kind without sounding rushed, awkward, or overly cheerful.",
    sections: [
      {
        title: "What this site does",
        body: "We publish message examples and wording guidance for get well notes, surgery recovery, serious illness, work cards, family texts, and other sensitive situations. The goal is simple: help you choose words that are easy to receive."
      },
      {
        title: "What this site does not do",
        body: "This site does not provide medical advice, diagnosis, treatment guidance, or health claims. It is not written or reviewed by clinicians. For medical questions, rely on a qualified clinician."
      },
      {
        title: "Editorial responsibility",
        body: "Quick Get Well is maintained as an independent writing resource. Each page is reviewed for plain language, emotional tone, privacy, pressure, and whether the wording avoids medical promises before it is published."
      },
      {
        title: "Contact",
        body: "For corrections or wording concerns, use the Contact page and include the page URL plus the sentence you want reviewed."
      }
    ]
  },
  {
    slug: "editorial-policy",
    title: "Editorial Policy",
    description: "How Quick Get Well reviews wording, sensitive topics, and non-medical guidance.",
    eyebrow: "Editorial policy",
    intro: "Every page is written as wording guidance. We prioritize clarity, emotional care, and avoiding promises about health outcomes.",
    sections: [
      {
        title: "Review principles",
        body: "Messages are reviewed for tone and sensitivity before publication. We avoid language that pressures someone to stay positive, asks for private medical details, or suggests words can change medical outcomes."
      },
      {
        title: "Sensitive-page checks",
        body: "Pages about cancer, serious illness, surgery, hospital stays, chronic illness, prayers, and workplace notes receive extra checks for privacy, pressure, faith language, humor, and recovery timelines."
      },
      {
        title: "Medical boundary",
        body: "Quick Get Well is not a medical site, and pages are not clinician reviewed. The guidance is limited to wording, tone, and message examples."
      },
      {
        title: "Sensitive topics",
        body: "Pages about cancer, serious illness, hospital stays, surgery, and long recovery include extra caution. They are meant to help with supportive language, not medical decisions."
      },
      {
        title: "Corrections",
        body: "When a correction affects sensitivity, accuracy of wording guidance, accessibility, or broken links, it is prioritized for review. Readers can send concerns through the Contact page."
      },
      {
        title: "Updates",
        body: `Content is updated when we find wording that can be clearer, kinder, or safer. Current site content was last updated in ${contentMonthLabel}.`
      }
    ]
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Contact Quick Get Well about corrections, feedback, or wording concerns.",
    eyebrow: "Contact",
    intro: "If you notice wording that feels off, insensitive, unclear, or too medical, send a short note so it can be reviewed.",
    sections: [
      {
        title: "Email",
        body: "Send corrections, feedback, or wording concerns by email. Include the page URL and the sentence you want reviewed.",
        email: "hello@quickgetwell.com"
      },
      {
        title: "Corrections",
        body: "Corrections are prioritized when they affect sensitive illness language, accessibility, broken links, or misleading wording."
      },
      {
        title: "Privacy",
        body: "Please do not send private medical details. A page link and a short description of the concern are enough."
      }
    ]
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "Privacy notes for Quick Get Well, including analytics and non-medical site usage.",
    eyebrow: "Privacy",
    intro: "Quick Get Well is a static website. It does not ask you to create an account or submit private health information.",
    sections: [
      {
        title: "Analytics",
        body: "The site uses Google Analytics 4 and Cloudflare analytics to understand aggregate traffic and page usage. These tools may process page URLs, device and browser information, approximate location, IP-derived data, cookies, and event data such as page views."
      },
      {
        title: "Message finder inputs",
        body: "The message finder runs in your browser. The optional name and help-offer fields are used only to generate the message on the page; they are not submitted through a form and are not stored by Quick Get Well."
      },
      {
        title: "Private information",
        body: "Please do not type private medical details into optional fields or send them by email. A page link and a short description of the wording concern are enough."
      },
      {
        title: "Analytics choices",
        body: "You can use browser privacy settings, content blockers, or Google's analytics opt-out tools to limit analytics collection."
      }
    ]
  }
];

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

function infoPageUrl(slug) {
  return `${baseUrl}/${slug}/`;
}

function assetVersion(file) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  return crypto.createHash("sha256").update(source).digest("hex").slice(0, 10);
}

function assetHref(file) {
  return `${file}?v=${assetVersion(file)}`;
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

const topicGroups = [
  {
    title: "Start here",
    slugs: [
      "get-well-soon-messages",
      "short-get-well-soon-messages",
      "get-well-soon-card-messages",
      "get-well-soon-text-messages",
      "what-to-say-instead-of-get-well-soon"
    ]
  },
  {
    title: "Relationships",
    slugs: [
      "get-well-soon-messages-for-friend",
      "get-well-soon-messages-for-family",
      "get-well-soon-messages-for-mom",
      "get-well-soon-messages-for-dad",
      "get-well-soon-messages-for-grandma",
      "get-well-soon-messages-for-grandpa",
      "get-well-soon-messages-for-sister",
      "get-well-soon-messages-for-brother",
      "get-well-soon-messages-for-boyfriend",
      "get-well-soon-messages-for-girlfriend",
      "get-well-soon-messages-for-wife",
      "get-well-soon-messages-for-husband",
      "get-well-soon-messages-for-child"
    ]
  },
  {
    title: "Health situations",
    slugs: [
      "get-well-soon-messages-after-surgery",
      "get-well-soon-messages-for-hospital-stay",
      "get-well-soon-messages-for-serious-illness",
      "get-well-soon-messages-for-cancer",
      "get-well-soon-messages-for-flu",
      "get-well-soon-messages-for-injury",
      "get-well-soon-messages-for-broken-bone",
      "get-well-soon-messages-for-flowers"
    ]
  },
  {
    title: "Work, tone, and faith",
    slugs: [
      "get-well-soon-messages-for-coworker",
      "get-well-soon-messages-for-boss",
      "get-well-soon-messages-for-client",
      "get-well-soon-messages-for-teacher",
      "funny-get-well-soon-messages",
      "religious-get-well-soon-messages",
      "get-well-soon-prayers"
    ]
  }
];

function renderTopicCard(page) {
  const searchText = [page.title, page.summary, page.eyebrow, page.nav, ...(topicAliases[page.slug] || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/\bcopy[-\s]?ready\b/g, "ready to send")
    .replace(/\blong[-\s]?tail\b/g, "specific")
    .replace(/\bs\.?e\.?o\b/g, "search");

  return `            <a href="./${page.slug}/" data-topic-card data-search="${escapeHtml(searchText)}">
              <span>${escapeHtml(page.nav || page.title)}</span>
              <small>${escapeHtml(page.summary)}</small>
            </a>`;
}

function renderTopicGrid() {
  const groupedSlugs = new Set(topicGroups.flatMap((group) => group.slugs));
  const grouped = topicGroups
    .map((group) => {
      const cards = group.slugs
        .map((slug) => pageBySlug.get(slug))
        .filter(Boolean)
        .map(renderTopicCard)
        .join("\n");

      return `          <div class="topic-group" data-topic-group>
            <h3>${escapeHtml(group.title)}</h3>
${cards}
          </div>`;
    })
    .join("\n");

  const ungrouped = pages
    .filter((page) => !groupedSlugs.has(page.slug))
    .map(renderTopicCard)
    .join("\n");

  if (!ungrouped) return grouped;

  return `${grouped}
          <div class="topic-group" data-topic-group>
            <h3>More options</h3>
${ungrouped}
          </div>`;
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

function renderFooter(options = {}) {
  const prefix = options.prefix || "./";
  const homeHref = options.homeHref || prefix;
  return `    <footer class="site-footer">
      <p>${escapeHtml(siteName)} provides writing guidance for thoughtful notes. Not medical advice.</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="${homeHref}">Home</a>
        <a href="${prefix}about/">About</a>
        <a href="${prefix}editorial-policy/">Editorial Policy</a>
        <a href="${prefix}contact/">Contact</a>
        <a href="${prefix}privacy/">Privacy</a>
      </nav>
    </footer>`;
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
    <link rel="preload" as="image" href="assets/hero-flowers-card.jpg">
    <meta property="og:title" content="Get Well Soon Messages">
    <meta property="og:description" content="Choose a message that fits the person, the situation, and the tone.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${baseUrl}/">
    <meta property="og:image" content="${baseUrl}/assets/hero-flowers-card.jpg">
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link rel="stylesheet" href="${assetHref("styles.css")}">
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

            <p class="finder-privacy-note">Runs in your browser. Do not enter private medical details. Inputs are not submitted or stored by Quick Get Well.</p>

            <div class="quick-tune" aria-label="Quick tone controls">
              <button type="button" data-action="shorter">Make shorter</button>
              <button type="button" data-action="warmer">Make warmer</button>
              <button type="button" data-action="safer">Use low-pressure wording</button>
            </div>
          </form>

          <div class="results-panel">
            <div class="results-heading">
              <h3 id="resultsTitle">Thoughtful messages for a friend</h3>
              <p id="resultsNote" role="status" aria-live="polite">Best for a personal text or card.</p>
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
            ${renderMessageButton("Wishing you rest and comfort. Please take the time you need, and know the team is thinking of you.")}
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
            <p>Yes, but softer wording often works better: "Take the time you need to heal" or "Wishing you rest and comfort."</p>
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

${renderFooter()}

    <div class="toast" id="toast" role="status" aria-live="polite" aria-hidden="true">Copied</div>
    <script src="${assetHref("script.js")}"></script>
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

function renderDecisionGuide(page) {
  const guide = page.decisionGuide;
  if (!guide?.items?.length) return "";

  return `
          <h2 id="choose-wording">${escapeHtml(guide.title)}</h2>
          ${guide.intro ? `<p>${escapeHtml(guide.intro)}</p>` : ""}
          <div class="decision-list">
            ${guide.items
              .map((item) => `<div>
              <h3>${escapeHtml(item.label)}</h3>
              <p>${escapeHtml(item.useWhen)}</p>
              <button class="copy-line compact-copy" data-copy="${escapeHtml(item.try)}" aria-label="Copy suggested wording: ${escapeHtml(item.try)}">${escapeHtml(item.try)}</button>
            </div>`)
              .join("\n            ")}
          </div>`;
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
      "Avoid pushing them to return to normal on anyone else's timeline.",
      "Offer one practical task, like food, errands, childcare, or a ride."
    ],
    "get-well-soon-messages-for-coworker": [
      "Keep the note separate from deadlines, coverage, and open tasks.",
      "Use no need to reply for Slack, Teams, or email check-ins.",
      "Mention the team only as support, never as pressure to come back."
    ],
    "get-well-soon-messages-for-friend": [
      "Sound like your actual friendship instead of a formal card.",
      "Offer one concrete kind of care, such as food, errands, company, or silence.",
      "For long recovery, keep checking in without asking them to perform a cheerful update."
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
            <p>Published by ${escapeHtml(siteName)}. Corrections and wording concerns can be sent through the Contact page.</p>
          </section>`;
}

function renderNav(page) {
  const sectionLinks = page.sections
    .map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.title.replace(/^Quick /, "Quick "))}</a>`)
    .join("\n          ");
  const decision = page.decisionGuide?.items?.length ? `\n          <a href="#choose-wording">Choose wording</a>` : "";
  const avoid = page.dos?.length || page.donts?.length ? `\n          <a href="#avoid">What to avoid</a>` : "";
  return `${sectionLinks}${decision}\n          <a href="#personalize">Personalize it</a>${avoid}\n          <a href="#faq-page">FAQ</a>`;
}

function renderSchema(page) {
  const graph = [
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
    }
  ];

  if (faqSchemaSlugs.has(page.slug)) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: buildFaqs(page).map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    });
  }

  graph.push({
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
  });

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph
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
    <title>${escapeHtml(`${page.title} | ${siteName}`)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${pageUrl(page.slug)}">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${pageUrl(page.slug)}">
    <meta property="og:image" content="${baseUrl}/assets/hero-flowers-card.jpg">
    <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
    <link rel="stylesheet" href="../${assetHref("styles.css")}">
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
${renderDecisionGuide(page)}
${renderPersonalization(page)}
${renderDosDonts(page)}
${renderFaq(page)}
${renderRelated(page)}
${renderTrustInfo()}
        </article>
      </section>
    </main>

${renderFooter({ prefix: "../", homeHref: "../" })}
    <div class="toast" id="toast" role="status" aria-live="polite" aria-hidden="true">Copied</div>
    <script src="../${assetHref("script.js")}"></script>
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
    `${baseUrl}/`,
    ...pages.map((page) => pageUrl(page.slug)),
    ...infoPages.map((page) => infoPageUrl(page.slug))
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${contentDate}</lastmod>
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
${securityHeaders}

/styles.css
  Cache-Control: public, max-age=31536000, immutable
${securityHeaders}

/script.js
  Cache-Control: public, max-age=31536000, immutable
${securityHeaders}

/search-index.json
  X-Robots-Tag: noindex
${securityHeaders}

/*.html
  Cache-Control: public, max-age=0, must-revalidate
${securityHeaders}

/*
${securityHeaders}
`;
}

function renderRedirects() {
  const host = new URL(baseUrl).hostname;
  return `/favicon.ico /assets/favicon.svg 302
https://www.${host}/* ${baseUrl}/:splat 301!
`;
}

function renderEmailLink() {
  return `<a class="info-email" href="./" data-email-link data-email-user="${escapeHtml(contactEmail.user)}" data-email-domain="${escapeHtml(contactEmail.domain)}" aria-label="Email Quick Get Well"><span data-email-text>Email Quick Get Well</span></a>`;
}

function renderInfoPage(page) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.title)} | ${escapeHtml(siteName)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${infoPageUrl(page.slug)}">
    <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
    <link rel="stylesheet" href="../${assetHref("styles.css")}">
${renderAnalytics()}
  </head>
  <body>
${renderHeader()}
    <main>
      <section class="info-hero">
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1>${escapeText(page.title)}</h1>
        <p>${escapeHtml(page.intro)}</p>
      </section>

      <section class="info-content">
        ${page.sections
          .map((section) => `<article>
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.body)}</p>
          ${section.email ? `<p>${renderEmailLink()}</p>` : ""}
        </article>`)
          .join("\n        ")}
      </section>
    </main>
${renderFooter({ prefix: "../", homeHref: "../" })}
    <script src="../${assetHref("script.js")}"></script>
  </body>
</html>
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
    <link rel="stylesheet" href="${assetHref("styles.css")}">
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
${renderFooter({ prefix: `${baseUrl}/`, homeHref: `${baseUrl}/` })}
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

  for (const page of infoPages) {
    const dir = path.join(dist, page.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), renderInfoPage(page));
  }

  fs.writeFileSync(path.join(dist, "404.html"), renderNotFoundPage());
  fs.writeFileSync(path.join(dist, "_headers"), renderHeaders());
  fs.writeFileSync(path.join(dist, "_redirects"), renderRedirects());
  fs.writeFileSync(path.join(dist, "robots.txt"), renderRobots());
  fs.writeFileSync(path.join(dist, "search-index.json"), renderSearchIndex());
  fs.writeFileSync(path.join(dist, "sitemap.xml"), renderSitemap());
}

writePages();
console.log(`Generated dist with homepage, ${pages.length} article pages, ${infoPages.length} info pages, 404.html, _headers, _redirects, robots.txt, search-index.json, and sitemap.xml`);
