# Lenis Phase 1 (`#niri-track-v`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Lenis as phase-1 smooth scrolling engine for root vertical track while preserving fixi hypermedia lifecycle and native fallback.

**Architecture:** Add a small Lenis manager global (`window.niriLenis`) plus stable API (`window.niriScrollTo`) and route all smooth programmatic scroll calls through it. Keep `fixi.js` untouched; integrate via `fx:config` and `fx:end` observers in `niri-engine.js`. Use native fallback + one-time warning when Lenis unavailable.

**Tech Stack:** Vanilla JS, Lenis (CDN script), existing fixi/moxi/paxi scripts, CSS scroll-snap tuning, Node built-in test runner (`node --test`) for pure config helpers.

---

## File Structure Map

- Create: `site/static/scripts/lenis-config.js`
  - Pure config utilities; no DOM side effects.
  - Exposes cinematic profile + reduced-motion softened profile.
- Create: `site/static/scripts/lenis-manager.js`
  - Lenis init/lifecycle wrapper bound to `#niri-track-v`.
  - Exposes global API: `window.niriScrollTo`, `window.niriLenis`.
- Create: `tests/lenis-config.test.mjs`
  - Unit tests for deterministic config behavior.
- Modify: `site/layout/partials/head.html`
  - Add Lenis CDN script and `lenis-manager.js` load order after fixi/moxi/paxi.
- Modify: `site/static/scripts/niri-engine.js`
  - Replace all `scrollIntoView({ behavior: 'smooth' })` call sites with wrapper that uses `window.niriScrollTo` and native fallback.
  - Emit/consume fixi lifecycle-safe manager hooks.
- Modify: `site/static/styles/main.css`
  - Move Lenis-managed areas from `scroll-behavior: smooth` to `auto`.
  - Soften `scroll-snap-type` for phase-1 vertical track to `proximity`.

---

### Task 1: Add deterministic Lenis config helpers (TDD first)

**Files:**
- Create: `site/static/scripts/lenis-config.js`
- Test: `tests/lenis-config.test.mjs`

- [ ] **Step 1: Write failing tests for config selection**

```js
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
    result.duration = 99;
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:
```bash
node --test tests/lenis-config.test.mjs
```

Expected:
- FAIL with module-not-found or missing-export error for `lenis-config.js` symbols.

- [ ] **Step 3: Implement minimal config helper module**

```js
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
```

- [ ] **Step 4: Re-run tests and confirm pass**

Run:
```bash
node --test tests/lenis-config.test.mjs
```

Expected:
- PASS, 3 tests, 0 failures.

- [ ] **Step 5: Commit Task 1**

```bash
git add tests/lenis-config.test.mjs site/static/scripts/lenis-config.js
git commit -m "test: add lenis config profile tests and implementation"
```

---

### Task 2: Create Lenis manager with fallback and one-time warning

**Files:**
- Create: `site/static/scripts/lenis-manager.js`
- Modify: `site/layout/partials/head.html`

- [ ] **Step 1: Write failing smoke test scaffold for manager API contract**

```js
// tests/lenis-manager-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

// contract-only test to keep browser globals out of node runtime
import fs from 'node:fs';

test('lenis manager exposes required globals contract strings', () => {
  const src = fs.readFileSync('site/static/scripts/lenis-manager.js', 'utf8');
  assert.match(src, /window\.niriScrollTo\s*=\s*/);
  assert.match(src, /window\.niriLenis\s*=\s*/);
  assert.match(src, /window\.__lenisDisabled\s*=\s*/);
});
```

- [ ] **Step 2: Run test to verify it fails before manager exists**

Run:
```bash
node --test tests/lenis-manager-contract.test.mjs
```

Expected:
- FAIL with ENOENT for `site/static/scripts/lenis-manager.js`.

- [ ] **Step 3: Add Lenis loader order in head partial**

```html
<!-- site/layout/partials/head.html (insert after fixi/moxi/paxi scripts) -->
<script src="https://unpkg.com/lenis@1.1.16/dist/lenis.min.js"></script>
<script src="/static/scripts/lenis-manager.js"></script>
```

- [ ] **Step 4: Implement manager with safe init and fallback**

```js
// site/static/scripts/lenis-manager.js
(function () {
  if (window.niriLenis) return;

  const WARN_KEY = '__lenisWarned';
  const ROOT_SELECTOR = '#niri-track-v';

  function warnOnce() {
    if (window[WARN_KEY]) return;
    window[WARN_KEY] = true;
    console.warn('Enhanced smooth scroll unavailable; using native scrolling.');
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function pickConfig() {
    const reduced = prefersReducedMotion();
    if (reduced) {
      return {
        duration: 0.95,
        easing: (t) => t,
        smoothWheel: true,
        smoothTouch: true,
        wheelMultiplier: 0.72,
        touchMultiplier: 0.72,
      };
    }
    return {
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    };
  }

  const api = {
    root: null,
    instance: null,
    rafId: null,
    init() {
      if (this.instance) return true;
      this.root = document.querySelector(ROOT_SELECTOR);
      if (!this.root || !window.Lenis) {
        window.__lenisDisabled = true;
        warnOnce();
        return false;
      }
      try {
        this.instance = new window.Lenis({
          ...pickConfig(),
          wrapper: this.root,
          content: this.root,
          autoRaf: false,
        });

        const tick = (time) => {
          if (!this.instance) return;
          this.instance.raf(time);
          this.rafId = requestAnimationFrame(tick);
        };
        this.rafId = requestAnimationFrame(tick);
        window.__lenisDisabled = false;
        return true;
      } catch (err) {
        window.__lenisDisabled = true;
        warnOnce();
        return false;
      }
    },
    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      if (this.instance?.destroy) this.instance.destroy();
      this.instance = null;
    },
    scrollTo(target, options = {}) {
      if (!this.instance) return false;
      this.instance.scrollTo(target, options);
      return true;
    },
    onFxConfig() {},
    onFxEnd() {},
  };

  window.niriLenis = api;
  window.niriScrollTo = function (target, options = {}) {
    if (window.niriLenis?.init() && window.niriLenis.scrollTo(target, options)) return;
    if (target instanceof Element) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      return;
    }
    const root = document.querySelector(ROOT_SELECTOR);
    if (root && typeof target === 'number') root.scrollTo({ top: target, behavior: 'smooth' });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => api.init(), { once: true });
  } else {
    api.init();
  }
})();
```

- [ ] **Step 5: Re-run contract test and confirm pass**

Run:
```bash
node --test tests/lenis-manager-contract.test.mjs
```

Expected:
- PASS, 1 test, 0 failures.

- [ ] **Step 6: Commit Task 2**

```bash
git add tests/lenis-manager-contract.test.mjs site/layout/partials/head.html site/static/scripts/lenis-manager.js
git commit -m "feat: add lenis manager with native fallback contract"
```

---

### Task 3: Refactor `niri-engine.js` smooth calls to manager API

**Files:**
- Modify: `site/static/scripts/niri-engine.js`
- Test: `tests/niri-scroll-routing-contract.test.mjs`

- [ ] **Step 1: Add failing contract test for migration away from direct smooth `scrollIntoView` calls**

```js
// tests/niri-scroll-routing-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const src = fs.readFileSync('site/static/scripts/niri-engine.js', 'utf8');

test('niri-engine exposes helper that routes through niriScrollTo', () => {
  assert.match(src, /function\s+scrollWindowIntoView\s*\(/);
  assert.match(src, /window\.niriScrollTo\s*\(/);
});

test('niri-engine no longer uses direct smooth scrollIntoView literals', () => {
  assert.equal(src.includes("scrollIntoView({ behavior: 'smooth'"), false);
});
```

- [ ] **Step 2: Run test to verify failure**

Run:
```bash
node --test tests/niri-scroll-routing-contract.test.mjs
```

Expected:
- FAIL: helper missing and old smooth `scrollIntoView` still present.

- [ ] **Step 3: Implement helper + replace all smooth call sites**

```js
// site/static/scripts/niri-engine.js (add near top)
function scrollWindowIntoView(target, opts = {}) {
  if (!target) return;
  if (typeof window.niriScrollTo === 'function') {
    window.niriScrollTo(target, { offset: 0, ...opts });
    return;
  }
  target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
}
```

```js
// site/static/scripts/niri-engine.js (replace each call pattern)
setTimeout(() => {
  scrollWindowIntoView(targetToFocus);
}, 50);

setTimeout(() => {
  scrollWindowIntoView(existing);
}, 50);

setTimeout(() => {
  scrollWindowIntoView(win);
}, 50);
```

```js
// site/static/scripts/niri-engine.js (wire lifecycle hooks without changing fixi protocol)
document.addEventListener('fx:config', (e) => {
  if (window.niriLenis?.onFxConfig) window.niriLenis.onFxConfig(e);
  // existing fx:config logic remains
});

document.addEventListener('fx:end', (e) => {
  if (window.niriLenis?.onFxEnd) window.niriLenis.onFxEnd(e);
  // existing fx:end logic remains
});
```

- [ ] **Step 4: Re-run routing contract tests and confirm pass**

Run:
```bash
node --test tests/niri-scroll-routing-contract.test.mjs
```

Expected:
- PASS, 2 tests, 0 failures.

- [ ] **Step 5: Commit Task 3**

```bash
git add site/static/scripts/niri-engine.js tests/niri-scroll-routing-contract.test.mjs
git commit -m "refactor: route niri smooth scroll through lenis manager api"
```

---

### Task 4: Align CSS with Lenis phase-1 behavior

**Files:**
- Modify: `site/static/styles/main.css`
- Test: `tests/lenis-css-contract.test.mjs`

- [ ] **Step 1: Add failing CSS contract test**

```js
// tests/lenis-css-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('site/static/styles/main.css', 'utf8');

test('vertical track uses proximity snap in phase 1', () => {
  assert.match(css, /\.niri-vertical-track[\s\S]*scroll-snap-type:\s*y\s+proximity;/);
});

test('lenis-managed tracks do not declare scroll-behavior smooth', () => {
  assert.equal(css.includes('scroll-behavior: smooth;'), false);
});
```

- [ ] **Step 2: Run test to verify failure**

Run:
```bash
node --test tests/lenis-css-contract.test.mjs
```

Expected:
- FAIL because CSS still has `mandatory` snap and `scroll-behavior: smooth`.

- [ ] **Step 3: Apply CSS updates**

```css
/* site/static/styles/main.css */
.niri-vertical-track {
    scroll-snap-type: y proximity;
    scroll-behavior: auto;
}

.niri-horizontal-track {
    scroll-behavior: auto;
}
```

- [ ] **Step 4: Re-run CSS contract test and confirm pass**

Run:
```bash
node --test tests/lenis-css-contract.test.mjs
```

Expected:
- PASS, 2 tests, 0 failures.

- [ ] **Step 5: Commit Task 4**

```bash
git add site/static/styles/main.css tests/lenis-css-contract.test.mjs
git commit -m "style: tune scroll snap and behavior for lenis phase-1"
```

---

### Task 5: End-to-end verification and docs update

**Files:**
- Create: `docs/superpowers/verification/2026-05-13-lenis-phase-1.md`
- Modify: `docs/superpowers/specs/2026-05-13-lenis-scrolling-design.md` (status note only)

- [ ] **Step 1: Build site locally**

Run:
```bash
anna
```

Expected:
- Build completes and updates `site/rendered/*` without build errors.

- [ ] **Step 2: Manual verification for core flows**

Run:
```bash
# open rendered site in local preview workflow used in repo
# then execute checklist below manually
```

Expected manual checks (all PASS):
- Vertical root scroll is cinematic
- Reduced-motion mode feels softer
- `fx-action` navigation still inserts/focuses windows correctly
- Overview toggle in/out still focuses expected window
- Closing non-root windows still focuses nearest prior window
- No repetitive console errors

- [ ] **Step 3: Manual fallback simulation**

Run:
```bash
# in browser devtools console
window.Lenis = undefined;
window.niriLenis?.destroy();
window.__lenisDisabled = false;
location.reload();
```

Expected:
- One warning: `Enhanced smooth scroll unavailable; using native scrolling.`
- Native scroll + navigation continue working.

- [ ] **Step 4: Write verification artifact**

```md
# docs/superpowers/verification/2026-05-13-lenis-phase-1.md

## Commands
- `node --test tests/lenis-config.test.mjs`
- `node --test tests/lenis-manager-contract.test.mjs`
- `node --test tests/niri-scroll-routing-contract.test.mjs`
- `node --test tests/lenis-css-contract.test.mjs`
- `anna`

## Manual checks
- [ ] Cinematic root scroll
- [ ] Reduced-motion softened profile
- [ ] fx-action flow intact
- [ ] Overview mode focus intact
- [ ] Close-window focus intact
- [ ] Fallback warning once + native behavior

## Result
- PASS/FAIL summary with notes
```

- [ ] **Step 5: Commit Task 5**

```bash
git add docs/superpowers/verification/2026-05-13-lenis-phase-1.md docs/superpowers/specs/2026-05-13-lenis-scrolling-design.md
git commit -m "docs: add lenis phase-1 verification report"
```

---

## Spec Coverage Self-Review

- Phase-1 scope (`#niri-track-v`): covered by Tasks 2, 4, 5.
- Cinematic profile + reduced-motion softer variant: covered by Tasks 1, 2.
- fixi lifecycle preservation (`fx:config`, `fx:end`, no `fixi.js` protocol edits): covered by Task 3.
- Native fallback + warning once: covered by Task 2 and Task 5 fallback simulation.
- Scroll snap softening to `proximity`: covered by Task 4.
- Regression checks for overview/focus/close-window behavior: covered by Task 5.

No uncovered spec requirements.

## Placeholder Scan

- No `TBD`, `TODO`, “implement later”, or unresolved placeholders present.
- All code-changing steps include concrete code blocks.
- All test steps include explicit commands and expected outcomes.

## Type/Name Consistency

- Global APIs referenced consistently: `window.niriLenis`, `window.niriScrollTo`, `window.__lenisDisabled`.
- File names consistent across tasks and test commands.
