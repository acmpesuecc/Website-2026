# Lenis Smooth Native Scroll Design

## Objective
Replace the rigid "Magnetic Focus Lock" scrolling logic with a "Smooth Native" approach that perfectly mimics original native CSS scroll-snap behavior while utilizing Lenis for smooth interpolation. The goal is to restore a touchpad-friendly, momentum-based scrolling experience without overshooting.

## Background
The previous implementation used a "lock" type snapping mechanism and a custom wheel event interceptor to force focus on individual windows. This resulted in a "slideshow" feel that trapped the user's scroll, requiring unnatural amounts of friction/velocity to navigate between windows, making it unusable on touchpads.

## Proposed Solution (Smooth Native)

### 1. Engine Simplification
- **Remove Focus Lock:** Delete the custom `wheel` event interceptor in `lenis-manager.js` that was manually routing scroll events based on velocity (`breakoutVelocity`).
- **Remove Active Window State:** Remove the `activeWindow` tracking and registration logic that forced focus.
- **Natural Bubbling:** Rely on standard Lenis nested scrolling. Windows with internal overflow will scroll naturally; when they reach their boundaries, scroll events will bubble up to the ribbons and root track natively.

### 2. Snap Configuration
- **Type:** Change the `Snap` configuration from `type: 'lock'` to `type: 'mandatory'`. This restores the native momentum feel where tracks don't resist the user's swipe but gracefully align the nearest item upon rest.
- **Thresholds:** Tune `velocityThreshold` and `distanceThreshold` to prevent overshooting, ensuring a standard swipe transitions exactly one window/ribbon at a time.

### 3. Tighter Responsiveness
- **Lerp Tuning:** Increase the `lerp` value in `pickConfig` (e.g., to `0.1` or slightly higher for base tracks) to reduce the "floaty" delay and make the scroll adhere more closely to touchpad input.
- **Duration:** Reduce the Snap `duration` slightly if necessary to make the final alignment feel snappy rather than sluggish.

### 4. Cleanup
- **Remove Patch:** Revert the custom patch added to `lenis-snap.js` (which injected `element` into `userData`), as the focus lock logic relying on it is being removed.
- **API Simplification:** Simplify `registerTrack` to focus purely on initializing Lenis and attaching the `mandatory` Snap instance without complex callbacks.

## Trade-offs
- **Pros:** Feels exactly like native scrolling but smoother; highly responsive to touchpads; removes complex and brittle event interception.
- **Cons:** Users must rely on standard cursor positioning to scroll internal window content (hovering over the window), rather than the engine automatically locking focus.

## Verification
- Touchpad swipes should easily and predictably move between windows without getting "stuck".
- Fast swipes should not drastically overshoot intended targets.
- Internal window content must scroll when hovered.
- Contract tests must remain green (no native `scroll-snap` CSS properties on Lenis-managed tracks).