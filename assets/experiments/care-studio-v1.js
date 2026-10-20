(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root.document) api.mount(root);
})(typeof window === "undefined" ? globalThis : window, function () {
  "use strict";
  const route = "/resources/care-studio/";
  const toolNames = Object.freeze({ card: "card maker", help: "help offer", preferences: "contact preferences" });
  const clean = (value, limit) => Array.from(String(value || "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim()).slice(0, limit).join("");
  const choice = (value, options, fallback) => options.includes(value) ? value : fallback;

  function buildModel(tool, values = {}) {
    const model = { valid: false, heading: "", to: "", lines: [], from: "", theme: "botanical", text: "" };
    if (tool === "card") {
      model.heading = { thinking: "Thinking of you", "get-well": "Get well soon", "thank-you": "Thank you" }[choice(values.heading, ["thinking", "get-well", "thank-you"], "thinking")];
      model.to = clean(values.to, 40);
      model.lines = [clean(values.message, 320)];
      model.from = clean(values.from, 50);
      model.theme = choice(values.theme, ["botanical", "ink", "sunrise"], "botanical");
      model.valid = !!model.lines[0];
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

  function draw(context, model) {
    const width = 1000, height = 1200;
    const palettes = {
      botanical: { paper: "#f6f3e9", ink: "#24463f", accent: "#9aaf95", soft: "#e4e9dc" },
      ink: { paper: "#ffffff", ink: "#202d29", accent: "#727b74", soft: "#f2f3ef" },
      sunrise: { paper: "#fff7eb", ink: "#553e2d", accent: "#c58b49", soft: "#f0dfbf" }
    };
    const color = palettes[model.theme] || palettes.botanical;
    context.clearRect(0, 0, width, height);
    context.fillStyle = color.paper;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = color.accent;
    context.lineWidth = 2;
    context.strokeRect(36, 36, width - 72, height - 72);
    context.fillStyle = color.soft;
    if (model.theme === "sunrise") {
      context.beginPath(); context.arc(830, 175, 98, 0, Math.PI * 2); context.fill();
      context.fillRect(732, 175, 196, 18);
    } else if (model.theme === "botanical") {
      context.save(); context.translate(835, 175); context.rotate(-0.35);
      context.strokeStyle = color.accent; context.lineWidth = 4;
      context.beginPath(); context.moveTo(0, 70); context.quadraticCurveTo(-20, 0, 8, -90); context.stroke();
      for (let i = 0; i < 4; i++) {
        context.beginPath(); context.ellipse(i % 2 ? 18 : -20, 35 - i * 32, 34, 13, i % 2 ? -0.6 : 0.6, 0, Math.PI * 2); context.fill();
      }
      context.restore();
    } else {
      context.beginPath(); context.moveTo(740, 150); context.lineTo(880, 150); context.stroke();
      context.beginPath(); context.moveTo(740, 170); context.lineTo(835, 170); context.stroke();
    }
    context.fillStyle = color.ink;
    context.textAlign = "left";
    context.textBaseline = "top";
    context.font = "24px Arial, sans-serif";
    context.fillText(model.to || "", 86, 104, 630);
    context.font = "60px Georgia, serif";
    const headingLines = wrapText(context, model.heading, 720);
    let y = 255;
    for (const line of headingLines) { context.fillText(line, 86, y); y += 70; }
    y += 32;
    let size = 35, lines;
    const content = model.lines.filter(Boolean).join("\n\n");
    const room = 1040 - y;
    do {
      context.font = `${size}px Arial, sans-serif`;
      lines = wrapText(context, content, 828);
      if (lines.length * size * 1.4 <= room || size <= 16) break;
      size -= 1;
    } while (size >= 16);
    // Refuse an unreadable/clipped export instead of silently dropping text.
    const fits = lines.length * size * 1.4 <= room;
    for (const line of lines) { context.fillText(line, 86, y); y += size * 1.4; }
    context.font = "27px Georgia, serif";
    context.fillText(model.from || "", 86, 1093, 828);
    return fits;
  }

  function mount(win) {
    const doc = win.document;
    if (!doc.getElementById("care-card-form")) return;
    let current = "card";
    const seen = new Set(), started = new Set(), feedbackSent = new Set();
    const urls = new Set();
    const models = new Map(), fits = new Map();
    const feedback = doc.getElementById("care-feedback-form");
    const feedbackStatus = doc.getElementById("care-feedback-status");
    let printRoot, printUrl, exportBusy = false, feedbackBusy = false;

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
    function update(tool, edited = false) {
      const values = read(tool), model = buildModel(tool, values);
      const canvas = doc.getElementById(`care-${tool}-canvas`);
      let context;
      try { context = canvas.getContext("2d"); } catch { /* Keep the text-only path usable. */ }
      let fitsCanvas = false;
      if (context) fitsCanvas = draw(context, model);
      fits.set(tool, fitsCanvas);
      models.set(tool, model);
      doc.getElementById(`care-${tool}-text`).textContent = model.text;
      doc.querySelectorAll(`[data-export][data-for="${tool}"]`).forEach(button => {
        button.disabled = !model.valid || (button.dataset.export !== "copy" && !fitsCanvas);
      });
      if (tool === "preferences") {
        doc.querySelectorAll("[data-helper-field]").forEach(field => { field.hidden = !(values.contact === "via-person" || values.updates === "person"); });
      }
      let notice = "";
      if (!model.valid) notice = tool === "card" ? "Add your own note to make this card." : tool === "help" ? "Add at least one thing you can offer." : "Add the name or role of the person who has agreed to help with contact.";
      else if (!context) notice = "Image preview is unavailable. You can still copy your text.";
      else if (!fitsCanvas) notice = "This has too many lines for one sheet. Use fewer line breaks, or copy the full text.";
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
    doc.querySelectorAll("[data-tool]").forEach(button => { button.addEventListener("click", () => select(button.dataset.tool)); });
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
        doc.getElementById(`care-${tool}-form`).reset(); update(tool);
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
        for (const tool of Object.keys(toolNames)) { doc.getElementById(`care-${tool}-form`).reset(); update(tool); }
      }
    });
    select("card");
  }
  return { buildModel, wrapText, makeEvent, toolNames, draw, mount };
});
