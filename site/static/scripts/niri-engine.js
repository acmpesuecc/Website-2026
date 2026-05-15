// 2D Niri Hypermedia Logic with paxi.js State Preservation

window.closeNiriWindow = function(win) {
    if (!win || win.id === 'root-window') return;
    
    const track = win.closest('.niri-horizontal-track');
    let targetToFocus = win.previousElementSibling;
    let removeTrack = false;
    
    if (!targetToFocus || !targetToFocus.classList.contains('niri-window')) {
        const prevTrack = track.previousElementSibling;
        if (prevTrack && prevTrack.classList.contains('niri-horizontal-track')) {
            const windows = prevTrack.querySelectorAll('.niri-window');
            targetToFocus = windows[windows.length - 1];
        }
    }
    
    if (track.id !== 'niri-track-h-root' && track.querySelectorAll('.niri-window').length === 1) {
        removeTrack = true;
    }
    
    if (removeTrack) {
        track.remove();
    } else {
        win.remove();
    }
    
    if (targetToFocus && targetToFocus.classList.contains('niri-window')) {
        targetToFocus.focus({ preventScroll: true });
        setTimeout(() => {
            targetToFocus.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }, 50);
    }
};

window.centerAndFocusWindow = function() {
    if (document.body.classList.contains('overview-mode')) return;
    const windows = document.querySelectorAll('.niri-window');
    let closest = null;
    let minDistance = Infinity;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    windows.forEach(win => {
        const rect = win.getBoundingClientRect();
        const winCenterX = rect.left + rect.width / 2;
        const winCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(centerX - winCenterX, 2) + Math.pow(centerY - winCenterY, 2));
        
        if (distance < minDistance) {
            minDistance = distance;
            closest = win;
        }
    });

    if (closest && document.activeElement !== closest && !closest.contains(document.activeElement)) {
        closest.focus({ preventScroll: true });
    }
};

let scrollTimeout;
document.addEventListener('scroll', (e) => {
    if (e.target.id === 'niri-track-v' || (e.target.classList && e.target.classList.contains('niri-horizontal-track'))) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(window.centerAndFocusWindow, 150);
    }
}, { capture: true, passive: true });

document.addEventListener('scrollend', (e) => {
    if (e.target.id === 'niri-track-v' || (e.target.classList && e.target.classList.contains('niri-horizontal-track'))) {
        window.centerAndFocusWindow();
    }
}, { capture: true });

// Target switching: from landing page spawns new full-width tracks,
// from inside pages appends half-width windows to current track
document.addEventListener('fx:config', (e) => {
  const trigger = e.detail.cfg.trigger;
  if (!trigger) return;
  const elt = trigger.target.closest('[fx-action]');
  if (!elt) return;

  const url = e.detail.cfg.action;
  const existing = document.querySelector(`.niri-window[data-url="${url}"]`);
  if (existing) {
    e.preventDefault(); // Abort fixi request
    document.body.classList.remove('overview-mode');
    existing.focus({ preventScroll: true });
    setTimeout(() => {
      existing.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }, 50);
    return;
  }

  const fromRoot = elt.closest('.niri-window')?.id === 'root-window';

  if (fromRoot) {
    const footer = document.querySelector('.site-footer');
    if (footer) {
      e.detail.cfg.target = footer;
      e.detail.cfg.swap = 'beforebegin';
    } else {
      e.detail.cfg.target = document.getElementById('niri-track-v');
      e.detail.cfg.swap = 'beforeend';
    }
  } else {
    const track = elt.closest('.niri-horizontal-track');
    if (track) {
      e.detail.cfg.target = track;
      e.detail.cfg.swap = 'beforeend';
    }
  }
});

function injectCloseBtn(container) {
  const wins = container.querySelectorAll('.niri-window');
  wins.forEach(win => {
    if (win.id === 'root-window') return;
    if (!win.querySelector('.mobile-close-btn')) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mobile-close-btn';
      closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      closeBtn.setAttribute('aria-label', 'Close window');
      win.prepend(closeBtn);
    }
  });
}

// Shell stripping, sizing, and track injection
document.addEventListener('fx:after', (e) => {
  const trigger = e.detail.cfg.trigger;
  const elt = trigger?.target.closest('[fx-action]');
  const parser = new DOMParser();
  const doc = parser.parseFromString(e.detail.cfg.text, 'text/html');
  const content = doc.querySelector('.niri-window');

  if (content) {
    content.setAttribute('data-url', e.detail.cfg.action);
    // Generate unique ID for paxi to track this window
    if (!content.id || content.id === 'root-window') {
      content.id = 'win-' + Math.random().toString(36).substr(2, 9);
    }
    content.setAttribute('tabindex', '-1');
    e.detail.cfg.newWinId = content.id;

    const fromRoot = elt && elt.closest('.niri-window')?.id === 'root-window';

    if (fromRoot) {
      content.classList.add('w-full');
      // Wrap in a new horizontal track
      const ribbon = document.createElement('div');
      ribbon.className = 'niri-horizontal-track';
      ribbon.id = 'track-' + Math.random().toString(36).substr(2, 9);
      if (elt.textContent) {
        ribbon.setAttribute('data-group-name', elt.textContent.trim());
      }
      ribbon.appendChild(content);
      injectCloseBtn(ribbon);
      e.detail.cfg.text = ribbon.outerHTML;
    } else {
      // Append half-width to current track
      const temp = document.createElement('div');
      temp.appendChild(content);
      injectCloseBtn(temp);
      e.detail.cfg.text = temp.innerHTML;
    }
  }
});

// Native scroll snapping focus
document.addEventListener('fx:end', (e) => {
  const newWinId = e.detail.cfg.newWinId;
  if (newWinId) {
    const win = document.getElementById(newWinId);
    if (win) {
      win.focus({ preventScroll: true });
      setTimeout(() => {
        win.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }, 50);
    }
  } else {
    const target = e.detail.cfg.target;
    if (target) {
      if (target.id === 'niri-track-v') {
        target.scrollTop = target.scrollHeight;
      } else {
        target.scrollLeft = target.scrollWidth;
      }
    }
  }
});

// Initial injection
function updateViewportVars() {
  document.documentElement.style.setProperty('--app-width', `${window.innerWidth}px`);
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}
window.addEventListener('resize', updateViewportVars);
updateViewportVars();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => injectCloseBtn(document.body));
} else {
  injectCloseBtn(document.body);
}

// Enhanced overview-mode scroll handling.
// Goals:
// - Prevent inner window native scrolling while in overview-mode.
// - Allow wheel/keyboard interactions over windows to move outer overview tracks.
// - Preserve typing in inputs/textareas/contenteditable.

const _windowOverflowMap = new WeakMap();
function setOverviewWindowOverflow(enabled) {
  document.querySelectorAll('.niri-window').forEach(win => {
    try {
      if (enabled) {
        _windowOverflowMap.set(win, win.style.overflow || '');
        win.style.overflow = 'hidden';
      } else {
        const prev = _windowOverflowMap.get(win);
        if (typeof prev !== 'undefined') win.style.overflow = prev;
        else win.style.overflow = '';
        _windowOverflowMap.delete(win);
      }
    } catch (err) {}
  });
}

// Ribbon scroll enable/disable helpers. Some CSS in overview-mode sets ribbons to overflow: visible;
// enable overflow-x:auto when user interacts so native scrolling works.
const _ribbonOverflowMap = new WeakMap();
function enableRibbonScroll(ribbon) {
  if (!ribbon) return;
  if (_ribbonOverflowMap.has(ribbon)) return;
  try {
    _ribbonOverflowMap.set(ribbon, { 
      overflowX: ribbon.style.overflowX || '', 
      touchAction: ribbon.style.touchAction || '',
      webkitOverflowScrolling: ribbon.style.webkitOverflowScrolling || ''
    });

    // make ribbon scrollable and enable native horizontal panning
    ribbon.style.overflowX = 'auto';
    ribbon.style.overflowY = 'hidden';
    ribbon.style.touchAction = 'pan-x';
    ribbon.style.webkitOverflowScrolling = 'touch';
  } catch (err) {}
}
function disableRibbonScroll(ribbon) {
  if (!ribbon) return;
  const prev = _ribbonOverflowMap.get(ribbon);
  if (prev) {
    try {
      ribbon.style.overflowX = prev.overflowX || '';
      ribbon.style.touchAction = prev.touchAction || '';
      ribbon.style.webkitOverflowScrolling = prev.webkitOverflowScrolling || '';
    } catch (err) {}
    _ribbonOverflowMap.delete(ribbon);
  }
}
function disableAllRibbons() {
  document.querySelectorAll('.niri-horizontal-track').forEach(r => disableRibbonScroll(r));
}

function setOverviewRibbonScroll(enabled) {
  const ribbons = document.querySelectorAll('.niri-horizontal-track');
  if (enabled) ribbons.forEach(r => enableRibbonScroll(r));
  else ribbons.forEach(r => disableRibbonScroll(r));
}

// apply initial state (must run after ribbon helpers init)
const initialOverview = document.body.classList.contains('overview-mode');
setOverviewWindowOverflow(initialOverview);
setOverviewRibbonScroll(initialOverview);

// enable auto-debug for current session
try { window.__niriDebugOverview = true; } catch (err) {}

// observe body.class changes
const _bodyObserver = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.attributeName === 'class') {
      const enabled = document.body.classList.contains('overview-mode');
      setOverviewWindowOverflow(enabled);
      setOverviewRibbonScroll(enabled);
    }
  }
});
_bodyObserver.observe(document.body, { attributes: true });

function _nearestTracks(win) {
  const root = document.getElementById('niri-track-v');
  const ribbon = win ? win.closest('.niri-horizontal-track') : null;
  return { root, ribbon };
}

function _scrollTrackBy(track, x, y, smooth = false) {
  if (!track) return;
  try {
    track.scrollBy({ left: x || 0, top: y || 0, behavior: smooth ? 'smooth' : 'auto' });
  } catch (err) {
    try { track.scrollLeft += x || 0; track.scrollTop += y || 0; } catch(e) {}
  }
}

// Wheel: redirect deltas to outer track when in overview-mode.
function overviewWheelHandler(e) {
  if (!document.body.classList.contains('overview-mode')) return;

  // determine event target robustly; sometimes target is inner scaled child
  let win = null;
  try {
    win = e.target && e.target.closest && e.target.closest('.niri-window');
    if (!win && typeof e.clientX === 'number') {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) win = el.closest && el.closest('.niri-window');
    }
  } catch (err) { win = null; }

  const { root, ribbon } = _nearestTracks(win);

  // normalize deltaMode (0=pixel,1=line,2=page)
  let deltaX = e.deltaX, deltaY = e.deltaY;
  if (e.deltaMode === 1) { // lines -> approx pixels
    const LINE_HEIGHT = 16;
    deltaX *= LINE_HEIGHT; deltaY *= LINE_HEIGHT;
  } else if (e.deltaMode === 2) { // page
    const PAGE = window.innerHeight || 800;
    deltaX *= PAGE; deltaY *= PAGE;
  }

  // helpers
  function isScrollable(el, axis) {
    if (!el) return false;
    try {
      if (axis === 'y') return el.scrollHeight > el.clientHeight && getComputedStyle(el).overflowY !== 'visible';
      return el.scrollWidth > el.clientWidth && getComputedStyle(el).overflowX !== 'visible';
    } catch (err) { return false; }
  }

  function findScrollTarget(axis) {
    if (axis === 'x') {
      if (ribbon && isScrollable(ribbon, 'x')) return ribbon;
      if (root && isScrollable(root, 'x')) return root;
    } else {
      if (root && isScrollable(root, 'y')) return root;
      if (document.scrollingElement && isScrollable(document.scrollingElement, 'y')) return document.scrollingElement;
      if (document.body && isScrollable(document.body, 'y')) return document.body;
    }
    return null;
  }

  const absY = Math.abs(deltaY), absX = Math.abs(deltaX);
  if (absY >= absX) {
    // vertical motion -> choose vertical scroll target
    const target = findScrollTarget('y');
    if (!target) return; // nothing scrollable, let browser handle it
    if ((window.__niriDebugOverview) || (localStorage && localStorage.debugOverview === '1')) console.log('[overview] vertical wheel', {deltaY, target: target.tagName, scrollTop: target.scrollTop, scrollHeight: target.scrollHeight, clientHeight: target.clientHeight});
    e.preventDefault();
    e.stopPropagation();
    _scrollTrackBy(target, 0, deltaY, false);
    return;
  }

  // horizontal motion: prefer ribbon under cursor
  let target = ribbon || findScrollTarget('x') || findScrollTarget('y');
  if (!target) return;

  if ((window.__niriDebugOverview) || (localStorage && localStorage.debugOverview === '1')) {
    console.log('[overview] horizontal wheel', {deltaX, deltaMode: e.deltaMode, ribbon: !!ribbon, scrollLeft: target.scrollLeft, scrollWidth: target.scrollWidth, clientWidth: target.clientWidth});
  }

  // enable ribbon native scroll and temporarily disable scroll-snap
  try {
    if (ribbon) enableRibbonScroll(ribbon);
    if (!target.__prevScrollSnap) target.__prevScrollSnap = target.style.scrollSnapType || '';
    target.style.scrollSnapType = 'none';
  } catch (err) {}

  e.preventDefault();
  e.stopPropagation();

  // accumulate and amplify small deltas for smoother touchpad response
  // compensate for overview zoom (<1) so horizontal movement feels natural
  const HORIZ_FACTOR_BASE = 8.0;
  let zoomComp = 1;
  try {
    const vTrack = document.getElementById('niri-track-v');
    const z = vTrack ? parseFloat(getComputedStyle(vTrack).zoom || '1') : 1;
    if (Number.isFinite(z) && z > 0 && z < 1) zoomComp = 1 / z;
  } catch (err) {}
  const HORIZ_FACTOR = HORIZ_FACTOR_BASE * zoomComp;
  target.__hAccum = (target.__hAccum || 0) + deltaX * HORIZ_FACTOR;

  // capture absDelta for adaptive clamping
  const absDelta = Math.abs(deltaX);

  // flush integer pixels via rAF
  window.requestAnimationFrame(() => {
    let amount = Math.trunc(target.__hAccum);

    // adaptive clamp: scale with viewport and input intensity
    // base = 20% of viewport width, adaptive = absDelta * factor, cap at target.clientWidth
    try {
      const base = Math.max(80, Math.round(target.clientWidth * 0.2));
      const adaptive = Math.round(absDelta * HORIZ_FACTOR * 6);
      const cap = Math.max(base, adaptive);
      const MAX_PER_FRAME = Math.min(cap, Math.max(base, target.clientWidth));

      if (amount > MAX_PER_FRAME) amount = MAX_PER_FRAME;
      if (amount < -MAX_PER_FRAME) amount = -MAX_PER_FRAME;
    } catch (e) {
      // fallback
      const FALLBACK_MAX = 300;
      if (amount > FALLBACK_MAX) amount = FALLBACK_MAX;
      if (amount < -FALLBACK_MAX) amount = -FALLBACK_MAX;
    }

    target.__hAccum -= amount;
    if (amount !== 0) {
      try {
        if (typeof target.scrollBy === 'function') target.scrollBy({ left: amount, behavior: 'auto' });
        else target.scrollLeft += amount;
      } catch (err) { _scrollTrackBy(target, amount, 0, false); }
    }

    if ((window.__niriDebugOverview) || (localStorage && localStorage.debugOverview === '1')) {
      try { console.log('[overview] post-scroll', { scrollLeft: target.scrollLeft, scrollWidth: target.scrollWidth, clientWidth: target.clientWidth, amount, absDelta }); } catch (e) {}
    }

    if (target.__snapRestoreTimeout) clearTimeout(target.__snapRestoreTimeout);
    target.__snapRestoreTimeout = setTimeout(() => {
      try { target.style.scrollSnapType = target.__prevScrollSnap || ''; delete target.__prevScrollSnap; } catch (e) {}
    }, 700);
  });
}

document.addEventListener('wheel', (e) => {
  // ensure ribbon becomes scrollable when user tries horizontal scroll with touchpad
  if (document.body.classList.contains('overview-mode')) {
    let win = null;
    try { win = e.target && e.target.closest && e.target.closest('.niri-window'); } catch(err) { win = null; }
    if (!win && typeof e.clientX === 'number') {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) win = el.closest && el.closest('.niri-window');
    }
    const ribbon = win ? win.closest('.niri-horizontal-track') : null;
    if (ribbon) enableRibbonScroll(ribbon);
  }
  overviewWheelHandler(e);
}, { passive: false, capture: true });

// Touch: simple pan routing. Track touchstart -> touchmove deltas, route to nearest track.
let _touchStart = null;
function overviewTouchStart(e) {
  if (!document.body.classList.contains('overview-mode')) return;
  const t = e.touches && e.touches[0];
  if (!t) return;
  const win = e.target && e.target.closest && e.target.closest('.niri-window');
  if (!win) return;
  _touchStart = { x: t.clientX, y: t.clientY, win };
}

function overviewTouchMove(e) {
  if (!document.body.classList.contains('overview-mode') || !_touchStart) return;
  const t = e.touches && e.touches[0];
  if (!t) return;
  const dx = _touchStart.x - t.clientX;
  const dy = _touchStart.y - t.clientY;

  // decide primary axis
  const absX = Math.abs(dx), absY = Math.abs(dy);
  if (absY >= absX) {
    const { root } = _nearestTracks(_touchStart.win);
    if (root) {
      e.preventDefault();
      _scrollTrackBy(root, 0, dy, false);
      _touchStart.x = t.clientX; _touchStart.y = t.clientY;
    }
  } else {
    const { ribbon, root } = _nearestTracks(_touchStart.win);
    const target = ribbon || root;
    if (target) {
      e.preventDefault();
      _scrollTrackBy(target, dx, 0, false);
      _touchStart.x = t.clientX; _touchStart.y = t.clientY;
    }
  }
}

document.addEventListener('touchstart', (e) => {
  if (document.body.classList.contains('overview-mode')) {
    const t = e.touches && e.touches[0];
    if (t) {
      const el = document.elementFromPoint(t.clientX, t.clientY);
      const ribbon = el && el.closest ? el.closest('.niri-horizontal-track') : null;
      if (ribbon) enableRibbonScroll(ribbon);
    }
  }
  overviewTouchStart(e);
}, { passive: true, capture: true });
document.addEventListener('touchmove', overviewTouchMove, { passive: false, capture: true });

// Keep all ribbons scroll-enabled during overview-mode.
// Avoid hover-boundary enable/disable toggles that can stall touchpad scrolling.

// Keyboard: map keys to outer track scroll commands.
function overviewKeyBlocker(e) {
  if (!document.body.classList.contains('overview-mode')) return;
  const scrollKeys = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','PageUp','PageDown','Home','End']);
  const spaceKeys = new Set([' ', 'Spacebar']);

  if (!scrollKeys.has(e.key) && !spaceKeys.has(e.key)) return;

  const active = document.activeElement;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

  const win = e.target && e.target.closest && e.target.closest('.niri-window');
  if (!win && !(active && active.closest && active.closest('.niri-window'))) return;

  e.preventDefault(); e.stopPropagation();

  const { root, ribbon } = _nearestTracks(win || active);
  const vw = window.innerHeight || document.documentElement.clientHeight;
  const vh = vw;
  const hx = window.innerWidth || document.documentElement.clientWidth;

  switch (e.key) {
    case 'ArrowDown': _scrollTrackBy(root, 0, Math.max(80, Math.round(vw * 0.08)), true); break;
    case 'ArrowUp': _scrollTrackBy(root, 0, -Math.max(80, Math.round(vw * 0.08)), true); break;
    case 'PageDown': _scrollTrackBy(root, 0, Math.round(vw * 0.85), true); break;
    case 'PageUp': _scrollTrackBy(root, 0, -Math.round(vw * 0.85), true); break;
    case 'Home': _scrollTrackBy(root, 0, -document.scrollingElement.scrollTop || -9999999, true); break;
    case 'End': _scrollTrackBy(root, 0, document.scrollingElement.scrollHeight || 9999999, true); break;
    case 'ArrowLeft': _scrollTrackBy(ribbon || root, -Math.round(hx * 0.2), 0, true); break;
    case 'ArrowRight': _scrollTrackBy(ribbon || root, Math.round(hx * 0.2), 0, true); break;
    default:
      // space or other
      _scrollTrackBy(root, 0, Math.round(vw * 0.85), true);
      break;
  }
}

document.addEventListener('keydown', overviewKeyBlocker, { capture: true });
