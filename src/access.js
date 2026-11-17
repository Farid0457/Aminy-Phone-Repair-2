/**
 * Cloudflare Access check for /api/admin/* (D-14, task 2.7).
 *
 * Access blocks /admin* and /api/admin/* at the edge. This is the second line of
 * defence: every admin API request must carry a valid Access JWT in the
 * Cf-Access-Jwt-Assertion header, signed (RS256) by one of the team's public keys.
 *
 * Fails closed: if ACCESS_TEAM_DOMAIN or ACCESS_AUD is missing, every request is refused.
 * Dev bypass: only when ADMIN_DEV_BYPASS === 'true' AND the request is to localhost.
 */

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);
const TEAM_DOMAIN_RE = /^[a-z0-9-]+\.cloudflareaccess\.com$/;
const CERT_TTL_MS = 60 * 60 * 1000;   // re-fetch the team's public keys hourly
const CLOCK_SKEW_S = 60;

/** teamDomain → { keys: Map<kid, CryptoKey>, fetchedAt: number } */
const certCache = new Map();

/** For tests only. */
export function clearCertCache() { certCache.clear(); }

/** "https://aminy.cloudflareaccess.com/" → "aminy.cloudflareaccess.com", or '' if not a team domain. */
export function normaliseTeamDomain(value) {
  const d = String(value || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return TEAM_DOMAIN_RE.test(d) ? d : '';
}

function b64urlToBytes(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function decodeJson(part) {
  try { return JSON.parse(new TextDecoder().decode(b64urlToBytes(part))); } catch { return null; }
}

async function loadKeys(team, fetchImpl) {
  const res = await fetchImpl(`https://${team}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`Access certs HTTP ${res.status}`);
  const body = await res.json();
  const keys = new Map();
  for (const jwk of body.keys || []) {
    if (jwk.kty !== 'RSA' || !jwk.kid) continue;
    const key = await crypto.subtle.importKey(
      'jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'],
    );
    keys.set(jwk.kid, key);
  }
  return keys;
}

async function getKey(team, kid, fetchImpl, now) {
  let entry = certCache.get(team);
  const stale = !entry || now - entry.fetchedAt > CERT_TTL_MS;
  // Re-fetch when stale, or when the kid is unknown (Access rotates keys).
  if (stale || !entry.keys.has(kid)) {
    entry = { keys: await loadKeys(team, fetchImpl), fetchedAt: now };
    certCache.set(team, entry);
  }
  return entry.keys.get(kid) || null;
}

/**
 * Verify an Access JWT. Returns its claims, or null if anything is wrong.
 * @param {string} token
 * @param {{team: string, aud: string, fetchImpl?: typeof fetch, now?: number}} opts
 */
export async function verifyAccessJwt(token, { team, aud, fetchImpl = fetch, now = Date.now() }) {
  const parts = typeof token === 'string' ? token.split('.') : [];
  if (parts.length !== 3 || token.length > 8192) return null;

  const header = decodeJson(parts[0]);
  const claims = decodeJson(parts[1]);
  if (!header || !claims || header.alg !== 'RS256' || typeof header.kid !== 'string') return null;

  let key;
  try { key = await getKey(team, header.kid, fetchImpl, now); } catch (err) {
    console.error('Could not load Access certs:', err);
    return null;
  }
  if (!key) return null;

  let valid = false;
  try {
    valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5', key, b64urlToBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
  } catch { valid = false; }
  if (!valid) return null;

  const nowS = Math.floor(now / 1000);
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(aud)) return null;
  if (typeof claims.exp !== 'number' || claims.exp + CLOCK_SKEW_S <= nowS) return null;
  if (typeof claims.nbf === 'number' && claims.nbf - CLOCK_SKEW_S > nowS) return null;
  if (claims.iss !== `https://${team}`) return null;
  return claims;
}

/**
 * @returns {Promise<{ok: true, email: string, bypass?: boolean} | {ok: false, status: number, error: string}>}
 */
export async function requireAdmin(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  const host = new URL(request.url).hostname;  if (env.ADMIN_DEV_BYPASS === 'true') {
    if (LOCAL_HOSTS.has(host)) return { ok: true, email: 'dev@localhost', bypass: true };
    console.error('ADMIN_DEV_BYPASS is set but the request is not to localhost; ignoring it');
  }

  const team = normaliseTeamDomain(env.ACCESS_TEAM_DOMAIN);
  const aud = String(env.ACCESS_AUD || '').trim();
  if (!team || !aud) {
    console.error('Admin API refused: ACCESS_TEAM_DOMAIN / ACCESS_AUD not configured (task 2.9)');
    return { ok: false, status: 503, error: 'admin_not_configured' };
  }

  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return { ok: false, status: 401, error: 'unauthorized' };

  const claims = await verifyAccessJwt(token, { team, aud, fetchImpl, now });
  if (!claims) return { ok: false, status: 403, error: 'forbidden' };
  return { ok: true, email: typeof claims.email === 'string' ? claims.email : '' };
}
