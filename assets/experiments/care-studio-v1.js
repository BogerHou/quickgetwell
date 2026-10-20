(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root.document) api.mount(root);
})(typeof window === "undefined" ? globalThis : window, function () {
  "use strict";
  const route = "/resources/care-studio/";
  const toolNames = Object.freeze({ card: "card maker", help: "help offer", preferences: "contact preferences" });
  const artwork = Object.freeze({
    botanical: "/assets/experiments/care-art/garden-v2.webp",
    ink: "/assets/experiments/care-art/comfort-v2.webp",
    sunrise: "/assets/experiments/care-art/window-v2.webp"
  });
  const clean = (value, limit) => Array.from(String(value || "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim()).slice(0, limit).join("");
  const choice = (value, options, fallback) => options.includes(value) ? value : fallback;
  const transferKey = "qgw:card-transfer:v1";

  // Only the explicit Finder → card action writes this one-use handoff. The editor
  // consumes it before parsing, never saves drafts, and never puts words in a URL.
  function consumeTransfer(win) {
    try {
      const stored = win.sessionStorage.getItem(transferKey);
      win.sessionStorage.removeItem(transferKey);
      if (!stored) return null;
      const data = JSON.parse(stored);
      const age = Date.now() - data.createdAt;
      if (typeof data.text !== "string" || !data.text.trim() ||
          Array.from(data.text).length > 4000 ||
          !Number.isFinite(data.createdAt) || age < 0 || age > 5 * 60 * 1000) return null;
      return data.text;
    } catch { return null; }
  }

  function buildModel(tool, values = {}) {
    const model = { tool, valid: false, heading: "", to: "", lines: [], from: "", theme: "botanical", text: "" };
    if (tool === "card") {
      model.heading = { thinking: "Thinking of you", "get-well": "Get well soon", "thank-you": "Thank you" }[choice(values.heading, ["thinking", "get-well", "thank-you"], "thinking")];
      model.to = clean(values.to, 40);
      model.lines = [clean(values.message, Infinity)];
      model.from = clean(values.from, 50);
      model.theme = choice(values.theme, ["botanical", "ink", "sunrise"], "botanical");
      model.tooLong = Array.from(model.lines[0]).length > 320;
      model.valid = !!model.lines[0] && !model.tooLong;
    } else if (tool === "help") {
      model.heading = "An offer of help";
      for (let i = 1; i <= 3; i++) {
        const task = clean(values[`task${i}`], 70);
        const time = clean(values[`time${i}`], 50);
        if (task) model.lines.push(`${model.lines.length + 1}. ${task}${time ? `\n   When: ${time}` : ""}`);
      }
      model.valid = model.lines.length > 0;
      if (model.valid) model.lines.push("Choose what would be useful. It's okay to pass or suggest a change.");
      model.from = clean(values.from, 50);
      model.theme = "ink";
    } else if (tool === "preferences") {
      const contact = choice(values.contact, ["text", "call-first", "via-person", "quiet"], "text");
      const visits = choice(values.visits, ["ask-first", "no-visits", "welcome"], "ask-first");
      const updates = choice(values.updates, ["self", "person", "private"], "self");
      const helper = clean(values.helper, 50);
      model.heading = "Keeping in touch";
      model.lines = [
        { text: "Text is the easiest way to reach me. I may take a while to reply.", "call-first": "Please text before calling so we can find a good time.", "via-person": helper ? `Please contact ${helper} before reaching out to me.` : "Choose a contact person below.", quiet: "I'd like some quiet time. I'll reach out when I'm ready." }[contact],
        { "ask-first": "Please ask before visiting.", "no-visits": "I'm not having visitors at the moment.", welcome: "I'd welcome a visit. Let's agree on a time first." }[visits],
        { self: "I'll share updates when I'm ready.", person: helper ? `Please ask ${helper} for the updates I've agreed to share.` : "Choose a contact person below.", private: "Please keep what I've shared with you private." }[updates]
      ];
      const note = clean(values.note, 160);
      if (note) model.lines.push(note);
      model.valid = !((contact === "via-person" || updates === "person") && !helper);
      model.theme = "sunrise";
    }
    model.text = [model.to, model.heading, ...model.lines, model.from].filter(Boolean).join("\n\n");
    return model;
  }

  function wrapText(context, value, width) {
    const result = [];
    for (const paragraph of String(value).split("\n")) {
      if (!paragraph.trim()) { result.push(""); continue; }
      let line = "";
      for (const word of paragraph.trim().split(/\s+/)) {
        const candidate = line ? `${line} ${word}` : word;
        if (context.measureText(candidate).width <= width) { line = candidate; continue; }
        if (line) { result.push(line); line = ""; }
        for (const char of Array.from(word)) {
          if (line && context.measureText(line + char).width > width) { result.push(line); line = ""; }
          line += char;
        }
      }
      if (line) result.push(line);
    }
    return result;
  }

  function makeEvent(name, tool, parameters = {}) {
    if (!Object.hasOwn(toolNames, tool)) return null;
    const allowed = ["care_tool_view", "care_tool_start", "care_export", "care_feedback"];
    if (!allowed.includes(name)) return null;
    const safe = { experiment_id: "care_studio_v1", tool_id: tool, page_path: route };
    if (name === "care_export") {
      if (!["png_created", "print_opened", "copied"].includes(parameters.action)) return null;
      safe.action = parameters.action;
    }
    if (name === "care_feedback") {
      if (!["useful", "not-useful", "not-sure"].includes(parameters.rating)) return null;
      safe.rating = parameters.rating;
      if (parameters.rating === "not-useful" && ["hard-to-edit", "design", "export", "not-needed", "other"].includes(parameters.reason)) safe.reason = parameters.reason;
      if (["group-card", "photo", "drawing", "more-layouts", "nothing"].includes(parameters.next_feature)) safe.next_feature = parameters.next_feature;
    }
    return { name, parameters: safe };
  }

  function draw(context, model, art) {
    const width = 1200, height = 1500;
    const ink = { botanical: "#253e55", ink: "#713e2e", sunrise: "#2c514f" }[model.theme] || "#253e55";
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#faf3e5";
    context.fillRect(0, 0, width, height);
    if (art) context.drawImage(art, 0, 0, width, height);
    context.fillStyle = ink;
    context.textAlign = "center";
    context.textBaseline = "top";
    const personal = model.tool === "card";
    let y;
    if (personal) {
      context.font = "28px Georgia, serif";
      context.fillText(model.to || "", 600, 66, 940);
      const title = {
        "Thinking of you": ["Thinking", "of you"],
        "Get well soon": ["Get well", "soon"],
        "Thank you": ["Thank", "you"]
      }[model.heading] || [model.heading];
      context.font = "108px Georgia, serif";
      context.fillText(title[0], 600, 128, 960);
      context.font = "italic 112px Georgia, serif";
      if (title[1]) context.fillText(title[1], 600, 242, 960);
      y = 385;
    } else {
      context.font = "italic 82px Georgia, serif";
      context.fillText(model.heading, 600, 125, 980);
      context.strokeStyle = ink;
      context.lineWidth = 1;
      context.beginPath(); context.moveTo(540, 242); context.lineTo(660, 242); context.stroke();
      y = 290;
    }
    // Leave the illustration intact: fit the entire note into its clear paper area.
    let size = personal ? 36 : 32, lines;
    // Keep overlong words in the editor/text preview without laying them out or
    // presenting a clipped image as an exportable card.
    const content = model.tooLong ? "" : model.lines.filter(Boolean).join("\n\n");
    const bottom = personal ? 622 : 682;
    const room = bottom - y;
    const family = personal ? "Georgia, serif" : "Arial, sans-serif";
    do {
      context.font = `${size}px ${family}`;
      lines = wrapText(context, content, 920);
      if (lines.length * size * 1.35 <= room || size <= 26) break;
      size--;
    } while (size >= 26);
    const fits = !model.tooLong && lines.length * size * 1.35 <= room;
    for (const line of lines) {
      if (y + size * 1.35 > bottom) break;
      context.fillText(line, 600, y);
      y += size * 1.35;
    }
    context.font = "italic 28px Georgia, serif";
    if (fits) context.fillText(model.from || "", 600, y + 25, 880);
    return fits;
  }

  function mount(win) {
    const doc = win.document;
    if (!doc.getElementById("care-card-form")) return;
    let current = "card";
    const seen = new Set(), started = new Set(), feedbackSent = new Set();
    const urls = new Set();
    const models = new Map(), fits = new Map(), artCache = new Map();
    const feedback = doc.getElementById("care-feedback-form");
    const feedbackStatus = doc.getElementById("care-feedback-status");
    let printRoot, printUrl, exportBusy = false, feedbackBusy = false;
    const messageField = doc.getElementById("card-message");
    const picker = doc.getElementById("card-message-picker");
    const categoryField = doc.getElementById("card-message-category");
    const messageOptions = doc.getElementById("card-message-options");
    const pickerStatus = doc.getElementById("card-message-picker-status");
    const importStatus = doc.getElementById("card-message-import-status");
    const undoButton = doc.getElementById("card-message-undo");
    const moreButton = doc.getElementById("card-message-more");
    let previousMessage = null, messageOffset = 0, messageEntries = [];
    try {
      const parsed = JSON.parse(doc.getElementById("care-message-catalog")?.textContent || "[]");
      if (Array.isArray(parsed)) messageEntries = parsed.filter(entry =>
        entry && typeof entry.id === "string" && /^[a-f0-9]{16}$/.test(entry.id) &&
        typeof entry.text === "string" && entry.text.trim() && Array.from(entry.text).length <= 320 &&
        typeof entry.category === "string");
    } catch { /* The editor remains usable if the optional message library fails. */ }

    function refreshMessageChoices() {
      doc.querySelectorAll("[data-message-id]").forEach(button => {
        const selected = messageEntries.some(entry => entry.id === button.dataset.messageId && entry.text === messageField.value);
        button.setAttribute("aria-pressed", String(selected));
        button.textContent = selected ? "In your card" : "Use message";
      });
    }
    function renderMessageChoices() {
      if (!messageOptions || !categoryField) return;
      const choices = messageEntries.filter(entry => categoryField.value === "all" || entry.category === categoryField.value);
      messageOptions.replaceChildren();
      choices.slice(messageOffset, messageOffset + 6).forEach(entry => {
        const item = doc.createElement("div"), text = doc.createElement("p"), button = doc.createElement("button");
        item.className = "care-message-option";
        text.textContent = entry.text;
        button.type = "button"; button.className = "care-message-use";
        button.dataset.messageId = entry.id;
        button.addEventListener("click", () => {
          if (messageField.value !== entry.text) {
            previousMessage = messageField.value;
            messageField.value = entry.text;
            if (undoButton) undoButton.hidden = false;
          }
          update("card", true);
          if (picker) picker.open = false;
          if (importStatus) importStatus.textContent = "Added to your card. You can edit it below.";
          // Keep the selected words in view without opening the mobile keyboard.
          if (undoButton && !undoButton.hidden) undoButton.focus({ preventScroll: true });
          else picker?.querySelector("summary")?.focus();
        });
        item.appendChild(text); item.appendChild(button); messageOptions.appendChild(item);
      });
      if (pickerStatus) pickerStatus.textContent = choices.length
        ? `Messages ${messageOffset + 1}–${Math.min(messageOffset + 6, choices.length)} of ${choices.length}`
        : "Message examples are unavailable. You can still write your own.";
      if (moreButton) moreButton.hidden = choices.length <= 6;
      refreshMessageChoices();
    }
    function clearMessageHistory() {
      previousMessage = null;
      if (undoButton) undoButton.hidden = true;
      if (importStatus) importStatus.textContent = "";
    }

    function track(name, tool, parameters) {
      const event = makeEvent(name, tool, parameters);
      if (!event || win.location.hostname !== "quickgetwell.com" || win.location.pathname !== route || typeof win.gtag !== "function") return false;
      try { win.gtag("event", event.name, event.parameters); return true; } catch { return false; }
    }
    function value(id) { return doc.getElementById(id)?.value || ""; }
    function read(tool) {
      if (tool === "card") return { heading: value("card-heading"), to: value("card-to"), message: value("card-message"), from: value("card-from"), theme: value("card-theme") };
      if (tool === "help") return { task1: value("help-task-1"), time1: value("help-time-1"), task2: value("help-task-2"), time2: value("help-time-2"), task3: value("help-task-3"), time3: value("help-time-3"), from: value("help-from") };
      return { contact: value("preferences-contact"), visits: value("preferences-visits"), updates: value("preferences-updates"), helper: value("preferences-helper"), note: value("preferences-note") };
    }
    function status(tool, text) { doc.getElementById(`care-${tool}-status`).textContent = text; }
    function loadArt(theme) {
      if (artCache.has(theme)) return artCache.get(theme);
      const entry = { state: "loading", image: null };
      artCache.set(theme, entry);
      const finish = state => {
        entry.state = state;
        // Re-read the current model; a late image must never restore an older draft/theme.
        for (const tool of Object.keys(toolNames)) {
          if (models.get(tool)?.theme === theme) update(tool);
        }
      };
      if (typeof win.Image !== "function") { entry.state = "error"; return entry; }
      const image = new win.Image();
      entry.image = image;
      image.onload = async () => {
        try {
          if (typeof image.decode === "function") await image.decode();
          if (!image.naturalWidth || !image.naturalHeight) throw new Error("Empty illustration");
          finish("ready");
        } catch { finish("error"); }
      };
      image.onerror = () => finish("error");
      image.src = artwork[theme];
      return entry;
    }
    function update(tool, edited = false) {
      const values = read(tool), model = buildModel(tool, values);
      const canvas = doc.getElementById(`care-${tool}-canvas`);
      let context;
      try { context = canvas.getContext("2d"); } catch { /* Keep the text-only path usable. */ }
      models.set(tool, model);
      const art = loadArt(model.theme);
      let fitsCanvas = false;
      let drawFailed = false;
      try { if (context) fitsCanvas = draw(context, model, art.state === "ready" ? art.image : null); }
      catch { drawFailed = true; }
      fitsCanvas = fitsCanvas && art.state === "ready" && !drawFailed;
      fits.set(tool, fitsCanvas);
      doc.getElementById(`care-${tool}-text`).textContent = model.text;
      doc.querySelectorAll(`[data-export][data-for="${tool}"]`).forEach(button => {
        button.disabled = !model.valid || (button.dataset.export !== "copy" && !fitsCanvas);
      });
      if (tool === "preferences") {
        doc.querySelectorAll("[data-helper-field]").forEach(field => { field.hidden = !(values.contact === "via-person" || values.updates === "person"); });
      }
      if (tool === "card") {
        doc.querySelectorAll("[data-theme-choice]").forEach(button => {
          button.setAttribute("aria-pressed", String(button.dataset.themeChoice === model.theme));
        });
        const counter = doc.getElementById("card-message-count");
        if (counter) {
          counter.textContent = `${Array.from(values.message).length} / 320 characters${model.tooLong ? " — shorten your message before downloading" : ""}`;
          counter.setAttribute("data-over-limit", String(model.tooLong));
        }
        messageField.setAttribute("aria-invalid", String(model.tooLong));
        refreshMessageChoices();
      }
      let notice = "";
      if (model.tooLong) notice = "Your full message is kept in the editor. Shorten it to 320 characters before using this card.";
      else if (!context || drawFailed) notice = "Image preview is unavailable. You can still copy your text.";
      else if (art.state === "loading") notice = "Loading your illustration…";
      else if (art.state === "error") notice = "The illustration could not load. Reload to try again, or use Copy text.";
      else if (!model.valid) notice = tool === "card" ? "Add your own note to make this card." : tool === "help" ? "Add at least one thing you can offer." : "Add the name or role of the person who has agreed to help with contact.";
      else if (!fitsCanvas) notice = "This note is too long for the illustrated space. Shorten it, use fewer line breaks, or copy the full text.";
      status(tool, notice);
      if (edited && !started.has(tool)) { started.add(tool); track("care_tool_start", tool); }
    }
    function select(tool, focus = false) {
      if (!Object.hasOwn(toolNames, tool)) return;
      current = tool;
      doc.querySelectorAll("[data-tool]").forEach(button => { button.setAttribute("aria-pressed", String(button.dataset.tool === tool)); });
      doc.querySelectorAll("[data-tool-panel]").forEach(panel => { panel.hidden = panel.dataset.toolPanel !== tool; });
      doc.querySelectorAll("[data-feedback-tool]").forEach(label => { label.textContent = toolNames[tool]; });
      feedback.reset();
      feedbackStatus.textContent = feedbackSent.has(tool) ? "You have already shared feedback on this tool during this visit." : "";
      feedback.querySelector("[data-feedback-reason]").hidden = true;
      feedback.querySelector('button[type="submit"]').disabled = feedbackBusy || feedbackSent.has(tool);
      update(tool);
      if (!seen.has(tool)) { seen.add(tool); track("care_tool_view", tool); }
      if (focus) doc.getElementById(`care-${tool}-form`).querySelector("input,select,textarea")?.focus();
    }
    function revoke(url) { if (url) { win.URL.revokeObjectURL(url); urls.delete(url); } }
    function cleanupPrint() {
      doc.body.classList.remove("care-printing");
      printRoot?.remove(); printRoot = null;
      revoke(printUrl); printUrl = null;
      exportBusy = false;
    }
    async function copy(text) {
      try { if (win.isSecureContext && win.navigator.clipboard) { await win.navigator.clipboard.writeText(text); return true; } } catch { /* Try manual browser fallback. */ }
      const area = doc.createElement("textarea"), previous = doc.activeElement;
      area.value = text; area.readOnly = true; area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      doc.body.appendChild(area); area.select();
      let ok = false;
      try { ok = doc.execCommand("copy"); } catch { /* Status explains manual selection. */ }
      area.remove(); previous?.focus();
      return ok;
    }
    async function exportTool(tool, action) {
      const model = models.get(tool);
      if (!model?.valid || exportBusy) return;
      if (action === "copy") {
        exportBusy = true;
        const copied = await copy(model.text);
        status(tool, copied ? "Copied. Read it once more before sharing." : "Could not copy. Open the text preview to select and copy your words.");
        if (copied) track("care_export", tool, { action: "copied" });
        exportBusy = false;
        return;
      }
      if (!["png", "print"].includes(action) || !fits.get(tool)) return;
      exportBusy = true;
      status(tool, action === "png" ? "Preparing your image…" : "Preparing a print view…");
      try {
        const blob = await new Promise((resolve, reject) => {
          doc.getElementById(`care-${tool}-canvas`).toBlob(result => result ? resolve(result) : reject(new Error("Image unavailable")), "image/png");
        });
        const url = win.URL.createObjectURL(blob);
        urls.add(url);
        if (action === "png") {
          const link = doc.createElement("a");
          link.href = url; link.download = `quickgetwell-${tool}.png`;
          doc.body.appendChild(link); link.click(); link.remove();
          win.setTimeout(() => revoke(url), 10000);
          status(tool, "Your PNG is ready. Check your browser's downloads, then share it yourself.");
          track("care_export", tool, { action: "png_created" });
          exportBusy = false;
        } else {
          cleanupPrint();
          exportBusy = true;
          printUrl = url;
          printRoot = doc.createElement("div"); printRoot.id = "care-print-root";
          const img = doc.createElement("img"); img.src = url; img.alt = model.text;
          printRoot.appendChild(img); doc.body.appendChild(printRoot);
          await img.decode();
          doc.body.classList.add("care-printing");
          win.print();
          track("care_export", tool, { action: "print_opened" });
          status(tool, "Print view opened. Choose your paper size and fit the image to one page.");
          // afterprint handles both printing and cancelling, including blocking print dialogs.
          exportBusy = false;
        }
      } catch {
        cleanupPrint();
        status(tool, "Could not prepare the image. Try again, or use Copy text.");
      }
    }

    for (const tool of Object.keys(toolNames)) {
      const form = doc.getElementById(`care-${tool}-form`);
      // Do not reuse a draft restored by the browser on a fresh page load.
      form.reset();
      form.addEventListener("submit", event => event.preventDefault());
      form.addEventListener("input", () => update(tool, true));
      form.addEventListener("change", () => update(tool, true));
      update(tool);
    }
    categoryField?.addEventListener("change", () => { messageOffset = 0; renderMessageChoices(); });
    moreButton?.addEventListener("click", () => {
      const total = messageEntries.filter(entry => categoryField.value === "all" || entry.category === categoryField.value).length;
      messageOffset = messageOffset + 6 >= total ? 0 : messageOffset + 6;
      renderMessageChoices();
    });
    undoButton?.addEventListener("click", () => {
      if (previousMessage === null) return;
      messageField.value = previousMessage;
      clearMessageHistory();
      update("card", true);
      if (importStatus) importStatus.textContent = "Your previous message is restored.";
      messageField.focus();
    });
    const transferredText = consumeTransfer(win);
    // Fragment IDs refer only to public examples; search engines see one URL.
    const incoming = new URLSearchParams((win.location.hash || "").slice(1));
    const publicMessage = messageEntries.find(entry => entry.id === incoming.get("message"));
    if (publicMessage) {
      messageField.value = publicMessage.text;
      if (categoryField) categoryField.value = publicMessage.category;
      if (importStatus) importStatus.textContent = "Your selected message is here. Make it your own.";
    } else if (incoming.get("from") === "finder" && transferredText) {
      messageField.value = transferredText;
      if (importStatus) importStatus.textContent = "Your Finder message is here. Make it your own.";
    } else if (incoming.has("message") || incoming.get("from") === "finder") {
      if (importStatus) importStatus.textContent = "That message could not be loaded. Choose an example below or paste your words.";
      if (picker) picker.open = true;
    }
    renderMessageChoices();
    doc.querySelectorAll("[data-tool]").forEach(button => { button.addEventListener("click", () => select(button.dataset.tool)); });
    doc.querySelectorAll("[data-theme-choice]").forEach(button => {
      button.addEventListener("click", () => {
        if (!Object.hasOwn(artwork, button.dataset.themeChoice)) return;
        doc.getElementById("card-theme").value = button.dataset.themeChoice;
        update("card", true);
      });
    });
    doc.querySelectorAll("[data-export]").forEach(button => { button.addEventListener("click", () => exportTool(button.dataset.for, button.dataset.export)); });
    doc.querySelectorAll("[data-reset]").forEach(button => {
      button.addEventListener("click", () => {
        const tool = button.dataset.reset;
        const confirm = doc.querySelector(`[data-reset-confirm="${tool}"]`);
        if (confirm) { confirm.hidden = false; confirm.querySelector("button")?.focus(); }
      });
    });
    doc.querySelectorAll("[data-reset-yes]").forEach(button => {
      button.addEventListener("click", () => {
        const tool = button.dataset.resetYes;
        if (tool === "card") clearMessageHistory();
        doc.getElementById(`care-${tool}-form`).reset(); update(tool);
        if (tool === "card") { messageOffset = 0; renderMessageChoices(); }
        doc.querySelector(`[data-reset-confirm="${tool}"]`).hidden = true;
        doc.querySelector(`[data-reset="${tool}"]`).focus();
      });
    });
    doc.querySelectorAll("[data-reset-no]").forEach(button => {
      button.addEventListener("click", () => {
        doc.querySelector(`[data-reset-confirm="${button.dataset.resetNo}"]`).hidden = true;
        doc.querySelector(`[data-reset="${button.dataset.resetNo}"]`).focus();
      });
    });
    feedback.addEventListener("change", () => {
      feedback.querySelector("[data-feedback-reason]").hidden = feedback.elements.rating.value !== "not-useful";
      if (!feedbackSent.has(current)) feedbackStatus.textContent = "";
    });
    feedback.addEventListener("submit", event => {
      event.preventDefault();
      if (!feedback.reportValidity() || feedbackBusy || feedbackSent.has(current)) return;
      if (win.location.hostname !== "quickgetwell.com") {
        feedbackStatus.textContent = "Feedback is not sent from this preview. You can try the tools here.";
        return;
      }
      if (win.qgwCareAnalyticsReady !== true || win.navigator.onLine === false) {
        feedbackStatus.textContent = "Feedback could not be sent. You can keep using the tools and try again later.";
        return;
      }
      feedbackBusy = true;
      const sent = track("care_feedback", current, { rating: feedback.elements.rating.value, reason: feedback.elements.reason.value, next_feature: feedback.elements.next_feature.value });
      if (sent) {
        feedbackSent.add(current);
        feedback.querySelector('button[type="submit"]').disabled = true;
        feedbackStatus.textContent = "Thank you for sharing your choice.";
      } else feedbackStatus.textContent = "Feedback could not be sent. Please try again later.";
      feedbackBusy = false;
    });
    win.addEventListener("afterprint", cleanupPrint);
    win.addEventListener("pagehide", () => { cleanupPrint(); for (const url of urls) revoke(url); });
    // Browsers may restore form fields on a back navigation; explicitly start a new visit.
    win.addEventListener("pageshow", event => {
      if (event.persisted) {
        clearMessageHistory();
        for (const tool of Object.keys(toolNames)) { doc.getElementById(`care-${tool}-form`).reset(); update(tool); }
        messageOffset = 0; renderMessageChoices();
      }
    });
    select("card");
  }
  return { buildModel, wrapText, makeEvent, toolNames, artwork, draw, consumeTransfer, mount };
});
