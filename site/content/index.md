---
title: ""
layout: page
---

<div class="niri-landing">
  <div class="niri-root-content">
    <img src="/static/images/acmpesuecc2.png" alt="ACM PESU ECC Logo" class="root-logo" draggable="false">
    <p class="root-eyebrow">PES University EC Campus ACM Student Chapter</p>
    <p class="root-tagline">A student led tech community at PES University centered around technology, creativity and collaboration</p>
  </div>

  <nav class="root-nav glass-pill">
    <a href="/about.html" class="m-link" fx-action="/about.html" fx-main-page fx-target="#niri-track-v" fx-swap="beforeend">About</a>
    <div class="nav-separator"></div>
    <a href="/members/index.html" class="m-link" fx-action="/members/index.html" fx-main-page fx-target="#niri-track-v" fx-swap="beforeend">Members</a>
    <div class="nav-separator"></div>
    <a href="/blogs/index.html" class="m-link" fx-action="/blogs/index.html" fx-main-page fx-target="#niri-track-v" fx-swap="beforeend">Blogs</a>
    <div class="nav-separator"></div>
    <a href="/events/index.html" class="m-link" fx-action="/events/index.html" fx-main-page fx-target="#niri-track-v" fx-swap="beforeend">Events</a>
    <div class="nav-separator"></div>
    <a href="/contact.html" class="m-link" fx-action="/contact.html" fx-main-page fx-target="#niri-track-v" fx-swap="beforeend">Contact</a>
  </nav>
</div>

<style>
/* Base root window styling */
#root-window {
  background-color: #000c23;
  background-image: radial-gradient(rgba(0, 170, 254, 0.1) 1px, transparent 1px);
  background-size: 24px 24px;
  position: relative;
}

/* Glowing Dot trail effect */
#root-window::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  background-image: radial-gradient(rgba(0, 170, 254, 0.8) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
  -webkit-mask-image: radial-gradient(circle 150px at var(--cursor-x, -150px) var(--cursor-y, -150px), rgba(0, 0, 0, 1), transparent);
  mask-image: radial-gradient(circle 150px at var(--cursor-x, -150px) var(--cursor-y, -150px), rgba(0, 0, 0, 1), transparent);
  z-index: 0;
  transition: opacity 0.3s;
}

/* Center everything in normal view */
#root-window .site-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0;
  width: 100%;
}

.niri-landing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  z-index: 1;
}

.niri-root-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.root-logo {
  width: 470px;
  height: auto;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  filter: drop-shadow(0 0 20px rgba(255,255,255,0.05));
  transition: all 0.25s ease;
}

.root-logo:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.root-eyebrow {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: #6b7fa3;
  margin: 0 0 1.25rem 0;
  text-transform: uppercase;
  box-sizing: border-box;
}

.root-tagline {
  font-size: clamp(1rem, 3vw, 1.35rem);
  font-weight: 400;
  line-height: 1.6;
  color: #a1a1aa !important;
  margin: 0 0 3rem 0;
  width: 100%;
  box-sizing: border-box;
}

.root-nav.glass-pill {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: center;
  background: rgba(0, 12, 35, 0.4);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(0, 170, 254, 0.08);
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  isolation: isolate;
  transform: translateZ(0);
  box-sizing: border-box;
  margin-top: 2rem;
  width: min(95%, 1000px);
}

.nav-separator {
  width: 1px;
  background: rgba(0, 170, 254, 0.12);
  align-self: stretch;
  margin: 0;
}

.root-nav .m-link {
  color: #a3c4ec;
  text-decoration: none;
  font-weight: 600;
  padding: 1.25rem 2.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: transparent;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  align-self: stretch;
  margin: 0;
  box-sizing: border-box;
  z-index: 1;
}

.root-nav .m-link::before {
  content: "";
  position: absolute;
  top: -2px; left: -2px; right: -2px; bottom: -2px;
  background: rgba(0, 170, 254, 0.25);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.root-nav .m-link:hover::before, .root-nav .m-link:focus::before {
  opacity: 1;
}

.root-nav .m-link:hover, .root-nav .m-link:focus {
  color: #ffffff;
  outline: none;
}

/* Scaling for overview mode via CSS transformations to ensure layout integrity */
body.overview-mode .niri-landing {
  position: absolute;
  top: 55%;
  left: 50%;
  width: 100vw;
  max-width: none;
  height: 65vh;
  margin: 0 !important;
  transform: translate(-50%, -50%) scale(0.85);
}

body.overview-mode .root-logo {
  width: 320px;
  min-width: 320px;
  height: auto;
  margin-bottom: 0.5rem;
  display: block;
}

body.overview-mode .niri-landing {
  padding-top: 2rem;
  justify-content: flex-start;
}

@media (max-width: 768px) {
  .niri-landing {
    margin-top: 8vh;
  }
  body.overview-mode .niri-landing {
    width: 100vw;
    height: 30vh;
    transform: translate(-50%, -50%) scale(0.65);
  }
  .root-logo {
    width: min(80vw, 300px);
  }
  .root-eyebrow {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
  .root-tagline {
    font-size: 0.9rem;
    padding: 0 1.5rem;
  }
  .root-nav.glass-pill {
    flex-direction: column;
    border-radius: 16px;
    width: min(85%, 260px);
    margin-top: 2rem;
  }
  .nav-separator {
    width: 100%;
    height: 1px;
  }
  .root-nav .m-link {
    width: 100%;
    text-align: center;
    padding: 0.85rem 1rem;
    font-size: 0.95rem;
  }
}
</style>

<script>
  (function() {
    const rootWindow = document.getElementById('root-window');
    if (rootWindow && !rootWindow.dataset.cursorBound) {
      let currentX = -200, currentY = -200;
      let targetX = -200, targetY = -200;
      
      function animate() {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        rootWindow.style.setProperty('--cursor-x', `${currentX}px`);
        rootWindow.style.setProperty('--cursor-y', `${currentY}px`);
        if (rootWindow.isConnected) {
          requestAnimationFrame(animate);
        }
      }
      requestAnimationFrame(animate);

      rootWindow.addEventListener('mousemove', (e) => {
        const rect = rootWindow.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      });
      rootWindow.dataset.cursorBound = 'true';
    }
  })();
</script>
