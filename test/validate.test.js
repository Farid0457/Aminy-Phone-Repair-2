import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContact, isHoneypotFilled, isValidAuPhone } from '../src/validate.js';

const minimal = {
  firstName: 'Jane',
  lastName: 'Citizen',
  email: 'jane@example.com',
  device: 'iPhone 15 Pro — cracked screen',
};

test('accepts minimal valid input', () => {
  const r = validateContact(minimal);
  assert.equal(r.ok, true);
  assert.equal(r.data.phone, '');
  assert.equal(r.data.quote, null);
});

test('accepts full input with quote, trims and lower-cases email', () => {
  const r = validateContact({
    ...minimal,
    firstName: '  Jane ',
    email: ' Jane@Example.COM ',
    phone: '0412 345 678',
    message: 'Line one\r\nLine two',
    quote: { model: 'iPhone 15 Pro', issue: 'Screen Replacement', total: 385 },
  });
  assert.equal(r.ok, true);
  assert.equal(r.data.firstName, 'Jane');
  assert.equal(r.data.email, 'jane@example.com');
  assert.equal(r.data.message, 'Line one\nLine two');
  assert.deepEqual(r.data.quote, { model: 'iPhone 15 Pro', issue: 'Screen Replacement', total: 385 });
});

for (const field of ['firstName', 'lastName', 'email', 'device']) {
  test(`rejects missing ${field}`, () => {
    const r = validateContact({ ...minimal, [field]: '   ' });
    assert.equal(r.ok, false);
    assert.equal(r.error, 'missing_fields');
    assert.deepEqual(r.fields, [field]);
  });
}

test('rejects non-object bodies', () => {
  for (const b of [null, undefined, 'x', 42, []]) {
    assert.equal(validateContact(b).ok, false);
  }
});

test('rejects bad email', () => {
  for (const email of ['jane', 'jane@', 'jane@example', 'ja ne@example.com']) {
    const r = validateContact({ ...minimal, email });
    assert.equal(r.ok, false, email);
    assert.deepEqual(r.fields, ['email']);
  }
});

test('Australian phone formats', () => {
  for (const p of ['0412 345 678', '+61412345678', '(03) 9123 4567', '03-9123-4567', '+61 3 9123 4567']) {
    assert.equal(isValidAuPhone(p), true, p);
  }
  for (const p of ['12345', '0412 345 67', '+1 555 123 4567', '04123456789']) {
    assert.equal(isValidAuPhone(p), false, p);
  }
  assert.equal(validateContact({ ...minimal, phone: '12345' }).error, 'invalid_phone');
});

test('rejects too-long fields', () => {
  const r = validateContact({ ...minimal, message: 'x'.repeat(2001), device: 'y'.repeat(201) });
  assert.equal(r.ok, false);
  assert.equal(r.error, 'too_long');
  assert.deepEqual(r.fields.sort(), ['device', 'message']);
});

test('rejects malformed quote', () => {
  for (const quote of [
    'iPhone',
    { model: 'iPhone 15', issue: 'Screen' },
    { model: 'iPhone 15', issue: 'Screen', total: '385' },
    { model: 'iPhone 15', issue: 'Screen', total: -1 },
    { model: 'iPhone 15', issue: 'Screen', total: 3.5 },
    { model: '', issue: 'Screen', total: 385 },
  ]) {
    const r = validateContact({ ...minimal, quote });
    assert.equal(r.ok, false, JSON.stringify(quote));
    assert.equal(r.error, 'invalid_quote');
  }
});

test('strips control characters from single-line fields', () => {
  const r = validateContact({ ...minimal, device: 'iPhone\r\nBcc: evil@example.com' });
  assert.equal(r.ok, true);
  assert.ok(!/[\r\n]/.test(r.data.device));
});

test('honeypot detection', () => {
  assert.equal(isHoneypotFilled({ website: '' }), false);
  assert.equal(isHoneypotFilled({}), false);
  assert.equal(isHoneypotFilled({ website: 'http://spam.example' }), true);
});
