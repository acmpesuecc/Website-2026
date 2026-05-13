// tests/niri-scroll-routing-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const src = fs.readFileSync('site/static/scripts/niri-engine.js', 'utf8');

test('niri-engine exposes global helper that routes through niriScrollTo', () => {
  assert.match(src, /window\.scrollWindowIntoView\s*=\s*function/);
  assert.match(src, /window\.niriScrollTo\s*\(/);
});

test('niri-engine no longer uses direct smooth scrollIntoView literals outside helper', () => {
  const parts = src.split('window.scrollWindowIntoView = function');
  const outside = parts[0] + (parts[1] ? parts[1].split('}')[1] : '');
  assert.equal(outside.includes("scrollIntoView({ behavior: 'smooth'"), false);
});
