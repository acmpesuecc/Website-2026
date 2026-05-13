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
      allowNestedScroll: tier !== 'content',
      infinite: false,
    };
  }

  const api = {
    tracks: new Map(), // element -> { instance, snap, rafId }
    windows: new Map(), // element -> { instance, rafId }
    activeWindow: null,
    breakoutVelocity: 1.5,

    registerTrack(el) {
      if (!el || this.tracks.has(el) || !window.Lenis) return null;
      const isVertical = el.id === 'niri-track-v' || el.classList.contains('niri-vertical-track');
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
          const snapOptions = {
            type: 'lock',
            distanceThreshold: '100%',
            duration: 0.8,
            lerp: 0.1,
            debounce: 0,
          };

          if (!isVertical) {
            snapOptions.onSnapComplete = (snapItem) => {
              const element = snapItem.element || snapItem.userData?.element;
              if (element) {
                this.activeWindow = element;
                this.registerWindow(element);
                this.resizeAll();
              }
            };
          }

          snap = new window.Snap(instance, snapOptions);
          
          if (!isVertical) {
            instance.on('scroll', ({ velocity }) => {
              if (Math.abs(velocity) > this.breakoutVelocity) {
                this.activeWindow = null;
              }
            });
          }
          
          this.updateSnapPoints(el, snap, isVertical);
        }

        const tick = (time) => {
          if (!this.tracks.has(el)) return;
          instance.raf(time);
          const data = this.tracks.get(el);
          if (data) data.rafId = requestAnimationFrame(tick);
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

    registerWindow(el) {
      if (!el || this.windows.has(el) || !window.Lenis) return null;
      if (el.scrollHeight <= el.clientHeight) return null;

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
      } catch (err) {
        return null;
      }
    },

    updateSnapPoints(el, snap, isVertical) {
      if (!snap || !snap.addElement) return;
      
      // In this version of Snap, we should ideally clear points.
      // Since it doesn't have a clear, we just add what's missing or trust it.
      if (isVertical) {
        const ribbons = el.querySelectorAll(RIBBON_SELECTOR);
        ribbons.forEach(r => {
            snap.addElement(r, { align: 'start' });
        });
      } else {
        const wins = el.querySelectorAll(WINDOW_SELECTOR);
        wins.forEach(w => {
            snap.addElement(w, { align: 'center' });
        });
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
      this.windows.forEach(data => data.instance.resize());
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

    destroyWindow(el) {
      const data = this.windows.get(el);
      if (data) {
        if (data.rafId) cancelAnimationFrame(data.rafId);
        if (data.instance?.destroy) data.instance.destroy();
        this.windows.delete(el);
      }
    },

    destroyAll() {
      this.tracks.forEach((_, el) => this.destroyTrack(el));
      this.windows.forEach((_, el) => this.destroyWindow(el));
    },

    pauseAll() {
      this.tracks.forEach(data => data.instance.stop());
      this.windows.forEach(data => data.instance.stop());
    },

    resumeAll() {
      this.tracks.forEach(data => data.instance.start());
      this.windows.forEach(data => data.instance.start());
    },

    init() {
      const root = document.querySelector(ROOT_SELECTOR);
      if (root) this.registerTrack(root);

      const ribbons = document.querySelectorAll(RIBBON_SELECTOR);
      ribbons.forEach(r => this.registerTrack(r));

      const wins = document.querySelectorAll(WINDOW_SELECTOR);
      wins.forEach(w => this.registerWindow(w));

      const observer = new MutationObserver((mutations) => {
        let needsResize = false;
        mutations.forEach(m => {
          m.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;
            if (node.matches(RIBBON_SELECTOR)) {
              this.registerTrack(node);
              needsResize = true;
            } else if (node.matches(WINDOW_SELECTOR)) {
              this.registerWindow(node);
              needsResize = true;
            } else {
              node.querySelectorAll(RIBBON_SELECTOR).forEach(r => {
                this.registerTrack(r);
                needsResize = true;
              });
              node.querySelectorAll(WINDOW_SELECTOR).forEach(w => {
                this.registerWindow(w);
                needsResize = true;
              });
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
      
      if (root && ribbon) {
        const rootData = this.tracks.get(root);
        if (rootData) {
          rootData.instance.scrollTo(ribbon, { ...options, lock: true });
        }
      }

      if (ribbon && targetEl !== ribbon) {
        const ribbonData = this.tracks.get(ribbon);
        if (ribbonData) {
          this.activeWindow = targetEl;
          this.registerWindow(targetEl);
          ribbonData.instance.scrollTo(targetEl);
          return true;
        }
      } else if (root && targetEl === ribbon) {
          return true;
      } else if (root && targetEl.closest(ROOT_SELECTOR)) {
          const rootData = this.tracks.get(root);
          if (rootData) {
              rootData.instance.scrollTo(targetEl, options);
              return true;
          }
      }

      return false;
    }
  };

  // Wheel interceptor for velocity breakout
  window.addEventListener('wheel', (e) => {
    const manager = window.niriLenis;
    if (!manager?.activeWindow) return;
    
    const winData = manager.windows.get(manager.activeWindow);
    if (!winData) return;

    const ribbon = manager.activeWindow.closest(RIBBON_SELECTOR);
    const ribbonData = manager.tracks.get(ribbon);
    
    if (ribbonData && Math.abs(ribbonData.instance.velocity) < manager.breakoutVelocity) {
       e.preventDefault();
       winData.instance.emit('wheel', e);
    }
  }, { passive: false });

  window.niriLenis = api;
  window.niriScrollTo = function (target, options = {}) {
    if (window.niriLenis.scrollTo(target, options)) return;
    
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
