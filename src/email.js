/**
 * Enquiry notification email — sent to the shop owner (D-02).
 * EMAIL_PROVIDER: log | resend | cloudflare
 */

/** Remove CR/LF so user input can never inject extra email headers. */
const oneLine = (s) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim();

export function melbourneTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
}

/** Build subject + plain-text body for an enquiry. */
export function formatEnquiry(data, { id, adminUrl } = {}) {
  const subject = oneLine(`New repair enquiry — ${data.device}`).slice(0, 180);
  const lines = [
    `New enquiry${id ? ` #${id}` : ''} from the website`,
    `Received: ${melbourneTime()}`,
    '',
    `Name:    ${data.firstName} ${data.lastName}`,
    `Email:   ${data.email}`,
    `Phone:   ${data.phone || '—'}`,
    `Device:  ${data.device}`,
  ];
  if (data.quote) {
    lines.push(`Quote:   ${data.quote.model} — ${data.quote.issue} — $${data.quote.total} incl. GST (online estimate)`);
  }
  lines.push('', 'Message:', data.message || '—', '');
  if (adminUrl) lines.push(`Open in admin: ${adminUrl}`, '');
  lines.push('Reply to this email to answer the customer directly.');
  return { subject, text: lines.join('\n') };
}

/**
 * Send the enquiry email. Throws on failure.
 * @param {object} env  Worker env
 * @param {object} data validated enquiry (from validateContact)
 * @param {{id?: number, adminUrl?: string}} meta
 */
export async function sendEnquiry(env, data, meta = {}) {
  const provider = env.EMAIL_PROVIDER || 'log';
  const { subject, text } = formatEnquiry(data, meta);
  const replyTo = oneLine(data.email);

  if (provider === 'log') {
    console.log(
      `\n──── EMAIL (EMAIL_PROVIDER=log — not actually sent) ────\n` +
      `To:       ${env.MAIL_TO || '(MAIL_TO not set)'}\nReply-To: ${replyTo}\nSubject:  ${subject}\n\n${text}\n` +
      `────────────────────────────────────────────────────────\n`
    );
    return;
  }

  if (!env.MAIL_FROM || !env.MAIL_TO) throw new Error('MAIL_FROM / MAIL_TO not configured');

  if (provider === 'resend') {
    if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY secret not set');
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Aminy Website <${env.MAIL_FROM}>`,
        to: [env.MAIL_TO],
        reply_to: replyTo,
        subject,
        text,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return;
  }

  if (provider === 'cloudflare') {
    if (!env.SEND_EMAIL) throw new Error('send_email binding SEND_EMAIL not configured');
    const { EmailMessage } = await import('cloudflare:email');
    const raw = buildMime({ from: env.MAIL_FROM, to: env.MAIL_TO, replyTo, subject, text });
    await env.SEND_EMAIL.send(new EmailMessage(env.MAIL_FROM, env.MAIL_TO, raw));
    return;
  }

  throw new Error(`Unknown EMAIL_PROVIDER "${provider}"`);
}

// ── Minimal RFC 5322 plain-text message (for the Cloudflare send_email binding) ──
const b64 = (str) => {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};

export function buildMime({ from, to, replyTo, subject, text }) {
  const domain = String(from).split('@')[1] || 'localhost';
  const body = b64(text).replace(/.{1,76}/g, '$&\r\n');
  return [
    `From: Aminy Website <${oneLine(from)}>`,
    `To: ${oneLine(to)}`,
    `Reply-To: ${oneLine(replyTo)}`,
    `Subject: =?UTF-8?B?${b64(oneLine(subject))}?=`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body,
  ].join('\r\n');
}
