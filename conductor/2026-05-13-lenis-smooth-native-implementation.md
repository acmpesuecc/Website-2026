# Lenis Smooth Native Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Smooth Native" scroll approach, restoring pure CSS-like mandatory snapping behavior while utilizing Lenis for momentum and smoothness. Removes rigid focus locking.

**Architecture:** Simplify `lenis-manager.js` by removing the wheel interceptor and `activeWindow` state. Change the Snap configuration to `mandatory` type to restore natural momentum. Increase the `lerp` value in the base Lenis configuration to make touchpad scrolling feel tighter. Revert the custom patch in `lenis-snap.js`.

**Tech Stack:** Vanilla JS, Lenis 1.1.16, Lenis Snap module.

---

## File Structure Map

- Modify: `site/static/scripts/lenis-manager.js`
  - Remove wheel event interceptor.
  - Remove `activeWindow` state and forced focus logic from `scrollTo` and `registerTrack`.
  - Update Snap configuration to `type: 'mandatory'`.
  - Increase `lerp` for track and content instances.
- Modify: `site/static/scripts/lenis-snap.js`
  - Revert the custom patch that injected `element` into `userData`.
- Test: `tests/lenis-manager-contract.test.mjs`
  - Ensure contract tests pass after modifications.

---

### Task 1: Revert `lenis-snap.js` Patch

**Files:**
- Modify: `site/static/scripts/lenis-snap.js`

- [ ] **Step 1: Write the reverted code**
  
```js
// site/static/scripts/lenis-snap.js (inside onSnap method)
// Replace the patched elements.forEach loop with the original minified version:
this.elements.forEach(({rect:o,align:m})=>{let p;m.forEach(u=>{u==="start"?p=o.top:u==="center"?p=t?o.left+o.width/2-this.viewport.width/2:o.top+o.height/2-this.viewport.height/2:u==="end"&&(p=t?o.left+o.width-this.viewport.width:o.top+o.height-this.viewport.height),typeof p=="number"&&i.push({value:Math.ceil(p),userData:{}})})}),
```

- [ ] **Step 2: Commit Task 1**

```bash
git add site/static/scripts/lenis-snap.js
git commit -m "fix: revert lenis-snap custom userData patch"
```

---

### Task 2: Simplify `lenis-manager.js` and Update Snap Logic

**Files:**
- Modify: `site/static/scripts/lenis-manager.js`

- [ ] **Step 1: Update configuration generator for tighter lerp**

```js
// site/static/scripts/lenis-manager.js (update pickConfig)
  function pickConfig(tier = 'track', orientation = 'vertical') {
    const reduced = prefersReducedMotion();
    return {
      lerp: tier === 'content' ? (reduced ? 0.15 : 0.1) : (reduced ? 0.15 : 0.1), // Tighter responsiveness
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: reduced ? 0.72 : 1,
      touchMultiplier: reduced ? 0.72 : 1,
      orientation: orientation,
      gestureOrientation: orientation === 'vertical' ? 'vertical' : 'horizontal',
      allowNestedScroll: tier !== 'content',
      infinite: false,
    };
  }
```

- [ ] **Step 2: Remove activeWindow state and focus lock variables**

```js
// site/static/scripts/lenis-manager.js (update api object definition)
  const api = {
    tracks: new Map(), // element -> { instance, snap, rafId }
    windows: new Map(), // element -> { instance, rafId }
    
    // REMOVED: activeWindow and breakoutVelocity
```

- [ ] **Step 3: Update `registerTrack` to use mandatory snap and remove callbacks**

```js
// site/static/scripts/lenis-manager.js (update Snap initialization inside registerTrack)
        let snap = null;
        if (window.Snap) {
          const snapOptions = {
            type: 'mandatory', // Restore native feel
            distanceThreshold: '100%', 
            duration: 0.8,
            lerp: 0.1,
            debounce: 0,
          };

          snap = new window.Snap(instance, snapOptions);
          this.updateSnapPoints(el, snap, isVertical);
        }
        // REMOVED: isVertical conditional logic for activeWindow state and velocity breakout
```

- [ ] **Step 4: Update `scrollTo` to remove forced focus logic**

```js
// site/static/scripts/lenis-manager.js (update scrollTo method)
      if (ribbon && targetEl !== ribbon) {
        const ribbonData = this.tracks.get(ribbon);
        if (ribbonData) {
          this.registerWindow(targetEl); // Still register it to ensure nested scroll works
          ribbonData.instance.scrollTo(targetEl);
          return true;
        }
      } else if (root && targetEl === ribbon) {
```

- [ ] **Step 5: Remove the wheel event interceptor**

```js
// site/static/scripts/lenis-manager.js (remove the entire block at the bottom of the IIFE)
  // REMOVE THIS BLOCK:
  // window.addEventListener('wheel', (e) => {
  //   const manager = window.niriLenis;
  //   ...
  // }, { passive: false });
```

- [ ] **Step 6: Commit Task 2**

```bash
git add site/static/scripts/lenis-manager.js
git commit -m "refactor: implement smooth native scroll, removing focus lock"
```

---

### Task 3: Final Verification

- [ ] **Step 1: Run contract tests**

Run: `node --test tests/*.test.mjs`
Expected: PASS.

- [ ] **Step 2: Serve and manual check**

Run: `./anna -s`
Manual Checklist:
- [ ] Touchpad scroll feels natural and responsive.
- [ ] Momentum is preserved.
- [ ] Tracks gracefully align the nearest item upon rest.
- [ ] Fast swipes do not overshoot uncontrollably.
- [ ] Hovering over a window with internal scroll content scrolls it naturally, and bubbles out when limits are reached.

- [ ] **Step 3: Cleanup and Close**

```bash
git add .
git commit -m "chore: finalize smooth native lenis scrolling"
```
