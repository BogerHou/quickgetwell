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
const emailLinks = Array.from(document.querySelectorAll("[data-email-link]"));

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

const recipientProfiles = {
  friend: {
    care: "You mean a lot to me.",
    help: "If a meal would be useful, I would be happy to arrange one. It is fine if that does not suit you.",
    professional: "I am thinking of you and hoping you get the rest you need."
  },
  family: {
    care: "I love you.",
    help: "Would a grocery drop-off help? I would be happy to arrange one if it suits you.",
    professional: "I am thinking of you and sending my best wishes."
  },
  partner: {
    care: "I love you, just as you are today.",
    help: "Would some quiet company help? It is fine if you would rather rest.",
    professional: "I am thinking of you and hoping today feels gentler."
  },
  coworker: {
    care: "I am sorry you are having a difficult time.",
    help: "Please share only what you feel comfortable sharing. I am sending my best wishes.",
    professional: "I am thinking of you and wishing you rest and comfort."
  },
  boss: {
    care: "I am sending my best wishes.",
    help: "Please share only what you feel comfortable sharing. I am sending my best wishes.",
    professional: "I hope you have the rest and care you need."
  },
  client: {
    care: "I am sorry to hear you have been unwell.",
    help: "Please share only what you feel comfortable sharing. I am sending my best wishes.",
    professional: "Please accept my warm thoughts and best wishes for comfort."
  }
};

const situationProfiles = {
  minor: {
    short: "Thinking of you and hoping today feels easier.",
    lowPressure: "today feels easier",
    care: "I hope you can get some rest and feel more comfortable soon.",
    professional: "Wishing you a restful recovery and better days ahead.",
    faith: "Praying for rest, comfort, and good care for you today."
  },
  surgery: {
    short: "Thinking of you after surgery and wishing you quiet rest.",
    lowPressure: "you get quiet rest after surgery",
    care: "I hope you are comfortable as you recover from surgery.",
    professional: "Wishing you rest and comfort as you recover from surgery.",
    faith: "Praying for peace and patience as you recover from surgery."
  },
  injury: {
    short: "Thinking of you and hoping the injury feels a little less frustrating today.",
    lowPressure: "the injury feels a little less frustrating today",
    care: "I hope recovering from the injury feels a little more manageable today.",
    professional: "Wishing you comfort as you recover from your injury.",
    faith: "Praying for comfort and practical support while you heal."
  },
  hospital: {
    short: "Thinking of you in the hospital and sending quiet support.",
    lowPressure: "the hospital days feel less lonely",
    care: "I hope the hospital days feel less lonely and you feel cared for by the people around you.",
    professional: "Wishing you comfort and good care during your hospital stay.",
    faith: "Praying for comfort and good care during your hospital stay."
  },
  serious: {
    short: "Thinking of you today. No need to reply.",
    lowPressure: "today brings a little comfort and support",
    care: "I am sorry this is so hard, and I am here without needing an update.",
    professional: "Sending warm thoughts during this difficult time.",
    faith: "Praying for comfort, peace, and the right support around you today."
  },
  chronic: {
    short: "Thinking of you and hoping today is gentle.",
    lowPressure: "today has a few easier moments",
    care: "I know a message cannot make this go away, but I care about how you are doing.",
    professional: "Wishing you comfort and support through the difficult days.",
    faith: "Praying that you feel cared for through the difficult days."
  }
};

const tuneFeedback = {
  shorter: "Switched to Short tone.",
  warmer: "Switched to Warm (heartfelt) tone.",
  safer: "Switched to Low-pressure (supportive) tone."
};

const tuneTones = { shorter: "short", warmer: "heartfelt", safer: "supportive" };
const finderOptions = {
  recipient: ["friend", "family", "partner", "coworker", "boss", "client"],
  situation: ["minor", "surgery", "injury", "hospital", "serious", "chronic"],
  tone: ["heartfelt", "short", "supportive", "professional", "funny", "religious"],
  format: ["text", "card", "email", "flowers", "group"]
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

// Each option is a complete message with a different purpose. Help is a single
// replaceable part, so a specific offer never sits alongside a broader promise.
function buildFinderMessages(filters, help = "") {
  const tone = effectiveTone(filters);
  const situation = situationProfiles[filters.situation];
  const recipient = recipientProfiles[filters.recipient];
  const customHelp = help.trim();
  let primary = buildPrimaryMessage(filters);
  let lowPressure = `No need to reply. I hope ${situation.lowPressure}.`;
  let helpMessage = customHelp
    ? ""
    : tone === "short"
      ? isWorkplaceRecipient(filters)
        ? "I am sending my best wishes and respecting your privacy."
        : "If a little company would help, I would be glad to hear from you when you feel up to it."
      : recipient.help;

  if (filters.format === "flowers") {
    // Gift enclosures have little space. Keep the selected tone while avoiding
    // the longer personal introduction and practical-help conversation.
    if (["heartfelt", "supportive"].includes(tone)) primary = situation.short;
    lowPressure = "A little something to brighten your day. No need to reply.";
    if (!customHelp) {
      helpMessage = isWorkplaceRecipient(filters)
        ? "A small gift with my best wishes."
        : "A little gift with a lot of love.";
    }
  } else if (filters.format === "card" || filters.format === "group") {
    lowPressure = "A card to let you know I am thinking of you. No reply or update is needed.";
  } else if (filters.format === "email") {
    lowPressure = "Just a note to say I am thinking of you. There is no need to reply to this email.";
  }

  return [primary, lowPressure, helpMessage].map((text) => {
    // Apply the group's voice only to generated prose, never to a person's
    // complete, explicitly authored offer (which may be from one group member).
    const generated = withSenderVoice(text, filters);
    const separator = ["email", "card", "group"].includes(filters.format) ? "\n\n" : " ";
    const offer = customHelp ? `${generated ? separator : ""}${formatHelpOffer(customHelp, filters)}` : "";
    return {
      recipient: filters.recipient,
      situation: filters.situation,
      tone,
      format: filters.format,
      text: `{name}${generated}${offer}`
    };
  });
}

function buildPrimaryMessage(filters) {
  const recipient = recipientProfiles[filters.recipient];
  const situation = situationProfiles[filters.situation];
  const tone = effectiveTone(filters);

  if (tone === "short") return situation.short;
  if (tone === "professional") return situation.professional;
  if (tone === "religious") return situation.faith;
  if (tone === "funny") return buildFunnyMessage(filters);
  if (tone === "heartfelt" && !isWorkplaceRecipient(filters)) {
    return `${recipient.care} ${situation.care}`;
  }
  // Workplace messages stay within what an individual sender can truthfully say.
  return isWorkplaceRecipient(filters) ? situation.professional : situation.care;
}

function withSenderVoice(text, filters) {
  if (filters.format !== "group") return text;
  return text
    .replace(/\bI am\b/g, "we are")
    .replace(/\bI\b/g, "we")
    .replace(/\bmy\b/gi, "our")
    .replace(/\bme\b/gi, "us")
    .replace(/(^|[.!?]\s+)(we|our|us)\b/g, (_, prefix, pronoun) => prefix + capitalize(pronoun));
}

function effectiveTone(filters) {
  if (filters.tone === "funny" && !isFunnyAllowed(filters)) {
    return isProfessionalRecipient(filters) ? "professional" : "supportive";
  }

  if (filters.tone === "religious" && isWorkplaceRecipient(filters)) return "professional";

  return filters.tone;
}

function isSensitiveFilter(filters) {
  return filters.situation === "surgery" || filters.situation === "serious" || filters.situation === "chronic" || filters.situation === "hospital";
}

function isProfessionalRecipient(filters) {
  return filters.recipient === "boss" || filters.recipient === "client";
}

function isWorkplaceRecipient(filters) {
  return filters.recipient === "boss" || filters.recipient === "client" || filters.recipient === "coworker";
}

function isFunnyAllowed(filters) {
  return filters.situation === "minor" && (
    filters.recipient === "friend" ||
    filters.recipient === "family" ||
    filters.recipient === "partner" ||
    filters.recipient === "coworker"
  );
}

function buildFunnyMessage(filters) {
  if (filters.situation === "injury") {
    return "Get well soon. I will save the dramatic comeback music for when moving around is less annoying.";
  }

  if (filters.recipient === "coworker") {
    return "Get well soon. I hope your TV shows have fewer plot holes than our meeting agendas.";
  }

  if (filters.recipient === "family") {
    return "Get well soon. I have saved some truly terrible jokes for when you want a distraction.";
  }

  return "Feel better soon. I miss your face and your questionable advice.";
}

function personalize(text, filters) {
  const name = personName.value.trim();
  let greeting = name ? `${name}, ` : "";
  if (filters.format === "email") greeting = name ? `Hello ${name},\n\n` : "Hello,\n\n";
  if (["card", "group"].includes(filters.format) && name) greeting = `Dear ${name},\n\n`;
  return text.replace("{name}", greeting);
}

function formatHelpOffer(help, filters = {}) {
  help = help.trim();
  if (isCompleteHelpOffer(help)) {
    return addTerminalPunctuation(help);
  }

  help = help.replace(/[.!?]+$/, "");
  const sender = filters.format === "group" ? "We" : "I";
  if (startsWithHelpVerb(help)) {
    return `${sender} can ${help} if that would help.`;
  }

  return `${sender} can help with ${help} if that would help.`;
}

function isCompleteHelpOffer(help) {
  const normalized = help.trim().toLowerCase().replaceAll("\u2019", "'");
  return /^(?:i|we|you|he|she|they|it)\s+\w/.test(normalized)
    || /^(?:i(?:'ll|'d|'m|'ve)|we(?:'ll|'d|'re|'ve)|let\s+(?:me|us)|please\s+let\s+(?:me|us)|happy\s+to)\b/.test(normalized)
    || /^[a-z][a-z' -]*\s+(?:is|are|will|can|could|has|have)\b/.test(normalized);
}

function startsWithHelpVerb(help) {
  const normalized = help.trim().toLowerCase();
  return /^(?:bring|drop|pick|drive|send|make|cook|deliver|watch|handle|cover|run|sit|call|visit|check|take|walk|feed|buy|help|write|text)\b/.test(normalized);
}

function addTerminalPunctuation(value) {
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function renderMessages() {
  if (!form || !resultRoot || !title || !note) return;
  const filters = currentFilters();
  const displayTone = effectiveTone(filters);
  const finderMessages = buildFinderMessages(filters, helpOffer.value);
  updateTuneButtons(displayTone);

  title.textContent = `${capitalize(labels[displayTone])} messages for ${labels[filters.recipient]}`;
  note.textContent = getResultNote(filters);

  resultRoot.innerHTML = finderMessages
    .map((message, index) => {
      const finalText = personalize(message.text, filters);
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
  const feedback = [
    activeTuneAction ? tuneFeedback[activeTuneAction] : "",
    filters.format === "group" && helpOffer.value.trim() && isCompleteHelpOffer(helpOffer.value)
      ? "Your complete help sentence keeps the wording you entered, including who is offering."
      : ""
  ].filter(Boolean).join(" ");
  const prefix = feedback ? `${feedback} ` : "";
  const displayTone = effectiveTone(filters);

  if (filters.tone === "funny" && displayTone !== "funny") {
    return `${prefix}Humor is softened for this situation so the wording stays careful and low-pressure.`;
  }

  if (filters.tone === "religious" && displayTone === "professional") {
    return `${prefix}Religious wording is avoided for this relationship unless you know it is welcome.`;
  }

  if (filters.situation === "serious" || filters.situation === "chronic") {
    return `${prefix}Uses safer wording that does not rush recovery or ask for updates.`;
  }

  return `${prefix}Best for ${noteSituationLabels[filters.situation]} ${formatLabels[filters.format]}.`;
}

function getCopySnippet(text) {
  const snippet = text.replace(/\s+/g, " ").trim();
  return snippet.length > 70 ? `${snippet.slice(0, 70).trim()}...` : snippet;
}

function trackUsage(eventName, parameters) {
  try {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, { ...parameters, page_path: window.location.pathname });
  } catch {
    // Analytics must never interrupt message generation or copying.
  }
}

function trackFinderUse(action) {
  const filters = currentFilters();
  if (!filters || !["select", "shorter", "warmer", "safer"].includes(action)) return;
  if (!Object.entries(finderOptions).every(([key, values]) => values.includes(filters[key]))) return;

  trackUsage("finder_use", {
    action,
    recipient: filters.recipient,
    situation: filters.situation,
    tone: effectiveTone(filters),
    format: filters.format
  });
}

function copyText(text, trigger) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showCopySuccess(trigger)).catch(() => fallbackCopy(text, trigger));
    return;
  }

  fallbackCopy(text, trigger);
}

function setupEmailLinks() {
  emailLinks.forEach((link) => {
    const user = link.dataset.emailUser;
    const domain = link.dataset.emailDomain;
    if (!user || !domain) return;

    const address = `${user}@${domain}`;
    const text = link.querySelector("[data-email-text]");
    link.href = `mailto:${address}`;
    link.setAttribute("aria-label", `Email ${address}`);
    if (text) text.textContent = address;
  });
}

function fallbackCopy(text, trigger) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (copied) {
    showCopySuccess(trigger);
  } else {
    showToast("Could not copy");
  }
}

function showCopySuccess(trigger) {
  const source = trigger?.closest?.("#messageResults")
    ? "finder"
    : trigger?.closest?.(".examples-section") ? "homepage" : "article";
  trackUsage("copy_message", { source });
  showToast("Copied");
  if (!trigger?.classList) return;

  trigger.classList.add("copied");
  const original = trigger.textContent;
  const preserveMessage = trigger.classList.contains("copy-line");
  if (!preserveMessage) trigger.textContent = "Copied";
  window.setTimeout(() => {
    if (!preserveMessage) trigger.textContent = original;
    trigger.classList.remove("copied");
  }, 1400);
}

function showToast(message = "Copied") {
  if (!toast) return;

  toast.textContent = message;
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

function handleFinderChange(event) {
  activeTuneAction = null;
  renderMessages();
  if (event.target.tagName === "SELECT" && ["recipient", "situation", "tone", "format"].includes(event.target.id)) {
    trackFinderUse("select");
  }
}

if (form) {
  form.addEventListener("input", () => {
    activeTuneAction = null;
    renderMessages();
  });
  form.addEventListener("change", handleFinderChange);
}

for (const field of [personName, helpOffer]) {
  if (!field) continue;
  field.addEventListener("input", renderMessages);
  field.addEventListener("change", renderMessages);
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

function updateTuneButtons(tone) {
  for (const button of tuneButtons) {
    button.setAttribute("aria-pressed", tuneTones[button.dataset.action] === tone ? "true" : "false");
  }
}

document.addEventListener("click", (event) => {
  const download = event.target.closest("[data-card-download]");
  if (download?.dataset.cardDownload === "teacher-get-well-cards"
      && ["a4", "letter"].includes(download.dataset.paperSize)) {
    trackUsage("card_download_click", {
      card_pack: download.dataset.cardDownload,
      paper_size: download.dataset.paperSize
    });
  }

  const copyTarget = event.target.closest("[data-copy]");
  if (copyTarget) {
    const visibleMessage = copyTarget.closest(".message-card")?.querySelector("p")?.textContent?.trim();
    copyText(visibleMessage || copyTarget.dataset.copy, copyTarget);
  }

  const tune = event.target.closest("[data-action]");
  if (!tune) return;

  const selectedTone = tuneTones[tune.dataset.action];
  if (!Object.hasOwn(tuneTones, tune.dataset.action) || !form) return;
  document.getElementById("tone").value = selectedTone;
  activeTuneAction = tune.dataset.action;
  renderMessages();
  trackFinderUse(activeTuneAction);
});

function applyInitialFinderContext() {
  if (!form || !["/", "/index.html"].includes(window.location.pathname)) return;
  const params = new URLSearchParams(window.location.search);
  // Read only categorical context. Names, offers, unknown keys, and URL hashes
  // are never imported or saved, and initialization sends no usage event.
  for (const [key, values] of Object.entries(finderOptions)) {
    const value = params.get(key);
    if (values.includes(value)) document.getElementById(key).value = value;
  }
}

setupEmailLinks();
applyInitialFinderContext();
renderMessages();
