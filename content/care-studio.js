const title = "Free Get-Well Card Maker and Care Notes";
const description = "Make a personal get-well card, offer specific help, or write a contact-preference note. Preview, save an image, copy the text, or print for free.";
const { getEntries } = require("./card-message-catalog");
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function messagePicker(entries) {
  const categories = new Map(entries.map(entry => [entry.category, entry.categoryLabel]));
  return `<details id="card-message-picker" class="care-message-picker">
            <summary><span>Choose a message</span><span class="care-message-picker-caption">Find a starting point to make your own</span></summary>
            <div class="care-message-picker-body">
              <div class="care-field">
                <label for="card-message-category">Who or what is it for?</label>
                <select id="card-message-category"><option value="all">All messages</option>${[...categories].map(([value, label]) => `<option value="${escape(value)}">${escape(label)}</option>`).join("")}</select>
              </div>
              <div id="card-message-options" class="care-message-options" aria-label="Message suggestions"></div>
              <div class="care-message-pagination"><p id="card-message-picker-status" role="status" aria-live="polite"></p><button id="card-message-more" type="button">Next messages <span aria-hidden="true">→</span></button></div>
            </div>
          </details>`;
}

function preview(tool, label, emptyText) {
  return `
    <aside class="care-preview" id="care-${tool}-preview" aria-labelledby="care-${tool}-preview-heading" tabindex="-1">
      <div class="care-preview-heading">
        <h3 id="care-${tool}-preview-heading">Your ${tool === "card" ? "card" : "note"}</h3>
        <a class="care-edit-link" href="#care-${tool}-form">Edit your words ↗</a>
      </div>
      <div class="care-paper">
        <canvas id="care-${tool}-canvas" width="1200" height="1500" role="img" aria-label="${label}">${emptyText} A text version is available below.</canvas>
      </div>
      <details class="care-text-preview">
        <summary>Read preview as text</summary>
        <p class="care-preview-text" id="care-${tool}-text">${emptyText}</p>
      </details>
      <div class="care-export-actions" aria-label="Save or use this ${tool === "card" ? "card" : "note"}">
        <button type="button" class="button care-save-button" data-export="png" data-for="${tool}" disabled>Download image ↓</button>
        <button type="button" class="button secondary" data-export="print" data-for="${tool}" disabled>Print</button>
        <button type="button" class="care-copy-button" data-export="copy" data-for="${tool}" disabled>Copy text</button>
      </div>
      <p id="care-${tool}-status" class="care-status" role="status" aria-live="polite"></p>
      <p class="care-export-note">A 1200 × 1500 image, ready to send or print.</p>
    </aside>`;
}

function helpItem(number) {
  return `
    <fieldset class="care-help-item">
      <legend>Offer ${number}${number > 1 ? ' <span class="care-optional">optional</span>' : ""}</legend>
      <div class="care-field">
        <label for="help-task-${number}">Something I can do</label>
        <input id="help-task-${number}" type="text" maxlength="70" placeholder="${["Pick up a few groceries", "Walk the dog", "Drop off a meal"][number - 1]}">
      </div>
      <div class="care-field">
        <label for="help-time-${number}">When I’m available <span class="care-optional">optional</span></label>
        <input id="help-time-${number}" type="text" maxlength="50" placeholder="${["Tuesday after 5 pm", "Thursday morning", "Saturday lunchtime"][number - 1]}">
      </div>
    </fieldset>`;
}

function clearConfirmation(tool) {
  return `<div class="care-clear-confirmation" data-reset-confirm="${tool}" hidden><p>Clear this draft?</p><div><button type="button" class="text-button" data-reset-yes="${tool}">Clear</button><button type="button" class="care-reset-button" data-reset-no="${tool}">Keep editing</button></div></div>`;
}

function render() {
  const entries = getEntries();
  const catalog = JSON.stringify(entries).replaceAll("<", "\\u003c").replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");
  return `
  <div class="care-studio">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol><li><a href="/">Home</a></li><li><span class="breadcrumb-separator" aria-hidden="true">/</span><a href="/resources/">Resources</a></li><li><span class="breadcrumb-separator" aria-hidden="true">/</span><span aria-current="page">Care studio</span></li></ol>
    </nav>

    <header class="care-intro">
      <p class="eyebrow">The care studio · Free, no account needed</p>
      <h1>Get-well cards, made personal.</h1>
      <p class="lede">Choose an illustrated design. Add words that are yours. Send a little something they can keep.</p>
      <p class="care-privacy-note">Your words stay in this browser tab and aren’t uploaded. Download your finished card before leaving.</p>
    </header>

    <noscript>
      <div class="care-noscript"><h2>Looking for something ready to use?</h2><p>These editors need JavaScript. You can still <a href="/resources/teacher-care-pack/">download the free teacher card PDFs</a> or <a href="/#situations">browse get-well message examples</a>.</p></div>
    </noscript>

    <div class="care-tool-picker" role="group" aria-label="Choose what to make">
      <button type="button" data-tool="card" aria-pressed="true" aria-controls="care-panel-card"><span class="care-picker-title">A personal card</span><span class="care-picker-description">A note to keep</span></button>
      <button type="button" data-tool="help" aria-pressed="false" aria-controls="care-panel-help"><span class="care-picker-title">An offer of help</span><span class="care-picker-description">Care you can give</span></button>
      <button type="button" data-tool="preferences" aria-pressed="false" aria-controls="care-panel-preferences"><span class="care-picker-title">Contact preferences</span><span class="care-picker-description">On your terms</span></button>
    </div>

    <section id="care-panel-card" class="care-tool-panel" data-tool-panel="card" aria-labelledby="care-card-heading">
      <div class="care-tool-heading"><h2 id="care-card-heading">Make a card.</h2><p>Choose the artwork, then make it yours.</p></div>
      <div class="care-tool-layout">
        <form id="care-card-form" class="care-form" autocomplete="off">
          <div class="care-design-picker">
            <div class="care-design-heading"><label for="card-theme">Choose a design</label><select id="card-theme"><option value="botanical">Garden blooms</option><option value="ink">Little comforts</option><option value="sunrise">Window light</option></select></div>
            <div class="care-theme-choices" role="group" aria-label="Illustrated card designs">
              <button type="button" class="care-theme-choice" data-theme-choice="botanical" aria-pressed="true"><span class="care-theme-art"><img src="/assets/experiments/care-art/garden-v2.webp" width="240" height="300" alt="Painted coral and yellow flowers in a blue pitcher"><span aria-hidden="true">Thinking<br>of you</span></span><span class="care-theme-name">Garden blooms</span></button>
              <button type="button" class="care-theme-choice" data-theme-choice="ink" aria-pressed="false"><span class="care-theme-art"><img src="/assets/experiments/care-art/comfort-v2.webp" width="240" height="300" alt="Cozy illustrated comforts framing a warm card"><span aria-hidden="true">Thinking<br>of you</span></span><span class="care-theme-name">Little comforts</span></button>
              <button type="button" class="care-theme-choice" data-theme-choice="sunrise" aria-pressed="false"><span class="care-theme-art"><img src="/assets/experiments/care-art/window-v2.webp" width="240" height="300" alt="Sunlit window illustration with space for a note"><span aria-hidden="true">Thinking<br>of you</span></span><span class="care-theme-name">Window light</span></button>
            </div>
          </div>
          <div class="care-field">
            <label for="card-heading">The occasion</label>
            <select id="card-heading"><option value="thinking">Thinking of you</option><option value="get-well">Get well soon</option><option value="thank-you">Thank you</option></select>
          </div>
          ${messagePicker(entries)}
          <div class="care-field care-message-field">
            <div class="care-message-label"><label for="card-message">Your message</label><button id="card-message-undo" class="care-message-undo" type="button" hidden>Undo replacement</button></div>
            <p id="card-message-import-status" class="care-message-import-status" role="status" aria-live="polite"></p>
            <textarea id="card-message" rows="4" aria-describedby="card-message-hint card-message-count" placeholder="Write a wish, a thank-you, or a memory you share." required></textarea>
            <div class="care-message-meta"><p id="card-message-hint" class="care-field-hint">Edit it until it sounds like you.</p><p id="card-message-count" class="care-field-hint">0 / 320</p></div>
          </div>
          <div class="care-name-fields">
            <div class="care-field">
              <label for="card-to">To <span class="care-optional">optional</span></label>
              <input id="card-to" type="text" maxlength="40" placeholder="Their name">
            </div>
            <div class="care-field">
              <label for="card-from">From <span class="care-optional">optional</span></label>
              <input id="card-from" type="text" maxlength="50" placeholder="Your name or class">
            </div>
          </div>
          <div class="care-form-end"><a class="care-preview-link" href="#care-card-preview">View your card ↓</a><button type="button" class="care-reset-button" data-reset="card">Clear card</button></div>
          ${clearConfirmation("card")}
        </form>
        ${preview("card", "Preview of your personal card", "Write a message to start your card.")}
      </div>
    </section>

    <section id="care-panel-help" class="care-tool-panel" data-tool-panel="help" aria-labelledby="care-help-heading" hidden>
      <div class="care-tool-heading"><h2 id="care-help-heading">Offer something you can do.</h2><p>List up to three practical offers. The other person can choose, suggest a change, or decline.</p></div>
      <div class="care-tool-layout">
        <form id="care-help-form" class="care-form" autocomplete="off">
          <p class="care-form-note">Only include help you’re able to provide. The examples in the fields are suggestions, not part of your note.</p>
          ${helpItem(1)}
          <details class="care-extra-offers"><summary>Add another offer <span class="care-optional">optional</span></summary>${[2, 3].map(helpItem).join("")}</details>
          <div class="care-field">
            <label for="help-from">From <span class="care-optional">optional</span></label>
            <input id="help-from" type="text" maxlength="50" placeholder="Your name">
          </div>
          <div class="care-form-end"><a class="care-preview-link" href="#care-help-preview">View your offer ↓</a><button type="button" class="care-reset-button" data-reset="help">Clear offer</button></div>
          ${clearConfirmation("help")}
        </form>
        ${preview("help", "Preview of your offer of help", "Add one thing you can offer to start your note.")}
      </div>
    </section>

    <section id="care-panel-preferences" class="care-tool-panel" data-tool-panel="preferences" aria-labelledby="care-preferences-heading" hidden>
      <div class="care-tool-heading"><h2 id="care-preferences-heading">Stay in touch on your terms.</h2><p>Make a note you can share with friends or family. Choose what fits you right now, without explaining your health.</p></div>
      <div class="care-tool-layout">
        <form id="care-preferences-form" class="care-form" autocomplete="off">
          <div class="care-field">
            <label for="preferences-contact">Getting in touch</label>
            <select id="preferences-contact"><option value="text">A text works best</option><option value="call-first">Ask before calling</option><option value="via-person">Contact someone I’ve chosen</option><option value="quiet">I’d like some quiet for now</option></select>
          </div>
          <div class="care-field">
            <label for="preferences-visits">Visits</label>
            <select id="preferences-visits"><option value="ask-first">Please ask first</option><option value="no-visits">No visits for now</option><option value="welcome">I’d welcome an arranged visit</option></select>
          </div>
          <div class="care-field">
            <label for="preferences-updates">Sharing updates</label>
            <select id="preferences-updates"><option value="self">I’ll share updates when I’m ready</option><option value="person">Someone I’ve chosen can share updates</option><option value="private">Please keep what I share private</option></select>
          </div>
          <div class="care-field" data-helper-field hidden>
            <label for="preferences-helper">The person I’ve chosen</label>
            <input id="preferences-helper" type="text" maxlength="50" placeholder="Their first name" aria-describedby="preferences-helper-hint">
            <p id="preferences-helper-hint" class="care-field-hint">Check they’re happy to help. You can share their contact details separately.</p>
          </div>
          <div class="care-field">
            <label for="preferences-note">Anything else? <span class="care-optional">optional</span></label>
            <textarea id="preferences-note" rows="4" maxlength="160" placeholder="Something that would help, or a topic you’d enjoy talking about." aria-describedby="preferences-note-hint"></textarea>
            <p id="preferences-note-hint" class="care-field-hint">Up to 160 characters. You don’t need to explain your choices.</p>
          </div>
          <p class="care-form-note">Read the preview before sharing. You can change your preferences whenever you want.</p>
          <div class="care-form-end"><a class="care-preview-link" href="#care-preferences-preview">View your note ↓</a><button type="button" class="care-reset-button" data-reset="preferences">Reset choices</button></div>
          ${clearConfirmation("preferences")}
        </form>
        ${preview("preferences", "Preview of your contact-preference note", "Choose how you would like to stay in touch, then review your note.")}
      </div>
    </section>

    <section class="care-feedback" aria-labelledby="care-feedback-heading">
      <div class="care-feedback-intro"><p class="eyebrow">Help shape these tools</p><h2 id="care-feedback-heading">Did this help?</h2><p>Feedback about <span data-feedback-tool>the personal card</span>. Choose what fits your experience; no name or message text is sent.</p></div>
      <form id="care-feedback-form" class="care-feedback-form">
        <div class="care-field">
          <label for="care-feedback-rating">Was this useful for what you needed?</label>
          <select id="care-feedback-rating" name="rating" required><option value="">Choose an answer</option><option value="useful">Yes, useful</option><option value="not-useful">No, not useful</option><option value="not-sure">I’m not sure yet</option></select>
        </div>
        <div class="care-field" data-feedback-reason hidden>
          <label for="care-feedback-reason">What got in the way? <span class="care-optional">optional</span></label>
          <select id="care-feedback-reason" name="reason"><option value="">Choose a reason</option><option value="hard-to-edit">It was hard to edit</option><option value="design">The design didn’t fit</option><option value="export">Saving, copying, or printing didn’t work</option><option value="not-needed">It wasn’t what I needed</option><option value="other">Something else</option></select>
        </div>
        <div class="care-field">
          <label for="care-feedback-next">What would you most like to try next? <span class="care-optional">optional</span></label>
          <select id="care-feedback-next" name="next_feature"><option value="">Choose one</option><option value="group-card">A card several people can sign</option><option value="photo">Adding my own photo</option><option value="drawing">Adding a drawing</option><option value="more-layouts">More designs and layouts</option><option value="nothing">Nothing else right now</option></select>
        </div>
        <button type="submit" class="button secondary">Send feedback</button>
        <p id="care-feedback-status" class="care-status" role="status" aria-live="polite"></p>
      </form>
    </section>

    <aside class="care-related"><h2>Prefer something ready to use?</h2><p><a href="/resources/teacher-care-pack/">Printable teacher cards</a><span aria-hidden="true"> · </span><a href="/#situations">Get-well message examples</a><span aria-hidden="true"> · </span><a href="/how-to-respond-to-get-well-soon/">Replying to someone’s kind wishes</a></p></aside>
  </div>
  <script type="application/json" id="care-message-catalog">${catalog}</script>`;
}

module.exports = { title, description, render };
