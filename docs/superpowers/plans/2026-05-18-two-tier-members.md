# Implement Two-Tier Member List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a two-tier member list (Core and Club) with compact, visually appealing cards.

**Architecture:** Split the `all-members.html` template into two loops: one for Core Team (ordered by role) and one for Club Members. Add compact card styling and grid layout to `main.css`.

**Tech Stack:** HTML/Hugo-like templates, CSS Grid.

---

### Task 1: Update Member List Template

**Files:**
- Modify: `site/layout/all-members.html`

- [ ] **Step 1: Replace current member loop with two-tier logic**

```html
{{ define "all-members"}}
{{$PageData := index .DeepDataMerge.Collections .PageURL}}
{{ template "head" .}}
{{template "niri-logic" .}}
    <main class="niri-vertical-track" id="niri-track-v">
        <div class="niri-horizontal-track" id="niri-track-h-root">
            <section class="niri-window" id="root-window" role="main" tabindex="-1">
                <div class="container site-main">
                    <article class="content">

                    <h2>{{$PageData.Frontmatter.Title}}</h2>

                    <h2>Core Team</h2>
                    <section class="member-cards-grid">
                        {{ $roles := slice "Chair" "Vice Chair" "Secretary" "Treasurer" "Membership Chair" "Webmaster" }}
                        {{ range $role := $roles }}
                            {{ range $key, $members := $.DeepDataMerge.CollectionsMap }}
                                {{ if eq $key "collections/members.html" }}
                                    {{ range $Post := $members }}
                                        {{ if and (contains $Post.CompleteURL "/core/") (eq $Post.Frontmatter.Description $role) }}
                                            <a class="member-card-compact" href="/{{$Post.CompleteURL}}" fx-action="/{{$Post.CompleteURL}}">
                                                <div class="member-thumb">
                                                    {{if $Post.Frontmatter.PreviewImage}}
                                                    <img src="{{$Post.Frontmatter.PreviewImage}}" alt="{{$Post.Frontmatter.Title}}"/>
                                                    {{end}}
                                                </div>
                                                <div class="member-card-info-compact">
                                                    <h3>{{$Post.Frontmatter.Title}}</h3>
                                                    <p class="member-designation-compact">{{$Post.Frontmatter.Description}}</p>
                                                </div>
                                            </a>
                                        {{ end }}
                                    {{ end }}
                                {{ end }}
                            {{ end }}
                        {{ end }}
                    </section>

                    <h2>Club Members</h2>
                    <section class="member-cards-grid">
                        {{ range $key, $members := .DeepDataMerge.CollectionsMap }}
                            {{ if eq $key "collections/members.html" }}
                                {{ range $Post := $members }}
                                    {{ if contains $Post.CompleteURL "/club/" }}
                                        <a class="member-card-compact" href="/{{$Post.CompleteURL}}" fx-action="/{{$Post.CompleteURL}}">
                                            <div class="member-thumb">
                                                {{if $Post.Frontmatter.PreviewImage}}
                                                <img src="{{$Post.Frontmatter.PreviewImage}}" alt="{{$Post.Frontmatter.Title}}"/>
                                                {{end}}
                                            </div>
                                            <div class="member-card-info-compact">
                                                <h3>{{$Post.Frontmatter.Title}}</h3>
                                                <p class="member-designation-compact">{{$Post.Frontmatter.Description}}</p>
                                            </div>
                                        </a>
                                    {{ end }}
                                {{ end }}
                            {{ end }}
                        {{ end }}
                    </section>

                    </article>
                </div>
            </section>
        </div>
        
    </main>
    {{template "footer" .}}
</body>
</html>
{{ end }}
```

- [ ] **Step 2: Commit template changes**

```bash
git add site/layout/all-members.html
git commit -m "feat: restructure member list template to two-tier"
```

### Task 2: Add Compact Card Styles

**Files:**
- Modify: `site/static/styles/main.css`

- [ ] **Step 1: Add new styles to `main.css`**

Append to the end of `site/static/styles/main.css`:

```css
/* Member Cards Two-Tier Styles */
.member-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
}
.member-card-compact {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, background 0.2s;
    background: rgba(255, 255, 255, 0.03);
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}
.member-card-compact:hover { 
    transform: translateY(-4px); 
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(0, 170, 254, 0.3);
}
.member-thumb {
    width: 120px;
    height: 120px;
    margin-bottom: 1rem;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(0, 170, 254, 0.2);
}
.member-thumb img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
}
.member-card-info-compact h3 {
    font-size: 1.1rem;
    margin: 0.5rem 0;
    color: #fff;
}
.member-designation-compact {
    font-size: 0.9rem;
    color: #a3c4ec;
    margin: 0;
}
```

- [ ] **Step 2: Commit style changes**

```bash
git add site/static/styles/main.css
git commit -m "style: add compact member card styles"
```

### Task 3: Verification

- [ ] **Step 1: Verify build**

Run build command if available, or visually inspect `all-members.html`.

- [ ] **Step 2: Final Commit (if needed)**

```bash
git commit --amend --no-edit
```
