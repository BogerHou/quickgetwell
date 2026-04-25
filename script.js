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
    text: "{name}Please feel better soon. I need my favorite person back at full sarcasm capacity."
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
    care: "I miss your usual energy and want you to feel cared for.",
    help: "I can bring food, run an errand, send distractions, or sit quietly with you.",
    professional: "I am thinking of you and hoping you get the rest you need."
  },
  family: {
    care: "You are deeply loved, and you do not have to manage anyone else's worry.",
    help: "We can handle meals, rides, calls, or home tasks while you rest.",
    professional: "Our family is thinking of you and sending steady support."
  },
  partner: {
    care: "I love you, and you do not have to be strong every minute.",
    help: "I can handle food, errands, reminders, or quiet company.",
    professional: "I am thinking of you and hoping today feels gentler."
  },
  coworker: {
    care: "You are missed, but work can wait.",
    help: "The team can cover things while you take the time you need.",
    professional: "The team is thinking of you and wishing you rest and comfort."
  },
  boss: {
    care: "The team is thinking of you with respect and warm wishes.",
    help: "The team has things covered while you focus on rest.",
    professional: "Please take the time you need to take care of yourself."
  },
  client: {
    care: "I am sorry to hear you have been unwell.",
    help: "There is no rush on our side; we can revisit anything outstanding when the timing is better.",
    professional: "Please accept my warm thoughts and best wishes for comfort."
  }
};

const situationProfiles = {
  minor: {
    short: "Thinking of you and hoping today feels easier.",
    lowPressure: "today feels easier",
    care: "I hope this rough patch gives you room for real rest.",
    professional: "Please take the time you need to rest and feel better.",
    faith: "May today feel calmer, lighter, and full of good care.",
    help: "simple things like soup, medicine pickup, or a no-pressure check-in"
  },
  surgery: {
    short: "Thinking of you after surgery and wishing you quiet rest.",
    lowPressure: "you get quiet rest after surgery",
    care: "I am glad the surgery is behind you, and I hope each day feels a little more supported.",
    professional: "Please focus on rest and care after your procedure.",
    faith: "May the days after surgery bring peace, patience, and steady support.",
    help: "meals, rides, errands, childcare, or help at home"
  },
  injury: {
    short: "Thinking of you and hoping the injury feels a little less frustrating today.",
    lowPressure: "the injury feels a little less frustrating today",
    care: "I know injury recovery can be slow and annoying, and I hope today feels more manageable.",
    professional: "Please take the time you need to rest and recover from the injury.",
    faith: "May you have patience, comfort, and practical support while you heal.",
    help: "rides, groceries, carrying things, or anything awkward while moving around is harder"
  },
  hospital: {
    short: "Thinking of you in the hospital and sending quiet support.",
    lowPressure: "the hospital days feel less lonely",
    care: "I hope the hospital days feel less lonely and you feel cared for by the people around you.",
    professional: "Please focus on rest, care, and privacy while you are in the hospital.",
    faith: "May peace, good care, and steady support surround you in the hospital.",
    help: "updates to others, errands, rides, or anything that makes the hospital stay easier"
  },
  serious: {
    short: "Thinking of you today. No need to reply.",
    lowPressure: "today brings a little comfort and support",
    care: "I am sorry this is so hard, and I am here without needing an update.",
    professional: "Sending steady support and warm thoughts during this difficult time.",
    faith: "Praying for comfort, peace, and the right support around you today.",
    help: "meals, rides, appointment support, errands, or handling updates for others"
  },
  chronic: {
    short: "Thinking of you and hoping today is gentle.",
    lowPressure: "today is as gentle as possible",
    care: "I know this is not simple, and I am here for the long days too.",
    professional: "Please take the time and space you need, without pressure to explain.",
    faith: "May today bring comfort, patience, and support that does not fade.",
    help: "low-pressure check-ins, meals, errands, or help on the days that feel heavy"
  }
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

function buildFinderMessages(filters) {
  const displayTone = effectiveTone(filters);
  if (displayTone === "short") {
    return buildShortFinderMessages(filters).map((text) => ({
      recipient: filters.recipient,
      situation: filters.situation,
      tone: displayTone,
      format: filters.format,
      text
    }));
  }

  const generated = [
    buildPrimaryMessage(filters),
    buildLowPressureMessage(filters),
    buildHelpMessage(filters),
    buildFormatSpecificMessage(filters),
    buildCheckInMessage(filters),
    buildGentleAlternativeMessage(filters)
  ];

  return generated.map((text) => ({
    recipient: filters.recipient,
    situation: filters.situation,
    tone: displayTone,
    format: filters.format,
    text
  }));
}

function buildShortFinderMessages(filters) {
  const situation = situationProfiles[filters.situation];
  const recipient = recipientProfiles[filters.recipient];

  if (isWorkplaceRecipient(filters)) {
    return [
      `{name}${situation.professional}`,
      "{name}Sending warm thoughts. No response needed.",
      `{name}${recipient.professional}`,
      "{name}Please take the time you need.",
      "{name}Thinking of you and wishing you comfort.",
      "{name}No need to reply. Just sending support."
    ];
  }

  return [
    `{name}${situation.short}`,
    "{name}No need to reply. Just thinking of you.",
    "{name}I hope today feels a little gentler.",
    "{name}Sending love, comfort, and steady support.",
    "{name}I am here if a specific kind of help would make today easier.",
    "{name}Thinking of you and hoping you feel cared for."
  ];
}

function buildPrimaryMessage(filters) {
  const recipient = recipientProfiles[filters.recipient];
  const situation = situationProfiles[filters.situation];
  const tone = effectiveTone(filters);

  if (tone === "short") return `{name}${situation.short}`;
  if (tone === "professional") return `{name}${buildProfessionalMessage(filters)}`;
  if (tone === "religious") return `{name}Praying for comfort, peace, and support. ${situation.faith}`;
  if (tone === "funny") return `{name}${buildFunnyMessage(filters)}`;
  if (tone === "heartfelt") return `{name}${recipient.care} ${situation.care}`;

  return `{name}${situation.care} ${recipient.care}`;
}

function buildLowPressureMessage(filters) {
  const situation = situationProfiles[filters.situation];
  const voice = senderVoice(filters);

  if (isWorkplaceRecipient(filters)) {
    return `{name}Sending warm thoughts. No response is needed. ${situation.professional}`;
  }

  return `{name}${voice.subject} just wanted to check in. No need to reply; ${voice.subjectLower} ${voice.hope} ${situation.lowPressure}.`;
}

function buildHelpMessage(filters) {
  const recipient = recipientProfiles[filters.recipient];
  const situation = situationProfiles[filters.situation];
  const voice = senderVoice(filters);
  const sharedVoice = voice.subjectLower === "we" || /^(?:We|The team)\b/.test(recipient.help);
  const gladPhrase = sharedVoice ? "we are" : "I am";

  if (filters.recipient === "client") {
    return `{name}${recipient.help}`;
  }

  if (filters.recipient === "boss" || filters.recipient === "coworker") {
    const subject = sharedVoice ? "we" : voice.subjectLower;
    return `{name}${recipient.help} Please focus on rest and care; ${subject} ${voice.hope} you feel supported.`;
  }

  return `{name}${recipient.help} If ${situation.help} would help, ${gladPhrase} glad to do something specific.`;
}

function buildFormatSpecificMessage(filters) {
  const recipient = recipientProfiles[filters.recipient];
  const situation = situationProfiles[filters.situation];

  if (filters.format === "email") {
    return `{name}${buildProfessionalMessage(filters)} There is no need to respond until it is a good time for you.`;
  }

  if (filters.format === "card") {
    return `{name}Writing this with warm thoughts and steady support. ${situation.care} ${recipient.care}`;
  }

  if (filters.format === "flowers") {
    return `{name}Sending a little brightness and a lot of care. ${situation.short}`;
  }

  if (filters.format === "group") {
    return `{name}All of us are thinking of you. ${situation.professional} You have our support and no pressure to reply.`;
  }

  if (/no need to reply/i.test(situation.short)) {
    return `{name}${situation.short}`;
  }

  return `{name}${situation.short} No need to reply; I just wanted you to know I am thinking of you.`;
}

function buildProfessionalMessage(filters) {
  const recipient = recipientProfiles[filters.recipient];
  const situation = situationProfiles[filters.situation];

  if (filters.recipient === "client") {
    if (filters.situation === "minor") return `${recipient.care} ${situation.professional}`;
    return situation.professional;
  }

  if (filters.recipient === "boss") {
    return `${recipient.care} ${recipient.help}`;
  }

  return `${recipient.professional} ${situation.professional}`;
}

function buildCheckInMessage(filters) {
  const situation = situationProfiles[filters.situation];
  const recipient = recipientProfiles[filters.recipient];
  const tone = effectiveTone(filters);

  if (tone === "short") {
    return `{name}Just checking in gently. ${situation.short}`;
  }

  if (isWorkplaceRecipient(filters)) {
    return `{name}Just checking in with warm thoughts. ${situation.professional} There is no need to respond until the timing is right.`;
  }

  return `{name}Just checking in gently. ${situation.care} ${recipient.help}`;
}

function buildGentleAlternativeMessage(filters) {
  const situation = situationProfiles[filters.situation];
  const tone = effectiveTone(filters);

  if (tone === "religious") {
    return `{name}May you feel held, loved, and supported today. ${situation.faith}`;
  }

  if (tone === "professional") {
    return `{name}Sending warm thoughts and respect for your privacy. ${situation.professional}`;
  }

  return `{name}There is no perfect thing to say, but I care about you. ${situation.care}`;
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

function senderVoice(filters) {
  if (filters.format === "group") {
    return { subject: "We", subjectLower: "we", hope: "hope" };
  }

  return { subject: "I", subjectLower: "I", hope: "hope" };
}

function buildFunnyMessage(filters) {
  if (filters.situation === "injury") {
    return "Get well soon. I will save the dramatic comeback music for when moving around is less annoying.";
  }

  if (filters.recipient === "coworker") {
    return "Get well soon. The office is dangerously close to becoming too quiet without you.";
  }

  if (filters.recipient === "family") {
    return "Get well soon, because everyone here is pretending to be calm and we both know that cannot last.";
  }

  return "Feel better soon. I miss your face and your questionable advice.";
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

  if (startsWithHelpVerb(help)) {
    return `I can ${help} if that would help.`;
  }

  return `I can help with ${help} if that would help.`;
}

function isCompleteHelpOffer(help) {
  const normalized = help.trim().toLowerCase().replaceAll("\u2019", "'");
  return /^(?:i\s+(?:can|will|would|am)|i(?:'ll|'d|'m)|we\s+(?:can|will|would|are)|we(?:'ll|'d|'re)|let\s+(?:me|us)|please\s+let\s+(?:me|us)|happy\s+to)\b/.test(normalized);
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
  const finderMessages = buildFinderMessages(filters);

  title.textContent = `${capitalize(labels[displayTone])} messages for ${labels[filters.recipient]}`;
  note.textContent = getResultNote(filters);

  resultRoot.innerHTML = finderMessages
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
  const displayTone = effectiveTone(filters);

  if (filters.tone === "funny" && displayTone !== "funny") {
    return `${feedback}Humor is softened for this situation so the wording stays careful and low-pressure.`;
  }

  if (filters.tone === "religious" && displayTone === "professional") {
    return `${feedback}Religious wording is avoided for this relationship unless you know it is welcome.`;
  }

  if (filters.situation === "serious" || filters.situation === "chronic") {
    return `${feedback}Uses safer wording that does not rush recovery or ask for updates.`;
  }

  return `${feedback}Best for ${noteSituationLabels[filters.situation]} ${formatLabels[filters.format]}.`;
}

function getCopySnippet(text) {
  const snippet = text.replace(/\s+/g, " ").trim();
  return snippet.length > 70 ? `${snippet.slice(0, 70).trim()}...` : snippet;
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
  showToast("Copied");
  if (!trigger?.classList) return;

  trigger.classList.add("copied");
  const original = trigger.textContent;
  trigger.textContent = "Copied";
  window.setTimeout(() => {
    trigger.textContent = original;
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

function handleFinderChange() {
  activeTuneAction = null;
  updateTuneButtons(null);
  renderMessages();
}

if (form) {
  form.addEventListener("input", () => {
    activeTuneAction = null;
    updateTuneButtons(null);
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

function updateTuneButtons(activeAction) {
  for (const button of tuneButtons) {
    button.setAttribute("aria-pressed", button.dataset.action === activeAction ? "true" : "false");
  }
}

document.addEventListener("click", (event) => {
  const copyTarget = event.target.closest("[data-copy]");
  if (copyTarget) {
    const visibleMessage = copyTarget.closest(".message-card")?.querySelector("p")?.textContent?.trim();
    copyText(visibleMessage || copyTarget.dataset.copy, copyTarget);
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
    document.getElementById("tone").value = "supportive";
  }
  activeTuneAction = tune.dataset.action;
  updateTuneButtons(activeTuneAction);
  renderMessages();
});

setupEmailLinks();
updateTuneButtons(null);
renderMessages();
