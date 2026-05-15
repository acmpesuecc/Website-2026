// tests/lenis-css-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('site/static/styles/main.css', 'utf8');

test('vertical track uses native proximity snap', () => {
  assert.match(css, /\.niri-vertical-track[\s\S]*scroll-snap-type:\s*y\s+proximity;/);
});

test('horizontal track uses native mandatory snap', () => {
  assert.match(css, /\.niri-horizontal-track[\s\S]*scroll-snap-type:\s*x\s+mandatory;/);
});

test('windows use native scroll-snap alignment', () => {
  assert.match(css, /\.niri-window[\s\S]*scroll-snap-align:\s*start;/);
});

test('horizontal ribbons use smooth behavior for programmatic jumps', () => {
  assert.match(css, /\.niri-horizontal-track[\s\S]*scroll-behavior:\s*smooth;/);
});
