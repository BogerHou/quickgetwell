const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildModel, wrapText, makeEvent, toolNames, draw, mount } = require("./assets/experiments/care-studio-v1");
const { siteUrl } = require("./site.config");

const route = "/resources/care-studio/";
const tools = ["card", "help", "preferences"];
const privateText = "Dear Zoë 🌷,\nYour private note <script>alert('example')</script> stays here.";
const privateHelper = "Private Person";
const source = fs.readFileSync(path.join(__dirname, "assets/experiments/care-studio-v1.js"), "utf8");
const count = (text) => Array.from(text).length;

function context() {
  return {
    font: "35px Arial", fillText() {}, clearRect() {}, fillRect() {}, strokeRect() {},
    beginPath() {}, arc() {}, fill() {}, save() {}, translate() {}, rotate() {},
    moveTo() {}, quadraticCurveTo() {}, stroke() {}, ellipse() {}, restore() {}, lineTo() {},
    measureText(text) { return { width: count(text) * Number.parseInt(this.font, 10) * 0.6 }; }
  };
}

function validateModels() {
  assert.deepEqual(Object.keys(toolNames), tools);
  assert.equal(buildModel("unknown").valid, false);
  for (const tool of ["card", "help"]) assert.equal(buildModel(tool).valid, false, `${tool}: a blank editor must not export a pretend result`);
  assert.equal(buildModel("card", { message: " \n\t " }).valid, false);
  const card = buildModel("card", { message: `  ${privateText}\r\nSecond line.  `, to: "  Zoë 🌷  ", from: "  Class 4  ", heading: "thank-you", theme: "ink" });
  assert.equal(card.valid, true);
  assert.equal(card.to, "Zoë 🌷");
  assert.equal(card.from, "Class 4");
  assert.equal(card.lines[0], `${privateText}\nSecond line.`, "The editor must keep the author's words and line breaks, without turning them into HTML");
  assert(card.text.includes(privateText));
  assert.equal(card.heading, "Thank you");
  assert.equal(card.theme, "ink");
  const longCard = buildModel("card", { message: "🌷".repeat(400), to: "🌷".repeat(100), from: "🌷".repeat(100) });
  assert.equal(count(longCard.lines[0]), 320);
  assert.equal(count(longCard.to), 40);
  assert.equal(count(longCard.from), 50);
  assert.equal(longCard.lines[0], "🌷".repeat(320), "Length limits must not split surrogate pairs");
  assert.equal(buildModel("card", { heading: privateText, theme: privateText, message: "Hello" }).theme, "botanical");
  assert(!buildModel("card", { heading: privateText, message: "Hello" }).heading.includes(privateText));

  assert.equal(buildModel("help", { time1: "Tuesday", time3: "Sunday" }).valid, false, "A time alone is not an offer of help");
  const help = buildModel("help", { time1: "Should not appear", task2: "Walk the dog", time2: "Tuesday", task3: "Pick up groceries", from: "Sam" });
  assert.equal(help.valid, true);
  assert(help.text.includes("Walk the dog") && help.text.includes("Tuesday") && help.text.includes("Pick up groceries"));
  assert(!help.text.includes("Should not appear"), "An orphaned time must not become a fake offer");
  assert(help.lines.every((line) => typeof line === "string"));
  assert(help.text.includes("pass") || help.text.includes("decline"), "An offer must leave the recipient a way to decline");
  const cappedHelp = buildModel("help", { task1: "🌷".repeat(90), time1: "🫶".repeat(90), from: "🌷".repeat(60) });
  assert(cappedHelp.text.includes("🌷".repeat(70)) && !cappedHelp.text.includes("🌷".repeat(71)));
  assert(cappedHelp.text.includes("🫶".repeat(50)) && !cappedHelp.text.includes("🫶".repeat(51)));

  assert.equal(buildModel("preferences").valid, true);
  for (const values of [{ contact: "via-person" }, { updates: "person" }, { contact: "via-person", updates: "person", helper: " \n " }]) {
    assert.equal(buildModel("preferences", values).valid, false, "A contact-person choice needs an identified, agreed helper");
  }
  const preferences = buildModel("preferences", { contact: "via-person", updates: "person", helper: privateHelper, note: privateText, visits: "no-visits" });
  assert.equal(preferences.valid, true);
  assert(preferences.text.includes(privateHelper) && preferences.text.includes(privateText));
  assert.match(preferences.text, /not having visitors/i);
  const staleHelper = buildModel("preferences", { contact: "quiet", updates: "private", helper: privateHelper });
  assert(!staleHelper.text.includes(privateHelper), "A previously entered helper must not appear after switching to private/quiet choices");
  const cappedPreferences = buildModel("preferences", { contact: "via-person", helper: "🌷".repeat(80), note: "🫶".repeat(200) });
  assert(cappedPreferences.text.includes("🌷".repeat(50)) && !cappedPreferences.text.includes("🌷".repeat(51)));
  assert(cappedPreferences.text.includes("🫶".repeat(160)) && !cappedPreferences.text.includes("🫶".repeat(161)));
}

function validateWrapping() {
  const fixedWidth = { measureText: (text) => ({ width: count(text) * 10 }) };
  assert.deepEqual(wrapText(fixedWidth, "First\n\nThird", 100), ["First", "", "Third"]);
  assert.deepEqual(wrapText(fixedWidth, "abc\r\nxyz".replace(/\r\n/g, "\n"), 40), ["abc", "xyz"]);
  for (const text of ["averylongunbrokenword", "你好世界祝早日康复", "🌷🫶🌷🫶🌷🫶"]) {
    const lines = wrapText(fixedWidth, text, 40);
    assert.equal(lines.join(""), text, "Wrapping must preserve every character of an unbroken token");
    assert(lines.every((line) => fixedWidth.measureText(line).width <= 40), "A long token must wrap within the canvas");
  }
  assert.equal(draw(context(), buildModel("card", { message: "Thinking of you today." })), true);
  const tooManyLines = buildModel("card", { message: "x\n".repeat(150) });
  assert.equal(tooManyLines.valid, true);
  assert.equal(draw(context(), tooManyLines), false, "An image that cannot fit must be refused, not silently clipped");
  assert.equal(tooManyLines.lines[0], "x\n".repeat(150).trim(), "Overflow refusal must leave the full text available to copy");
}

function validateEventContract() {
  const injected = { action: "copied", rating: "not-useful", reason: "hard-to-edit", next_feature: "photo", message: privateText, helper: privateHelper, page_path: "/?name=secret", experiment_id: "secret", tool_id: "secret", to: "private@example.com" };
  for (const name of ["care_tool_view", "care_tool_start", "care_export", "care_feedback"]) {
    for (const tool of tools) {
      const event = makeEvent(name, tool, injected);
      assert(event);
      assert.equal(event.name, name);
      assert.equal(event.parameters.page_path, route);
      assert.equal(event.parameters.experiment_id, "care_studio_v1");
      assert.equal(event.parameters.tool_id, tool);
      const permitted = ["experiment_id", "tool_id", "page_path", ...(name === "care_export" ? ["action"] : []), ...(name === "care_feedback" ? ["rating", "reason", "next_feature"] : [])];
      assert.deepEqual(Object.keys(event.parameters).sort(), permitted.sort());
      assert.doesNotMatch(JSON.stringify(event), /Private Person|private@example|private note|name=secret|<script>/, "Analytics must not include private content or URL parameters");
    }
  }
  for (const action of ["png_created", "print_opened", "copied"]) assert(makeEvent("care_export", "card", { action }));
  for (const rating of ["useful", "not-useful", "not-sure"]) assert(makeEvent("care_feedback", "card", { rating }));
  for (const reason of ["hard-to-edit", "design", "export", "not-needed", "other"]) assert.equal(makeEvent("care_feedback", "help", { rating: "not-useful", reason }).parameters.reason, reason);
  for (const next of ["group-card", "photo", "drawing", "more-layouts", "nothing"]) assert.equal(makeEvent("care_feedback", "help", { rating: "useful", next_feature: next }).parameters.next_feature, next);
  assert.equal(makeEvent("care_feedback", "card", { rating: "useful", reason: "hard-to-edit" }).parameters.reason, undefined, "Hidden stale reason fields must not be attributed to positive feedback");
  assert.equal(makeEvent("care_feedback", "card", { rating: "useful", reason: privateText, next_feature: privateText }).parameters.next_feature, undefined);
  assert.equal(makeEvent("care_export", "card", { action: "sent-to-recipient" }), null);
  assert.equal(makeEvent("care_export", "card", { action: privateText }), null);
  assert.equal(makeEvent("care_feedback", "card", { rating: privateText }), null);
  assert.equal(makeEvent("other_event", "card", injected), null);
  assert.equal(makeEvent("care_export", privateHelper, injected), null);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|FormData|localStorage|sessionStorage|indexedDB)\b|\.innerHTML\s*=/, "Private editor content must not be uploaded, persisted or interpolated into HTML");
}

function node(properties = {}) {
  const listeners = new Map();
  const classes = new Set();
  return {
    value: "", textContent: "", dataset: {}, hidden: false, disabled: false, focused: 0, style: {},
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name), contains: (name) => classes.has(name) },
    setAttribute() {}, appendChild() {}, remove() {}, select() {}, click() {}, focus() { this.focused++; },
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(fn); },
    async dispatch(type, extra = {}) {
      const event = { target: this, preventDefault() {}, ...extra };
      await Promise.all((listeners.get(type) || []).map((fn) => fn(event)));
    },
    ...properties
  };
}

function fixture(options = {}) {
  const nodes = new Map(), events = [], copied = [], urls = new Set(), revoked = [], downloads = [], timers = [];
  const get = (id) => { if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id); };
  const fields = {
    card: { "card-heading": "thinking", "card-to": "", "card-message": "", "card-from": "", "card-theme": "botanical" },
    help: { "help-task-1": "", "help-time-1": "", "help-task-2": "", "help-time-2": "", "help-task-3": "", "help-time-3": "", "help-from": "" },
    preferences: { "preferences-contact": "text", "preferences-visits": "ask-first", "preferences-updates": "self", "preferences-helper": "", "preferences-note": "" }
  };
  const exports = tools.flatMap((tool) => ["png", "print", "copy"].map((action) => node({ dataset: { for: tool, export: action } })));
  const toolButtons = tools.map((tool) => node({ dataset: { tool } }));
  const panels = tools.map((tool) => node({ dataset: { toolPanel: tool } }));
  const resetButtons = tools.map((tool) => node({ dataset: { reset: tool } }));
  const resetYes = tools.map((tool) => node({ dataset: { resetYes: tool } }));
  const resetNo = tools.map((tool) => node({ dataset: { resetNo: tool } }));
  const resetConfirmations = tools.map((tool, index) => node({ dataset: { resetConfirm: tool }, hidden: true, querySelector: () => resetYes[index] }));
  const helperField = node({ hidden: true }), feedbackReason = node({ hidden: true }), feedbackSubmit = node();
  const feedback = get("care-feedback-form");
  feedback.elements = { rating: node(), reason: node(), next_feature: node() };
  feedback.reset = () => Object.values(feedback.elements).forEach((field) => { field.value = ""; });
  feedback.reportValidity = () => !!feedback.elements.rating.value;
  feedback.querySelector = (selector) => selector === "[data-feedback-reason]" ? feedbackReason : feedbackSubmit;
  for (const tool of tools) {
    const form = get(`care-${tool}-form`);
    form.reset = () => Object.entries(fields[tool]).forEach(([id, value]) => { get(id).value = value; });
    form.querySelector = () => get(Object.keys(fields[tool])[0]);
    form.reset();
    const canvas = get(`care-${tool}-canvas`);
    canvas.getContext = () => {
      if (options.canvasThrows) throw new Error("Canvas disabled by browser");
      return options.noCanvas ? null : context();
    };
    canvas.toBlob = (callback) => callback(options.blobFailure ? null : { type: "image/png" });
  }
  for (const [id, value] of Object.entries(options.restoredFields || {})) get(id).value = value;
  const previousFocus = node();
  const doc = {
    activeElement: previousFocus, body: node(),
    getElementById: get,
    querySelectorAll(selector) {
      if (selector === "[data-export]") return exports;
      if (selector === "[data-tool]") return toolButtons;
      if (selector === "[data-tool-panel]") return panels;
      if (selector === "[data-helper-field]") return [helperField];
      if (selector === "[data-feedback-tool]") return [node()];
      if (selector === "[data-reset]") return resetButtons;
      if (selector === "[data-reset-yes]") return resetYes;
      if (selector === "[data-reset-no]") return resetNo;
      const match = selector.match(/^\[data-export\]\[data-for="([^"]+)"\]$/);
      if (match) return exports.filter((button) => button.dataset.for === match[1]);
      throw new Error(`Unexpected selector: ${selector}`);
    },
    querySelector(selector) {
      const confirmation = selector.match(/^\[data-reset-confirm="([^"]+)"\]$/);
      if (confirmation) return resetConfirmations[tools.indexOf(confirmation[1])];
      const button = selector.match(/^\[data-reset="([^"]+)"\]$/);
      if (button) return resetButtons[tools.indexOf(button[1])];
      throw new Error(`Unexpected selector: ${selector}`);
    },
    createElement(tag) {
      const created = node();
      if (tag === "a") created.click = () => downloads.push(created.download);
      if (tag === "img") created.decode = () => Promise.resolve();
      return created;
    },
    execCommand: () => options.fallbackResult ?? true
  };
  const win = node({
    document: doc, isSecureContext: true,
    location: { hostname: options.hostname || "quickgetwell.com", pathname: route, search: "?name=Private+Person", hash: "#private@example.com" },
    qgwCareAnalyticsReady: options.analyticsReady ?? true,
    navigator: { onLine: options.online ?? true, clipboard: { writeText: async (text) => { if (options.copyFails) throw new Error("Unavailable"); copied.push(text); } } },
    gtag: (...args) => events.push(args),
    URL: { createObjectURL: () => { const url = `blob:local-${urls.size}`; urls.add(url); return url; }, revokeObjectURL: (url) => { revoked.push(url); urls.delete(url); } },
    setTimeout: (callback) => timers.push(callback),
    print: () => { win.prints = (win.prints || 0) + 1; }
  });
  mount(win);
  return {
    nodes, events, copied, exports, urls, revoked, downloads, timers, feedback, feedbackSubmit, helperField, win, resetConfirmations,
    async input(id, value, tool = "card") { get(id).value = value; await get(`care-${tool}-form`).dispatch("input"); },
    select: (tool) => toolButtons.find((button) => button.dataset.tool === tool).dispatch("click"),
    reset: (tool, action) => ({ open: resetButtons, confirm: resetYes, cancel: resetNo }[action][tools.indexOf(tool)]).dispatch("click"),
    export: (tool, action) => exports.find((button) => button.dataset.for === tool && button.dataset.export === action).dispatch("click")
  };
}

async function validateBehavior() {
  const app = fixture();
  assert.equal(app.events.filter((event) => event[1] === "care_tool_view").length, 1);
  assert(app.exports.filter((button) => button.dataset.for === "card").every((button) => button.disabled));
  await app.input("card-message", privateText);
  await app.input("card-to", privateHelper);
  assert.equal(app.events.filter((event) => event[1] === "care_tool_start").length, 1, "Editing several fields must count one start per tool and visit");
  await app.export("card", "copy");
  assert(app.copied[0].includes(privateText));
  assert.equal(app.events.at(-1)[2].action, "copied");
  await app.export("card", "png");
  assert.deepEqual(app.downloads, ["quickgetwell-card.png"]);
  assert.equal(app.events.at(-1)[2].action, "png_created");
  app.timers.forEach((callback) => callback());
  assert.equal(app.urls.size, 0, "Download object URLs must be released");
  await app.export("card", "print");
  assert.equal(app.win.prints, 1);
  assert.equal(app.events.at(-1)[2].action, "print_opened");
  await app.win.dispatch("afterprint");
  assert.equal(app.urls.size, 0, "Cancelling or completing printing must release the print image");
  await app.select("preferences");
  await app.input("preferences-contact", "via-person", "preferences");
  assert.equal(app.helperField.hidden, false);
  assert(app.exports.filter((button) => button.dataset.for === "preferences").every((button) => button.disabled));
  await app.input("preferences-helper", privateHelper, "preferences");
  assert(app.exports.filter((button) => button.dataset.for === "preferences").every((button) => !button.disabled));
  app.feedback.elements.rating.value = "not-useful";
  app.feedback.elements.reason.value = "hard-to-edit";
  app.feedback.elements.next_feature.value = "group-card";
  await app.feedback.dispatch("submit");
  await app.feedback.dispatch("submit");
  assert.equal(app.events.filter((event) => event[1] === "care_feedback").length, 1, "Feedback must not be accidentally counted twice in one visit");
  assert.equal(app.feedbackSubmit.disabled, true);
  assert.doesNotMatch(JSON.stringify(app.events), /Private Person|private@example|private note|<script>/);

  const preview = fixture({ hostname: "127.0.0.1" });
  await preview.input("card-message", privateText);
  await preview.export("card", "copy");
  preview.feedback.elements.rating.value = "useful";
  await preview.feedback.dispatch("submit");
  assert.equal(preview.events.length, 0, "Local previews must not pollute production analytics");
  assert.match(preview.nodes.get("care-feedback-status").textContent, /not sent/i);

  const unavailable = fixture({ analyticsReady: false });
  unavailable.feedback.elements.rating.value = "useful";
  await unavailable.feedback.dispatch("submit");
  assert.equal(unavailable.events.filter((event) => event[1] === "care_feedback").length, 0);
  assert.match(unavailable.nodes.get("care-feedback-status").textContent, /could not be sent/i);

  const offline = fixture({ online: false });
  offline.feedback.elements.rating.value = "useful";
  await offline.feedback.dispatch("submit");
  assert.equal(offline.events.filter((event) => event[1] === "care_feedback").length, 0, "Offline feedback must not be counted as sent");
  assert.equal(offline.feedbackSubmit.disabled, false, "An offline attempt must remain retryable");
  assert.match(offline.nodes.get("care-feedback-status").textContent, /could not be sent/i);
  offline.win.navigator.onLine = true;
  await offline.feedback.dispatch("submit");
  assert.equal(offline.events.filter((event) => event[1] === "care_feedback").length, 1, "The same feedback can be retried when connectivity returns");
  assert.equal(offline.feedbackSubmit.disabled, true);

  const failedCopy = fixture({ copyFails: true, fallbackResult: false });
  await failedCopy.input("card-message", privateText);
  await failedCopy.export("card", "copy");
  assert.equal(failedCopy.events.filter((event) => event[1] === "care_export").length, 0, "A failed clipboard action is not a successful export");
  assert.match(failedCopy.nodes.get("care-card-status").textContent, /could not copy/i);
  const failedImage = fixture({ blobFailure: true });
  await failedImage.input("card-message", privateText);
  await failedImage.export("card", "png");
  assert.equal(failedImage.events.filter((event) => event[1] === "care_export").length, 0);
  assert.match(failedImage.nodes.get("care-card-status").textContent, /could not prepare/i);

  const overflow = fixture();
  await overflow.input("card-message", "x\n".repeat(150));
  assert(overflow.exports.filter((button) => button.dataset.for === "card" && button.dataset.export !== "copy").every((button) => button.disabled));
  assert.equal(overflow.exports.find((button) => button.dataset.for === "card" && button.dataset.export === "copy").disabled, false);
  await overflow.export("card", "copy");
  assert(overflow.copied[0].includes("x\n".repeat(149)));
  const noCanvas = fixture({ noCanvas: true });
  await noCanvas.input("card-message", privateText);
  assert.equal(noCanvas.exports.find((button) => button.dataset.for === "card" && button.dataset.export === "copy").disabled, false);
  const blockedCanvas = fixture({ canvasThrows: true });
  await blockedCanvas.input("card-message", privateText);
  assert.match(blockedCanvas.nodes.get("care-card-status").textContent, /preview is unavailable/i);
  assert(blockedCanvas.exports.filter((button) => button.dataset.for === "card" && button.dataset.export !== "copy").every((button) => button.disabled));
  assert.equal(blockedCanvas.exports.find((button) => button.dataset.for === "card" && button.dataset.export === "copy").disabled, false);
  await blockedCanvas.export("card", "copy");
  assert(blockedCanvas.copied[0].includes(privateText), "A browser Canvas exception must leave the complete text-copy path usable");
  assert.equal(blockedCanvas.events.at(-1)[2].action, "copied");

  const restored = fixture({ restoredFields: {
    "card-to": privateHelper, "card-message": privateText,
    "help-task-1": privateText, "help-time-1": "Private time",
    "preferences-contact": "via-person", "preferences-helper": privateHelper, "preferences-note": privateText
  } });
  for (const id of ["card-to", "card-message", "help-task-1", "help-time-1", "preferences-helper", "preferences-note"]) {
    assert.equal(restored.nodes.get(id).value, "", `Initial browser-restored field must be cleared: ${id}`);
  }
  assert.equal(restored.nodes.get("preferences-contact").value, "text");
  for (const tool of tools) assert.doesNotMatch(restored.nodes.get(`care-${tool}-text`).textContent, /Private Person|private note|Private time/, "Restored private content must never enter the initial preview");
  assert(restored.exports.filter((button) => button.dataset.for === "card").every((button) => button.disabled));
  await noCanvas.reset("card", "open");
  assert.equal(noCanvas.resetConfirmations[0].hidden, false);
  assert.equal(noCanvas.nodes.get("card-message").value, privateText, "Opening Clear must not discard the draft");
  await noCanvas.reset("card", "cancel");
  assert.equal(noCanvas.nodes.get("card-message").value, privateText, "Cancelling Clear must preserve the draft");
  await noCanvas.reset("card", "open");
  await noCanvas.reset("card", "confirm");
  assert.equal(noCanvas.nodes.get("card-message").value, "");
  assert.equal(noCanvas.resetConfirmations[0].hidden, true);
  assert(noCanvas.exports.filter((button) => button.dataset.for === "card").every((button) => button.disabled));
  await app.win.dispatch("pageshow", { persisted: true });
  assert.equal(app.nodes.get("card-message").value, "", "Back navigation must not unexpectedly restore private draft fields");
  assert(!app.nodes.get("care-preferences-text").textContent.includes(privateHelper));
}

function validateGeneratedPage() {
  const dist = path.join(__dirname, "dist");
  const html = fs.readFileSync(path.join(dist, route, "index.html"), "utf8");
  const base = siteUrl.replace(/\/$/, "");
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1);
  assert.match(html, /<title>[^<]*(?:Card Maker|card maker)[^<]*<\/title>/);
  assert.match(html, /<meta name="robots" content="index,follow">/);
  assert(html.includes(`<link rel="canonical" href="${base}${route}">`));
  const urls = [...fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(urls.filter((url) => url === `${base}${route}`).length, 1);
  assert(html.includes('href="#main"') && html.includes('id="main"'));
  assert(html.includes("<noscript>") && html.includes("/resources/teacher-care-pack/"));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "No duplicate DOM IDs");
  for (const tag of html.matchAll(/<(?:input|select|textarea)\b[^>]*>/g)) {
    const id = tag[0].match(/\bid="([^"]+)"/)?.[1];
    assert(id && html.includes(`<label for="${id}">`), `Form control needs a visible label: ${tag[0]}`);
    const describedBy = tag[0].match(/\baria-describedby="([^"]+)"/)?.[1];
    if (describedBy) for (const reference of describedBy.split(/\s+/)) assert(ids.includes(reference), `Missing input description ${reference}`);
  }
  for (const tool of tools) {
    for (const suffix of ["form", "canvas", "text", "status"]) assert(ids.includes(`care-${tool}-${suffix}`));
    assert(html.includes(`data-tool="${tool}"`) && html.includes(`data-tool-panel="${tool}"`));
    for (const action of ["png", "print", "copy"]) assert(new RegExp(`data-export="${action}"\\s+data-for="${tool}"`).test(html));
    for (const attribute of ["data-reset-confirm", "data-reset-yes", "data-reset-no"]) assert(html.includes(`${attribute}="${tool}"`), `${tool}: clearing must offer a working confirmation/cancel path`);
  }
  assert.match(html, /Your words stay on this page/);
  assert.match(html, /don.t upload or save/i);
  assert.match(html, /no name or message text is sent/i);
  assert.match(html, /completed human editorial review is not recorded/);
  assert.doesNotMatch(html, /<input\b[^>]*\btype="(?:file|email)"/i, "The first experiment must not collect uploads or email addresses");
  assert.doesNotMatch(html, /<form\b[^>]*\baction=/i, "These local editors must not post entered words to a server");
  assert.doesNotMatch(html, /No names, message text, or health details are requested/, "The generic resource footer must not contradict the optional name/message fields");
  const ownScripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((match) => match[1]);
  assert(ownScripts.some((url) => url.startsWith("/assets/experiments/care-studio-v1.js")));
  for (const relative of ["index.html", "get-well-soon-messages-for-teacher/index.html", "get-well-soon-messages-for-client/index.html", "get-well-soon-messages-for-boss/index.html"]) {
    assert(!fs.readFileSync(path.join(dist, relative), "utf8").includes("care-studio-v1.js"), `${relative}: established traffic pages must not load the new editor`);
  }
}

async function main() {
  validateModels();
  validateWrapping();
  validateEventContract();
  await validateBehavior();
  validateGeneratedPage();
  console.log("Validated care studio: private local models, Unicode wrapping, safe analytics, copy/image/print failure handling, feedback deduplication, accessible generated forms and indexability.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
