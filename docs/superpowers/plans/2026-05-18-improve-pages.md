# Improve Pages and Templates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve formatting, information density, and layout consistency across blogs, members, events, and announcements.

**Architecture:** 
1. Refactor common Niri-specific logic into a partial to reduce duplication.
2. Enhance `page.html` to display post-specific metadata (authors, dates, tags).
3. Update list views (`all-posts`, `all-events`) to include tags.
4. Establish a formal `announcements` collection.
5. Streamline navigation to use auto-generated collections.

**Tech Stack:** HTML/Go Templates (Niri engine), Markdown, CSS.

---

### Task 1: Extract Niri Logic to Partial

**Files:**
- Create: `site/layout/partials/niri-logic.html`
- Modify: `site/layout/page.html`
- Modify: `site/layout/all-posts.html`
- Modify: `site/layout/all-members.html`
- Modify: `site/layout/all-events.html`

- [ ] **Step 1: Create the partial**
Create `site/layout/partials/niri-logic.html` with the extracted `on-keydown` and `on-click` logic from the `<body>` tags.

```html
{{define "niri-logic"}}
<body class="site-body" 
    on-keydown="
        if(evt.shiftKey && evt.key === 'Q') {
            let win = document.activeElement.closest('.niri-window') || document.querySelector('.niri-window:last-child');
            if (win) window.closeNiriWindow(win);
        }
        if(evt.shiftKey && evt.key === 'F') {
            let win = document.activeElement.closest('.niri-window');
            if(win) {
                win.classList.toggle('w-full');
                setTimeout(() => {
                    win.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                }, 310);
            }
        }
        if(evt.key === 'd' || evt.key === 'D') {
            document.body.classList.toggle('overview-mode');
            if(!document.body.classList.contains('overview-mode')) {
                let win = document.activeElement.closest('.niri-window');
                if(win) win.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }
        if(evt.key === '/') {
            let m = document.getElementById('help-modal');
            if(m) m.open ? m.close() : m.showModal();
            evt.preventDefault();
        }
    "
    on-click="
        let fab = evt.target.closest('.fab-overview');
        if(fab) {
            document.body.classList.toggle('overview-mode');
            return;
        }
        
        let win = evt.target.closest('.niri-window');
        let interactive = evt.target.closest('a, button, input');
        if(win && !interactive) {
            win.focus({ preventScroll: true });
            if(document.body.classList.contains('overview-mode')) {
                document.body.classList.remove('overview-mode');
                setTimeout(() => {
                    win.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                }, 50);
                evt.preventDefault();
                evt.stopPropagation();
            }
        }
    "
>
{{end}}
```

- [ ] **Step 2: Update layouts to use the partial**
Replace the large `<body>` tag in `page.html`, `all-posts.html`, `all-members.html`, and `all-events.html` with `{{template "niri-logic" .}}`.

- [ ] **Step 3: Commit**
```bash
git add site/layout/
git commit -m "refactor: extract Niri logic to partial"
```

---

### Task 2: Enhance Page Metadata Display

**Files:**
- Modify: `site/layout/page.html`
- Modify: `site/static/styles/main.css`

- [ ] **Step 1: Add metadata block to `page.html`**
Modify `site/layout/page.html` to show authors, date, and tags for pages in collections.

```html
{{ if ne (len $PageData.Frontmatter.Title) 0 }}
<div class="post-header">
    <h1>{{ $PageData.Frontmatter.Title }}</h1>
    {{ if or $PageData.Frontmatter.Authors $PageData.Frontmatter.Date $PageData.Frontmatter.Tags }}
    <div class="post-metadata">
        {{ if $PageData.Frontmatter.Authors }}
        <span class="post-authors">By {{ range $i, $a := $PageData.Frontmatter.Authors }}{{ if $i }}, {{ end }}{{ $a }}{{ end }}</span>
        {{ end }}
        {{ if $PageData.Frontmatter.Date }}
        <span class="post-date">• {{ $PageData.Frontmatter.Date }}</span>
        {{ end }}
        {{ if $PageData.Frontmatter.Tags }}
        <div class="post-tags">
            {{ range $PageData.Frontmatter.Tags }}
            <a href="/tags/{{ . | lower }}.html" class="tag-pill">{{ . }}</a>
            {{ end }}
        </div>
        {{ end }}
    </div>
    {{ end }}
</div>
{{ end }}
```

- [ ] **Step 2: Add styles to `main.css`**
```css
.post-metadata {
    margin: 1rem 0 2rem;
    font-size: 0.9rem;
    color: var(--text-muted);
}
.tag-pill {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    margin-right: 0.5rem;
    background: var(--bg-secondary);
    border-radius: 12px;
    font-size: 0.8rem;
    text-decoration: none;
    color: var(--primary);
}
```

- [ ] **Step 3: Commit**
```bash
git add site/layout/page.html site/static/styles/main.css
git commit -m "feat: add metadata and tags to page layout"
```

---

### Task 3: Improve List Card Views

**Files:**
- Modify: `site/layout/all-posts.html`
- Modify: `site/layout/all-events.html`

- [ ] **Step 1: Add tags to blog cards in `all-posts.html`**
Update the `blog-info` div to include tags.

```html
<div class="blog-info">
    <h3>{{$Post.Frontmatter.Title}}</h3>
    <p>{{$Post.Frontmatter.Description}}</p>
    <div class="card-meta">
        <span class="blog-date">{{$Post.Frontmatter.Date}}</span>
        {{ if $Post.Frontmatter.Tags }}
        <div class="card-tags">
            {{ range $Post.Frontmatter.Tags }}
            <span class="tag-label">{{ . }}</span>
            {{ end }}
        </div>
        {{ end }}
    </div>
</div>
```

- [ ] **Step 2: Add tags to event cards in `all-events.html`**
(Same pattern as above for `event-info`).

- [ ] **Step 3: Commit**
```bash
git add site/layout/all-posts.html site/layout/all-events.html
git commit -m "feat: show tags on blog and event cards"
```

---

### Task 4: Setup Announcements Collection

**Files:**
- Move: `site/content/announcement.md` -> `site/content/announcements/latest.md`
- Create: `site/content/announcements/index.md`
- Create: `site/layout/all-announcements.html`
- Modify: `site/layout/config.json`

- [ ] **Step 1: Move content and create collection index**
```bash
mkdir -p site/content/announcements
mv site/content/announcement.md site/content/announcements/latest.md
```
Update `latest.md` frontmatter to include `collections: ["announcements"]` and a `date`.

- [ ] **Step 2: Create `site/layout/all-announcements.html`**
Copy `all-posts.html` but filter for `collections/announcements.html`.

- [ ] **Step 3: Update `config.json`**
Add `"collections/announcements.html": "all-announcements"` to `collectionLayouts`.
Update `navbar` link: `{ "Announcements": "collections/announcements.html" }`.

- [ ] **Step 4: Commit**
```bash
git add site/content/ site/layout/
git commit -m "feat: formalize announcements collection"
```

---

### Task 5: Streamline Navigation

**Files:**
- Modify: `site/layout/config.json`
- Delete: `site/layout/all-members.html` (merged into auto-collection)
- Modify: `site/layout/page.html` (ensure it handles member bio properly)

- [ ] **Step 1: Update Members nav link**
In `config.json`, change Members link to `collections/members.html`.

- [ ] **Step 2: Cleanup redundant manual list**
If `site/layout/all-members.html` and `site/content/members/index.md` are redundant with the new collection system, remove them or ensure they don't conflict.

- [ ] **Step 3: Final Commit and Verification**
```bash
git add .
git commit -m "chore: streamline navigation and cleanup"
```
Check all pages in browser.
