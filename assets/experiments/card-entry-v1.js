(function () {
  "use strict";

  const root = document.getElementById("messageResults");
  if (!root) return;

  const transferKey = "qgw:card-transfer:v1";
  const destination = "/resources/care-studio/#from=finder";
  const privacy = document.createElement("p");
  privacy.className = "card-transfer-note";
  privacy.textContent = "Make a card carries your message to the editor using temporary storage in this tab. It is removed when the editor opens.";
  root.insertAdjacentElement("beforebegin", privacy);

  function enhanceResults() {
    root.querySelectorAll(".message-card").forEach((card, index) => {
      if (card.querySelector(".card-finder-action")) return;
      const copyButton = card.querySelector(".copy-button");
      const paragraph = card.querySelector("p");
      if (!copyButton || !paragraph) return;

      const actions = document.createElement("div");
      actions.className = "card-finder-actions";
      copyButton.before(actions);
      actions.appendChild(copyButton);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "card-finder-action";
      button.textContent = "Make a card";
      button.setAttribute("aria-label", `Make a card with message ${index + 1}`);
      actions.appendChild(button);

      // The Finder also renders on input blur. Keep this clicked button in the
      // document until its click runs, rather than letting blur replace it.
      button.addEventListener("pointerdown", function (event) {
        if (event.button === 0 && event.isPrimary !== false) event.preventDefault();
      });

      const status = document.createElement("p");
      status.className = "card-transfer-status";
      status.setAttribute("role", "status");
      status.hidden = true;
      card.appendChild(status);

      button.addEventListener("click", function () {
        const text = paragraph.textContent;
        if (!text.trim() || Array.from(text).length > 4000) {
          status.textContent = "This message is too long to transfer. Copy it, open Make a card in the navigation, and paste a shorter version into the editor.";
          status.hidden = false;
          return;
        }

        try {
          const payload = JSON.stringify({ text, createdAt: Date.now() });
          window.sessionStorage.setItem(transferKey, payload);
          if (window.sessionStorage.getItem(transferKey) !== payload) throw new Error("Transfer unavailable");
          window.location.assign(destination);
        } catch (_) {
          try { window.sessionStorage.removeItem(transferKey); } catch (_) { /* Storage may be unavailable. */ }
          status.textContent = "Your browser blocked the message transfer. Copy this message, open Make a card in the navigation, and paste it into the editor.";
          status.hidden = false;
        }
      });
    });
  }

  enhanceResults();
  new MutationObserver(enhanceResults).observe(root, { childList: true });
}());
