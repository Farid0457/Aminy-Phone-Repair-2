import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseListQuery, validateAdminPatch, parseId, escapeLike, ADMIN_LIMITS } from '../src/validate.js';

const q = (s) => parseListQuery(new URLSearchParams(s));

test('list query defaults', () => {
  assert.deepEqual(q(''), { ok: true, data: { status: null, q: '', limit: 50, before: null } });
  assert.equal(q('status=all').data.status, null);
});

test('list query accepts valid values and clamps limit', () => {
  assert.deepEqual(q('status=booked&q=%20iPhone%20&limit=10&before=42').data, { status: 'booked', q: 'iPhone', limit: 10, before: 42 });
  assert.equal(q('limit=0').data.limit, 1);
  assert.equal(q('limit=5000').data.limit, ADMIN_LIMITS.pageMax);
  assert.equal(q('limit=abc').data.limit, 50);
});

test('list query rejects bad status, long search and bad cursor', () => {
  assert.equal(q('status=deleted').error, 'invalid_status');
  assert.equal(q(`q=${'x'.repeat(101)}`).error, 'query_too_long');
  assert.equal(q('before=-1').error, 'invalid_before');
  assert.equal(q('before=1;DROP TABLE enquiries').error, 'invalid_before');
});

test('patch accepts status and/or notes', () => {
  assert.deepEqual(validateAdminPatch({ status: 'contacted' }).data, { status: 'contacted', notes: null });
  assert.deepEqual(validateAdminPatch({ notes: ' Called back\r\nNo answer ' }).data, { status: null, notes: 'Called back\nNo answer' });
  assert.equal(validateAdminPatch({ notes: '' }).data.notes, '');
});

test('patch rejects bad input', () => {
  assert.equal(validateAdminPatch(null).error, 'invalid_body');
  assert.equal(validateAdminPatch([]).error, 'invalid_body');
  assert.equal(validateAdminPatch({}).error, 'nothing_to_update');
  assert.equal(validateAdminPatch({ status: 'archived' }).error, 'invalid_status');
  assert.equal(validateAdminPatch({ notes: 5 }).error, 'invalid_notes');
  assert.equal(validateAdminPatch({ notes: 'x'.repeat(2001) }).error, 'too_long');
  assert.deepEqual(validateAdminPatch({ status: 'new', email: 'x@y.z' }), { ok: false, error: 'unknown_fields', fields: ['email'] });
});

test('parseId only takes positive integers', () => {
  assert.equal(parseId('7'), 7);
  for (const bad of ['0', '-3', '1.5', '07', 'abc', '', '1 OR 1=1', undefined]) assert.equal(parseId(bad), null, String(bad));
});

test('escapeLike escapes wildcards', () => {
  assert.equal(escapeLike('50%_off\\'), '50\\%\\_off\\\\');
});
