const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { getEntries, getMessageId } = require("./content/card-message-catalog");

const source = fs.readFileSync(path.join(__dirname, "assets/experiments/card-entry-v1.js"), "utf8");
const key = "qgw:card-transfer:v1";
const privateText = "Dear Zoë 🌷, no need to reply. I can bring your private lunch on Tuesday.";

function fixture(options = {}) {
  const stored = new Map(), writes = [], navigations = [], created = [], observerCallbacks = [];
  function node(properties = {}) {
    return {
      children: [], listeners: new Map(), hidden: false, textContent: "",
      appendChild(child) { this.children.push(child); },
      before() {},
      setAttribute() {},
      addEventListener(type, callback) { this.listeners.set(type, callback); },
      ...properties
    };
  }
  const paragraph = node({ textContent: options.text ?? privateText });
  const copy = node();
  const card = node({ querySelector(selector) {
    if (selector === ".copy-button") return copy;
    if (selector === "p") return paragraph;
    if (selector === ".card-finder-action") return created.find(item => item.className === "card-finder-action");
    throw new Error(`Unexpected selector: ${selector}`);
  } });
  const root = node({
    querySelectorAll(selector) { assert.equal(selector, ".message-card"); return [card]; },
    insertAdjacentElement(position, element) { assert.equal(position, "beforebegin"); this.note = element; }
  });
  const document = {
    getElementById(id) { assert.equal(id, "messageResults"); return root; },
    createElement(tag) { const item = node({ tag }); created.push(item); return item; }
  };
  const window = {
    sessionStorage: {
      setItem(name, value) {
        if (options.storageFailure) throw new Error("Storage blocked");
        writes.push([name, value]);
        if (!options.discardWrites) stored.set(name, value);
      },
      getItem(name) { return stored.get(name) ?? null; },
      removeItem(name) { stored.delete(name); }
    },
    location: { assign(destination) {
      if (options.navigationFailure) throw new Error("Navigation rejected");
      navigations.push(destination);
    } }
  };
  vm.runInNewContext(source, {
    document, window, Date,
    MutationObserver: class {
      constructor(callback) { observerCallbacks.push(callback); }
      observe(target, config) { assert.equal(target, root); assert.equal(config.childList, true); }
    }
  });
  return {
    stored, writes, navigations, paragraph, root,
    buttons: () => created.filter(item => item.className === "card-finder-action"),
    status: () => created.find(item => item.className === "card-transfer-status"),
    enhance: () => observerCallbacks[0](),
    pointerDown(properties = {}) {
      const event = { button: 0, isPrimary: true, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...properties };
      created.find(item => item.className === "card-finder-action").listeners.get("pointerdown")?.(event);
      return event;
    },
    click: () => created.find(item => item.className === "card-finder-action").listeners.get("click")()
  };
}

function validateHandoff() {
  const normal = fixture();
  assert.equal(normal.writes.length, 0, "Viewing Finder results must not store personalized content");
  assert.equal(normal.buttons().length, 1);
  normal.enhance();
  assert.equal(normal.buttons().length, 1, "Enhancing updated results must not duplicate card controls");
  assert.equal(normal.pointerDown().defaultPrevented, true,
    "A primary pointer click must keep the active Finder input from blurring and replacing the clicked button before its click handler");
  assert.equal(normal.pointerDown({ button: 2 }).defaultPrevented, false, "Secondary pointer actions should retain browser behavior");
  assert.equal(normal.pointerDown({ isPrimary: false }).defaultPrevented, false);
  assert.equal(normal.writes.length, 0, "Pointerdown must not submit or transfer; the activation click remains the explicit action");
  normal.paragraph.textContent = `${privateText} Revised before clicking.`;
  normal.click();
  assert.deepEqual(normal.navigations, ["/resources/care-studio/#from=finder"]);
  assert.equal(normal.writes.length, 1);
  const payload = JSON.parse(normal.stored.get(key));
  assert.equal(payload.text, normal.paragraph.textContent, "Transfer the current visible words, not a stale copy attribute");
  assert(Number.isFinite(payload.createdAt) && Math.abs(Date.now() - payload.createdAt) < 1000);
  assert.doesNotMatch(normal.navigations[0], /Zoë|Tuesday|lunch|message=|\?/);

  for (const options of [{ storageFailure: true }, { discardWrites: true }, { navigationFailure: true }]) {
    const failed = fixture(options);
    failed.click();
    assert.equal(failed.navigations.length, 0, "A failed handoff must leave the user on the original message");
    assert.equal(failed.stored.size, 0, "A failed transfer must remove its temporary private payload");
    assert.equal(failed.status().hidden, false);
    assert.match(failed.status().textContent, /copy.*paste/i, "The user needs a manual fallback when storage is unavailable");
  }
  for (const text of ["", " \n ", "🌷".repeat(4001)]) {
    const invalid = fixture({ text });
    invalid.click();
    assert.equal(invalid.writes.length, 0);
    assert.equal(invalid.navigations.length, 0);
  }
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|FormData|localStorage|indexedDB|gtag)\b|\.innerHTML\s*=/,
    "The handoff must not send, permanently store, or HTML-interpolate personal words");
}

function validateCatalog() {
  const entries = getEntries();
  assert(entries.length > 100, "The local picker should provide the established message collections");
  assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length);
  for (const entry of entries) {
    assert.equal(entry.id, getMessageId(entry.text));
    assert.match(entry.id, /^[a-f0-9]{16}$/);
    assert(entry.text.trim() && Array.from(entry.text).length <= 320);
    assert(entry.category && entry.categoryLabel);
  }
  const html = fs.readFileSync(path.join(__dirname, "dist/resources/care-studio/index.html"), "utf8");
  const payload = html.match(/<script\b(?=[^>]*\bid="care-message-catalog")(?=[^>]*\btype="application\/json")[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert(payload, "The studio must contain its public message library without another network request");
  assert.deepEqual(JSON.parse(payload), entries);
  assert.doesNotMatch(payload, /<\/script/i, "Embedded message data must not be able to close its JSON script element");
}

validateHandoff();
validateCatalog();
console.log("Validated card entry: explicit one-use Finder transfer, no private URL/network payload, blocked-storage fallback, fresh visible text, deduplicated controls and public message catalog.");
