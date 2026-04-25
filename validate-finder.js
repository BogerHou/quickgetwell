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
this.__formatHelpOffer = formatHelpOffer;
this.__effectiveTone = effectiveTone;`, context);

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
  const expectedTone = context.__effectiveTone(filters);
  assert(finderMessages.length === 6, `Expected 6 finder messages for ${JSON.stringify(filters)}`);

  for (const message of finderMessages) {
    assert(message.recipient === filters.recipient, `Recipient mismatch for ${JSON.stringify(filters)}`);
    assert(message.situation === filters.situation, `Situation mismatch for ${JSON.stringify(filters)}`);
    assert(message.tone === expectedTone, `Tone mismatch for ${JSON.stringify(filters)}`);
    assert(message.format === filters.format, `Format mismatch for ${JSON.stringify(filters)}`);
    if (expectedTone === "short") {
      const plain = message.text.replace("{name}", "").trim();
      assert(plain.length <= 125, `Short finder message is too long for ${JSON.stringify(filters)}: ${plain}`);
    }
    assert(!/No need to reply\W+No need to reply/i.test(message.text), `Duplicate no-need-to-reply phrase for ${JSON.stringify(filters)}`);
  }

  assert(new Set(finderMessages.map((message) => message.text)).size >= 5, `Finder messages are too repetitive for ${JSON.stringify(filters)}`);

  element("recipient").value = filters.recipient;
  element("situation").value = filters.situation;
  element("tone").value = filters.tone;
  element("format").value = filters.format;
  context.__renderMessages();
  assert(element("messageResults").innerHTML.includes("message-card"), `Rendered results missing for ${JSON.stringify(filters)}`);
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

const surgeryFunny = renderFor({ recipient: "friend", situation: "surgery", tone: "funny", format: "text" });
assert(surgeryFunny.title.startsWith("Supportive messages"), "Softened surgery humor should display the effective tone");
assert(!surgeryFunny.html.includes(">funny<"), "Softened surgery humor should not render a funny tag");

const workplaceReligious = renderFor({ recipient: "coworker", situation: "minor", tone: "religious", format: "email" });
assert(workplaceReligious.title.startsWith("Professional messages"), "Workplace religious tone should display as professional");
assert(!/Praying|May you feel held/i.test(workplaceReligious.html), "Workplace religious tone should not render prayer language");

const seriousClient = renderFor({ recipient: "client", situation: "serious", tone: "professional", format: "email" });
assert(!seriousClient.html.includes("I am sorry this is so hard"), "Client serious illness wording should not use overly intimate phrasing");

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

console.log(`Validated finder generation across ${combos.length} selection sets.`);
