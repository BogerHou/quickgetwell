const crypto = require("crypto");
const { pages } = require("./pages");

const homeMessages = [
  "Thinking of you and hoping today feels a little easier.",
  "Sending comfort, rest, and steady healing your way.",
  "No need to reply. Just wanted you to know you are on my mind.",
  "I am so sorry you are going through this. I am here for the quiet days, the hard days, and anything in between.",
  "Take all the time you need to rest and heal. You are cared for more than you know.",
  "Wishing you rest and comfort. Please take the time you need, and know the team is thinking of you.",
  "We miss having you around, but your health comes first. Wishing you rest and steady progress."
];

function getMessageId(text) {
  return crypto.createHash("sha256").update(String(text), "utf8").digest("hex").slice(0, 16);
}

function getEntries() {
  const entries = new Map();
  function add(text, category, categoryLabel) {
    if (typeof text !== "string" || !text.trim() || Array.from(text).length > 320) return;
    const id = getMessageId(text);
    if (entries.has(id)) return;
    entries.set(id, { id, text, category, categoryLabel });
  }

  for (const text of homeMessages) add(text, "starting-points", "Starting points");
  for (const page of pages) {
    const categoryLabel = page.nav === "All messages" ? "General get-well wishes" : page.nav || page.title;
    for (const section of page.sections || []) {
      for (const text of section.messages || []) add(text, page.slug, categoryLabel);
    }
    for (const item of page.decisionGuide?.items || []) add(item.try, page.slug, categoryLabel);
  }
  return [...entries.values()];
}

module.exports = { getMessageId, getEntries };
