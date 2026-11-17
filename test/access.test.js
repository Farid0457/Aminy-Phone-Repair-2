import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { requireAdmin, verifyAccessJwt, normaliseTeamDomain, clearCertCache } from '../src/access.js';

const TEAM = 'aminy-test.cloudflareaccess.com';
const AUD = 'test-aud-tag';
const NOW = Date.UTC(2026, 10, 14, 12, 0, 0);
const nowS = Math.floor(NOW / 1000);

// A throwaway RSA key pair made in memory for these tests (never a real key).
const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
  true, ['sign', 'verify'],
);
const otherPair = await crypto.subtle.generateKey(
  { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
  true, ['sign', 'verify'],
);
const jwk = { ...(await crypto.subtle.exportKey('jwk', publicKey)), kid: 'k1' };

let certFetches = 0;
const fakeFetch = async (url) => {
  certFetches++;
  assert.equal(url, `https://${TEAM}/cdn-cgi/access/certs`);
  return new Response(JSON.stringify({ keys: [jwk] }), { status: 200 });
};

const b64url = (bytes) => Buffer.from(bytes).toString('base64url');
async function makeToken(claims = {}, { kid = 'k1', alg = 'RS256', key = privateKey } = {}) {
  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg, kid, typ: 'JWT' })));
  const payload = b64url(new TextEncoder().encode(JSON.stringify({
    aud: [AUD], iss: `https://${TEAM}`, email: 'owner@example.com', iat: nowS - 10, nbf: nowS - 10, exp: nowS + 3600,
    ...claims,
  })));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${header}.${payload}`));
  return `${header}.${payload}.${b64url(new Uint8Array(sig))}`;
}

const env = { ACCESS_TEAM_DOMAIN: TEAM, ACCESS_AUD: AUD };
const req = (token, host = 'aminy-phone-repair-2.example.workers.dev') =>
  new Request(`https://${host}/api/admin/enquiries`, { headers: token ? { 'Cf-Access-Jwt-Assertion': token } : {} });
const check = (request, e = env) => requireAdmin(request, e, { fetchImpl: fakeFetch, now: NOW });

beforeEach(() => { clearCertCache(); certFetches = 0; });

test('accepts a valid token and returns the email', async () => {
  const r = await check(req(await makeToken()));
  assert.deepEqual(r, { ok: true, email: 'owner@example.com' });
});

test('401 without a token', async () => {
  const r = await check(req(null));
  assert.equal(r.ok, false);
  assert.equal(r.status, 401);
});

test('rejects an expired token', async () => {
  const r = await check(req(await makeToken({ exp: nowS - 3600 })));
  assert.equal(r.status, 403);
});

test('rejects a token that is not valid yet (nbf in the future)', async () => {
  const r = await check(req(await makeToken({ nbf: nowS + 3600 })));
  assert.equal(r.status, 403);
});

test('rejects the wrong audience', async () => {
  const r = await check(req(await makeToken({ aud: ['someone-elses-app'] })));
  assert.equal(r.status, 403);
});

test('accepts aud given as a plain string', async () => {
  const r = await check(req(await makeToken({ aud: AUD })));
  assert.equal(r.ok, true);
});

test('rejects the wrong issuer', async () => {
  const r = await check(req(await makeToken({ iss: 'https://evil.cloudflareaccess.com' })));
  assert.equal(r.status, 403);
});

test('rejects a bad signature (signed by a different key)', async () => {
  const r = await check(req(await makeToken({}, { key: otherPair.privateKey })));
  assert.equal(r.status, 403);
});

test('rejects a tampered payload', async () => {
  const [h, , s] = (await makeToken()).split('.');
  const forged = b64url(new TextEncoder().encode(JSON.stringify({ aud: [AUD], iss: `https://${TEAM}`, exp: nowS + 3600, email: 'attacker@example.com' })));
  const r = await check(req(`${h}.${forged}.${s}`));
  assert.equal(r.status, 403);
});

test('rejects alg "none" and unknown key ids', async () => {
  assert.equal((await check(req(await makeToken({}, { alg: 'none' })))).status, 403);
  assert.equal((await check(req(await makeToken({}, { kid: 'nope' })))).status, 403);
});

test('rejects malformed tokens', async () => {
  for (const t of ['abc', 'a.b', 'a.b.c', '...']) {
    assert.equal((await check(req(t))).status, 403, t);
  }
});

test('caches the certs between requests', async () => {
  await check(req(await makeToken()));
  await check(req(await makeToken()));
  assert.equal(certFetches, 1);
});

test('fails closed when Access is not configured', async () => {
  const r = await check(req(await makeToken()), {});
  assert.equal(r.status, 503);
  assert.equal(r.error, 'admin_not_configured');
});

test('dev bypass works on localhost only', async () => {
  const bypassEnv = { ADMIN_DEV_BYPASS: 'true' };
  assert.equal((await check(req(null, 'localhost:8787'), bypassEnv)).ok, true);
  assert.equal((await check(req(null, '127.0.0.1:8787'), bypassEnv)).ok, true);
});

test('dev bypass is refused on a non-local host', async () => {
  const r = await check(req(null), { ...env, ADMIN_DEV_BYPASS: 'true' });
  assert.equal(r.ok, false);
  assert.equal(r.status, 401);
  const r2 = await check(req(null, 'aminyrepair.com.au'), { ADMIN_DEV_BYPASS: 'true' });
  assert.equal(r2.ok, false);
});

test('dev bypass needs exactly "true"', async () => {
  const r = await check(req(null, 'localhost:8787'), { ...env, ADMIN_DEV_BYPASS: '1' });
  assert.equal(r.status, 401);
});

test('normaliseTeamDomain', () => {
  assert.equal(normaliseTeamDomain('https://Aminy.cloudflareaccess.com/'), 'aminy.cloudflareaccess.com');
  assert.equal(normaliseTeamDomain('evil.example.com'), '');
  assert.equal(normaliseTeamDomain(''), '');
});

test('verifyAccessJwt returns claims for a good token', async () => {
  const claims = await verifyAccessJwt(await makeToken(), { team: TEAM, aud: AUD, fetchImpl: fakeFetch, now: NOW });
  assert.equal(claims.email, 'owner@example.com');
});
