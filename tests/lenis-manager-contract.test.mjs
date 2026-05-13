// tests/lenis-manager-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('lenis manager exposes required globals contract strings', () => {
  const src = fs.readFileSync('site/static/scripts/lenis-manager.js', 'utf8');
  assert.match(src, /window\.niriScrollTo\s*=\s*/);
  assert.match(src, /window\.niriLenis\s*=\s*/);
  assert.match(src, /window\.__lenisDisabled\s*=\s*/);
});
