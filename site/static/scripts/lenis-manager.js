// site/static/scripts/lenis-manager.js
(function () {
  if (window.niriLenis && window.niriLenis.tracks) return;

  const WARN_KEY = '__lenisWarned';
  const ROOT_SELECTOR = '#niri-track-v';
  const RIBBON_SELECTOR = '.niri-horizontal-track';
  const WINDOW_SELECTOR = '.niri-window';

  function warnOnce() {
    if (window[WARN_KEY]) return;
    window[WARN_KEY] = true;
    console.warn('Enhanced smooth scroll unavailable; using native scrolling.');
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function pickConfig(orientation = 'vertical') {
    const reduced = prefersReducedMotion();
    const base = {
      lerp: reduced ? 0.1 : 0.05,
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: reduced ? 0.72 : 1,
      touchMultiplier: reduced ? 0.72 : 1,
      orientation: orientation,
      gestureOrientation: orientation === 'vertical' ? 'vertical' : 'horizontal',
      allowNestedScroll: orientation === 'vertical',
    };
    return base;
  }

  const api = {
    tracks: new Map(), // element -> { instance, snap, rafId }
    
    registerTrack(el) {
      if (!el || this.tracks.has(el) || !window.Lenis) return null;
      
      const isVertical = el.id === 'niri-track-v' || el.classList.contains('niri-vertical-track');
      const orientation = isVertical ? 'vertical' : 'horizontal';
      
      try {
        const instance = new window.Lenis({
          ...pickConfig(orientation),
          wrapper: el,
          content: el,
          autoRaf: false,
        });

        // Initialize Snap if available
        let snap = null;
        if (window.Snap) {
          snap = new window.Snap(instance, {
            type: 'lock', // Forces slideshow-like navigation
            distanceThreshold: '100%', // Even small scrolls move to next point
            duration: 0.8,
            lerp: 0.1,
            debounce: 0,
          });
          
          this.updateSnapPoints(el, snap, isVertical);
        }

        const tick = (time) => {
          if (!this.tracks.has(el)) return;
          instance.raf(time);
          const trackData = this.tracks.get(el);
          if (trackData) trackData.rafId = requestAnimationFrame(tick);
        };
        const rafId = requestAnimationFrame(tick);

        this.tracks.set(el, { instance, snap, rafId });
        window.__lenisDisabled = false;
        return instance;
      } catch (err) {
        console.error('Lenis track init failed:', err);
        window.__lenisDisabled = true;
        warnOnce();
        return null;
      }
    },

    updateSnapPoints(el, snap, isVertical) {
      if (!snap) return;
      
      // Clear existing points
      // Note: snap.addElements is additive in some versions, but usually we want to refresh
      if (snap.destroy) { /* snap doesn't have a clear, so we just rebuild if needed or trust addElements */ }
      
      if (isVertical) {
        // Vertical track snaps to horizontal ribbons
        const ribbons = el.querySelectorAll(RIBBON_SELECTOR);
        if (ribbons.length > 0) {
          snap.addElements([...ribbons], { align: 'start' });
        }
      } else {
        // Horizontal track snaps to windows
        const wins = el.querySelectorAll(WINDOW_SELECTOR);
        if (wins.length > 0) {
          snap.addElements([...wins], { align: 'center' });
        }
      }
    },

    resizeAll() {
      this.tracks.forEach((data, el) => {
        data.instance.resize();
        if (data.snap) {
          const isVertical = el.id === 'niri-track-v' || el.classList.contains('niri-vertical-track');
          this.updateSnapPoints(el, data.snap, isVertical);
        }
      });
    },

    destroyTrack(el) {
      const data = this.tracks.get(el);
      if (data) {
        if (data.rafId) cancelAnimationFrame(data.rafId);
        if (data.snap?.destroy) data.snap.destroy();
        if (data.instance?.destroy) data.instance.destroy();
        this.tracks.delete(el);
      }
    },

    destroyAll() {
      this.tracks.forEach((_, el) => this.destroyTrack(el));
    },

    pauseAll() {
      this.tracks.forEach(data => data.instance.stop());
    },

    resumeAll() {
      this.tracks.forEach(data => data.instance.start());
    },

    init() {
      // Register root vertical track
      const root = document.querySelector(ROOT_SELECTOR);
      if (root) {
        this.registerTrack(root);
        // Ensure root allows nested scroll for ribbons
        const data = this.tracks.get(root);
        if (data) {
          // Re-init with allowNestedScroll if needed, or just set it
          // data.instance.options.allowNestedScroll = true;
        }
      }

      // Register existing horizontal ribbons
      const ribbons = document.querySelectorAll(RIBBON_SELECTOR);
      ribbons.forEach(r => this.registerTrack(r));

      // Proactive discovery for dynamically added ribbons
      const observer = new MutationObserver((mutations) => {
        let needsResize = false;
        mutations.forEach(m => {
          m.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;
            if (node.matches(RIBBON_SELECTOR)) {
              this.registerTrack(node);
              needsResize = true;
            } else {
              const nested = node.querySelectorAll(RIBBON_SELECTOR);
              if (nested.length > 0) {
                nested.forEach(r => this.registerTrack(r));
                needsResize = true;
              }
            }
          });
        });
        if (needsResize) {
          setTimeout(() => this.resizeAll(), 50);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    },

    scrollTo(target, options = {}) {
      const targetEl = target instanceof Element ? target : null;
      if (!targetEl) {
        // Assume vertical scroll if target is a number
        const root = document.querySelector(ROOT_SELECTOR);
        const data = this.tracks.get(root);
        if (data && typeof target === 'number') {
          data.instance.scrollTo(target, options);
          return true;
        }
        return false;
      }

      const ribbon = targetEl.closest(RIBBON_SELECTOR);
      const root = document.querySelector(ROOT_SELECTOR);
      
      // 1. Scroll vertical track to ribbon if ribbon exists
      if (root && ribbon) {
        const rootData = this.tracks.get(root);
        if (rootData) {
          rootData.instance.scrollTo(ribbon, { ...options, lock: true });
        }
      }

      // 2. Scroll ribbon to window if target is inside ribbon
      if (ribbon && targetEl !== ribbon) {
        const ribbonData = this.tracks.get(ribbon);
        if (ribbonData) {
          ribbonData.instance.scrollTo(targetEl, options);
          return true;
        }
      } else if (root && targetEl === ribbon) {
          // Already handled by step 1
          return true;
      } else if (root && targetEl.closest(ROOT_SELECTOR)) {
          const rootData = this.tracks.get(root);
          if (rootData) {
              rootData.instance.scrollTo(targetEl, options);
              return true;
          }
      }

      return false;
    },

    debug() {
      const info = [];
      this.tracks.forEach((data, el) => {
        info.push({
          id: el.id || 'no-id',
          class: el.className,
          scroll: data.instance.scroll,
          limit: data.instance.limit,
          hasSnap: !!data.snap,
          snapPoints: data.snap?.elements?.length || 0
        });
      });
      console.table(info);
      return info;
    }
  };

  window.niriLenis = api;
  window.niriScrollTo = function (target, options = {}) {
    if (window.niriLenis.scrollTo(target, options)) return;
    
    // Native Fallback
    if (target instanceof Element) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    } else if (typeof target === 'number') {
      const root = document.querySelector(ROOT_SELECTOR);
      if (root) root.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => api.init(), { once: true });
  } else {
    api.init();
  }
})();
