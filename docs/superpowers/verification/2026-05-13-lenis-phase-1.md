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
- Implementation complete and contract tests passing.
- Live verification via Chrome DevTools: **PASS** (Lenis initialized, manager active, no warnings).
- Ready for manual UX verification.
