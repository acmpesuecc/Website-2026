---
title: ""
layout: page
---

<div class="niri-landing">
  <div id="root-dots"></div>
  <div class="niri-root-content">
    <img src="/static/images/acmpesuecc2.png" alt="ACM PESU ECC Logo" class="root-logo" draggable="false">
    <p class="root-eyebrow">PES University EC Campus ACM Student Chapter</p>
    <p class="root-tagline">A student led tech community at PES University centered around technology, creativity and collaboration</p>
  </div>

  <nav class="root-nav glass-pill">
    <a href="/about.html" class="m-link">About</a>
    <div class="nav-separator"></div>
    <a href="/collections/members.html" class="m-link">Members</a>
    <div class="nav-separator"></div>
    <a href="/collections/blogs.html" class="m-link">Blogs</a>
    <div class="nav-separator"></div>
    <a href="/collections/events.html" class="m-link">Events</a>
    <div class="nav-separator"></div>
    <a href="/contact.html" class="m-link">Contact</a>
  </nav>
</div>

<script>
  (function() {
    const rootWindow = document.getElementById('root-window');
    const rootDots = document.getElementById('root-dots');
    
    // Move dots to the parent window so it covers the background and uses correct coordinates
    if (rootWindow && rootDots) {
      rootWindow.prepend(rootDots);
    }

    if (rootWindow && !rootWindow.dataset.cursorBound) {
      let currentX = -200, currentY = -200;
      let targetX = -200, targetY = -200;
      
      function animate() {
        if (document.body.classList.contains('overview-mode')) {
          requestAnimationFrame(animate);
          return;
        }

        if (window.innerWidth <= 1024) {
          // Mobile: Sine-wave path from bottom to top
          const rect = rootWindow.getBoundingClientRect();
          const time = Date.now();
          const speed = 0.08; 
          
          // Move vertically from bottom to top
          currentY = rect.height - ((time * speed) % (rect.height + 400)) + 200;
          
          // Oscillate horizontally to create the wave motion
          const amplitude = rect.width * 0.35;
          currentX = (rect.width / 2) + Math.sin(time / 700) * amplitude;
        } else {
          // Desktop: Pointer following
          currentX += (targetX - currentX) * 0.15;
          currentY += (targetY - currentY) * 0.15;
        }

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
