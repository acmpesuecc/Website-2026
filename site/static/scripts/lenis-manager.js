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
