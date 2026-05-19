# Design: Fix Task 3 Review Issues

## Goal
Fix double rendering on member pages, move hardcoded colors to CSS variables, and refine member page detection.

## Architecture Changes

### 1. `site/layout/page.html`
- Wrap default header and body in `{{ else }}` of member detection block.
- Logic:
  ```html
  <section class="body">
      {{ if contains .PageURL "members/" }}
          <!-- Rich Profile -->
      {{ else }}
          <!-- Default Title/Body -->
      {{ end }}
  </section>
  ```

### 2. Styling (CSS Variables)
- Add `--brand-color: #00aafe;` to `:root` in `site/static/styles/main.css`.
- Replace all occurrences of `#00aafe` with `var(--brand-color)`.

### 3. Social Icons
- Create `site/layout/partials/social-icons.html` to centralize SVG icons.
- Usage in `page.html`: `{{ template "social-icons" .platform }}`.

## Verification
- Visit member profile: expect rich profile only.
- Visit index/about: expect default layout.
- Inspect colors: expect `var(--brand-color)`.
