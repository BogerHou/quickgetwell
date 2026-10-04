(() => {
  "use strict";
  const lessonIds = ["client-sick-reply", "boss-sick-notice", "coworker-you-barely-know", "signing-a-team-card", "thanking-work-well-wishers"];
  const lessonId = document.body.dataset.lessonId;
  const validLesson = lessonIds.includes(lessonId);
  const routes = ["/resources/", "/resources/teacher-care-pack/", "/practice/workplace-english/", ...lessonIds.map(id => `/practice/workplace-english/${id}/`)];
  const status = document.querySelector(".copy-status");
  let statusTimer;
  let completed = false;

  function track(name, parameters) {
    if (window.location.hostname !== "quickgetwell.com" || !routes.includes(window.location.pathname)) return;
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, { experiment_id: "resources_v1", ...parameters, page_path: window.location.pathname });
      }
    } catch { /* Analytics must not interrupt a task. */ }
  }

  function notify(message) {
    if (!status) return;
    clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.add("is-visible");
    statusTimer = setTimeout(() => status.classList.remove("is-visible"), 2500);
  }

  async function copy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch { /* Try the selectable-text fallback below. */ }
    const field = document.createElement("textarea");
    const previous = document.activeElement;
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } catch { /* Show honest failure. */ }
    field.remove();
    previous?.focus();
    return copied;
  }

  document.addEventListener("click", async event => {
    const download = event.target.closest("[data-resource-download]");
    if (download?.dataset.resourceDownload === "teacher-care-pack" && ["a4", "letter"].includes(download.dataset.paperSize)) {
      track("resource_download_click", { resource_id: "teacher-care-pack", paper_size: download.dataset.paperSize });
    }
    const button = event.target.closest("[data-copy-target]");
    if (!button) return;
    const id = button.dataset.copyTarget;
    if (!["class-invitation", "example-0", "example-1"].includes(id)) return;
    const target = document.getElementById(id);
    if (!target) return;
    const copied = await copy(target.textContent);
    notify(copied ? "Copied. Replace any bracketed details before sending." : "Could not copy. You can select and copy the text above.");
    if (copied) track("resource_copy", { resource_id: validLesson ? lessonId : "teacher-care-pack", copy_id: id });
  });

  const form = document.querySelector(".practice-form");
  const feedback = document.querySelector(".answer-status");
  const explanation = document.querySelector(".answer-explanation");
  if (!form || !validLesson || !feedback || !explanation) return;

  form.addEventListener("change", () => {
    feedback.textContent = "Choice changed. Check it to see how the wording fits.";
    explanation.hidden = true;
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const selected = form.querySelector('input[name="answer"]:checked');
    if (!selected) {
      feedback.textContent = "Choose one reply first.";
      form.querySelector('input[name="answer"]')?.focus();
      return;
    }
    if (!["0", "1", "2"].includes(selected.value) || !["0", "1", "2"].includes(form.dataset.correctIndex)) return;
    const correct = selected.value === form.dataset.correctIndex;
    feedback.textContent = correct ? "A good fit for this situation. Here's why." : "Another reply fits the stated situation more closely. Read the explanation below.";
    explanation.hidden = false;
    document.querySelectorAll(".choice-explanation").forEach(item => item.classList.toggle("is-selected", item.dataset.choiceIndex === selected.value));
    track("practice_answer", { lesson_id: lessonId, choice: Number(selected.value), correct });
    if (!completed) {
      completed = true;
      track("practice_complete", { lesson_id: lessonId });
    }
  });
})();
