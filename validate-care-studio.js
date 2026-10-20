const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildModel, wrapText, makeEvent, toolNames, artwork, draw, consumeTransfer, mount } = require("./assets/experiments/care-studio-v1");
const { siteUrl } = require("./site.config");
const { getEntries } = require("./content/card-message-catalog");

const route = "/resources/care-studio/";
const tools = ["card", "help", "preferences"];
const privateText = "Dear Zoë 🌷,\nYour private note <script>alert('example')</script> stays here.";
const privateHelper = "Private Person";
const source = fs.readFileSync(path.join(__dirname, "assets/experiments/care-studio-v1.js"), "utf8");
const count = (text) => Array.from(text).length;

function context(options = {}) {
  return {
    font: "35px Arial", fillText() {}, clearRect() {}, fillRect() {}, strokeRect() {},
    beginPath() {}, arc() {}, fill() {}, save() {}, translate() {}, rotate() {},
    moveTo() {}, quadraticCurveTo() {}, stroke() {}, ellipse() {}, restore() {}, lineTo() {},
    drawImage(image, ...dimensions) {
      if (options.drawFails) throw new Error("Canvas image decoding failed");
      this.lastImage = image;
      this.lastImageDimensions = dimensions;
    },
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
  assert.equal(count(longCard.lines[0]), 400);
  assert.equal(count(longCard.to), 40);
  assert.equal(count(longCard.from), 50);
  assert.equal(longCard.lines[0], "🌷".repeat(400), "An imported message must never be silently truncated");
  assert.equal(longCard.valid, false, "An overlong imported message must block export until its author shortens it");
  assert.equal(longCard.tooLong, true);
  const unicodeAtLimit = buildModel("card", { message: "🌷".repeat(320) });
  assert.equal(unicodeAtLimit.valid, true, "The 320-character limit must count Unicode code points, not UTF-16 units");
  assert.equal(unicodeAtLimit.lines[0], "🌷".repeat(320));
  const unicodeOverLimit = buildModel("card", { message: "🌷".repeat(321) });
  assert.equal(unicodeOverLimit.valid, false);
  assert.equal(unicodeOverLimit.tooLong, true);
  assert.equal(unicodeOverLimit.lines[0], "🌷".repeat(321), "Over-limit Unicode input must remain intact for revision");
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
  const image = { naturalWidth: 1122, naturalHeight: 1402 };
  const illustratedContext = context();
  assert.equal(draw(illustratedContext, buildModel("card", { message: "Thinking of you today." }), image), true);
  assert.equal(illustratedContext.lastImage, image);
  assert.deepEqual(illustratedContext.lastImageDimensions, [0, 0, 1200, 1500], "Every export must draw the illustration across the full 1200 × 1500 image");
  const tooManyLines = buildModel("card", { message: "x\n".repeat(150) });
  assert.equal(tooManyLines.valid, true);
  assert.equal(draw(context(), tooManyLines, image), false, "An image that cannot fit must be refused, not silently clipped");
  assert.equal(tooManyLines.lines[0], "x\n".repeat(150).trim(), "Overflow refusal must leave the full text available to copy");
  const overLimitContext = context();
  const rendered = [];
  overLimitContext.fillText = text => rendered.push(text);
  overLimitContext.measureText = () => { throw new Error("Over-limit body text must not be measured"); };
  assert.equal(draw(overLimitContext, buildModel("card", { message: "🌷".repeat(321), from: "Private signature" }), image), false);
  assert(!rendered.includes("Private signature"), "An over-limit image must not appear to be a completed signed card");
  assert(!rendered.some(text => text.includes("🌷")), "Over-limit input must not be clipped into the preview image");
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
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|FormData|localStorage|indexedDB)\b|\.innerHTML\s*=/, "Private editor content must not be uploaded or interpolated into HTML");
  assert.doesNotMatch(source, /sessionStorage\s*\.\s*setItem/, "The editor must only consume the explicit one-time handoff; normal draft edits must never be persisted");
}

function node(properties = {}) {
  const listeners = new Map();
  const classes = new Set();
  const attributes = new Map();
  return {
    value: "", textContent: "", dataset: {}, hidden: false, disabled: false, focused: 0, style: {}, children: [],
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name), contains: (name) => classes.has(name) },
    setAttribute(name, value) { attributes.set(name, value); }, getAttribute: (name) => attributes.get(name),
    appendChild(child) { this.children.push(child); return child; },
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = [...children]; },
    remove() {}, select() {}, click() {}, focus() { this.focused++; },
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(fn); },
    async dispatch(type, extra = {}) {
      const event = { target: this, preventDefault() {}, ...extra };
      await Promise.all((listeners.get(type) || []).map((fn) => fn(event)));
    },
    ...properties
  };
}

function fixture(options = {}) {
  const nodes = new Map(), events = [], copied = [], urls = new Set(), revoked = [], downloads = [], timers = [], images = [];
  const get = (id) => { if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id); };
  const catalogEntries = options.catalog ?? getEntries().slice(0, 16);
  get("care-message-catalog").textContent = JSON.stringify(catalogEntries);
  get("card-message-category").value = "all";
  const stored = new Map(options.transfer === undefined ? [] : [["qgw:card-transfer:v1", options.transfer]]);
  const storageReads = [], storageDeletes = [], storageWrites = [];
  const fields = {
    card: { "card-heading": "thinking", "card-to": "", "card-message": "", "card-from": "", "card-theme": "botanical", "card-message-category": "all" },
    help: { "help-task-1": "", "help-time-1": "", "help-task-2": "", "help-time-2": "", "help-task-3": "", "help-time-3": "", "help-from": "" },
    preferences: { "preferences-contact": "text", "preferences-visits": "ask-first", "preferences-updates": "self", "preferences-helper": "", "preferences-note": "" }
  };
  const exports = tools.flatMap((tool) => ["png", "print", "copy"].map((action) => node({ dataset: { for: tool, export: action } })));
  const toolButtons = tools.map((tool) => node({ dataset: { tool } }));
  const themeButtons = Object.keys(artwork).map((theme) => node({ dataset: { themeChoice: theme } }));
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
    canvas.context = context(options);
    canvas.getContext = () => {
      if (options.canvasThrows) throw new Error("Canvas disabled by browser");
      return options.noCanvas ? null : canvas.context;
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
      if (selector === "[data-theme-choice]") return themeButtons;
      if (selector === "[data-tool-panel]") return panels;
      if (selector === "[data-helper-field]") return [helperField];
      if (selector === "[data-feedback-tool]") return [node()];
      if (selector === "[data-reset]") return resetButtons;
      if (selector === "[data-reset-yes]") return resetYes;
      if (selector === "[data-reset-no]") return resetNo;
      if (selector === "[data-message-id]") return get("card-message-options").children.flatMap(item => item.children).filter(child => child.dataset.messageId);
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
    location: { hostname: options.hostname || "quickgetwell.com", pathname: route, search: options.search ?? "?name=Private+Person", hash: options.hash ?? "#private@example.com" },
    sessionStorage: {
      getItem(key) { storageReads.push(key); if (options.storageFailure) throw new Error("Storage unavailable"); return stored.get(key) ?? null; },
      removeItem(key) { storageDeletes.push(key); if (options.storageFailure) throw new Error("Storage unavailable"); stored.delete(key); },
      setItem(key, value) { storageWrites.push([key, value]); throw new Error("The editor must not write drafts"); }
    },
    URLSearchParams,
    qgwCareAnalyticsReady: options.analyticsReady ?? true,
    navigator: { onLine: options.online ?? true, clipboard: { writeText: async (text) => { if (options.copyFails) throw new Error("Unavailable"); copied.push(text); } } },
    gtag: (...args) => events.push(args),
    URL: { createObjectURL: () => { const url = `blob:local-${urls.size}`; urls.add(url); return url; }, revokeObjectURL: (url) => { revoked.push(url); urls.delete(url); } },
    setTimeout: (callback) => timers.push(callback),
    print: () => { win.prints = (win.prints || 0) + 1; }
  });
  win.Image = class {
    constructor() {
      this.naturalWidth = options.emptyImage ? 0 : 1122;
      this.naturalHeight = options.emptyImage ? 0 : 1402;
      images.push(this);
    }
    set src(value) {
      this._src = value;
      if (!options.manualImages) queueMicrotask(() => {
        if (options.imageFailure) this.onerror();
        else this.onload();
      });
    }
    get src() { return this._src; }
    decode() {
      if (options.decodeFailure) return Promise.reject(new Error("Invalid WebP"));
      if (options.manualDecode) return new Promise((resolve, reject) => {
        this.finishDecode = resolve;
        this.failDecode = reject;
      });
      return Promise.resolve();
    }
  };
  if (options.noImageApi) delete win.Image;
  mount(win);
  return {
    nodes, events, copied, exports, urls, revoked, downloads, timers, feedback, feedbackSubmit, helperField, win, resetConfirmations, images, themeButtons, catalogEntries, stored, storageReads, storageDeletes, storageWrites,
    flush: () => new Promise((resolve) => setImmediate(resolve)),
    async input(id, value, tool = "card") { get(id).value = value; await get(`care-${tool}-form`).dispatch("input"); },
    select: (tool) => toolButtons.find((button) => button.dataset.tool === tool).dispatch("click"),
    theme: (theme) => themeButtons.find((button) => button.dataset.themeChoice === theme).dispatch("click"),
    reset: (tool, action) => ({ open: resetButtons, confirm: resetYes, cancel: resetNo }[action][tools.indexOf(tool)]).dispatch("click"),
    export: (tool, action) => exports.find((button) => button.dataset.for === tool && button.dataset.export === action).dispatch("click")
  };
}

async function validateBehavior() {
  const app = fixture();
  await app.flush();
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

function validateOneTimeTransfer() {
  const key = "qgw:card-transfer:v1";
  const now = Date.now();
  const payloads = [
    [JSON.stringify({ text: privateText, createdAt: now }), privateText],
    [JSON.stringify({ text: "x".repeat(4000), createdAt: now }), "x".repeat(4000)],
    [JSON.stringify({ text: privateText, createdAt: now - 301000 }), null],
    [JSON.stringify({ text: privateText, createdAt: now + 60000 }), null],
    [JSON.stringify({ text: privateText, createdAt: "now" }), null],
    [JSON.stringify({ text: "x".repeat(4001), createdAt: now }), null],
    [JSON.stringify({ text: " \n ", createdAt: now }), null],
    [JSON.stringify({ text: 42, createdAt: now }), null],
    ["{bad json", null], ["null", null], ["[]", null], [null, null]
  ];
  for (const [stored, expected] of payloads) {
    const calls = [];
    const result = consumeTransfer({ sessionStorage: {
      getItem(name) { calls.push(["read", name]); return stored; },
      removeItem(name) { calls.push(["delete", name]); }
    } });
    assert.equal(result, expected);
    assert.deepEqual(calls, [["read", key], ["delete", key]], "Every handoff, even malformed/expired data, must be consumed before parsing");
  }
  assert.equal(consumeTransfer({ get sessionStorage() { throw new Error("Blocked storage"); } }), null);
  assert.equal(consumeTransfer({ sessionStorage: { getItem: () => "{}", removeItem() { throw new Error("Read-only storage"); } } }), null,
    "Do not load private transferred text if it cannot be removed");
}

async function validateMessageSelection() {
  const entries = getEntries();
  const publicEntry = entries[0];
  const imported = fixture({ hash: `#message=${publicEntry.id}`, transfer: JSON.stringify({ text: privateText, createdAt: Date.now() }) });
  await imported.flush();
  assert.equal(imported.nodes.get("card-message").value, publicEntry.text);
  assert.equal(imported.nodes.get("card-message-category").value, publicEntry.category);
  assert.equal(imported.stored.size, 0, "Even a public-message arrival must discard an unrelated pending private handoff");
  assert.equal(imported.storageWrites.length, 0);

  const finder = fixture({ hash: "#from=finder", transfer: JSON.stringify({ text: privateText, createdAt: Date.now() }) });
  await finder.flush();
  assert.equal(finder.nodes.get("card-message").value, privateText);
  assert.equal(finder.stored.size, 0);
  assert(finder.nodes.get("care-card-text").textContent.includes(privateText));
  assert.doesNotMatch(JSON.stringify(finder.events), /private note|Private Person|<script>/);
  await finder.input("card-message", "An edited private note");
  assert.equal(finder.storageWrites.length, 0, "Editing must not turn the one-time handoff into draft storage");

  const longText = "🌷".repeat(340);
  const longImport = fixture({ hash: "#from=finder", transfer: JSON.stringify({ text: longText, createdAt: Date.now() }) });
  await longImport.flush();
  assert.equal(longImport.nodes.get("card-message").value, longText, "The entire incoming message must remain available for editing");
  assert(longImport.exports.filter(button => button.dataset.for === "card").every(button => button.disabled));
  assert.match(longImport.nodes.get("care-card-status").textContent, /full message|shorten/i);
  assert.match(longImport.nodes.get("card-message-count").textContent, /340 \/ 320/);
  await longImport.export("card", "png");
  assert.equal(longImport.downloads.length, 0);
  await longImport.input("card-message", "A short revised message.");
  assert(longImport.exports.filter(button => button.dataset.for === "card").every(button => !button.disabled));

  const unicodeInput = fixture();
  await unicodeInput.flush();
  await unicodeInput.input("card-message", "🌷".repeat(320));
  assert.equal(unicodeInput.nodes.get("card-message").value, "🌷".repeat(320));
  assert.equal(unicodeInput.nodes.get("card-message").getAttribute("aria-invalid"), "false");
  assert.match(unicodeInput.nodes.get("card-message-count").textContent, /^320 \/ 320 characters$/);
  assert.equal(unicodeInput.exports.find(button => button.dataset.for === "card" && button.dataset.export === "copy").disabled, false);
  await unicodeInput.input("card-message", "🌷".repeat(321));
  assert.equal(unicodeInput.nodes.get("card-message").value, "🌷".repeat(321));
  assert.equal(unicodeInput.nodes.get("card-message").getAttribute("aria-invalid"), "true");
  assert(unicodeInput.nodes.get("care-card-text").textContent.includes("🌷".repeat(321)));
  assert(unicodeInput.exports.filter(button => button.dataset.for === "card").every(button => button.disabled));

  for (const options of [
    { hash: "#message=0000000000000000" },
    { hash: "#from=finder" },
    { hash: "#from=finder", storageFailure: true },
    { hash: "#from=finder", transfer: JSON.stringify({ text: privateText, createdAt: Date.now() - 301000 }) }
  ]) {
    const missing = fixture(options);
    assert.equal(missing.nodes.get("card-message").value, "");
    assert.match(missing.nodes.get("card-message-import-status").textContent, /could not be loaded/i);
    assert.equal(missing.nodes.get("card-message-picker").open, true);
  }
  const rawUrl = fixture({ search: `?message=${encodeURIComponent(privateText)}`, hash: `#message=${encodeURIComponent(privateText)}` });
  assert.equal(rawUrl.nodes.get("card-message").value, "", "Arbitrary URL message text must never populate the editor");

  const selection = fixture();
  await selection.flush();
  await selection.input("card-message", privateText);
  await selection.input("card-to", privateHelper);
  await selection.input("card-from", "Private Sender");
  await selection.theme("ink");
  const choices = () => selection.nodes.get("card-message-options").children.flatMap(item => item.children).filter(child => child.dataset.messageId);
  assert.equal(choices().length, 6, "Show a manageable six examples at a time");
  const firstButton = choices()[0];
  await firstButton.dispatch("click");
  const selectedText = entries.find(entry => entry.id === firstButton.dataset.messageId).text;
  assert.equal(selection.nodes.get("card-message").value, selectedText);
  assert.equal(selection.nodes.get("card-to").value, privateHelper);
  assert.equal(selection.nodes.get("card-from").value, "Private Sender");
  assert.equal(selection.nodes.get("card-theme").value, "ink", "Choosing words must retain the design and signatures");
  assert.equal(selection.nodes.get("card-message-undo").hidden, false);
  await selection.nodes.get("card-message-undo").dispatch("click");
  assert.equal(selection.nodes.get("card-message").value, privateText, "Undo restores the previous message exactly");
  assert.equal(selection.nodes.get("card-message-undo").hidden, true);
  assert.equal(selection.nodes.get("card-theme").value, "ink");
  await selection.nodes.get("card-message-more").dispatch("click");
  assert.notEqual(choices()[0].dataset.messageId, firstButton.dataset.messageId);
  await choices()[0].dispatch("click");
  await selection.win.dispatch("pageshow", { persisted: true });
  assert.equal(selection.nodes.get("card-message").value, "");
  assert.equal(selection.nodes.get("card-message-undo").hidden, true, "A discarded draft must not remain recoverable through Undo");
  assert.equal(selection.storageWrites.length, 0);

  const resetPicker = fixture();
  const pickerButtons = () => resetPicker.nodes.get("card-message-options").children
    .flatMap(item => item.children).filter(child => child.dataset.messageId);
  const category = resetPicker.catalogEntries.find(entry => entry.category !== resetPicker.catalogEntries[0].category).category;
  const categoryEntries = resetPicker.catalogEntries.filter(entry => entry.category === category);
  assert(categoryEntries.length > 6, "Reset regression needs a category with a second page of examples");
  resetPicker.nodes.get("card-message-category").value = category;
  await resetPicker.nodes.get("card-message-category").dispatch("change");
  await resetPicker.nodes.get("card-message-more").dispatch("click");
  assert.equal(pickerButtons()[0].dataset.messageId, categoryEntries[6].id);
  await resetPicker.reset("card", "open");
  await resetPicker.reset("card", "cancel");
  assert.equal(resetPicker.nodes.get("card-message-category").value, category);
  assert.equal(pickerButtons()[0].dataset.messageId, categoryEntries[6].id, "Cancelling Clear must preserve the current picker category and page");
  await resetPicker.reset("card", "open");
  await resetPicker.reset("card", "confirm");
  assert.equal(resetPicker.nodes.get("card-message-category").value, "all");
  assert.deepEqual(pickerButtons().map(button => button.dataset.messageId), resetPicker.catalogEntries.slice(0, 6).map(entry => entry.id),
    "Confirmed Clear must rebuild the first page of all examples to match the reset category control");
  assert.match(resetPicker.nodes.get("card-message-picker-status").textContent, /^Messages 1–6 of /);
}

async function validateIllustrationReadiness() {
  const imagesFor = (app, theme) => app.images.filter((image) => image.src === artwork[theme]);
  const imageButtons = (app, tool = "card") => app.exports.filter((button) => button.dataset.for === tool && button.dataset.export !== "copy");
  const copyButton = (app, tool = "card") => app.exports.find((button) => button.dataset.for === tool && button.dataset.export === "copy");
  const waiting = fixture({ manualImages: true, manualDecode: true });
  await waiting.input("card-message", privateText);
  assert(imageButtons(waiting).every((button) => button.disabled), "An image cannot be exported before its illustration is loaded");
  assert.equal(copyButton(waiting).disabled, false, "Text copying remains available while the artwork is loading");
  assert.match(waiting.nodes.get("care-card-status").textContent, /loading your illustration/i);
  await waiting.export("card", "png");
  await waiting.export("card", "print");
  assert.equal(waiting.downloads.length, 0);
  assert.equal(waiting.win.prints || 0, 0);
  assert.equal(waiting.events.filter((event) => event[1] === "care_export").length, 0, "An attempted export before readiness must not count as an export");
  const garden = imagesFor(waiting, "botanical")[0];
  const loaded = garden.onload();
  assert(imageButtons(waiting).every((button) => button.disabled), "A load event is insufficient until image decoding completes");
  garden.finishDecode();
  await loaded;
  assert(imageButtons(waiting).every((button) => !button.disabled), "A valid note becomes exportable only after artwork decoding succeeds");
  await waiting.export("card", "png");
  assert.deepEqual(waiting.downloads, ["quickgetwell-card.png"]);
  await waiting.win.dispatch("pagehide");
  assert.equal(waiting.urls.size, 0);

  for (const options of [{ imageFailure: true }, { decodeFailure: true }, { emptyImage: true }, { noImageApi: true }]) {
    const failed = fixture(options);
    await failed.flush();
    await failed.input("card-message", privateText);
    assert.match(failed.nodes.get("care-card-status").textContent, /illustration could not load/i);
    assert(imageButtons(failed).every((button) => button.disabled), "Missing/broken artwork must not silently produce a text-only PNG");
    assert.equal(copyButton(failed).disabled, false);
    await failed.export("card", "png");
    await failed.export("card", "print");
    assert.equal(failed.downloads.length, 0);
    assert.equal(failed.win.prints || 0, 0);
    assert.equal(failed.events.filter((event) => event[1] === "care_export").length, 0);
    await failed.export("card", "copy");
    assert(failed.copied[0].includes(privateText), "All author text must remain available despite failed artwork");
  }
  const drawFailure = fixture({ drawFails: true });
  await drawFailure.flush();
  await drawFailure.input("card-message", privateText);
  assert.match(drawFailure.nodes.get("care-card-status").textContent, /preview is unavailable/i);
  assert(imageButtons(drawFailure).every((button) => button.disabled));
  assert.equal(copyButton(drawFailure).disabled, false);

  const race = fixture({ manualImages: true });
  await race.input("card-message", "First draft.");
  await race.theme("ink");
  await race.input("card-message", "The latest draft must remain.");
  await imagesFor(race, "ink")[0].onload();
  assert.equal(race.nodes.get("card-theme").value, "ink");
  assert.equal(race.nodes.get("care-card-canvas").context.lastImage.src, artwork.ink);
  assert.equal(race.themeButtons.find((button) => button.dataset.themeChoice === "ink").getAttribute("aria-pressed"), "true");
  await imagesFor(race, "botanical")[0].onload();
  assert.equal(race.nodes.get("care-card-canvas").context.lastImage.src, artwork.ink, "A late old-theme image must never replace the current illustration");
  assert(race.nodes.get("care-card-text").textContent.includes("The latest draft must remain."));
  assert(!race.nodes.get("care-card-text").textContent.includes("First draft."));
  await race.theme("sunrise");
  assert(imageButtons(race).every((button) => button.disabled), "Switching to an unready design must immediately revoke image-export readiness");
  await race.select("help");
  await race.input("help-task-1", "Walk the dog", "help");
  await imagesFor(race, "sunrise")[0].onload();
  assert.equal(race.nodes.get("care-card-canvas").context.lastImage.src, artwork.sunrise);
  assert.equal(race.nodes.get("care-help-canvas").context.lastImage.src, artwork.ink, "A delayed card design must not overwrite another tool's artwork");
  assert(race.nodes.get("care-help-text").textContent.includes("Walk the dog"));
  for (const theme of Object.keys(artwork)) assert.equal(imagesFor(race, theme).length, 1, "Repeated edits and tool switches must reuse the decoded artwork");
  assert.doesNotMatch(JSON.stringify(race.images.map((image) => image.src)), /draft|Walk|Private|@|\?/, "Artwork requests must not encode user input or URL parameters");
  assert.doesNotMatch(JSON.stringify(race.events), /latest draft|First draft|Walk the dog/);
}

function validateArtworkAssets() {
  assert.deepEqual(artwork, {
    botanical: "/assets/experiments/care-art/garden-v2.webp",
    ink: "/assets/experiments/care-art/comfort-v2.webp",
    sunrise: "/assets/experiments/care-art/window-v2.webp"
  }, "Illustration URLs must be the three fixed same-origin public assets");
  for (const url of Object.values(artwork)) {
    const relative = url.slice(1);
    const bytes = fs.readFileSync(path.join(__dirname, relative));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF", `${url}: missing WebP RIFF header`);
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP", `${url}: incorrect image format`);
    assert.equal(bytes.readUInt32LE(4) + 8, bytes.length, `${url}: incomplete RIFF image`);
    assert(bytes.length < 300 * 1024, `${url}: illustration exceeds the 300 KiB static-asset budget`);
    let dimensions;
    for (let offset = 12; offset + 8 <= bytes.length;) {
      const chunk = bytes.toString("ascii", offset, offset + 4);
      const length = bytes.readUInt32LE(offset + 4);
      const data = offset + 8;
      if (chunk === "VP8 ") dimensions = [bytes.readUInt16LE(data + 6) & 0x3fff, bytes.readUInt16LE(data + 8) & 0x3fff];
      if (chunk === "VP8L") dimensions = [1 + ((bytes[data + 2] & 0x3f) << 8 | bytes[data + 1]), 1 + ((bytes[data + 4] & 0x0f) << 10 | bytes[data + 3] << 2 | bytes[data + 2] >> 6)];
      if (chunk === "VP8X") dimensions = [bytes.readUIntLE(data + 4, 3) + 1, bytes.readUIntLE(data + 7, 3) + 1];
      if (dimensions) break;
      offset = data + length + (length % 2);
    }
    assert.deepEqual(dimensions, [1122, 1402], `${url}: source dimensions must remain the reviewed portrait artwork`);
    assert.deepEqual(fs.readFileSync(path.join(__dirname, "dist", relative)), bytes, `${url}: build must copy the reviewed illustration without conversion`);
  }
}

function validateGeneratedPage() {
  const dist = path.join(__dirname, "dist");
  const html = fs.readFileSync(path.join(dist, route, "index.html"), "utf8");
  const messageInput = html.match(/<textarea\b[^>]*\bid="card-message"[^>]*>/)?.[0];
  assert(messageInput, "The card editor needs its message textarea");
  assert.doesNotMatch(messageInput, /\bmaxlength\s*=/i,
    "Native maxlength counts UTF-16 units and would reject emoji before the advertised code-point limit");
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
    assert.match(html, new RegExp(`<canvas\\s+id="care-${tool}-canvas"\\s+width="1200"\\s+height="1500"`), `${tool}: backing canvas must export a 1200 × 1500 portrait`);
  }
  for (const [theme, url] of Object.entries(artwork)) {
    assert(html.includes(`data-theme-choice="${theme}"`), `${theme}: missing accessible theme choice`);
    assert(html.includes(`src="${url}"`), `${theme}: missing visible design thumbnail`);
  }
  assert.match(html, /Your words stay (?:on this page|in this browser tab)/);
  assert.match(html, /don.t upload|not uploaded/i);
  assert.match(html, /one.time|removed when|removes it|cleared when/i, "Privacy copy must explain the explicit one-use Finder handoff");
  assert.match(html, /no name or message text is sent/i);
  assert.match(html, /completed human editorial review is not recorded/);
  assert.doesNotMatch(html, /<input\b[^>]*\btype="(?:file|email)"/i, "The first experiment must not collect uploads or email addresses");
  assert.doesNotMatch(html, /<form\b[^>]*\baction=/i, "These local editors must not post entered words to a server");
  assert.doesNotMatch(html, /No names, message text, or health details are requested/, "The generic resource footer must not contradict the optional name/message fields");
  const ownScripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((match) => match[1]);
  assert(ownScripts.some((url) => url.startsWith("/assets/experiments/care-studio-v1.js")));
  for (const relative of ["index.html", "get-well-soon-messages-for-teacher/index.html", "get-well-soon-messages-for-client/index.html", "get-well-soon-messages-for-boss/index.html"]) {
    const existingHtml = fs.readFileSync(path.join(dist, relative), "utf8");
    assert(!existingHtml.includes("care-studio-v1.js"), `${relative}: established traffic pages must not load the new editor`);
    assert(!existingHtml.includes("/care-art/"), `${relative}: existing traffic pages must not download the new illustration assets`);
  }
}

async function main() {
  validateModels();
  validateWrapping();
  validateEventContract();
  validateOneTimeTransfer();
  await validateBehavior();
  await validateMessageSelection();
  await validateIllustrationReadiness();
  validateArtworkAssets();
  validateGeneratedPage();
  console.log("Validated care studio: private local models, safe analytics, 1200 × 1500 illustrated rendering, asynchronous load/decode and stale-theme safeguards, image/print failure handling, static WebP size/build integrity, accessible forms and indexability.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
