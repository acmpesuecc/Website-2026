# docs/superpowers/verification/2026-05-13-lenis-phase-1.md

## Commands
- `node --test tests/lenis-config.test.mjs` -> PASS
- `node --test tests/lenis-manager-contract.test.mjs` -> PASS
- `node --test tests/niri-scroll-routing-contract.test.mjs` -> PASS
- `node --test tests/lenis-css-contract.test.mjs` -> PASS
- `./anna` -> PASS

## Manual checks (to be verified in browser)
- [ ] Cinematic root scroll
- [ ] Reduced-motion softened profile
- [ ] fx-action flow intact
- [ ] Overview mode focus intact
- [ ] Close-window focus intact
- [ ] Fallback warning once + native behavior

## Result
- Phase 1 implementation initial rollout: **FAIL** (Severe jank due to CSS snap conflict and 1.6s duration lag).
- Scroll quality fix (lerp: 0.05 + remove native snap): **PASS**.
- Live verification via Chrome DevTools: **PASS**.
  - `lerp: 0.05` confirmed active.
  - Native `scroll-snap-type` confirmed removed (`none`).
  - Smooth interpolation verified via `window.niriScrollTo`.
- Ready for manual UX verification.
