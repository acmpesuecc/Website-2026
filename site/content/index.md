---
title: ""
layout: page
---

<div class="niri-root-window">
  <div class="hero-content">
    <img src="/static/images/anna.png" alt="ACM PESU ECC Logo" class="hero-logo">
    <h1 class="hero-title">ACM PESU-ECC</h1>
    <p class="hero-tagline">Niri-inspired horizontal tiling interface.</p>
    <div class="hero-nav">
      <a href="/about.html" class="nav-btn secondary" fx-action="/about.html" fx-main-page fx-target="#niri-track-v" fx-swap="beforeend">About</a>
      <a href="/members/index.html" class="nav-btn secondary" fx-action="/members/index.html" fx-main-page fx-target="#niri-track-v" fx-swap="beforeend">Members</a>
      <a href="/blogs/index.html" class="nav-btn secondary" fx-action="/blogs/index.html" fx-main-page fx-target="#niri-track-v" fx-swap="beforeend">Blogs</a>
      <a href="/events/index.html" class="nav-btn secondary" fx-action="/events/index.html" fx-main-page fx-target="#niri-track-v" fx-swap="beforeend">Events</a>
      <a href="/contact.html" class="nav-btn primary" fx-action="/contact.html" fx-main-page fx-target="#niri-track-v" fx-swap="beforeend">Contact</a>
    </div>
  </div>
</div>

<style>
.niri-root-window {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 85vh;
  padding: 2rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

<div class="niri-horizontal-track">

  <section class="niri-window w-full" id="root-window">
    <div class="hero-content">
      <img src="/static/images/anna.png" alt="Logo" class="hero-logo">
      <h1 class="hero-title">ACM PESU-ECC</h1>
      <p class="hero-tagline">Niri-inspired horizontal tiling interface.</p>
      
      <div class="hero-nav">
        <a href="#about" class="nav-btn secondary">About</a>
        <a href="#members" class="nav-btn secondary">Members</a>
        <a href="/contact.html" class="nav-btn primary">Contact</a>
      </div>
    </div>
  </section>

  <section class="niri-window">
    <h2>About the Chapter</h2>
    <p>We build systems, culture, and better pathways for engineers.</p>
  </section>

</div>
.hero-content {
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
  width: 56px;
  height: 56px;
  margin-bottom: 2rem;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}
.hero-title {
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  color: #ffffff;
  margin: 0 0 1.25rem 0;
  background: linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-tagline {
  font-size: clamp(1.1rem, 3vw, 1.35rem);
  font-weight: 400;
  line-height: 1.6;
  color: #a1a1aa !important;
  margin: 0 0 3rem 0;
}
.hero-nav {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  justify-content: center;
}
.nav-btn {
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
