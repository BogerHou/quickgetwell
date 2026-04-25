const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("script.js", "utf8");
const elements = new Map();

function element(id, value = "") {
  if (!elements.has(id)) {
    elements.set(id, {
      id,
      value,
      textContent: "",
      innerHTML: "",
      dataset: {},
      addEventListener() {},
      setAttribute() {},
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

const context = {
  console,
  window: { isSecureContext: false, setTimeout() {} },
  navigator: {},
  document: {
    getElementById: (id) => element(id),
    querySelectorAll: () => [],
    addEventListener() {},
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
this.__formatHelpOffer = formatHelpOffer;`, context);

assert(context.__formatHelpOffer("dinner") === "I can help with dinner if that would help.", "Noun help offer should use help with");
assert(context.__formatHelpOffer("bring dinner") === "I can bring dinner if that would help.", "Verb help offer should keep I can");
assert(context.__formatHelpOffer("I can bring dinner") === "I can bring dinner.", "Complete help offer should not be rewritten");

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
  assert(finderMessages.length === 6, `Expected 6 finder messages for ${JSON.stringify(filters)}`);

  for (const message of finderMessages) {
    assert(message.recipient === filters.recipient, `Recipient mismatch for ${JSON.stringify(filters)}`);
    assert(message.situation === filters.situation, `Situation mismatch for ${JSON.stringify(filters)}`);
    assert(message.tone === filters.tone, `Tone mismatch for ${JSON.stringify(filters)}`);
    assert(message.format === filters.format, `Format mismatch for ${JSON.stringify(filters)}`);
  }

  assert(new Set(finderMessages.map((message) => message.text)).size >= 5, `Finder messages are too repetitive for ${JSON.stringify(filters)}`);

  element("recipient").value = filters.recipient;
  element("situation").value = filters.situation;
  element("tone").value = filters.tone;
  element("format").value = filters.format;
  context.__renderMessages();
  assert(element("messageResults").innerHTML.includes("message-card"), `Rendered results missing for ${JSON.stringify(filters)}`);
}

for (const filters of signatureCombos) {
  const textSignature = context.__buildFinderMessages(filters).map((message) => message.text).join("\n");
  signatures.add(textSignature);
}

assert(signatures.size === signatureCombos.length, "Representative finder selections produced duplicate message sets");

console.log(`Validated finder generation across ${combos.length} selection sets.`);
