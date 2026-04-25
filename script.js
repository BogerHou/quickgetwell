const messages = [
  {
    recipient: "friend",
    situation: "minor",
    tone: "heartfelt",
    format: "text",
    text: "{name}I hate that you are feeling so rough. Rest as much as you can, and I am sending every good thought your way."
  },
  {
    recipient: "friend",
    situation: "minor",
    tone: "short",
    format: "text",
    text: "{name}Feel better soon. I am thinking of you and hoping today is easier."
  },
  {
    recipient: "friend",
    situation: "minor",
    tone: "funny",
    format: "text",
    text: "{name}Please recover soon. I need my favorite person back at full sarcasm capacity."
  },
  {
    recipient: "friend",
    situation: "surgery",
    tone: "heartfelt",
    format: "card",
    text: "{name}I am so glad the surgery is behind you. Take your time healing. I am here for the boring recovery days, the hard days, and anything you need."
  },
  {
    recipient: "friend",
    situation: "surgery",
    tone: "supportive",
    format: "text",
    text: "{name}Wishing you rest and comfort, one quiet day at a time. No pressure to reply. I just wanted you to know I am here."
  },
  {
    recipient: "friend",
    situation: "chronic",
    tone: "supportive",
    format: "text",
    text: "{name}I hope things feel a little lighter today. You do not have to explain or update me. I am with you through this."
  },
  {
    recipient: "friend",
    situation: "serious",
    tone: "supportive",
    format: "text",
    text: "{name}I am so sorry you are going through this. I am thinking of you and here to listen, sit quietly, or help in any practical way."
  },
  {
    recipient: "friend",
    situation: "serious",
    tone: "short",
    format: "text",
    text: "{name}Thinking of you today. No need to reply. I just wanted you to feel supported."
  },
  {
    recipient: "family",
    situation: "surgery",
    tone: "heartfelt",
    format: "card",
    text: "{name}We love you so much and are grateful you are resting now. Let your body take the time it needs. We are here every step of the way."
  },
  {
    recipient: "family",
    situation: "hospital",
    tone: "supportive",
    format: "card",
    text: "{name}You are surrounded by love, even when we cannot all be in the room. Wishing you comfort, strength, and calmer days ahead."
  },
  {
    recipient: "family",
    situation: "minor",
    tone: "religious",
    format: "text",
    text: "{name}Praying that you feel comfort, rest, and renewed strength today. May care surround you steadily."
  },
  {
    recipient: "family",
    situation: "serious",
    tone: "supportive",
    format: "card",
    text: "{name}There is no perfect thing to say, but please know this: you are deeply loved, you are not alone, and we are here for whatever this season brings."
  },
  {
    recipient: "partner",
    situation: "minor",
    tone: "heartfelt",
    format: "text",
    text: "{name}I wish I could make this easier. Rest up, let me handle the little things, and focus only on feeling better."
  },
  {
    recipient: "partner",
    situation: "surgery",
    tone: "heartfelt",
    format: "card",
    text: "{name}I am proud of you. Recovery may take patience, but you do not have to do it alone. I am here for every step, every errand, and every quiet night."
  },
  {
    recipient: "partner",
    situation: "chronic",
    tone: "supportive",
    format: "text",
    text: "{name}I know this is not something a simple message can fix. I love you exactly where you are today, and I am here for the long haul."
  },
  {
    recipient: "coworker",
    situation: "minor",
    tone: "professional",
    format: "email",
    text: "{name}Wishing you a restful time away and the space you need to feel better."
  },
  {
    recipient: "coworker",
    situation: "surgery",
    tone: "professional",
    format: "group",
    text: "{name}The team is thinking of you and wishing you rest and comfort. Your health comes first."
  },
  {
    recipient: "coworker",
    situation: "minor",
    tone: "funny",
    format: "text",
    text: "{name}Get well soon. The office is dangerously close to becoming too productive without you."
  },
  {
    recipient: "coworker",
    situation: "hospital",
    tone: "supportive",
    format: "group",
    text: "{name}We miss having you around, but the only deadline that matters is your recovery. Wishing you rest, comfort, and steady progress."
  },
  {
    recipient: "boss",
    situation: "minor",
    tone: "professional",
    format: "email",
    text: "{name}Please take care of yourself, and know the team has things covered while you rest."
  },
  {
    recipient: "boss",
    situation: "surgery",
    tone: "professional",
    format: "card",
    text: "{name}Wishing you a steady recovery and plenty of rest after surgery. The team is thinking of you and looking forward to seeing you well."
  },
  {
    recipient: "client",
    situation: "minor",
    tone: "professional",
    format: "email",
    text: "{name}I am sorry to hear you have been unwell. Wishing you rest, comfort, and better days ahead."
  },
  {
    recipient: "client",
    situation: "serious",
    tone: "professional",
    format: "email",
    text: "{name}I am very sorry to hear what you are going through. Please accept my warmest thoughts and wishes for comfort and strength."
  },
  {
    recipient: "family",
    situation: "minor",
    tone: "funny",
    format: "text",
    text: "{name}Get well soon, because everyone here is pretending to be calm and we both know that cannot last."
  },
  {
    recipient: "friend",
    situation: "injury",
    tone: "funny",
    format: "text",
    text: "{name}Heal up soon. I promise to only make fun of the injury after you are officially cleared for jokes."
  },
  {
    recipient: "friend",
    situation: "injury",
    tone: "supportive",
    format: "text",
    text: "{name}I know recovery from an injury can be frustrating. I hope today brings a little more comfort and a little more progress."
  },
  {
    recipient: "family",
    situation: "serious",
    tone: "religious",
    format: "card",
    text: "{name}Praying for comfort, courage, and peace around you today. May you feel loved, held, and strengthened in every hard moment."
  },
  {
    recipient: "coworker",
    situation: "serious",
    tone: "professional",
    format: "group",
    text: "{name}We are thinking of you and sending support during this difficult time. Please take all the time and space you need."
  },
  {
    recipient: "friend",
    situation: "hospital",
    tone: "heartfelt",
    format: "flowers",
    text: "{name}Sending a little brightness to your room and a lot of love to your day. I hope you feel cared for and less alone."
  },
  {
    recipient: "family",
    situation: "surgery",
    tone: "short",
    format: "flowers",
    text: "{name}Rest well and heal gently. We love you and are thinking of you."
  }
];

const labels = {
  friend: "a friend",
  family: "family",
  partner: "your partner",
  coworker: "a coworker",
  boss: "your boss",
  client: "a client",
  minor: "a minor illness",
  surgery: "surgery recovery",
  injury: "an injury",
  hospital: "a hospital stay",
  serious: "serious illness",
  chronic: "chronic illness",
  heartfelt: "heartfelt",
  short: "short",
  supportive: "supportive",
  professional: "professional",
  funny: "funny",
  religious: "religious"
};

const form = document.getElementById("finderForm");
const resultRoot = document.getElementById("messageResults");
const title = document.getElementById("resultsTitle");
const note = document.getElementById("resultsNote");
const toast = document.getElementById("toast");
const personName = document.getElementById("personName");
const helpOffer = document.getElementById("helpOffer");
const topicSearch = document.getElementById("topicSearch");
const topicGrid = document.getElementById("topicGrid");
const tuneButtons = Array.from(document.querySelectorAll("[data-action]"));

const noteSituationLabels = {
  minor: "a minor illness",
  surgery: "a surgery recovery",
  injury: "an injury",
  hospital: "a hospital stay",
  serious: "a serious illness",
  chronic: "a chronic illness"
};

const formatLabels = {
  text: "text message",
  card: "card",
  email: "email",
  flowers: "flower or gift note",
  group: "group card"
};

const tuneFeedback = {
  shorter: "Updated to shorter wording.",
  warmer: "Updated to a warmer tone.",
  safer: "Updated to safer wording."
};

let activeTuneAction = null;

function currentFilters() {
  if (!form) return null;
  return {
    recipient: document.getElementById("recipient").value,
    situation: document.getElementById("situation").value,
    tone: document.getElementById("tone").value,
    format: document.getElementById("format").value
  };
}

function scoreMessage(message, filters) {
  let score = 0;
  if (message.recipient === filters.recipient) score += 5;
  if (message.situation === filters.situation) score += 6;
  if (message.tone === filters.tone) score += 4;
  if (message.format === filters.format) score += 2;

  if (filters.situation === "serious" || filters.situation === "chronic") {
    if (message.tone === "supportive" || message.tone === "professional") score += 2;
    if (message.tone === "funny") score -= 6;
  }

  if (filters.recipient === "boss" || filters.recipient === "client") {
    if (message.tone === "professional") score += 3;
    if (message.tone === "funny") score -= 5;
  }

  return score;
}

function personalize(text) {
  const name = personName.value.trim();
  const help = helpOffer.value.trim();
  let output = text.replace("{name}", name ? `${name}, ` : "");

  if (help) {
    output += ` ${formatHelpOffer(help)}`;
  }

  return output;
}

function formatHelpOffer(help) {
  if (isCompleteHelpOffer(help)) {
    return addTerminalPunctuation(help);
  }

  return `I can ${help} if that would help.`;
}

function isCompleteHelpOffer(help) {
  const normalized = help.trim().toLowerCase().replaceAll("\u2019", "'");
  return /^(?:i\s+(?:can|will|would|am)|i(?:'ll|'d|'m)|we\s+(?:can|will|would|are)|we(?:'ll|'d|'re)|let\s+(?:me|us)|please\s+let\s+(?:me|us)|happy\s+to)\b/.test(normalized);
}

function addTerminalPunctuation(value) {
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function renderMessages() {
  if (!form || !resultRoot || !title || !note) return;
  const filters = currentFilters();
  const ranked = [...messages]
    .map((message) => ({ ...message, score: scoreMessage(message, filters) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  title.textContent = `${capitalize(labels[filters.tone])} messages for ${labels[filters.recipient]}`;
  note.textContent = getResultNote(filters);

  resultRoot.innerHTML = ranked
    .map((message, index) => {
      const finalText = personalize(message.text);
      const copyLabel = `Copy message ${index + 1}: ${getCopySnippet(finalText)}`;
      return `
        <article class="message-card">
          <p>${escapeHtml(finalText)}</p>
          <div class="message-meta">
            <span>${escapeHtml(labels[message.situation])}</span>
            <span>${escapeHtml(labels[message.tone])}</span>
            <span>${escapeHtml(message.format)}</span>
          </div>
          <button class="copy-button" type="button" data-copy="${escapeHtml(finalText)}" aria-label="${escapeHtml(copyLabel)}">Copy message</button>
        </article>
      `;
    })
    .join("");
}

function getResultNote(filters) {
  const feedback = activeTuneAction ? `${tuneFeedback[activeTuneAction]} ` : "";

  if (filters.situation === "serious" || filters.situation === "chronic") {
    return `${feedback}Uses safer wording that does not rush recovery or ask for updates.`;
  }

  return `${feedback}Best for ${noteSituationLabels[filters.situation]} ${formatLabels[filters.format]}.`;
}

function getCopySnippet(text) {
  const snippet = text.replace(/\s+/g, " ").trim();
  return snippet.length > 70 ? `${snippet.slice(0, 70).trim()}...` : snippet;
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(showToast).catch(() => fallbackCopy(text));
    return;
  }

  fallbackCopy(text);
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  showToast();
}

function showToast() {
  if (!toast) return;

  toast.setAttribute("aria-hidden", "false");
  toast.classList.add("show");
  window.setTimeout(() => {
    toast.classList.remove("show");
    toast.setAttribute("aria-hidden", "true");
  }, 1400);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

if (form) {
  form.addEventListener("input", () => {
    activeTuneAction = null;
    updateTuneButtons(null);
    renderMessages();
  });
}

if (topicSearch) {
  const cards = Array.from(document.querySelectorAll("[data-topic-card]"));
  const groups = Array.from(document.querySelectorAll("[data-topic-group]"));
  const emptyState = createTopicEmptyState();

  topicSearch.addEventListener("input", () => {
    const query = topicSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    for (const card of cards) {
      const text = card.dataset.search || card.textContent.toLowerCase();
      const isVisible = query ? text.includes(query) : true;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    }

    for (const group of groups) {
      const groupCards = Array.from(group.querySelectorAll("[data-topic-card]"));
      group.hidden = groupCards.length > 0 && groupCards.every((card) => card.hidden);
    }

    updateTopicEmptyState(emptyState, visibleCount === 0);
  });
}

function createTopicEmptyState() {
  if (!topicGrid) return null;

  const emptyState = document.createElement("p");
  emptyState.id = "topicEmptyState";
  emptyState.className = "topic-empty-state";
  emptyState.hidden = true;
  emptyState.setAttribute("role", "status");
  emptyState.setAttribute("aria-live", "polite");
  emptyState.textContent = "No topics found. Try surgery, coworker, mom, or funny.";
  emptyState.style.margin = "18px 0 0";
  emptyState.style.color = "#5d6a66";
  emptyState.style.fontWeight = "800";
  topicGrid.after(emptyState);

  return emptyState;
}

function updateTopicEmptyState(emptyState, isEmpty) {
  if (!emptyState || !topicGrid) return;

  emptyState.hidden = !isEmpty;
  topicGrid.hidden = isEmpty;
}

function updateTuneButtons(activeAction) {
  for (const button of tuneButtons) {
    button.setAttribute("aria-pressed", button.dataset.action === activeAction ? "true" : "false");
  }
}

document.addEventListener("click", (event) => {
  const copyTarget = event.target.closest("[data-copy]");
  if (copyTarget) {
    copyText(copyTarget.dataset.copy);
  }

  const tune = event.target.closest("[data-action]");
  if (!tune) return;

  if (tune.dataset.action === "shorter") {
    document.getElementById("tone").value = "short";
  }
  if (tune.dataset.action === "warmer") {
    document.getElementById("tone").value = "heartfelt";
  }
  if (tune.dataset.action === "safer") {
    document.getElementById("situation").value = "serious";
    document.getElementById("tone").value = "supportive";
  }
  activeTuneAction = tune.dataset.action;
  updateTuneButtons(activeTuneAction);
  renderMessages();
});

updateTuneButtons(null);
renderMessages();
