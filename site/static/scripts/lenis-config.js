// site/static/scripts/lenis-config.js
export const BASE_CINEMATIC = Object.freeze({
  lerp: 0.05,
  smoothWheel: true,
  smoothTouch: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.0,
});

export const REDUCED_MOTION_CINEMATIC = Object.freeze({
  lerp: 0.1,
  smoothWheel: true,
  smoothTouch: true,
  wheelMultiplier: 0.72,
  touchMultiplier: 0.72,
});

export function getLenisOptions({ reducedMotion }) {
  const src = reducedMotion ? REDUCED_MOTION_CINEMATIC : BASE_CINEMATIC;
  return Object.freeze({ ...src });
}
