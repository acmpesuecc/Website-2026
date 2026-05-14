// tests/lenis-css-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('site/static/styles/main.css', 'utf8');

test('vertical track does not use native scroll-snap', () => {
  assert.equal(css.includes('scroll-snap-type: y'), false);
});

test('horizontal track does not use native scroll-snap', () => {
  assert.equal(css.includes('scroll-snap-type: x'), false);
});

test('windows do not use native scroll-snap alignment', () => {
  assert.equal(css.includes('scroll-snap-align'), false);
});

test('lenis-managed tracks do not declare scroll-behavior smooth', () => {
  assert.equal(css.includes('scroll-behavior: smooth;'), false);
});
