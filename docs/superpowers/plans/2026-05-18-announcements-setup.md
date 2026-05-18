# Formalize Announcements Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formalize announcements as a collection with a listing page and updated navigation.

**Architecture:** Use collection layouts and config mapping to transition from a standalone page to a collection.

**Tech Stack:** HTML (Templates), Markdown, JSON.

---

### Task 1: Update Latest Announcement Frontmatter

**Files:**
- Modify: `site/content/announcements/latest.md`

- [ ] **Step 1: Add date and collections to frontmatter**

```markdown
---
title: Announcement
description: Official announcement from ACM PESUECC
date: "2026-05-18"
collections: ["announcements"]
---
```

- [ ] **Step 2: Verify frontmatter**

Run: `cat site/content/announcements/latest.md`
Expected: Frontmatter updated.

- [ ] **Step 3: Commit**

```bash
git add site/content/announcements/latest.md
git commit -m "feat: add collection metadata to latest announcement"
```

### Task 2: Create Announcements Index

**Files:**
- Create: `site/content/announcements/index.md`

- [ ] **Step 1: Create index file with collection layout**

```markdown
---
title: Announcements
layout: all-announcements
---
```

- [ ] **Step 2: Verify file existence**

Run: `ls site/content/announcements/index.md`
Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add site/content/announcements/index.md
git commit -m "feat: create announcements index"
```

### Task 3: Create all-announcements Layout

**Files:**
- Create: `site/layout/all-announcements.html`
- Read: `site/layout/all-posts.html`

- [ ] **Step 1: Clone all-posts.html and adjust for announcements**

```html
{{ define "all-announcements"}}
{{$PageData := index .DeepDataMerge.Collections .PageURL}}
{{ template "head" .}}
{{template "niri-logic" .}}
    <main class="niri-vertical-track" id="niri-track-v">
        <div class="niri-horizontal-track" id="niri-track-h-root">
            <section class="niri-window" id="root-window" role="main" tabindex="-1">
                <div class="container site-main">
                    <article class="content">
                    <section class="blogs-list">
                        {{range $key, $posts := .DeepDataMerge.CollectionsMap}}
                            {{if eq $key "collections/announcements.html"}}
                                {{range $Post := $posts}}
                                    {{if ne $Post.Frontmatter.Title "anna"}}
                        <a class="blog-card" href="/{{$Post.CompleteURL}}" fx-action="/{{$Post.CompleteURL}}">
                            <div class="blog-card-inner">
                                <div class="blog-thumb">
                                    {{ if $Post.Frontmatter.PreviewImage }}
                                        <img src="{{$Post.Frontmatter.PreviewImage}}" alt="pixel art"/>
                                    {{ else }}
                                        <img src="/static/images/placeholder.png" alt="pls tell me what to put here"/>
                                    {{ end }}
                                </div>
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
                            </div>
                        </a>
                                    {{end}}
                                {{end}}
                            {{end}}
                        {{end}}
                    </section>
                    </article>
                </div>
            </section>
        </div>
        
    </main>
    {{template "footer" .}}
</body>
</html>
{{ end}}
```

- [ ] **Step 2: Verify define name and collection key**

Run: `grep "all-announcements" site/layout/all-announcements.html && grep "collections/announcements.html" site/layout/all-announcements.html`
Expected: Matches found.

- [ ] **Step 3: Commit**

```bash
git add site/layout/all-announcements.html
git commit -m "feat: create all-announcements layout"
```

### Task 4: Update Site Configuration

**Files:**
- Modify: `site/layout/config.json`

- [ ] **Step 1: Update collectionLayouts and navbar**

Update `collectionLayouts` to include:
`"collections/announcements.html": "all-announcements"`

Update `navbar` Announcements link to:
`"collections/announcements.html"`

- [ ] **Step 2: Verify JSON validity**

Run: `jq . site/layout/config.json`
Expected: Valid JSON output.

- [ ] **Step 3: Commit**

```bash
git add site/layout/config.json
git commit -m "feat: update config for announcements collection"
```
