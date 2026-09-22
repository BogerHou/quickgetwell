const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("script.js", "utf8");
const elements = new Map();
const analyticsEvents = [];
const documentListeners = new Map();

function addListener(listeners, type, callback) {
  if (!listeners.has(type)) listeners.set(type, []);
  listeners.get(type).push(callback);
}

function dispatch(listeners, type, target) {
  for (const callback of listeners.get(type) || []) callback({ target });
}

function element(id, value = "") {
  if (!elements.has(id)) {
    const listeners = new Map();
    elements.set(id, {
      id,
      tagName: ["recipient", "situation", "tone", "format"].includes(id) ? "SELECT" : "INPUT",
      value,
      textContent: "",
      innerHTML: "",
      dataset: {},
      attributes: {},
      addEventListener: (type, callback) => addListener(listeners, type, callback),
      dispatch: (type, target) => dispatch(listeners, type, target || element(id)),
      setAttribute(name, value) { this.attributes[name] = value; },
      classList: { add() {}, remove() {} },
      after() {}
    });
  }

  return elements.get(id);
}

for (const id of [
  "finderForm",
  "messageResults",
  "resultsTitle",
  "resultsNote",
  "toast",
  "personName",
  "helpOffer",
  "topicSearch",
  "topicGrid",
  "recipient",
  "situation",
  "tone",
  "format"
]) {
  element(id);
}

element("recipient").value = "friend";
element("situation").value = "minor";
element("tone").value = "heartfelt";
element("format").value = "text";

const tuneButtons = ["shorter", "warmer", "safer"].map((action) => {
  const button = element(`tune-${action}`);
  button.dataset.action = action;
  return button;
});

const context = {
  console,
  URLSearchParams,
  window: {
    isSecureContext: false,
    setTimeout() {},
    location: { pathname: "/get-well-soon-messages/", search: "?name=Private+Person", hash: "#private@example.com" },
    gtag: (...args) => analyticsEvents.push(args)
  },
  navigator: {},
  document: {
    getElementById: (id) => element(id),
    querySelectorAll: (selector) => selector === "[data-action]" ? tuneButtons : [],
    addEventListener: (type, callback) => addListener(documentListeners, type, callback),
    createElement: () => ({
      value: "",
      style: {},
      setAttribute() {},
      select() {},
      remove() {}
    }),
    body: { appendChild() {} },
    execCommand() {}
  }
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

vm.createContext(context);
vm.runInContext(`${source}
this.__buildFinderMessages = buildFinderMessages;
this.__renderMessages = renderMessages;
this.__formatHelpOffer = formatHelpOffer;
this.__effectiveTone = effectiveTone;
this.__trackFinderUse = trackFinderUse;`, context);

assert(analyticsEvents.length === 0, "Initial finder rendering must not send usage events");

assert(context.__formatHelpOffer("dinner") === "I can help with dinner if that would help.", "Noun help offer should use help with");
assert(context.__formatHelpOffer("bring dinner") === "I can bring dinner if that would help.", "Verb help offer should keep I can");
assert(context.__formatHelpOffer("I can bring dinner") === "I can bring dinner.", "Complete help offer should not be rewritten");
assert(context.__formatHelpOffer("Dinner is on me tonight.", { format: "group" }) === "Dinner is on me tonight.", "A complete authored help sentence must keep its sender");
assert(context.__formatHelpOffer("drop off dinner.", { format: "group" }) === "We can drop off dinner if that would help.", "Generated group help should use we and one terminal punctuation mark");

function assertSelectedTone(tone) {
  const actions = { short: "shorter", heartfelt: "warmer", supportive: "safer" };
  for (const button of tuneButtons) {
    assert(button.attributes["aria-pressed"] === (button.dataset.action === actions[tone] ? "true" : "false"), "Tone controls must reflect the displayed effective tone");
  }
}

assertSelectedTone("heartfelt");

function initializeWithUrl(pathname, search) {
  const defaults = { recipient: "friend", situation: "minor", tone: "heartfelt", format: "text" };
  const nodes = new Map([...elements].map(([id, node]) => [id, {
    ...node,
    value: defaults[id] || "",
    attributes: {},
    addEventListener() {}
  }]));
  const events = [];
  const reads = [];
  const initial = {
    ...context,
    URLSearchParams: class extends URLSearchParams {
      get(key) { reads.push(key); return super.get(key); }
    },
    window: {
      ...context.window,
      location: { pathname, search, hash: "#private@example.com" },
      gtag: (...args) => events.push(args),
      get localStorage() { throw new Error("Finder context must not use local storage"); },
      get sessionStorage() { throw new Error("Finder context must not use session storage"); },
      history: { replaceState() { throw new Error("Finder context must not rewrite URL state"); } }
    },
    document: {
      ...context.document,
      getElementById: (id) => nodes.get(id),
      querySelectorAll: () => [],
      addEventListener() {}
    }
  };
  vm.createContext(initial);
  vm.runInContext(source, initial);
  assert(events.length === 0, "URL initialization must not send analytics events");
  assert(reads.every((key) => Object.hasOwn(defaults, key)), "Only category query parameters may be read");
  assert(nodes.get("personName").value === "" && nodes.get("helpOffer").value === "", "URL initialization must never import names or help offers");
  assert(!/Private Person|private@example|private dinner/.test(nodes.get("messageResults").innerHTML), "Private URL values must not appear in messages");
  return nodes;
}

const privateQuery = "&name=Private+Person&personName=private%40example.com&help=private+dinner&helpOffer=private+dinner";
for (const path of ["/", "/index.html"]) {
  const nodes = initializeWithUrl(path, `?recipient=client&situation=serious&tone=funny&format=email${privateQuery}`);
  assert(nodes.get("recipient").value === "client" && nodes.get("situation").value === "serious" && nodes.get("format").value === "email", "Valid homepage category context must be applied");
  assert(nodes.get("resultsTitle").textContent === "Professional messages for a client", "Initial rendering must use category context and safe effective tone");
}
const ignoredContext = initializeWithUrl("/get-well-soon-messages-for-cancer/", "?recipient=client&situation=serious&tone=short&format=email");
assert(ignoredContext.get("recipient").value === "friend" && ignoredContext.get("situation").value === "minor", "Article URLs must not initialize Finder context");
const mixedContext = initializeWithUrl("/", `?recipient=private%40example.com&situation=surgery&tone=not-a-tone&format=not-a-format${privateQuery}`);
assert(mixedContext.get("recipient").value === "friend" && mixedContext.get("situation").value === "surgery" && mixedContext.get("tone").value === "heartfelt" && mixedContext.get("format").value === "text", "Invalid values must be ignored independently while valid context is preserved");
const freshContext = initializeWithUrl("/", "");
assert(freshContext.get("situation").value === "minor", "A fresh visit must keep defaults rather than a previous URL selection");

const recipients = ["friend", "family", "partner", "coworker", "boss", "client"];
const situations = ["minor", "surgery", "injury", "hospital", "serious", "chronic"];
const tones = ["heartfelt", "short", "supportive", "professional", "funny", "religious"];
const formats = ["text", "card", "email", "flowers", "group"];

const combos = [];
for (const recipient of recipients) {
  for (const situation of situations) {
    for (const tone of tones) {
      for (const format of formats) {
        combos.push({ recipient, situation, tone, format });
      }
    }
  }
}

const signatureCombos = [
  { recipient: "friend", situation: "minor", tone: "heartfelt", format: "text" },
  { recipient: "friend", situation: "minor", tone: "funny", format: "text" },
  { recipient: "client", situation: "serious", tone: "professional", format: "email" },
  { recipient: "coworker", situation: "surgery", tone: "professional", format: "group" },
  { recipient: "family", situation: "hospital", tone: "religious", format: "flowers" },
  { recipient: "partner", situation: "chronic", tone: "supportive", format: "card" }
];

const signatures = new Set();

for (const filters of combos) {
  const finderMessages = context.__buildFinderMessages(filters);
  const expectedTone = context.__effectiveTone(filters);
  assert(finderMessages.length === 3, `Expected three distinct alternatives for ${JSON.stringify(filters)}`);

  for (const message of finderMessages) {
    assert(message.recipient === filters.recipient, `Recipient mismatch for ${JSON.stringify(filters)}`);
    assert(message.situation === filters.situation, `Situation mismatch for ${JSON.stringify(filters)}`);
    assert(message.tone === expectedTone, `Tone mismatch for ${JSON.stringify(filters)}`);
    assert(message.format === filters.format, `Format mismatch for ${JSON.stringify(filters)}`);
    if (expectedTone === "short") {
      const plain = message.text.replace("{name}", "").trim();
      assert(plain.length <= 125, `Short finder message is too long for ${JSON.stringify(filters)}: ${plain}`);
    }
    if (filters.format === "flowers") {
      assert(message.text.replace("{name}", "").length <= 100, `An unpersonalized gift enclosure should stay brief: ${message.text}`);
    }
    const sentences = message.text.replace("{name}", "").toLowerCase().split(/[.!?]+/).map((sentence) => sentence.trim()).filter(Boolean);
    assert(new Set(sentences).size === sentences.length, `Repeated sentence for ${JSON.stringify(filters)}: ${message.text}`);
    for (const repeatedIdea of [/thinking of you/gi, /warm thoughts/gi, /(?:no need to reply|no response (?:is )?needed)/gi]) {
      assert((message.text.match(repeatedIdea) || []).length <= 1, `Repeated idea for ${JSON.stringify(filters)}: ${message.text}`);
    }
    if (filters.format === "group") {
      assert(!/\b(?:I|me|my|mine|myself)\b/.test(message.text), `Group prose switches to an individual sender: ${message.text}`);
    }
    if (["boss", "coworker", "client"].includes(filters.recipient)) {
      assert(!/team.{0,30}(?:cover|handle)|things covered|work can wait|no rush on our side|revisit anything outstanding|only deadline/i.test(message.text), `Unconfirmed work arrangements for ${JSON.stringify(filters)}: ${message.text}`);
    }
  }

  assert(new Set(finderMessages.map((message) => message.text)).size === finderMessages.length, `Finder options must be distinct for ${JSON.stringify(filters)}`);
  const withOffer = context.__buildFinderMessages(filters, "drop off dinner this week");
  assert(new Set(withOffer.map((message) => message.text)).size === withOffer.length, `Adding help must not collapse the options for ${JSON.stringify(filters)}`);
  for (const message of withOffer) {
    assert((message.text.match(/drop off dinner this week/g) || []).length === 1, "A specific help offer must appear exactly once in each option");
    assert(!/grocery|errand|quiet company|arrange one|food,|reminders|childcare/.test(message.text), "A specific help offer must replace all generic help commitments");
    if (filters.format === "group") {
      assert(/We can drop off dinner/.test(message.text) && !/\b(?:I|me|my|mine|myself)\b/.test(message.text), "Group fragments must use the group voice throughout");
    }
  }

  element("recipient").value = filters.recipient;
  element("situation").value = filters.situation;
  element("tone").value = filters.tone;
  element("format").value = filters.format;
  context.__renderMessages();
  assert(element("messageResults").innerHTML.includes("message-card"), `Rendered results missing for ${JSON.stringify(filters)}`);
  assertSelectedTone(expectedTone);
}

assert(context.__effectiveTone({ recipient: "friend", situation: "surgery", tone: "funny", format: "text" }) === "supportive", "Surgery humor should be softened");
assert(context.__effectiveTone({ recipient: "client", situation: "minor", tone: "funny", format: "email" }) === "professional", "Client humor should be professional");
assert(context.__effectiveTone({ recipient: "coworker", situation: "minor", tone: "religious", format: "email" }) === "professional", "Workplace religious tone should be professional");

function renderFor(filters) {
  element("recipient").value = filters.recipient;
  element("situation").value = filters.situation;
  element("tone").value = filters.tone;
  element("format").value = filters.format;
  context.__renderMessages();
  return {
    title: element("resultsTitle").textContent,
    note: element("resultsNote").textContent,
    html: element("messageResults").innerHTML
  };
}

const formatSelection = { recipient: "friend", situation: "minor", tone: "heartfelt" };
const byFormat = Object.fromEntries(["text", "card", "email", "flowers"].map((format) => [
  format, context.__buildFinderMessages({ ...formatSelection, format }).map((message) => message.text)
]));
assert(byFormat.flowers[0].length < byFormat.card[0].length && byFormat.flowers[0].length < byFormat.email[0].length, "Gift notes should omit the fuller personal introduction used by heartfelt cards and emails");
assert(byFormat.flowers.every((text) => !/grocery|arrange one|quiet company/.test(text)), "A default gift enclosure should stay focused on the accompanying gift rather than a practical-help conversation");
assert(byFormat.card.some((text) => /card/.test(text)) && byFormat.email.some((text) => /email/.test(text)), "Card and email selections should include a suitable message for that medium");

element("personName").value = "Alex";
element("helpOffer").value = "I can bring dinner on Thursday.";
const formattedEmail = renderFor({ ...formatSelection, format: "email" });
const formattedCard = renderFor({ ...formatSelection, format: "card" });
const formattedText = renderFor({ ...formatSelection, format: "text" });
assert(formattedEmail.html.includes("Hello Alex,\n\n") && formattedCard.html.includes("Dear Alex,\n\n"), "Personalized email and card greetings should be separated from their message bodies");
assert(formattedEmail.html.includes("\n\nI can bring dinner on Thursday.") && formattedCard.html.includes("\n\nI can bring dinner on Thursday."), "A specific offer should have its own paragraph in a fuller email or card");
assert(!/<p>[^<]*\n/.test(formattedText.html), "Text messages should retain their compact line structure");
element("personName").value = "";
element("helpOffer").value = "";

const surgeryFunny = renderFor({ recipient: "friend", situation: "surgery", tone: "funny", format: "text" });
assert(surgeryFunny.title.startsWith("Supportive messages"), "Softened surgery humor should display the effective tone");
assert(!surgeryFunny.html.includes(">funny<"), "Softened surgery humor should not render a funny tag");

const workplaceReligious = renderFor({ recipient: "coworker", situation: "minor", tone: "religious", format: "email" });
assert(workplaceReligious.title.startsWith("Professional messages"), "Workplace religious tone should display as professional");
assert(!/Praying|May you feel held/i.test(workplaceReligious.html), "Workplace religious tone should not render prayer language");

const seriousClient = renderFor({ recipient: "client", situation: "serious", tone: "professional", format: "email" });
assert(!seriousClient.html.includes("I am sorry this is so hard"), "Client serious illness wording should not use overly intimate phrasing");

const seriousBoss = renderFor({ recipient: "boss", situation: "serious", tone: "funny", format: "text" });
assert(seriousBoss.title.startsWith("Professional messages") && /Humor is softened/.test(seriousBoss.note), "The reported boss combination should explain its professional fallback");
assert(!/team has|covered|work can wait|deadline/.test(seriousBoss.html), "The reported boss combination must not promise workplace coverage");

element("helpOffer").value = "I can bring dinner on Thursday.";
const partnerHelp = renderFor({ recipient: "partner", situation: "chronic", tone: "heartfelt", format: "email" });
const partnerParagraphs = [...partnerHelp.html.matchAll(/<p>(.*?)<\/p>/gs)].map((match) => match[1]);
assert(partnerParagraphs.every((text) => text.includes("I can bring dinner on Thursday.") && !/errands|reminders|quiet company|handle food/.test(text)), "The reported partner combination must use only the authored dinner offer");

element("helpOffer").value = "drop off dinner this week";
const friendHelp = renderFor({ recipient: "friend", situation: "surgery", tone: "supportive", format: "text" });
assert(!/run an errand|sit quietly|childcare|meals, rides/.test(friendHelp.html), "The reported friend combination must replace its generic help list");

element("helpOffer").value = "I can bring dinner on Thursday.";
const groupAuthored = renderFor({ recipient: "friend", situation: "surgery", tone: "supportive", format: "group" });
const groupParagraphs = [...groupAuthored.html.matchAll(/<p>(.*?)<\/p>/gs)].map((match) => match[1]);
assert(groupParagraphs.every((text) => !/\b(?:I|me|my)\b/.test(text.replace("I can bring dinner on Thursday.", ""))), "Only the user's complete authored offer may keep an individual sender in a group card");
assert(/wording you entered/.test(groupAuthored.note), "Group results should explain why a complete authored offer retains its sender");
element("helpOffer").value = "";

element("personName").value = "Alex";
element("helpOffer").value = "I can cover tomorrow's notes";
context.__renderMessages();
assert(element("messageResults").innerHTML.includes("Alex"), "Personalized finder result should include current name");
element("personName").value = "";
element("helpOffer").value = "";
context.__renderMessages();
assert(!element("messageResults").innerHTML.includes("Alex"), "Cleared name should be removed from rendered results");
assert(!element("messageResults").innerHTML.includes("tomorrow"), "Cleared help offer should be removed from rendered results");

for (const filters of signatureCombos) {
  const textSignature = context.__buildFinderMessages(filters).map((message) => message.text).join("\n");
  signatures.add(textSignature);
}

assert(signatures.size === signatureCombos.length, "Representative finder selections produced duplicate message sets");

async function validateUsageAnalytics() {
  assert(analyticsEvents.length === 0, "Rendering and personalization must not send usage events");
  renderFor({ recipient: "friend", situation: "minor", tone: "heartfelt", format: "text" });
  element("personName").value = "Private Person";
  element("helpOffer").value = "email private@example.com about dinner";
  element("topicSearch").value = "private search query";

  for (const id of ["personName", "helpOffer"]) {
    for (const type of ["input", "change"]) {
      element(id).dispatch(type);
      element("finderForm").dispatch(type, element(id));
    }
  }
  element("topicSearch").dispatch("input");
  assert(analyticsEvents.length === 0, "Names, help offers, and search input must not send usage events");

  for (const [id, value] of [["recipient", "coworker"], ["situation", "surgery"], ["tone", "religious"], ["format", "group"]]) {
    element(id).value = value;
    const before = analyticsEvents.length;
    element("finderForm").dispatch("input", element(id));
    assert(analyticsEvents.length === before, "Select input must not send a duplicate usage event");
    element("finderForm").dispatch("change", element(id));
    assert(analyticsEvents.length === before + 1, `${id} change should send one usage event`);
    assert(analyticsEvents.at(-1)[1] === "finder_use" && analyticsEvents.at(-1)[2].action === "select", "Select should record finder_use");
  }
  assert(analyticsEvents.at(-1)[2].tone === "professional", "Analytics should use the effective workplace tone");

  for (const [action, tone] of [["shorter", "short"], ["warmer", "heartfelt"], ["safer", "supportive"]]) {
    const tune = { dataset: { action }, closest: (selector) => selector === "[data-action]" ? tune : null };
    const before = analyticsEvents.length;
    dispatch(documentListeners, "click", tune);
    assert(analyticsEvents.length === before + 1, `${action} should send one usage event`);
    const event = analyticsEvents.at(-1);
    assert(event[1] === "finder_use" && event[2].action === action && event[2].tone === tone, "Quick tune event should describe its action and effective tone");
    assertSelectedTone(tone);
    assert(element("resultsNote").textContent.startsWith("Switched to "), "Quick controls must describe switching tone rather than cumulative edits");
  }

  const beforeInvalid = analyticsEvents.length;
  for (const id of ["recipient", "situation", "tone", "format"]) {
    const original = element(id).value;
    element(id).value = "private@example.com";
    context.__trackFinderUse("select");
    element(id).value = original;
  }
  context.__trackFinderUse("private@example.com");
  assert(analyticsEvents.length === beforeInvalid, "Non-whitelisted fields and actions must not be sent");

  const privateCopy = "Dear Private Person,\n\nEmail private@example.com about dinner.\n\nWith love,\nYour family";
  function copyTrigger(source) {
    const trigger = {
      dataset: { copy: privateCopy },
      textContent: source === "finder" ? "Copy message" : privateCopy,
      classList: { add() {}, remove() {}, contains: (name) => name === "copy-line" && source !== "finder" },
      closest(selector) {
        if (selector === "[data-copy]") return trigger;
        if (selector === "#messageResults" && source === "finder") return element("messageResults");
        if (selector === ".examples-section" && source === "homepage") return element("examples");
        return null;
      }
    };
    return trigger;
  }

  context.document.execCommand = () => true;
  for (const source of ["article", "finder", "homepage"]) {
    const before = analyticsEvents.length;
    const trigger = copyTrigger(source);
    dispatch(documentListeners, "click", trigger);
    assert(analyticsEvents.length === before + 1, "Successful fallback copy should send one event");
    assert(analyticsEvents.at(-1)[1] === "copy_message" && analyticsEvents.at(-1)[2].source === source, "Copy source must distinguish article, finder, and homepage examples");
    assert(trigger.textContent === (source === "finder" ? "Copied" : privateCopy), "Copying an article or homepage example must preserve its displayed text and height");
  }

  const beforeFailure = analyticsEvents.length;
  context.document.execCommand = () => false;
  dispatch(documentListeners, "click", copyTrigger("article"));
  assert(analyticsEvents.length === beforeFailure, "Failed fallback copy must not send an event");
  assert(element("toast").textContent === "Could not copy", "Copy failure should keep its feedback");

  context.window.isSecureContext = true;
  let copiedText = "";
  context.navigator.clipboard = { writeText: (text) => { copiedText = text; return Promise.resolve(); } };
  const beforeClipboard = analyticsEvents.length;
  dispatch(documentListeners, "click", copyTrigger("finder"));
  assert(analyticsEvents.length === beforeClipboard, "Clipboard event must wait for success");
  await new Promise(setImmediate);
  assert(copiedText === privateCopy, "Copy should preserve the complete message, including paragraph and signature line breaks");
  assert(analyticsEvents.length === beforeClipboard + 1 && analyticsEvents.at(-1)[2].source === "finder", "Successful Clipboard API copy should send one event");

  context.navigator.clipboard.writeText = () => Promise.reject(new Error("Clipboard blocked"));
  const beforeRejected = analyticsEvents.length;
  dispatch(documentListeners, "click", copyTrigger("finder"));
  await new Promise(setImmediate);
  assert(analyticsEvents.length === beforeRejected, "Rejected Clipboard API and failed fallback must not send an event");
  context.document.execCommand = () => true;
  dispatch(documentListeners, "click", copyTrigger("finder"));
  await new Promise(setImmediate);
  assert(analyticsEvents.length === beforeRejected + 1, "Rejected Clipboard API with successful fallback should send exactly one event");

  function downloadTrigger(cardPack, paperSize) {
    const trigger = {
      dataset: { cardDownload: cardPack, paperSize },
      closest: (selector) => selector === "[data-card-download]" ? trigger : null
    };
    return trigger;
  }

  for (const paper of ["a4", "letter"]) {
    const before = analyticsEvents.length;
    dispatch(documentListeners, "click", downloadTrigger("teacher-get-well-cards", paper));
    assert(analyticsEvents.length === before + 1, "A card download click should send one intent event");
    const [, name, params] = analyticsEvents.at(-1);
    assert(name === "card_download_click" && params.paper_size === paper && params.card_pack === "teacher-get-well-cards", "Card intent should record the selected pack and paper size");
  }
  const beforeInvalidDownload = analyticsEvents.length;
  dispatch(documentListeners, "click", downloadTrigger("private@example.com", "a4"));
  dispatch(documentListeners, "click", downloadTrigger("teacher-get-well-cards", "private@example.com"));
  assert(analyticsEvents.length === beforeInvalidDownload, "Unrecognized card packs and paper sizes must not be tracked");

  for (const event of analyticsEvents) {
    const [command, name, parameters] = event;
    const allowedKeys = name === "copy_message"
      ? ["source", "page_path"]
      : name === "card_download_click"
        ? ["card_pack", "paper_size", "page_path"]
        : ["action", "recipient", "situation", "tone", "format", "page_path"];
    assert(command === "event", "Usage should use the existing gtag event API");
    assert(Object.keys(parameters).length === allowedKeys.length && Object.keys(parameters).every((key) => allowedKeys.includes(key)), "Events must contain only approved fields");
    assert(parameters.page_path === context.window.location.pathname, "Events must use pathname without query or hash");
    assert(!/Private Person|private@example|private search|dinner|\?|#/.test(JSON.stringify(parameters)), "Usage events must not contain message, name, help, email, search, query, or hash data");
  }

  for (const gtag of [undefined, () => { throw new Error("Analytics unavailable"); }]) {
    context.window.gtag = gtag;
    dispatch(documentListeners, "click", downloadTrigger("teacher-get-well-cards", "a4"));
    element("recipient").value = "family";
    element("finderForm").dispatch("change", element("recipient"));
    assert(element("resultsTitle").textContent.includes("family"), "Analytics failure must not prevent finder updates");
    const trigger = copyTrigger("finder");
    context.navigator.clipboard.writeText = () => Promise.resolve();
    dispatch(documentListeners, "click", trigger);
    await new Promise(setImmediate);
    assert(trigger.textContent === "Copied" && element("toast").textContent === "Copied", "Analytics failure must not prevent copy success feedback");
  }

  console.log(`Validated finder generation across ${combos.length} selection sets and privacy-safe usage analytics.`);
}

validateUsageAnalytics().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
