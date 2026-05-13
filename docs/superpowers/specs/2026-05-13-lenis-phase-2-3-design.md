# Lenis Scrolling Integration Design (Phase 2 & 3)

- **Date:** 2026-05-13
- **Branch:** `feat/ux/lenis-full`
- **Status:** Approved design
- **Goal:** Full 2D scrolling integration with nested content support and a "Magnetic Focus Lock" feel.

## 1) Scope and Decisions

### User-approved decisions
1. **Hierarchical Scrolling**: Adopt a three-tier Lenis architecture:
   - **Tier 1 (Root)**: Vertical track (`#niri-track-v`) manages ribbon-to-ribbon jumps.
   - **Tier 2 (Ribbon)**: Horizontal tracks (`.niri-horizontal-track`) manage window-to-window jumps.
   - **Tier 3 (Window)**: Individual windows (`.niri-window`) manage internal long content.
2. **Magnetic Focus Lock**: When a window snaps to the center of the viewport, it automatically becomes "active".
3. **Velocity Breakout**:
   - **Low Velocity (< 1.5)**: Scroll input is routed exclusively to the active window's internal content.
   - **High Velocity (>= 1.5)**: Scroll input "breaks out" of the window lock and moves the ribbon or root track to the next snap point.
4. **Lenis Snap Integration**: Use the official Lenis Snap module with `type: 'lock'` for mandatory, quantized navigation.

## 2) Architecture

### A. `lenis-manager.js` (Orchestrator)
The manager transforms from a singleton into a factory and registry.

**Responsibilities:**
- Manage a registry of all active tracks and windows.
- Coordinate event propagation between tiers.
- Implement the velocity breakout logic.
- Own recursive `resizeAll()` logic.

**Public API:**
- `registerTrack(el)`: Inits Tier 1/2 instances.
- `registerWindow(el)`: Inits Tier 3 instances for long content.
- `resizeAll()`: Recalculates all registered instances.
- `pauseAll() / resumeAll()`: State sync for overview mode.

### B. State Management
- Use `data-lenis-prevent` on horizontal tracks to prevent wheel events from bubbling to the vertical root track prematurely.
- Use a central `activeTarget` variable to track the currently snapped window.

## 3) Component Boundaries

### Tier 1 & 2 (Navigation)
- **Physics**: `type: 'lock'`, `distanceThreshold: '100%'`, `debounce: 0`.
- **Alignment**: Vertical snaps to ribbon `start`; Horizontal snaps to window `center`.

### Tier 3 (Content)
- **Physics**: Standard cinematic `lerp: 0.05` without snapping.
- **Activation**: Only consumes wheel events when the parent ribbon is snapped and the window is centered.

## 4) Lifecycle & SPA Sync

- **MutationObserver**: Monitor `document.body` to automatically register/destroy instances as `fixi.js` adds or removes content.
- **fx:end Hook**: Call `resizeAll()` after any hypermedia swap.
- **Overview Mode**: Pause all Lenis instances during zoom-out to avoid CSS `transform` conflicts.

## 5) Testing & Success Criteria

### Success Criteria
- [ ] Scrolling down jumps exactly one ribbon at a time.
- [ ] Scrolling right jumps exactly one window at a time.
- [ ] Once a window is centered, slow scrolling moves the text *inside* that window.
- [ ] A fast flick reliably jumps to the next window.
- [ ] No scroll clipping on newly loaded SPA content.

### Error Handling
- Native fallback (native `scroll-snap`) remains available if scripts fail.
- Double-registration protection for all instances.
