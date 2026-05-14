# Lenis Phase 2 & 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a three-tier hierarchical Lenis scrolling system with "Magnetic Focus Lock" and velocity-gated breakout for 2D navigation and internal window reading.

**Architecture:** Refactor `lenis-manager.js` into a registry that manages `Root (V)`, `Ribbon (H)`, and `Window (V)` instances. Coordinate focus state such that a centered window consumes scroll events until a high-velocity "flick" breaks the lock to navigate.

**Tech Stack:** Vanilla JS, Lenis 1.1.16, Lenis Snap module, MutationObserver.

---

## File Structure Map

- Modify: `site/static/scripts/lenis-manager.js`
  - Refactor to factory/registry pattern.
  - Implement Tier 1/2/3 registration.
  - Implement focus state and velocity breakout logic.
- Modify: `site/static/scripts/niri-engine.js`
  - Update `fx:end` and overview toggles to sync with new manager API.
  - Ensure horizontal tracks get `data-lenis-prevent`.
- Test: `tests/lenis-manager-contract.test.mjs`
  - Update for multi-instance API.

---

### Task 1: Refactor Manager to Hierarchical Registry

**Files:**
- Modify: `site/static/scripts/lenis-manager.js`

- [ ] **Step 1: Define updated configuration generator**

```js
// site/static/scripts/lenis-manager.js (update pickConfig)
  function pickConfig(tier = 'track', orientation = 'vertical') {
    const reduced = prefersReducedMotion();
    return {
      lerp: tier === 'content' ? (reduced ? 0.1 : 0.05) : (reduced ? 0.1 : 0.05),
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: reduced ? 0.72 : 1,
      touchMultiplier: reduced ? 0.72 : 1,
      orientation: orientation,
      gestureOrientation: orientation === 'vertical' ? 'vertical' : 'horizontal',
      allowNestedScroll: tier !== 'content', // Tracks allow nested, content isolates
      infinite: false,
    };
  }
```

- [ ] **Step 2: Implement Track and Window registration factory**

```js
// site/static/scripts/lenis-manager.js (update api object)
  const api = {
    tracks: new Map(), // element -> { instance, snap, rafId }
    windows: new Map(), // element -> { instance, rafId }
    activeWindow: null,
    breakoutVelocity: 1.5,

    registerTrack(el) {
      if (!el || this.tracks.has(el) || !window.Lenis) return null;
      const isVertical = el.id === 'niri-track-v';
      const orientation = isVertical ? 'vertical' : 'horizontal';
      
      try {
        const instance = new window.Lenis({
          ...pickConfig('track', orientation),
          wrapper: el,
          content: el,
          autoRaf: false,
        });

        let snap = null;
        if (window.Snap) {
          snap = new window.Snap(instance, {
            type: 'lock',
            distanceThreshold: '100%',
            duration: 0.8,
            lerp: 0.1,
            debounce: 0,
          });
          this.updateSnapPoints(el, snap, isVertical);
          
          if (!isVertical) {
            instance.on('scroll', ({ velocity }) => {
              if (Math.abs(velocity) > this.breakoutVelocity) {
                this.activeWindow = null; // Break lock
              }
            });
          }
        }

        const tick = (time) => {
          if (!this.tracks.has(el)) return;
          instance.raf(time);
          const data = this.tracks.get(el);
          if (data) data.rafId = requestAnimationFrame(tick);
        };
        const rafId = requestAnimationFrame(tick);

        this.tracks.set(el, { instance, snap, rafId });
        return instance;
      } catch (err) { return null; }
    },

    registerWindow(el) {
      if (!el || this.windows.has(el) || !window.Lenis) return null;
      if (el.scrollHeight <= el.clientHeight) return null; // No scroll needed

      try {
        const instance = new window.Lenis({
          ...pickConfig('content', 'vertical'),
          wrapper: el,
          content: el.firstElementChild || el,
          autoRaf: false,
        });

        const tick = (time) => {
          if (!this.windows.has(el)) return;
          instance.raf(time);
          const data = this.windows.get(el);
          if (data) data.rafId = requestAnimationFrame(tick);
        };
        const rafId = requestAnimationFrame(tick);

        this.windows.set(el, { instance, rafId });
        return instance;
      } catch (err) { return null; }
    }
  };
```

- [ ] **Step 3: Commit Task 1**

```bash
git add site/static/scripts/lenis-manager.js
git commit -m "refactor: implement hierarchical lenis registration factory"
```

---

### Task 2: Implement Magnetic Focus Lock & Velocity Breakout

**Files:**
- Modify: `site/static/scripts/lenis-manager.js`

- [ ] **Step 1: Add Snap completion handler to coordinator focus**

```js
// site/static/scripts/lenis-manager.js (inside registerTrack for ribbons)
          if (!isVertical && window.Snap) {
            // ... existing snap init ...
            snap.onSnapComplete = ({ index, element }) => {
              this.activeWindow = element;
              this.registerWindow(element);
              this.resizeAll();
            };
          }
```

- [ ] **Step 2: Implement wheel event interceptor for velocity gating**

```js
// site/static/scripts/lenis-manager.js (inside (function(){ ... }) closure)
  window.addEventListener('wheel', (e) => {
    if (!window.niriLenis?.activeWindow) return;
    
    const winData = window.niriLenis.windows.get(window.niriLenis.activeWindow);
    if (!winData) return;

    // Check velocity from the ribbon that contains this window
    const ribbon = window.niriLenis.activeWindow.closest(RIBBON_SELECTOR);
    const ribbonData = window.niriLenis.tracks.get(ribbon);
    
    if (ribbonData && Math.abs(ribbonData.instance.velocity) < window.niriLenis.breakoutVelocity) {
       // Route wheel to internal window
       // e.preventDefault(); // Careful with native propagation
    }
  }, { passive: false });
```

- [ ] **Step 3: Commit Task 2**

```bash
git add site/static/scripts/lenis-manager.js
git commit -m "feat: implement magnetic focus lock and velocity breakout coordination"
```

---

### Task 3: Update Niri Engine & Lifecycle Hooks

**Files:**
- Modify: `site/static/scripts/niri-engine.js`

- [ ] **Step 1: Ensure ribbons are prevented from bubbling prematurely**

```js
// site/static/scripts/niri-engine.js (update ribbon creation in fx:after)
      const ribbon = document.createElement('div');
      ribbon.className = 'niri-horizontal-track';
      ribbon.setAttribute('data-lenis-prevent', ''); // Isolate H scroll from V
```

- [ ] **Step 2: Sync Overview Mode with pausing**

```js
// site/static/scripts/niri-engine.js (update keydown 'd' handler)
        if(evt.key === 'd' || evt.key === 'D') {
            document.body.classList.toggle('overview-mode');
            if (document.body.classList.contains('overview-mode')) {
                window.niriLenis?.pauseAll();
            } else {
                window.niriLenis?.resumeAll();
                window.niriLenis?.resizeAll();
            }
        }
```

- [ ] **Step 3: Commit Task 3**

```bash
git add site/static/scripts/niri-engine.js
git commit -m "refactor: sync niri-engine lifecycle with multi-tier lenis"
```

---

### Task 4: Final Verification

- [ ] **Step 1: Run contract tests**

Run: `node --test tests/*.test.mjs`
Expected: PASS.

- [ ] **Step 2: Serve and manual check**

Run: `./anna -s`
Manual Checklist:
- [ ] Flick down: jumps to next ribbon.
- [ ] Flick right: jumps to next window.
- [ ] Center window: slow scroll moves text inside.
- [ ] Hard flick right: breaks out of window and moves ribbon.
- [ ] Overview mode: scroll is native/functional.

- [ ] **Step 3: Cleanup and Close**

```bash
git add .
git commit -m "chore: finalize phase 2 & 3 full lenis integration"
```
