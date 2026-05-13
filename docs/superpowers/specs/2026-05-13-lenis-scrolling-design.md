# Lenis Scrolling Integration Design (Phase 1)

- **Date:** 2026-05-13
- **Branch:** `feat/ux/lenis`
- **Status:** Implemented (Phase 1)
- **Goal:** Adopt Lenis as scrolling foundation, starting with phased rollout that preserves fixi hypermedia behavior.

## 1) Scope and Decisions

### User-approved decisions
1. **Rollout strategy:** Phased rollout
2. **Phase 1 target:** `#niri-track-v` (root vertical track)
3. **Motion profile:** Cinematic
4. **Reduced motion:** Keep Lenis enabled, but soften parameters
5. **Scroll snap policy:** Soften to `proximity`
6. **Failure behavior:** Native fallback + small warning

### Non-goals (Phase 1)
- No Lenis control for horizontal ribbons yet
- No nested `.niri-window` scroll hijack
- No changes to fixi request/swap protocol

## 2) Fixi-project Principles (Required Constraints)

This integration must preserve existing hypermedia behavior:
- Keep `fx-action` semantics unchanged
- Preserve `fx:config`, `fx:after`, `fx:end` lifecycle contracts
- Maintain progressive enhancement (native behavior remains functional when enhancement fails)
- Avoid touching core `fixi.js` protocol logic; only consume lifecycle events from integration layer

## 3) Architecture

Add `site/static/scripts/lenis-manager.js` as global scroll orchestration module.

Responsibilities:
- Initialize Lenis for `#niri-track-v`
- Own RAF loop lifecycle (init/pause/resume/destroy)
- Expose global API: `window.niriScrollTo(targetOrY, options)`
- Apply runtime tuning profile:
  - Cinematic baseline
  - Softer profile when `prefers-reduced-motion: reduce`
- Provide native fallback path when Lenis unavailable

Integration point:
- Include script globally via shared template pipeline (`site/layout/partials/head.html` script flow)
- Keep behavior available across page/all-events/all-members templates

## 4) Component Boundaries

### A. `lenis-manager.js` (new)
Public surface:
- `init({ rootSelector, profile })`
- `scrollTo(targetOrY, opts)`
- `isActive()`
- `destroy()`
- `onFxConfig(evt)`
- `onFxEnd(evt)`

Behavior:
- Idempotent init (double-init safe)
- Internal try/catch around constructor + RAF tick
- One-time warning on disable/failure

### B. `niri-engine.js` (existing, adapted)
- Replace direct `scrollIntoView({ behavior: 'smooth' })` call sites with wrapper that delegates to `window.niriScrollTo`
- Keep native fallback when manager absent/disabled
- Keep current focus management, close behavior, overview toggles, and fixi event handling semantics

### C. `fixi.js` (existing, unchanged)
- No edits to request pipeline, swap behavior, or event protocol

## 5) Data Flow

1. **Boot**
   - Head scripts load
   - Lenis manager finds `#niri-track-v` and initializes RAF

2. **User input scroll**
   - Wheel/touch input drives cinematic vertical smooth scroll through manager
   - Reduced-motion users get softer interpolation and timing

3. **Programmatic scroll/focus**
   - `niri-engine` calls `window.niriScrollTo(...)`
   - Manager computes target and performs smooth movement
   - On manager failure/unavailable: native `scrollIntoView`/`scrollTo`

4. **Hypermedia swap lifecycle**
   - `fx:config`: manager records pending navigation state and prevents duplicate smooth-scroll triggers during swap
   - `fx:after`: existing shell-stripping/new-window transforms continue
   - `fx:end`: new-window reveal/focus uses manager scroll API

5. **Failure path**
   - Lenis load/init/runtime failure disables enhancement
   - Show one small warning
   - Keep full native scrolling and navigation behavior

## 6) CSS Strategy (Phase 1)

On Lenis-controlled path:
- Change `scroll-behavior: smooth` to `auto` for containers involved in Lenis-managed motion
- Change strict `scroll-snap-type: ... mandatory` to `... proximity` for softened snap feel
- Retain nested window overflow styles and existing layout semantics

## 7) Error Handling and Compatibility

Required guards:
- Missing root container guard (`#niri-track-v` absent => manager disabled)
- Double-init guard
- Try/catch around Lenis constructor and RAF loop
- Runtime fail-safe flag (`window.__lenisDisabled = true`)
- One-time user-visible warning (non-blocking)

Compatibility requirements:
- No disruption of `fx-action` navigation
- No regression in overview-mode toggles and focus behaviors
- No duplicate RAF loops
- No console error spam

## 8) Testing Plan

### Functional checks
- Cinematic vertical scroll on desktop wheel/touchpad
- Reduced-motion profile active and softer
- Open page via `fx-action` still works
- New window insertion + focus scroll still correct
- Overview mode toggle and return behavior unchanged
- Close window -> expected focus target maintained

### Fallback checks
- Simulate Lenis unavailable/failure
- Confirm one warning shown
- Confirm native scrolling and fixi flow remain intact

### Regression checks
- `fx:config` / `fx:after` / `fx:end` sequence intact
- No stalled scrolling or broken input
- No duplicate animation loops

## 9) Phased Rollout

### Phase 1 (this design)
- Root vertical track (`#niri-track-v`) only

### Future phases (explicitly deferred)
- Phase 2: Horizontal track integration (`.niri-horizontal-track`)
- Phase 3: Evaluate nested content scrolling policies

## 10) Alternatives Considered

1. **Global Lenis broker (chosen)**
   - Best long-term consistency and phased expansion path
2. **Patch-in-place minimal edits**
   - Faster start but creates mixed behavior/debt
3. **Track-by-track isolated adapters**
   - Explicit but heavier complexity for phase 1

Chosen for maintainability and fixi-safe integration quality.
