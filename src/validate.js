/**
 * Contact form validation — pure functions (no env, no fetch) so they can be
 * unit-tested with node:test. Rules: docs/architecture.md "API contract".
 */

export const LIMITS = {
  firstName: 60,
  lastName: 60,
  email: 254,
  phone: 20,
  device: 200,
  message: 2000,
};

const REQUIRED = ['firstName', 'lastName', 'email', 'device'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AU_PHONE_RE = /^(\+61|0)\d{9}$/;

/** Trim, collapse control characters (except newlines in message) and coerce to string. */
function clean(value, keepNewlines = false) {
  if (value === undefined || value === null) return '';
  let s = String(value);
  s = keepNewlines
    ? s.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    : s.replace(/[\u0000-\u001F\u007F]/g, ' ');
  return s.trim();
}

export function isValidAuPhone(phone) {
  return AU_PHONE_RE.test(phone.replace(/[\s\-()]/g, ''));
}

/** True when the hidden honeypot field was filled in (i.e. a bot). */
export function isHoneypotFilled(body) {
  return !!(body && typeof body.website === 'string' && body.website.trim() !== '');
}

/**
 * @param {unknown} body parsed JSON request body
 * @returns {{ok: true, data: object} | {ok: false, error: string, fields: string[]}}
 */
export function validateContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'invalid_body', fields: [] };
  }

  const data = {
    firstName: clean(body.firstName),
    lastName: clean(body.lastName),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone),
    device: clean(body.device),
    message: clean(body.message, true),
    quote: null,
  };

  const fields = [];

  for (const f of REQUIRED) if (!data[f]) fields.push(f);
  if (fields.length) return { ok: false, error: 'missing_fields', fields };

  for (const [f, max] of Object.entries(LIMITS)) {
    if (data[f].length > max) fields.push(f);
  }
  if (fields.length) return { ok: false, error: 'too_long', fields };

  if (!EMAIL_RE.test(data.email)) return { ok: false, error: 'invalid_email', fields: ['email'] };
  if (data.phone && !isValidAuPhone(data.phone)) return { ok: false, error: 'invalid_phone', fields: ['phone'] };

  if (body.quote !== undefined && body.quote !== null) {
    const q = body.quote;
    const valid =
      typeof q === 'object' &&
      typeof q.model === 'string' && q.model.trim() && q.model.length <= 120 &&
      typeof q.issue === 'string' && q.issue.trim() && q.issue.length <= 120 &&
      Number.isInteger(q.total) && q.total > 0 && q.total < 100000;
    if (!valid) return { ok: false, error: 'invalid_quote', fields: ['quote'] };
    data.quote = { model: clean(q.model), issue: clean(q.issue), total: q.total };
  }

  return { ok: true, data };
}

// ─────────────────────────────────────────
// Admin API input (task 2.7) — also pure
// ─────────────────────────────────────────

/** Must match the CHECK constraint in migrations/0001_create_enquiries.sql. */
export const ENQUIRY_STATUSES = ['new', 'contacted', 'booked', 'done', 'spam'];
/** Only finished or junk enquiries may be deleted. */
export const DELETABLE_STATUSES = ['done', 'spam'];

export const ADMIN_LIMITS = { notes: 2000, query: 100, pageDefault: 50, pageMax: 100 };

/** A positive integer id from a URL segment, or null. */
export function parseId(segment) {
  return typeof segment === 'string' && /^[1-9]\d{0,15}$/.test(segment) ? Number(segment) : null;
}

/** Escape LIKE wildcards so a search for "50%" matches literally (used with ESCAPE '\'). */
export function escapeLike(s) {
  return s.replace(/[\\%_]/g, '\\$&');
}

/**
 * GET /api/admin/enquiries query string.
 * @param {{get(name: string): string|null}} params URLSearchParams
 * @returns {{ok: true, data: {status: string|null, q: string, limit: number, before: number|null}} | {ok: false, error: string}}
 */
export function parseListQuery(params) {
  const rawStatus = (params.get('status') || '').trim();
  let status = null;
  if (rawStatus && rawStatus !== 'all') {
    if (!ENQUIRY_STATUSES.includes(rawStatus)) return { ok: false, error: 'invalid_status' };
    status = rawStatus;
  }

  const q = clean(params.get('q'));
  if (q.length > ADMIN_LIMITS.query) return { ok: false, error: 'query_too_long' };

  const n = Number.parseInt(params.get('limit') || '', 10);
  const limit = Number.isFinite(n) ? Math.min(Math.max(n, 1), ADMIN_LIMITS.pageMax) : ADMIN_LIMITS.pageDefault;

  const rawBefore = params.get('before');
  let before = null;
  if (rawBefore) {
    before = parseId(rawBefore);
    if (!before) return { ok: false, error: 'invalid_before' };
  }

  return { ok: true, data: { status, q, limit, before } };
}

/**
 * PATCH /api/admin/enquiries/:id body: {status?, notes?}
 * @returns {{ok: true, data: {status: string|null, notes: string|null}} | {ok: false, error: string, fields: string[]}}
 */
export function validateAdminPatch(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'invalid_body', fields: [] };
  }
  const unknown = Object.keys(body).filter((k) => k !== 'status' && k !== 'notes');
  if (unknown.length) return { ok: false, error: 'unknown_fields', fields: unknown };
  if (body.status === undefined && body.notes === undefined) {
    return { ok: false, error: 'nothing_to_update', fields: [] };
  }

  const data = { status: null, notes: null };
  if (body.status !== undefined) {
    if (!ENQUIRY_STATUSES.includes(body.status)) return { ok: false, error: 'invalid_status', fields: ['status'] };
    data.status = body.status;
  }
  if (body.notes !== undefined) {
    if (typeof body.notes !== 'string') return { ok: false, error: 'invalid_notes', fields: ['notes'] };
    data.notes = clean(body.notes, true);
    if (data.notes.length > ADMIN_LIMITS.notes) return { ok: false, error: 'too_long', fields: ['notes'] };
  }
  return { ok: true, data };
}
