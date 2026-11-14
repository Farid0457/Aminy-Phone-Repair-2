/**
 * POST /api/contact — website enquiry form.
 * Order: method → origin → size → JSON → honeypot → validate → Turnstile → save (D1) → email.
 * Contract: docs/architecture.md
 */
import { json } from './http.js';
import { validateContact, isHoneypotFilled } from './validate.js';
import { sendEnquiry } from './email.js';

const MAX_BODY_BYTES = 10 * 1024;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

export function isAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  let o;
  try { o = new URL(origin); } catch { return false; }
  if (o.origin === new URL(request.url).origin) return true;          // same site (incl. workers.dev)
  if (LOCAL_HOSTS.has(o.hostname)) return LOCAL_HOSTS.has(new URL(request.url).hostname);
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return allowed.includes(o.origin);
}

export async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error('TURNSTILE_SECRET_KEY is not set — rejecting submission');
    return false;
  }
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET_KEY);
  form.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const out = await res.json();
    if (!out.success) console.warn('Turnstile failed:', out['error-codes']);
    return out.success === true;
  } catch (err) {
    console.error('Turnstile verify error:', err);
    return false;
  }
}

async function saveEnquiry(env, d) {
  const row = await env.DB.prepare(
    `INSERT INTO enquiries
       (first_name, last_name, email, phone, device, message, quote_model, quote_issue, quote_total)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id`
  ).bind(
    d.firstName, d.lastName, d.email, d.phone, d.device, d.message,
    d.quote?.model ?? null, d.quote?.issue ?? null, d.quote?.total ?? null
  ).first();
  return row.id;
}

export async function handleContact(request, env) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'POST' });
  }
  if (!isAllowedOrigin(request, env)) {
    return json({ ok: false, error: 'forbidden_origin' }, 403);
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'payload_too_large' }, 413);
  }

  let body;
  try { body = JSON.parse(raw); } catch {
    return json({ ok: false, error: 'invalid_json', fields: [] }, 400);
  }

  // Bots that fill the hidden field get a fake success and nothing is stored or sent.
  if (isHoneypotFilled(body)) return json({ ok: true });

  const v = validateContact(body);
  if (!v.ok) return json({ ok: false, error: v.error, fields: v.fields }, 400);

  if (!(await verifyTurnstile(body.turnstileToken, request, env))) {
    return json({ ok: false, error: 'verification_failed' }, 403);
  }

  const data = v.data;
  let id = null;
  try {
    id = await saveEnquiry(env, data);
  } catch (err) {
    console.error('D1 insert failed:', err);
  }

  const origin = new URL(request.url).origin;
  try {
    await sendEnquiry(env, data, { id, adminUrl: id ? `${origin}/admin/?id=${id}` : undefined });
    if (id) await env.DB.prepare('UPDATE enquiries SET email_sent = 1 WHERE id = ?').bind(id).run();
  } catch (err) {
    console.error('Email delivery failed:', err);
    // Saved in the database → the owner will still see it in /admin.
    if (!id) return json({ ok: false, error: 'delivery_failed' }, 502);
  }

  return json({ ok: true, id });
}
