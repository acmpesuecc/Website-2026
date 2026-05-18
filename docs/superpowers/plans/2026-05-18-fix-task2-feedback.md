# Fix Task 2 Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address feedback from Task 2 review by fixing tag link inconsistency, CSS class mismatches, bullet UX, hover states, and vertical spacing.

**Architecture:** Update templates and styles to ensure consistency and improved UX.

**Tech Stack:** HTML/CSS, Go Templates

---

### Task 1: Fix Tag Link Inconsistency and Metadata UX in `page.html`

**Files:**
- Modify: `site/layout/page.html`

- [ ] **Step 1: Update metadata block to remove `lower` filter, fix bullet logic, and add vertical spacing style**

```html
<div class="post-header">
    <h1>{{ $PageData.Frontmatter.Title }}</h1>
    {{ if or $PageData.Frontmatter.Authors $PageData.Frontmatter.Date $PageData.Frontmatter.Tags }}
    <div class="post-metadata">
        {{ if $PageData.Frontmatter.Authors }}
        <span class="post-authors">By {{ range $i, $a := $PageData.Frontmatter.Authors }}{{ if $i }}, {{ end }}{{ $a }}{{ end }}</span>
        {{ end }}
        {{ if $PageData.Frontmatter.Date }}
        <span class="post-date">{{ if $PageData.Frontmatter.Authors }}• {{ end }}{{ $PageData.Frontmatter.Date }}</span>
        {{ end }}
        {{ if $PageData.Frontmatter.Tags }}
        <div class="post-tags" style="margin-top: 0.5rem;">
            {{ range $PageData.Frontmatter.Tags }}
            <a href="/tags/{{ . }}.html" class="tag-pill">{{ . }}</a>
            {{ end }}
        </div>
        {{ end }}
    </div>
    {{ end }}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add site/layout/page.html
git commit -m "fix: tag links and metadata UX in page.html"
```

### Task 2: Enhance `tag-pill` Styles in `main.css`

**Files:**
- Modify: `site/static/styles/main.css`

- [ ] **Step 1: Add hover/focus states and update `tag-pill` spacing**

```css
.tag-pill {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    margin-right: 0.5rem;
    background: var(--inline-code-bg);
    border-radius: 12px;
    font-size: 0.8rem;
    text-decoration: none;
    color: var(--color-primary);
    transition: background 0.2s ease, color 0.2s ease;
}

.tag-pill:hover, .tag-pill:focus {
    background: var(--color-background-dim);
    color: #fff;
}
```

- [ ] **Step 2: Commit**

```bash
git add site/static/styles/main.css
git commit -m "style: add hover and focus states to tag-pill"
```

### Task 3: Update `page_another.html` for Consistency

**Files:**
- Modify: `site/layout/page_another.html`

- [ ] **Step 1: Update metadata block to match `page.html` logic**

```html
<div class="post-header">
    <h1>{{ $PageData.Frontmatter.Title }}</h1>
    {{ if or $PageData.Frontmatter.Authors $PageData.Frontmatter.Date $PageData.Frontmatter.Tags }}
    <div class="post-metadata">
        {{ if $PageData.Frontmatter.Authors }}
        <span class="post-authors">By {{ range $i, $a := $PageData.Frontmatter.Authors }}{{ if $i }}, {{ end }}{{ $a }}{{ end }}</span>
        {{ end }}
        {{ if $PageData.Frontmatter.Date }}
        <span class="post-date">{{ if $PageData.Frontmatter.Authors }}• {{ end }}{{ $PageData.Frontmatter.Date }}</span>
        {{ end }}
        {{ if $PageData.Frontmatter.Tags }}
        <div class="post-tags" style="margin-top: 0.5rem;">
            {{ range $PageData.Frontmatter.Tags }}
            <a href="/tags/{{ . }}.html" class="tag-pill">{{ . }}</a>
            {{ end }}
        </div>
        {{ end }}
    </div>
    {{ end }}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add site/layout/page_another.html
git commit -m "fix: metadata consistency in page_another.html"
```
