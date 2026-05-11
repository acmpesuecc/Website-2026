---
title: ""
layout: page
---

<div class="niri-root-window">
  <canvas id="dots"></canvas>
  <div class="hero-content">
    <div class="hero-brand">

  <img src="/static/images/acmpesuecc2.png"
       alt="ACM PESU ECC Logo"
       class="hero-logo"
       draggable="false">

  

</div><p class="hero-eyebrow">PES University EC Campus ACM Student Chapter </p>
    <p class="hero-tagline">A student led tech community at PES University centered around technology, creativity and collaboration</p>
    
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
.niri-root-window {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 85vh;
  padding: 2rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* full-bleed: break out of any parent max-width so the dots span the whole viewport */
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

#dots {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  display: block;
}

.hero-eyebrow {
  font-size: 1.5 rem; /* was 0.75rem */
  font-weight: 400;
  letter-spacing: 0.15em;
  color: #6b7fa3;
  margin: 0 0 1.25rem 0;
  text-transform: uppercase;
}
.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 800px;
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(15px);
}
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}

.hero-logo {
  width: 470px;
  height: auto;

  margin-bottom: 1.5rem;

  opacity: 0.9;

  filter:
    drop-shadow(0 0 20px rgba(255,255,255,0.05));

  transition: all 0.25s ease;
}

.hero-logo:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.hero-title {
  font-size: clamp(5rem, 10vw, 8rem);
  font-weight: 2500;
  line-height: 1;
  letter-spacing: -0.0000005em;
  color: #ffffff;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-tagline {
  font-size: clamp(1rem, 3vw, 1.35rem);
  font-weight: 400;
  line-height: 1.6;
  color: #a1a1aa !important;
  margin: 0 0 3rem 0;
}
.hero-nav {
  display: flex;
  gap: 1.7rem;
  flex-wrap: wrap;
  justify-content: center;
  background: rgba(0, 12, 35, 0.4);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(0, 170, 254, 0.2);
  border-radius: 100px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  isolation: isolate;
  transform: translateZ(0);
  box-sizing: border-box;
  margin-top: 3rem;
  width: min(95%, 1000px);
}

.nav-separator {
  width: 1px;
  background: rgba(0, 170, 254, 0.3);
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
  transform: scale(0.6);
  transform-origin: center center;
}

@media (max-width: 768px) {
  .root-nav.glass-pill {
    flex-direction: column;
    border-radius: 24px;
    width: min(90%, 300px);
  }
  .nav-separator {
    width: 100%;
    height: 1px;
  }
  .root-nav .m-link {
    width: 100%;
    text-align: center;
    padding: 1rem;
  }
}
.nav-btn {
  min-width: 70px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none !important;
  transition: all 0.15s ease;
  letter-spacing: 0.01em;
}
.nav-btn.primary {
  background: #ffffff;
  color: #000c23 !important;
  border: 1px solid #ffffff;
}
.nav-btn.primary:hover {
  background: #e4e4e7;
  transform: translateY(-1px);
}
.nav-btn.secondary {
  background: rgba(255, 255, 255, 0.04);
  color: #e4e4e7 !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.nav-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff !important;
}
</style>

<script>
(function () {
  const canvas = document.getElementById('dots');
  const ctx = canvas.getContext('2d');
  const wrap = document.querySelector('.niri-root-window');
  let mouse = { x: -9999, y: -9999 };
  let dots = [];

  const SPACING = 28;
  const BASE_R = 1.8;
  const MAX_R = 6;
  const INFLUENCE = 80;
  const BASE_ALPHA = 0.12;
  const MAX_ALPHA = 0.45;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    dots = [];
    const cols = Math.ceil(rect.width / SPACING) + 1;
    const rows = Math.ceil(rect.height / SPACING) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({ x: c * SPACING, y: r * SPACING });
      }
    }
  }

  wrap.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  wrap.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  function draw() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    for (const d of dots) {
      const dx = d.x - mouse.x;
      const dy = d.y - mouse.y;
      const t = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / INFLUENCE);
      const r = BASE_R + (MAX_R - BASE_R) * t * t;
      const alpha = BASE_ALPHA + (MAX_ALPHA - BASE_ALPHA) * t * t;
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(80, 160, 255, ${alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(resize).observe(wrap);
  } else {
    window.addEventListener('resize', resize);
  }

  window.addEventListener('load', resize);
})();
</script>
