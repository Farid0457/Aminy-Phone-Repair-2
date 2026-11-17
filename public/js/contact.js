/* ═══════════════════════════════════════════
   CONTACT — enquiry form → POST /api/contact
   (emailed to the shop — no database, D-17)
   ═══════════════════════════════════════════ */

const BUSINESS_EMAIL = 'info@aminyrepair.com.au';

// ── Auto-update footer year ──
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Quote hand-off from the instant-quote tool ──
let attachedQuote = null;   // { model, issue, total }
let autoDevice = '';        // the #device text we filled in, so we only clear our own text

function renderQuote() {
  const box  = document.getElementById('quoteAttached');
  const text = document.getElementById('quoteAttachedText');
  if (!box || !text) return;
  box.hidden = !attachedQuote;
  text.textContent = attachedQuote
    ? `${attachedQuote.model} — ${attachedQuote.issue} — $${attachedQuote.total} incl. GST`
    : '';
}

/** Called by quote.js when "Book This Repair" is clicked. */
export function attachQuote(quote) {
  attachedQuote = { model: quote.model, issue: quote.issue, total: Math.round(quote.total) };
  const device = document.getElementById('device');
  if (device) {
    autoDevice = `${quote.model} — ${quote.issue}`;
    device.value = autoDevice;
    device.removeAttribute('aria-invalid');
  }
  renderQuote();
  document.getElementById('contact')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  document.getElementById('firstName')?.focus({ preventScroll: true });
  history.replaceState(null, '', '#contact');
}

/** Called by quote.js on "Start Over", and by the × button. */
export function clearQuote() {
  attachedQuote = null;
  const device = document.getElementById('device');
  if (device && device.value === autoDevice) device.value = '';
  autoDevice = '';
  renderQuote();
}

// ── Form ──
export function setupContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submit = document.getElementById('contactSubmit');
  if (!form) return;

  document.getElementById('quoteAttachedRemove')?.addEventListener('click', () => {
    clearQuote();
    document.getElementById('device')?.focus();
  });

  const field = id => form.querySelector(`#${id}`);
  const value = id => field(id).value.trim();
  const phoneLink = document.querySelector('.contact-item a[href^="tel:"]');

  function showMessage(msg, type, { html = false } = {}) {
    if (!status) return;
    if (html) status.replaceChildren(...msg); else status.textContent = msg;
    status.className = `form-status ${type}`;
  }

  // Error message with phone + email fallback, built with DOM nodes (no innerHTML)
  function showFallback(intro) {
    const parts = [document.createTextNode(`${intro} Please call us`)];
    if (phoneLink) {
      const a = document.createElement('a');
      a.href = phoneLink.getAttribute('href');
      a.textContent = phoneLink.textContent;
      parts.push(document.createTextNode(' on '), a);
    }
    const m = document.createElement('a');
    m.href = `mailto:${BUSINESS_EMAIL}`;
    m.textContent = BUSINESS_EMAIL;
    parts.push(document.createTextNode(' or email '), m, document.createTextNode('.'));
    showMessage(parts, 'error', { html: true });
  }

  function markInvalid(ids) {
    form.querySelectorAll('input, textarea').forEach(el => el.removeAttribute('aria-invalid'));
    ids.forEach(id => field(id)?.setAttribute('aria-invalid', 'true'));
    const first = ids.map(field).find(Boolean);
    if (first) first.focus();
  }

  function setSending(on) {
    submit.disabled = on;
    submit.textContent = on ? 'Sending…' : 'Send Enquiry →';
    form.setAttribute('aria-busy', String(on));
  }

  const resetTurnstile = () => { try { window.turnstile?.reset('#turnstile'); } catch { /* not loaded */ } };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submit.disabled) return;

    const data = {
      firstName: value('firstName'),
      lastName:  value('lastName'),
      email:     value('email'),
      phone:     value('phone'),
      device:    value('device'),
      message:   value('message'),
      website:   field('website')?.value ?? '',
      quote:     attachedQuote,
      turnstileToken: form.querySelector('[name="cf-turnstile-response"]')?.value ?? '',
    };

    // ── Client-side checks (the server checks again) ──
    const missing = ['firstName', 'lastName', 'email', 'device'].filter(id => !data[id]);
    if (missing.length) {
      markInvalid(missing);
      return showMessage('Please fill in all required fields.', 'error');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      markInvalid(['email']);
      return showMessage('Please enter a valid email address.', 'error');
    }
    // Phone is optional; accept spaces, dashes and brackets (e.g. 0412 345 678, +61 412 345 678)
    if (data.phone && !/^(\+61|0)\d{9}$/.test(data.phone.replace(/[\s\-()]/g, ''))) {
      markInvalid(['phone']);
      return showMessage('Please enter a valid Australian phone number, e.g. 0412 345 678.', 'error');
    }
    if (!data.turnstileToken) {
      return showMessage('Please wait a moment for the security check above to finish, then try again.', 'error');
    }
    markInvalid([]);

    // ── Send ──
    setSending(true);
    showMessage('', 'info');
    let res, out = {};
    try {
      res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      out = await res.json().catch(() => ({}));
    } catch {
      res = null;
    }
    setSending(false);
    resetTurnstile();

    if (res && res.ok && out.ok) {
      form.reset();
      clearQuote();
      return showMessage(`Thanks ${data.firstName} — we've received your enquiry and will be in touch shortly.`, 'success');
    }
    if (res && res.status === 400 && Array.isArray(out.fields) && out.fields.length) {
      markInvalid(out.fields.filter(f => f !== 'quote'));
      return showMessage('Please check the highlighted fields and try again.', 'error');
    }
    if (res && res.status === 403 && out.error === 'verification_failed') {
      return showMessage('The security check failed. Please try again.', 'error');
    }
    showFallback("Sorry, we couldn't send your enquiry right now.");
  });
}
