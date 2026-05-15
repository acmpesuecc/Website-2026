// site/static/scripts/lenis-manager.js
(function () {
  if (window.niriLenis) return;

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

  function pickConfig(scope, orientation) {
    // keep simple: prefer reduced-motion check, ignore scope/orientation for now
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
      duration: 1.2,
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
    tracks: new Map(), // map of track element -> { instance, rafId, snap }
    windows: new Map(), // map of window element -> { instance, rafId }

    // init vertical root Lenis instance
    initRoot() {
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
        // register root in tracks map so unified APIs can use it
        this.tracks.set(this.root, { instance: this.instance, rafId: this.rafId });
        return true;
      } catch (err) {
        console.error('Lenis track init failed:', err);
        window.__lenisDisabled = true;
        return false;
      }
    },

    // register horizontal track (ribbon) or any track element
    registerTrack(el) {
      if (!el || this.tracks.has(el) || !window.Lenis) return null;
      // skip if track not scrollable horizontally
      if (el.scrollWidth <= el.clientWidth) return null;

      try {
        const instance = new window.Lenis({
          ...pickConfig('track', 'horizontal'),
          wrapper: el,
          content: el.firstElementChild || el,
          autoRaf: false,
        });

        const tick = (time) => {
          if (!this.tracks.has(el)) return;
          instance.raf(time);
          const data = this.tracks.get(el);
          if (data) data.rafId = requestAnimationFrame(tick);
        };
        const rafId = requestAnimationFrame(tick);

        this.tracks.set(el, { instance, rafId, snap: null });
        return instance;
      } catch (err) {
        return null;
      }
    },

    // register window-like element for its own Lenis instance (vertical micro-scroll)
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

      if (isVertical) {
        const ribbons = el.querySelectorAll(RIBBON_SELECTOR);
        ribbons.forEach(r => {
          snap.addElement(r, { align: 'start' });
        });
        const footer = el.querySelector('.site-footer');
        if (footer) snap.addElement(footer, { align: 'end' });
      } else {
        const wins = el.querySelectorAll(WINDOW_SELECTOR);
        wins.forEach(w => snap.addElement(w, { align: 'center' }));
      }
    },

    resizeAll() {
      this.tracks.forEach((data, el) => {
        try { data.instance.resize(); } catch (e) {}
        if (data.snap) {
          const isVertical = el.id === 'niri-track-v' || el.classList.contains('niri-vertical-track');
          this.updateSnapPoints(el, data.snap, isVertical);
        }
      });
      this.windows.forEach(data => { try { data.instance.resize(); } catch (e) {} });
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
      this.tracks.forEach(data => { try { data.instance.stop(); } catch(e){} });
      this.windows.forEach(data => { try { data.instance.stop(); } catch(e){} });
      if (this.instance) try { this.instance.stop(); } catch(e){}
    },

    resumeAll() {
      this.tracks.forEach(data => { try { data.instance.start(); } catch(e){} });
      this.windows.forEach(data => { try { data.instance.start(); } catch(e){} });
      if (this.instance) try { this.instance.start(); } catch(e){}
    },

    // top-level init: create root Lenis and register tracks/windows
    init() {
      this.initRoot();

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
            if (node.matches && node.matches(RIBBON_SELECTOR)) {
              this.registerTrack(node);
              needsResize = true;
            } else if (node.matches && node.matches(WINDOW_SELECTOR)) {
              this.registerWindow(node);
              needsResize = true;
            } else {
              if (node.querySelectorAll) {
                node.querySelectorAll(RIBBON_SELECTOR).forEach(r => { this.registerTrack(r); needsResize = true; });
                node.querySelectorAll(WINDOW_SELECTOR).forEach(w => { this.registerWindow(w); needsResize = true; });
              }
            }
          });
        });
        if (needsResize) setTimeout(() => this.resizeAll(), 50);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    },

    // scrollTo: combine rules
    // - if target is inside horizontal ribbon: use theirs behavior (horizontal: theirs)
    //   1) scroll vertical root to ribbon via Lenis
    //   2) scroll ribbon to element natively (scrollIntoView)
    // - if target inside vertical root: use ours (Lenis scrollTo)
    // - numeric target: scroll root
    scrollTo(target, options = {}) {
      // ensure root instance exists
      const hasRoot = !!this.tracks.get(document.querySelector(ROOT_SELECTOR));

      const targetEl = target instanceof Element ? target : null;
      if (!targetEl) {
        // numeric or selector unsupported here
        const root = document.querySelector(ROOT_SELECTOR);
        const data = this.tracks.get(root);
        if (data && typeof target === 'number') {
          try { data.instance.scrollTo(target, options); } catch (e) { return false; }
          return true;
        }
        return false;
      }

      const ribbon = targetEl.closest(RIBBON_SELECTOR);
      const root = document.querySelector(ROOT_SELECTOR);

      if (ribbon) {
        // horizontal track case -> take theirs
        const rootData = this.tracks.get(root);
        if (rootData) {
          try { rootData.instance.scrollTo(ribbon, options); } catch (e) {}
        }
        if (targetEl !== ribbon) {
          try {
            targetEl.scrollIntoView({ behavior: options.immediate ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
          } catch (e) {}
        }
        return true;
      }

      // vertical track case -> keep ours
      if (root && targetEl.closest(ROOT_SELECTOR)) {
        const rootData = this.tracks.get(root);
        if (rootData) {
          try { rootData.instance.scrollTo(targetEl, options); } catch (e) { return false; }
          return true;
        }
      }

      return false;
    },
  };

  window.niriLenis = api;
  window.niriScrollTo = function (target, options = {}) {
    if (window.niriLenis?.init() && window.niriLenis.scrollTo(target, options)) return;

    if (target instanceof Element) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
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
