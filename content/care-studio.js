const title = "Free Get-Well Card Maker and Care Notes";
const description = "Make a personal get-well card, offer specific help, or write a contact-preference note. Preview, save an image, copy the text, or print for free.";

function preview(tool, label, emptyText) {
  return `
    <aside class="care-preview" id="care-${tool}-preview" aria-labelledby="care-${tool}-preview-heading" tabindex="-1">
      <div class="care-preview-heading">
        <h3 id="care-${tool}-preview-heading">Your preview</h3>
        <a class="care-edit-link" href="#care-${tool}-form">Back to editing</a>
      </div>
      <div class="care-paper">
        <canvas id="care-${tool}-canvas" width="1000" height="1200" role="img" aria-label="${label}">${emptyText} A text version is available below.</canvas>
      </div>
      <details class="care-text-preview">
        <summary>Read preview as text</summary>
        <p class="care-preview-text" id="care-${tool}-text">${emptyText}</p>
      </details>
      <div class="care-export-actions" aria-label="Save or use this ${tool === "card" ? "card" : "note"}">
        <button type="button" class="button" data-export="png" data-for="${tool}" disabled>Save image</button>
        <button type="button" class="button secondary" data-export="print" data-for="${tool}" disabled>Print</button>
        <button type="button" class="care-copy-button" data-export="copy" data-for="${tool}" disabled>Copy text</button>
      </div>
      <p id="care-${tool}-status" class="care-status" role="status" aria-live="polite"></p>
      <p class="care-export-note">Save an image to share yourself, or print a single page.</p>
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
  return `
  <div class="care-studio">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol><li><a href="/">Home</a></li><li><span class="breadcrumb-separator" aria-hidden="true">/</span><a href="/resources/">Resources</a></li><li><span class="breadcrumb-separator" aria-hidden="true">/</span><span aria-current="page">Care studio</span></li></ol>
    </nav>

    <header class="care-intro">
      <p class="eyebrow">Free tools · No account needed</p>
      <h1>Make a get-well card<br>or care note.</h1>
      <p class="lede">Add your own words to a card, offer a helping hand, or let people know how you’d like to stay in touch.</p>
      <p class="care-privacy-note">Your words stay on this page. We don’t upload or save them; download a copy before leaving. No health details are needed.</p>
    </header>

    <noscript>
      <div class="care-noscript"><h2>Looking for something ready to use?</h2><p>These editors need JavaScript. You can still <a href="/resources/teacher-care-pack/">download the free teacher card PDFs</a> or <a href="/#situations">browse get-well message examples</a>.</p></div>
    </noscript>

    <div class="care-tool-picker" role="group" aria-label="Choose what to make">
      <button type="button" data-tool="card" aria-pressed="true" aria-controls="care-panel-card"><span class="care-picker-title">A personal card</span><span class="care-picker-description">Your words, ready to share</span></button>
      <button type="button" data-tool="help" aria-pressed="false" aria-controls="care-panel-help"><span class="care-picker-title">An offer of help</span><span class="care-picker-description">A few things you can do</span></button>
      <button type="button" data-tool="preferences" aria-pressed="false" aria-controls="care-panel-preferences"><span class="care-picker-title">My contact preferences</span><span class="care-picker-description">How I’d like to stay in touch</span></button>
    </div>

    <section id="care-panel-card" class="care-tool-panel" data-tool-panel="card" aria-labelledby="care-card-heading">
      <div class="care-tool-heading"><h2 id="care-card-heading">Make it personal.</h2><p>A short note in your own words is enough. Names are optional.</p></div>
      <div class="care-tool-layout">
        <form id="care-card-form" class="care-form" autocomplete="off">
          <a class="care-preview-link" href="#care-card-preview">View preview ↓</a>
          <div class="care-field">
            <label for="card-heading">Card heading</label>
            <select id="card-heading"><option value="thinking">Thinking of you</option><option value="get-well">Get well soon</option><option value="thank-you">Thank you</option></select>
          </div>
          <div class="care-field">
            <label for="card-to">To <span class="care-optional">optional</span></label>
            <input id="card-to" type="text" maxlength="40" placeholder="A first name, a nickname, or your teacher">
          </div>
          <div class="care-field">
            <label for="card-message">Your message</label>
            <textarea id="card-message" rows="5" maxlength="320" aria-describedby="card-message-hint" placeholder="Write a wish, a thank-you, or a memory you share." required></textarea>
            <p id="card-message-hint" class="care-field-hint">Up to 320 characters. Need a starting point? <a href="/#situations">Browse message examples.</a></p>
          </div>
          <div class="care-field">
            <label for="card-from">From <span class="care-optional">optional</span></label>
            <input id="card-from" type="text" maxlength="50" placeholder="Your name, family, or class">
          </div>
          <div class="care-field">
            <label for="card-theme">Design</label>
            <select id="card-theme"><option value="botanical">Botanical · green and cream</option><option value="ink">Ink · simple black and white</option><option value="sunrise">Sunrise · warm peach</option></select>
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
          <a class="care-preview-link" href="#care-help-preview">View preview ↓</a>
          <p class="care-form-note">Only include help you’re able to provide. The examples in the fields are suggestions, not part of your note.</p>
          ${[1, 2, 3].map(helpItem).join("")}
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
          <a class="care-preview-link" href="#care-preferences-preview">View preview ↓</a>
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
  </div>`;
}

module.exports = { title, description, render };
