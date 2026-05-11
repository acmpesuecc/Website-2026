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

// Target switching: Main pages spawn new ribbons, sub-pages append to current ribbon
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

  if (elt.hasAttribute('fx-main-page')) {
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

// Shell stripping and Mobile injection
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
    
    if (elt && elt.hasAttribute('fx-main-page')) {
      // Wrap main pages in a new horizontal track
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
