/* ═══════════════════════════════════════════
   CONTACT — form submission + footer year
   ═══════════════════════════════════════════ */

const BUSINESS_EMAIL = 'info@aminyrepair.com.au';

// ── Auto-update footer year ──
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

export function setupContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  const field = id => form.querySelector(`#${id}`);
  const value = id => field(id).value.trim();

  function showMessage(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className = `form-status ${type}`;
  }

  function markInvalid(ids) {
    form.querySelectorAll('input, textarea').forEach(el => el.removeAttribute('aria-invalid'));
    ids.forEach(id => field(id).setAttribute('aria-invalid', 'true'));
    if (ids.length) field(ids[0]).focus();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = value('firstName');
    const lastName  = value('lastName');
    const email     = value('email');
    const phone     = value('phone');
    const device    = value('device');
    const message   = value('message');

    const missing = [['firstName', firstName], ['lastName', lastName], ['email', email], ['device', device]]
      .filter(([, v]) => !v).map(([id]) => id);
    if (missing.length) {
      markInvalid(missing);
      return showMessage('Please fill in all required fields.', 'error');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      markInvalid(['email']);
      return showMessage('Please enter a valid email address.', 'error');
    }

    // Phone is optional; accept spaces, dashes and brackets (e.g. 0412 345 678, +61 412 345 678)
    if (phone && !/^(\+61|0)\d{9}$/.test(phone.replace(/[\s\-()]/g, ''))) {
      markInvalid(['phone']);
      return showMessage('Please enter a valid Australian phone number, e.g. 0412 345 678.', 'error');
    }

    markInvalid([]);

    // No backend: open the visitor's email app with the enquiry pre-filled.
    const subject = encodeURIComponent(`Repair Enquiry — ${device}`);
    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nDevice & Issue: ${device}\nMessage: ${message}`
    );
    window.location.href = `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;

    showMessage(
      `Your email app should now open with your enquiry ready — just press Send. If nothing opened, email us at ${BUSINESS_EMAIL}.`,
      'info'
    );
  });
}
