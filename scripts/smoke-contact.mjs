#!/usr/bin/env node
/**
 * Smoke test for POST /api/contact against a running server.
 *   npm run dev            (in another terminal)
 *   npm run smoke          (default http://localhost:8787)
 *   BASE_URL=https://… npm run smoke
 *
 * Uses Turnstile's dummy token, which only passes with the TEST secret key
 * (.dev.vars). Against production, expect the "valid" case to return 403.
 */
const BASE = (process.env.BASE_URL ?? 'http://localhost:8787').replace(/\/$/, '');
const ORIGIN = new URL(BASE).origin;

const valid = {
  firstName: 'Smoke',
  lastName: 'Test',
  email: 'smoke@example.com',
  phone: '0412 345 678',
  device: 'iPhone 15 Pro — Screen Replacement',
  message: 'Automated smoke test — safe to delete.',
  quote: { model: 'iPhone 15 Pro', issue: 'Screen Replacement', total: 385 },
  website: '',
  turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
};

const cases = [
  { name: 'valid enquiry', expect: 200, body: valid },
  { name: 'missing fields', expect: 400, body: { ...valid, email: '' } },
  { name: 'honeypot (bot)', expect: 200, body: { ...valid, website: 'http://spam.example' } },
  { name: 'bad phone', expect: 400, body: { ...valid, phone: '123' } },
  { name: 'no Turnstile token', expect: 403, body: { ...valid, turnstileToken: '' } },
  { name: 'foreign origin', expect: 403, body: valid, origin: 'https://evil.example' },
  { name: 'too large', expect: 413, body: { ...valid, message: 'x'.repeat(11000) } },
  { name: 'wrong method (GET)', expect: 405, method: 'GET' },
];

let failed = 0;
for (const c of cases) {
  const init = { method: c.method ?? 'POST', headers: { Origin: c.origin ?? ORIGIN } };
  if (init.method === 'POST') {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(c.body);
  }
  let status, text;
  try {
    const res = await fetch(`${BASE}/api/contact`, init);
    status = res.status;
    text = await res.text();
  } catch (err) {
    status = 'ERR';
    text = err.message;
  }
  const pass = status === c.expect;
  if (!pass) failed++;
  console.log(`${pass ? '✔' : '✖'} ${c.name.padEnd(20)} expected ${c.expect}, got ${status}  ${text.slice(0, 90)}`);
}

console.log(failed ? `\n${failed} case(s) failed` : '\nAll cases passed');
process.exitCode = failed ? 1 : 0;
