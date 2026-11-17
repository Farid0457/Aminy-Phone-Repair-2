#!/usr/bin/env node
/**
 * Smoke test for the admin API (/api/admin/*) against a running server.
 *   npm run dev              (in another terminal; .dev.vars needs ADMIN_DEV_BYPASS=true)
 *   npm run smoke:admin      (default http://localhost:8787)
 *   BASE_URL=https://… npm run smoke:admin
 *
 * Locally (dev bypass): creates two test enquiries through /api/contact, then
 * lists, filters, searches, updates and deletes them.
 * Against a live URL: only checks that the API refuses requests without an
 * Access login (401/403/503). It never changes live data.
 */
const BASE = (process.env.BASE_URL ?? 'http://localhost:8787').replace(/\/$/, '');
const ORIGIN = new URL(BASE).origin;
const LOCAL = ['localhost', '127.0.0.1'].includes(new URL(BASE).hostname);
const API = `${BASE}/api/admin/enquiries`;

let failed = 0;
function report(name, pass, detail) {
  if (!pass) failed++;
  console.log(`${pass ? '✔' : '✖'} ${name.padEnd(38)} ${detail}`);
}
async function call(path, { method = 'GET', body, origin = ORIGIN } = {}) {
  const headers = {};
  if (origin) headers.Origin = origin;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  try {
    const res = await fetch(`${API}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: res.status, json, text };
  } catch (err) {
    return { status: 'ERR', json: null, text: err.message };
  }
}
const expectStatus = (name, r, expected) => report(name, r.status === expected, `expected ${expected}, got ${r.status}  ${r.text.slice(0, 80)}`);

if (!LOCAL) {
  const r = await call('');
  report('no Access login → refused', [401, 403, 503].includes(r.status) || (r.status === 302), `got ${r.status}  ${r.text.slice(0, 80)}`);
  console.log(failed ? `\n${failed} case(s) failed` : '\nAll cases passed');
  process.exit(failed ? 1 : 0);
}

// ── Seed two enquiries through the public form API ──
const tag = `smoke-${Date.now()}`;
async function seed(firstName) {
  const res = await fetch(`${BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
    body: JSON.stringify({
      firstName, lastName: 'Admin', email: `${tag}@example.com`, phone: '0412 345 678',
      device: `MacBook Air 13" (M2) — Screen Replacement ${tag}`, message: 'Admin smoke test — safe to delete.',
      quote: { model: 'MacBook Air 13" (M2)', issue: 'Screen Replacement', total: 399 },
      website: '', turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
    }),
  });
  return (await res.json()).id;
}
const idA = await seed('Smokey');
const idB = await seed('Smokette');
report('seed 2 enquiries via /api/contact', Number.isInteger(idA) && Number.isInteger(idB), `ids ${idA}, ${idB}`);

// ── List, counts, filter, search ──
let r = await call('');
expectStatus('list', r, 200);
report('list has counts per status + all', !!r.json?.counts && typeof r.json.counts.all === 'number' && 'spam' in r.json.counts, JSON.stringify(r.json?.counts));
report('list is newest first', r.json?.items?.[0]?.id === idB, `first id ${r.json?.items?.[0]?.id}`);

r = await call(`?q=${encodeURIComponent(tag)}`);
report('search finds both test enquiries', r.json?.items?.length === 2 && r.json.counts.all === 2, `found ${r.json?.items?.length}`);

r = await call(`?q=${encodeURIComponent(tag)}&limit=1`);
report('limit=1 gives a nextBefore cursor', r.json?.items?.length === 1 && r.json.nextBefore === idB, `nextBefore ${r.json?.nextBefore}`);
r = await call(`?q=${encodeURIComponent(tag)}&limit=1&before=${idB}`);
report('before=<id> loads the next page', r.json?.items?.[0]?.id === idA && r.json.nextBefore === null, `got id ${r.json?.items?.[0]?.id}`);

expectStatus('bad status filter', await call('?status=archived'), 400);

// ── Get one ──
r = await call(`/${idA}`);
report('get one', r.status === 200 && r.json?.item?.first_name === 'Smokey' && r.json.item.quote_total === 399, `status ${r.status}`);
expectStatus('get missing id', await call('/999999999'), 404);
expectStatus('get non-numeric id', await call('/abc'), 404);

// ── Patch ──
r = await call(`/${idA}`, { method: 'PATCH', body: { status: 'contacted', notes: 'Called back — smoke test' } });
report('patch status + notes', r.status === 200 && r.json?.item?.status === 'contacted' && r.json.item.notes === 'Called back — smoke test' && !!r.json.item.updated_at, `status ${r.status}`);
expectStatus('patch invalid status', await call(`/${idA}`, { method: 'PATCH', body: { status: 'archived' } }), 400);
expectStatus('patch notes > 2000 chars', await call(`/${idA}`, { method: 'PATCH', body: { notes: 'x'.repeat(2001) } }), 400);
expectStatus('patch without Origin (CSRF guard)', await call(`/${idA}`, { method: 'PATCH', body: { status: 'new' }, origin: null }), 403);
expectStatus('patch from another site', await call(`/${idA}`, { method: 'PATCH', body: { status: 'new' }, origin: 'https://evil.example' }), 403);

r = await call(`?status=contacted&q=${encodeURIComponent(tag)}`);
report('status filter after patch', r.json?.items?.length === 1 && r.json.items[0].id === idA && r.json.counts.contacted === 1 && r.json.counts.new === 1, `items ${r.json?.items?.length}`);

// ── Delete rule ──
r = await call(`/${idA}`, { method: 'DELETE' });
report('delete refused while "contacted"', r.status === 409 && r.json?.error === 'delete_not_allowed', `got ${r.status}`);
await call(`/${idA}`, { method: 'PATCH', body: { status: 'done' } });
expectStatus('delete allowed once "done"', await call(`/${idA}`, { method: 'DELETE' }), 200);
expectStatus('deleted enquiry is gone', await call(`/${idA}`), 404);
await call(`/${idB}`, { method: 'PATCH', body: { status: 'spam' } });
expectStatus('delete allowed for "spam"', await call(`/${idB}`, { method: 'DELETE' }), 200);

// ── Methods ──
expectStatus('POST on the list → 405', await call('', { method: 'POST', body: {} }), 405);
expectStatus('PUT on one → 405', await call(`/${idA}`, { method: 'PUT', body: {} }), 405);

console.log('\n(401 without a login can only be checked against a live URL: BASE_URL=https://… npm run smoke:admin)');
console.log(failed ? `\n${failed} case(s) failed` : '\nAll cases passed');
process.exitCode = failed ? 1 : 0;
