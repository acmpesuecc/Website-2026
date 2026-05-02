---
title: ""
layout: page
---

<div class="manifesto-wrapper">
  <h1 class="manifesto-title">
    Let’s build <span class="accent">Together.</span>
  </h1>

  <div class="manifesto-body">
    <p>
      Want to work with us? Build cool things, meet amazing people and be part of a community that’s always learning, creating and growing.
    </p>
  </div>

<div class="manifesto-footer">
  <div class="cta-row">
    <span class="label">Mail us at</span>
    <a href="mailto:acmpesuecc@pes.edu" class="m-link">Gmail</a>
  </div>

  <div class="cta-row">
    <span class="label">Socials</span>
    <div class="links">
      <a href="https://github.com/acmpesuecc" class="m-link">GitHub</a>
      <a href="https://www.linkedin.com/company/acm-pesu-ecc/" class="m-link">LinkedIn</a>
    </div>
  </div>

  <div class="cta-row">
    <span class="label">Join us</span>
    <a href="" class="m-link">Apply Here</a>
  </div>
</div>

<style>
.manifesto-wrapper {
  margin: 10vh auto;
  max-width: 800px;
  text-align: left;
  padding: 0 20px;
}

.manifesto-title {
  font-size: clamp(2.5rem, 7vw, 4rem) !important;
  line-height: 1 !important;
  font-weight: 800;
  letter-spacing: -0.05em;
  margin-bottom: 40px !important;
  color: var(--text-color, #ffffff);
  border: none !important;
}

.manifesto-title .accent {
  color: #2563eb;
  font-style: italic;
}

.manifesto-body p {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #00aafe
  max-width: 600px;
  margin-bottom: 60px;
  opacity: 0.9;
}

.manifesto-footer {
  border-top: 1px solid #eee;
  padding-top: 30px;
}

.cta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 18px;
  font-size: 1.1rem;
}

.label {
  font-weight: 700;
  color: var(--text-color, #ffffff);
  min-width: 140px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.m-link {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  color: #2563eb !important;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.18);
  transition: all 0.2s ease;
}

.m-link:hover {
  background: #2563eb;
  color: white !important;
  border-color: #2563eb;
  opacity: 1;
  transform: translateY(-2px);
}

@media (prefers-color-scheme: dark) {
  .manifesto-footer {
    border-top-color: #333;
  }

  .manifesto-title .accent {
    color: #60a5fa;
  }

  .m-link {
    color: #60a5fa !important;
    background: rgba(96, 165, 250, 0.12);
    border-color: rgba(96, 165, 250, 0.22);
  }

  .m-link:hover {
    background: #60a5fa;
    color: #111 !important;
    border-color: #60a5fa;
  }
}

@media (max-width: 600px) {
  .cta-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 25px;
  }

  .label {
    min-width: auto;
  }
}
</style>