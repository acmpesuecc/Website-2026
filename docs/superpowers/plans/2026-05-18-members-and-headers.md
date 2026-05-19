# Members and Headers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a two-tier member directory (Core/Club) with compact cards linking to detailed profiles, and addhero sections to all list pages.

**Architecture:**
1. Reorganize member content into subdirectories.
2. Update member metadata fields.
3. Modify `all-members.html` for two-section layout and compact cards.
4. Enhance `page.html` to handle rich member profiles.
5. Add hero headers to `all-posts.html`, `all-events.html`, and `all-announcements.html`.

**Tech Stack:** HTML/Go Templates, Markdown, CSS.

---

### Task 1: Reorganize Member Content

**Files:**
- Create: `site/content/members/core/`
- Create: `site/content/members/club/`
- Move/Modify: All `.md` files in `site/content/members/`

- [ ] **Step 1: Create subdirectories**
```bash
mkdir -p site/content/members/core site/content/members/club
```

- [ ] **Step 2: Move existing members**
Move known core members (Andey, Lakshit, etc.) to `core/` and others to `club/`.
Example: `mv site/content/members/Andey.md site/content/members/core/`

- [ ] **Step 3: Update member frontmatter**
Add `tagline`, `hobbies`, and `interesting_info` to each member file.
Ensure `collections: ["members"]` is present.

- [ ] **Step 4: Commit**
```bash
git add site/content/members/
git commit -m "chore: reorganize member content into core and club subdirectories"
```

---

### Task 2: Implement Two-Tier Member List

**Files:**
- Modify: `site/layout/all-members.html`
- Modify: `site/static/styles/main.css`

- [ ] **Step 1: Define Role Order logic in `all-members.html`**
Create a manual sequence for Core roles.

- [ ] **Step 2: Create Core Section**
Filter members by `site/content/members/core/` and loop through roles in order: Chair, Vice Chair, Secretary, Treasurer, Membership Chair, Webmaster.

- [ ] **Step 3: Create Club Section**
Filter members by `site/content/members/club/` and sort alphabetically by Title (Name).

- [ ] **Step 4: Update Card HTML**
Make cards compact and link to profile.
```html
<a class="member-card-compact" href="/{{.CompleteURL}}" fx-action="/{{.CompleteURL}}">
    <div class="member-thumb">
        <img src="{{.Frontmatter.PreviewImage}}" alt="{{.Frontmatter.Title}}"/>
    </div>
    <div class="member-info-compact">
        <h3>{{.Frontmatter.Title}}</h3>
        <p>{{.Frontmatter.Description}}</p>
    </div>
</a>
```

- [ ] **Step 5: Add Styles to `main.css`**
```css
.member-card-compact {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s;
}
.member-card-compact:hover { transform: translateY(-4px); }
.member-thumb img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; }
```

- [ ] **Step 6: Commit**
```bash
git add site/layout/all-members.html site/static/styles/main.css
git commit -m "feat: implement two-tier member list with compact cards"
```

---

### Task 3: Enhance Detailed Member Profiles

**Files:**
- Modify: `site/layout/page.html`
- Modify: `site/static/styles/main.css`

- [ ] **Step 1: Update `page.html` for Member Profile**
Add logic to check if `collections` contains "members". If so, render the rich profile.

```html
{{ if in $PageData.Frontmatter.Collections "members" }}
<div class="member-profile">
    <div class="profile-header">
        <img src="{{ $PageData.Frontmatter.PreviewImage }}" class="profile-large-img" />
        <div class="profile-title">
            <h1>{{ $PageData.Frontmatter.Title }}</h1>
            <p class="profile-role">{{ $PageData.Frontmatter.Description }}</p>
            {{ if $PageData.Frontmatter.Tagline }}
            <p class="profile-tagline">"{{ $PageData.Frontmatter.Tagline }}"</p>
            {{ end }}
        </div>
    </div>
    <div class="profile-details">
        <div class="profile-bio">{{ $PageData.Body }}</div>
        <div class="profile-meta">
            {{ if $PageData.Frontmatter.Hobbies }}
            <div class="meta-section">
                <h4>Hobbies</h4>
                <ul>{{ range $PageData.Frontmatter.Hobbies }}<li>{{ . }}</li>{{ end }}</ul>
            </div>
            {{ end }}
            {{ if $PageData.Frontmatter.Interesting_info }}
            <div class="meta-section">
                <h4>Fun Fact</h4>
                <p>{{ $PageData.Frontmatter.Interesting_info }}</p>
            </div>
            {{ end }}
        </div>
    </div>
    <!-- Social icons loop here -->
</div>
{{ end }}
```

- [ ] **Step 2: Add Profile Styles to `main.css`**
Define grid layout for profile and styling for tagline/meta-sections.

- [ ] **Step 3: Commit**
```bash
git add site/layout/page.html site/static/styles/main.css
git commit -m "feat: enhance detailed member profiles"
```

---

### Task 4: Add Hero Headers to List Pages

**Files:**
- Modify: `site/layout/all-posts.html`
- Modify: `site/layout/all-events.html`
- Modify: `site/layout/all-announcements.html`
- Modify: `site/static/styles/main.css`

- [ ] **Step 1: Add Hero Block to layouts**
Insert a descriptive header section before the list grid.
```html
<header class="collection-hero">
    <h1>{{ $PageData.Frontmatter.Title }}</h1>
    <p>{{ $PageData.Frontmatter.Description }}</p>
</header>
```

- [ ] **Step 2: Update content frontmatter**
Ensure `index.md` for Blogs, Events, and Announcements has a good `description`.

- [ ] **Step 3: Add Styles to `main.css`**
```css
.collection-hero {
    padding: 3rem 0;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--border);
}
.collection-hero h1 { font-size: 3rem; margin-bottom: 0.5rem; }
.collection-hero p { font-size: 1.2rem; color: var(--text-muted); }
```

- [ ] **Step 4: Commit**
```bash
git add site/layout/ site/static/styles/main.css
git commit -m "feat: add hero headers to collection list pages"
```

---

### Task 5: Final Review and Cleanup

- [ ] **Step 1: Verify navigation**
Ensure all links in navbar work and land on the new hero-header pages.

- [ ] **Step 2: Check responsiveness**
Ensure compact cards and rich profiles look good on mobile.

- [ ] **Step 3: Final Commit**
```bash
git add .
git commit -m "chore: final polish of members and headers"
```
