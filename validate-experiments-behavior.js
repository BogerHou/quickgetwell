const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { lessons } = require("./content/workplace-practice");
const { siteUrl } = require("./site.config");

const source = fs.readFileSync(path.join(__dirname, "assets/experiments/pilot-v1.js"), "utf8");
const productionHost = new URL(siteUrl).hostname;
const lessonPath = (id) => `/practice/workplace-english/${id}/`;
const privateText = "Dear Private Person,\n\nPlease email private@example.com about the private note.\n\nBest wishes,\n[Your name]";

function node(properties = {}) {
  const listeners = new Map();
  const classes = new Set();
  return {
    dataset: {}, textContent: "", value: "", hidden: false, focused: 0,
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
      toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); }
    },
    focus() { this.focused += 1; },
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(callback);
    },
    async dispatch(type, target = this) {
      const event = { target, prevented: false, preventDefault() { this.prevented = true; } };
      await Promise.all((listeners.get(type) || []).map((callback) => callback(event)));
      return event;
    },
    ...properties
  };
}

function fixture(options = {}) {
  const lesson = options.lesson || lessons[0];
  const events = [];
  const clipboardWrites = [];
  const fallbackWrites = [];
  const attachedFields = new Set();
  const choiceNodes = lesson.options.map((option, index) => node({ value: String(index), textContent: option.text }));
  let selected = null;
  const form = node({
    dataset: { correctIndex: String(lesson.correctIndex) },
    querySelector(selector) {
      if (selector === 'input[name="answer"]:checked') return selected;
      if (selector === 'input[name="answer"]') return choiceNodes[0];
      throw new Error(`Unexpected form selector: ${selector}`);
    }
  });
  const feedback = node();
  const explanation = node({ hidden: true });
  const choiceExplanations = lesson.options.map((option, index) => node({ dataset: { choiceIndex: String(index) }, textContent: option.explanation }));
  const status = node();
  const previousFocus = node();
  const textNodes = new Map(["class-invitation", "example-0", "example-1"].map((id) => [id, node({ textContent: privateText })]));
  const selectors = new Map([
    [".copy-status", status],
    [".practice-form", options.hasForm === false ? null : form],
    [".answer-status", feedback],
    [".answer-explanation", explanation]
  ]);
  let selectedField;
  const document = node({
    activeElement: previousFocus,
    body: { dataset: { lessonId: options.lessonId ?? lesson.id }, appendChild: (field) => attachedFields.add(field) },
    querySelector: (selector) => selectors.get(selector) || null,
    querySelectorAll: (selector) => selector === ".choice-explanation" ? choiceExplanations : [],
    getElementById: (id) => textNodes.get(id) || null,
    createElement(tag) {
      assert.equal(tag, "textarea", "Clipboard fallback should create a selectable text field");
      const field = {
        value: "", style: {}, setAttribute() {},
        select() { selectedField = field; },
        remove() { attachedFields.delete(field); }
      };
      return field;
    },
    execCommand(command) {
      assert.equal(command, "copy");
      assert.ok(selectedField && attachedFields.has(selectedField), "Fallback must copy an attached and selected field");
      fallbackWrites.push(selectedField.value);
      if (options.fallbackThrows) throw new Error("Copy unavailable");
      return options.fallbackResult ?? true;
    }
  });
  const navigator = options.noClipboard ? {} : {
    clipboard: {
      writeText(text) {
        clipboardWrites.push(text);
        return options.clipboardWrite ? options.clipboardWrite(text) : Promise.resolve();
      }
    }
  };
  const window = {
    isSecureContext: options.secure ?? true,
    location: {
      hostname: options.hostname ?? productionHost,
      pathname: options.pathname ?? lessonPath(lesson.id),
      search: "?name=Private+Person&help=private+note", hash: "#private@example.com"
    },
    gtag: options.noAnalytics ? undefined : (...args) => {
      if (options.analyticsThrows) throw new Error("Analytics unavailable");
      events.push(JSON.parse(JSON.stringify(args)));
    }
  };
  let timer = 0;
  const context = { document, window, navigator, setTimeout: () => ++timer, clearTimeout() {} };
  vm.runInNewContext(source, context, { filename: "pilot-v1.js" });
  assert.equal(events.length, 0, "Loading an experiment must not send a custom event");
  assert.equal(explanation.hidden, true, "An answer explanation should begin hidden");

  async function click(selector, dataset) {
    const trigger = node({ dataset });
    trigger.closest = (candidate) => candidate === selector ? trigger : null;
    await document.dispatch("click", trigger);
  }

  return {
    events, window, form, feedback, explanation, status, choiceNodes, choiceExplanations,
    previousFocus, attachedFields, clipboardWrites, fallbackWrites, textNodes,
    select(value) { selected = value === null ? null : choiceNodes.find((choice) => choice.value === String(value)) || node({ value: String(value) }); },
    change: () => form.dispatch("change"),
    submit: () => form.dispatch("submit"),
    copy: (id = "example-0") => click("[data-copy-target]", { copyTarget: id }),
    download: (paper = "a4", resource = "teacher-care-pack") => click("[data-resource-download]", { resourceDownload: resource, paperSize: paper })
  };
}

function eventsNamed(app, name) {
  return app.events.filter((event) => event[1] === name);
}

function assertPrivateEvents(app) {
  const fields = {
    practice_answer: ["lesson_id", "choice", "correct"],
    practice_complete: ["lesson_id"],
    resource_copy: ["resource_id", "copy_id"],
    resource_download_click: ["resource_id", "paper_size"]
  };
  for (const [command, name, parameters] of app.events) {
    assert.equal(command, "event");
    assert.ok(fields[name], `Unexpected custom event: ${name}`);
    assert.deepEqual(Object.keys(parameters).sort(), [...fields[name], "experiment_id", "page_path"].sort());
    assert.equal(parameters.experiment_id, "resources_v1");
    assert.equal(parameters.page_path, app.window.location.pathname);
    assert.doesNotMatch(JSON.stringify(parameters), /Private Person|private@example|private note|\[Your name\]|\?|#|\n/, "Custom analytics must not include copied text, private URL values or line breaks");
  }
}

async function validateAnswers() {
  for (const lesson of lessons) {
    const app = fixture({ lesson });
    assert.equal((await app.submit()).prevented, true, "Submitting should not navigate away");
    assert.match(app.feedback.textContent, /choose/i);
    assert.equal(app.choiceNodes[0].focused, 1, "An unanswered submission should focus the first choice");
    assert.equal(app.explanation.hidden, true);
    assert.equal(app.events.length, 0, "An unanswered submission is not an answer or completion");

    const wrongIndex = (lesson.correctIndex + 1) % lesson.options.length;
    app.select(wrongIndex);
    await app.submit();
    assert.match(app.feedback.textContent, /another reply/i, "A wrong choice should receive corrective feedback");
    assert.equal(app.explanation.hidden, false, "Wrong answers still reveal the explanation");
    assert.equal(eventsNamed(app, "practice_answer")[0][2].correct, false);
    assert.equal(eventsNamed(app, "practice_complete").length, 1, "Completion means first feedback viewed, even when the answer was wrong");
    assert.equal(app.choiceExplanations[wrongIndex].classList.contains("is-selected"), true);

    app.select(lesson.correctIndex);
    await app.change();
    assert.equal(app.explanation.hidden, true, "Switching choices should hide the old explanation until checked");
    assert.equal(app.events.length, 2, "Changing a choice must not record an answer or completion");
    await app.submit();
    assert.match(app.feedback.textContent, /good fit/i);
    assert.equal(app.explanation.hidden, false);
    assert.equal(eventsNamed(app, "practice_answer").at(-1)[2].choice, lesson.correctIndex);
    assert.equal(eventsNamed(app, "practice_answer").at(-1)[2].correct, true);
    for (let index = 0; index < app.choiceExplanations.length; index++) {
      assert.equal(app.choiceExplanations[index].classList.contains("is-selected"), index === lesson.correctIndex);
    }
    await app.submit();
    assert.equal(eventsNamed(app, "practice_answer").length, 3, "Each checked choice should be recorded");
    assert.equal(eventsNamed(app, "practice_complete").length, 1, "Repeated submissions must not complete the same visit twice");
    assertPrivateEvents(app);

    const revisit = fixture({ lesson });
    revisit.select(lesson.correctIndex);
    await revisit.submit();
    assert.equal(eventsNamed(revisit, "practice_complete").length, 1, "A separate page visit may complete once again");
  }

  for (const invalid of ["private@example.com", "-1", "3"]) {
    const app = fixture();
    app.select(invalid);
    await app.submit();
    assert.equal(app.events.length, 0, "An unsupported answer value must not be tracked");
    assert.equal(app.explanation.hidden, true);
  }
  const invalidCorrect = fixture();
  invalidCorrect.form.dataset.correctIndex = "private@example.com";
  invalidCorrect.select(0);
  await invalidCorrect.submit();
  assert.equal(invalidCorrect.events.length, 0, "An invalid answer key must not emit answer or completion events");
  const invalidLesson = fixture({ lessonId: "private@example.com" });
  invalidLesson.select(0);
  await invalidLesson.submit();
  assert.equal(invalidLesson.events.length, 0, "An unrecognized lesson must not activate the practice form");
}

async function validateCopying() {
  let resolveClipboard;
  const pending = new Promise((resolve) => { resolveClipboard = resolve; });
  const app = fixture({ clipboardWrite: () => pending });
  const copying = app.copy();
  assert.deepEqual(app.clipboardWrites, [privateText], "The Clipboard API must receive the complete text with its line breaks");
  assert.equal(app.events.length, 0, "Copy analytics must wait for clipboard success");
  resolveClipboard();
  await copying;
  assert.match(app.status.textContent, /^Copied\./);
  assert.equal(app.status.classList.contains("is-visible"), true);
  assert.equal(eventsNamed(app, "resource_copy").length, 1);
  assert.equal(app.events[0][2].resource_id, lessons[0].id);
  assertPrivateEvents(app);

  for (const options of [
    { noClipboard: true }, { secure: false },
    { clipboardWrite: () => Promise.reject(new Error("Clipboard denied")) }
  ]) {
    const fallback = fixture(options);
    await fallback.copy("example-1");
    assert.deepEqual(fallback.fallbackWrites, [privateText], "Fallback copying must preserve paragraphs and signature line breaks");
    assert.equal(fallback.attachedFields.size, 0, "Fallback must remove its temporary field");
    assert.equal(fallback.previousFocus.focused, 1, "Fallback must restore focus to the prior control");
    assert.match(fallback.status.textContent, /^Copied\./);
    assert.equal(eventsNamed(fallback, "resource_copy").length, 1, "Only one successful copy event should be sent");
    assertPrivateEvents(fallback);
  }

  for (const options of [
    { noClipboard: true, fallbackResult: false },
    { noClipboard: true, fallbackThrows: true },
    { clipboardWrite: () => Promise.reject(new Error("Clipboard denied")), fallbackResult: false }
  ]) {
    const failure = fixture(options);
    await failure.copy();
    assert.match(failure.status.textContent, /^Could not copy\./, "Both failed paths must give honest failure feedback");
    assert.equal(failure.events.length, 0, "A failed copy must not produce a success event");
    assert.equal(failure.attachedFields.size, 0);
    assert.equal(failure.previousFocus.focused, 1);
  }
  const resource = fixture({ hasForm: false, lessonId: "", pathname: "/resources/teacher-care-pack/" });
  await resource.copy("class-invitation");
  assert.equal(resource.events[0][2].resource_id, "teacher-care-pack");
  await resource.copy("private@example.com");
  resource.textNodes.delete("example-1");
  await resource.copy("example-1");
  assert.equal(resource.clipboardWrites.length, 1, "Unknown or absent copy targets must not be copied");
  assert.equal(resource.events.length, 1);
  assertPrivateEvents(resource);
}

async function validateAnalyticsBoundaries() {
  const allowedPaths = ["/resources/", "/resources/teacher-care-pack/", "/practice/workplace-english/", ...lessons.map((lesson) => lessonPath(lesson.id))];
  for (const pathname of allowedPaths) {
    const app = fixture({ pathname });
    await app.download("a4");
    await app.download("letter");
    assert.equal(eventsNamed(app, "resource_download_click").length, 2, `Production route should record download intent: ${pathname}`);
    assert.deepEqual(app.events.map((event) => event[2].paper_size), ["a4", "letter"]);
    await app.download("private@example.com");
    await app.download("a4", "private@example.com");
    assert.equal(app.events.length, 2, "Unknown resource and paper values must not enter analytics");
    assertPrivateEvents(app);
  }

  const rejected = [
    ...["localhost", "127.0.0.1", "quickgetwell.pages.dev", `www.${productionHost}`, `${productionHost}.example.org`].map((hostname) => ({ hostname })),
    ...["/", "/resources/unknown/", "/resources/teacher-care-pack/private", "/practice/workplace-english/private@example.com/"].map((pathname) => ({ pathname }))
  ];
  for (const options of rejected) {
    const app = fixture(options);
    app.select(0);
    await app.submit();
    await app.copy();
    await app.download();
    assert.equal(app.events.length, 0, `Custom events must be suppressed outside the canonical production host and exact route allowlist: ${JSON.stringify(options)}`);
    assert.equal(app.explanation.hidden, false, "Analytics gating must not disable local practice feedback");
    assert.match(app.status.textContent, /^Copied\./, "Analytics gating must not disable copying");
  }

  for (const options of [{ noAnalytics: true }, { analyticsThrows: true }]) {
    const app = fixture(options);
    app.select(0);
    await app.submit();
    await app.copy();
    await app.download();
    assert.equal(app.explanation.hidden, false, "Analytics failures must not interrupt answers");
    assert.match(app.status.textContent, /^Copied\./, "Analytics failures must not interrupt copy feedback");
    assert.equal(app.events.length, 0);
  }
}

(async () => {
  await validateAnswers();
  await validateCopying();
  await validateAnalyticsBoundaries();
  console.log(`Validated experiment behavior for ${lessons.length} lessons, clipboard success/failure, and privacy-safe production analytics.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
