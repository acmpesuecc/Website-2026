// site/static/scripts/lenis-config.js
export const BASE_CINEMATIC = Object.freeze({
  duration: 1.6,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.0,
});

export const REDUCED_MOTION_CINEMATIC = Object.freeze({
  duration: 0.95,
  easing: (t) => t,
  smoothWheel: true,
  smoothTouch: true,
  wheelMultiplier: 0.72,
  touchMultiplier: 0.72,
});

export function getLenisOptions({ reducedMotion }) {
  const src = reducedMotion ? REDUCED_MOTION_CINEMATIC : BASE_CINEMATIC;
  return Object.freeze({ ...src });
}
