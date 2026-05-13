// tests/lenis-config.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { getLenisOptions, BASE_CINEMATIC, REDUCED_MOTION_CINEMATIC } from '../site/static/scripts/lenis-config.js';

test('returns base cinematic profile when reduced motion is false', () => {
  const result = getLenisOptions({ reducedMotion: false });
  assert.deepEqual(result, BASE_CINEMATIC);
});

test('returns softened profile when reduced motion is true', () => {
  const result = getLenisOptions({ reducedMotion: true });
  assert.deepEqual(result, REDUCED_MOTION_CINEMATIC);
});

test('returns frozen clone so callers cannot mutate defaults', () => {
  const result = getLenisOptions({ reducedMotion: false });
  assert.throws(() => {
    result.lerp = 99;
  });
});
