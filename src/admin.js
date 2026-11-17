/**
 * /api/admin/* — enquiries admin API (D-14, task 2.7).
 *
 *   GET    /api/admin/enquiries?status=&q=&limit=50&before=<id>
 *   GET    /api/admin/enquiries/:id
 *   PATCH  /api/admin/enquiries/:id   {status?, notes?}
 *   DELETE /api/admin/enquiries/:id   (only when status is done or spam)
 *
 * Every request passes requireAdmin() first. Every query uses prepare().bind();
 * SQL is never built from request text.
 */
import { json } from './http.js';
import { requireAdmin } from './access.js';
import {
  ENQUIRY_STATUSES, DELETABLE_STATUSES, parseId, parseListQuery, validateAdminPatch, escapeLike,
} from './validate.js';

const COLUMNS = `id, created_at, updated_at, first_name, last_name, email, phone, device, message,
  quote_model, quote_issue, quote_total, status, notes, email_sent`;
const MAX_PATCH_BYTES = 8 * 1024;

// Search across name, email, phone and device. The same fragment is reused for the
// list and the per-status counts, so tab counts always match the search.
const SEARCH_SQL = `(first_name || ' ' || last_name LIKE ?1 ESCAPE '\\'
  OR email LIKE ?1 ESCAPE '\\' OR phone LIKE ?1 ESCAPE '\\' OR device LIKE ?1 ESCAPE '\\')`;

/** PATCH/DELETE must come from this site's own pages (CSRF guard on top of Access). */
function isSameOrigin(request, url) {
  return request.headers.get('Origin') === url.origin;
}

export async function handleAdmin(request, env, url) {
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return json({ ok: false, error: auth.error }, auth.status);

  const parts = url.pathname.replace(/\/+$/, '').split('/');   // ['', 'api', 'admin', 'enquiries', id?]
  if (parts[3] !== 'enquiries' || parts.length > 5) return json({ ok: false, error: 'not_found' }, 404);

  if (request.method !== 'GET' && !isSameOrigin(request, url)) {
    return json({ ok: false, error: 'forbidden_origin' }, 403);
  }

  if (parts.length === 4) {
    if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'GET' });
    return listEnquiries(env, url.searchParams);
  }

  const id = parseId(parts[4]);
  if (!id) return json({ ok: false, error: 'not_found' }, 404);

  switch (request.method) {
    case 'GET': return getEnquiry(env, id);
    case 'PATCH': return patchEnquiry(request, env, id);
    case 'DELETE': return deleteEnquiry(env, id);
    default: return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'GET, PATCH, DELETE' });
  }
}

async function listEnquiries(env, params) {
  const parsed = parseListQuery(params);
  if (!parsed.ok) return json({ ok: false, error: parsed.error }, 400);
  const { status, q, limit, before } = parsed.data;
  const like = q ? `%${escapeLike(q)}%` : null;

  // ?1 = search pattern (or NULL = no search), ?2 = status (or NULL = all), ?3 = before id, ?4 = limit
  const searchClause = `(?1 IS NULL OR ${SEARCH_SQL})`;
  const listStmt = env.DB.prepare(
    `SELECT ${COLUMNS} FROM enquiries
     WHERE ${searchClause} AND (?2 IS NULL OR status = ?2) AND (?3 IS NULL OR id < ?3)
     ORDER BY id DESC LIMIT ?4`
  ).bind(like, status, before, limit + 1);
  const countStmt = env.DB.prepare(
    `SELECT status, COUNT(*) AS n FROM enquiries WHERE ${searchClause} GROUP BY status`
  ).bind(like);

  const [list, counts] = await env.DB.batch([listStmt, countStmt]);
  const rows = list.results;
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  const byStatus = Object.fromEntries(ENQUIRY_STATUSES.map((s) => [s, 0]));
  for (const r of counts.results) byStatus[r.status] = r.n;
  byStatus.all = Object.values(byStatus).reduce((a, b) => a + b, 0);

  return json({ ok: true, items, counts: byStatus, nextBefore: hasMore ? items[items.length - 1].id : null });
}

async function getEnquiry(env, id) {
  const item = await env.DB.prepare(`SELECT ${COLUMNS} FROM enquiries WHERE id = ?1`).bind(id).first();
  return item ? json({ ok: true, item }) : json({ ok: false, error: 'not_found' }, 404);
}

async function patchEnquiry(request, env, id) {
  const text = await request.text();
  if (text.length > MAX_PATCH_BYTES) return json({ ok: false, error: 'payload_too_large' }, 413);
  let body;
  try { body = JSON.parse(text); } catch { return json({ ok: false, error: 'invalid_json', fields: [] }, 400); }

  const v = validateAdminPatch(body);
  if (!v.ok) return json({ ok: false, error: v.error, fields: v.fields }, 400);

  // NULL means "leave unchanged" for both fields.
  const item = await env.DB.prepare(
    `UPDATE enquiries
        SET status = COALESCE(?1, status),
            notes = COALESCE(?2, notes),
            updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
      WHERE id = ?3
      RETURNING ${COLUMNS}`
  ).bind(v.data.status, v.data.notes, id).first();
  return item ? json({ ok: true, item }) : json({ ok: false, error: 'not_found' }, 404);
}

async function deleteEnquiry(env, id) {
  const placeholders = DELETABLE_STATUSES.map((_, i) => `?${i + 2}`).join(', ');
  const deleted = await env.DB.prepare(
    `DELETE FROM enquiries WHERE id = ?1 AND status IN (${placeholders}) RETURNING id`
  ).bind(id, ...DELETABLE_STATUSES).first();
  if (deleted) return json({ ok: true, id });

  const exists = await env.DB.prepare('SELECT status FROM enquiries WHERE id = ?1').bind(id).first();
  if (!exists) return json({ ok: false, error: 'not_found' }, 404);
  return json({ ok: false, error: 'delete_not_allowed', status: exists.status }, 409);
}
