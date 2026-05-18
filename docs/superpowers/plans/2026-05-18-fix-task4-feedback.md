# Task 4 Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve Task 4 reviewer feedback by fixing CSS variables, ensuring header consistency, and optimizing gradient stops.

**Architecture:** Surgical CSS updates and template modifications to maintain design system integrity.

**Tech Stack:** HTML, CSS (Vanilla)

---

### Task 1: Research CSS Variables

**Files:**
- Read: `site/static/styles/main.css`

- [ ] **Step 1: Identify correct variables**
Check for `--color-border`, `--color-text-dim`, and any white color variables.

### Task 2: Fix CSS Variables in `main.css`

**Files:**
- Modify: `site/static/styles/main.css`

- [ ] **Step 1: Define or replace undefined variables**
Replace `var(--border-color)` and `var(--text-muted)` with project-standard variables.
- [ ] **Step 2: Use variable for white in gradients (optional)**
If a variable like `--color-bg` or `--white` exists, use it instead of `#fff`.

### Task 3: Update `all-members.html` Hero Header

**Files:**
- Modify: `site/layout/all-members.html`

- [ ] **Step 1: Replace existing header with collection-hero**
Replace `<h2>{{$PageData.Frontmatter.Title}}</h2>` with the revised hero block.

### Task 4: Verification and Commit

- [ ] **Step 1: Verify changes in browser (if possible) or via local build**
- [ ] **Step 2: Commit changes**

```bash
git add site/static/styles/main.css site/layout/all-members.html
git commit -m "style: fix undefined css variables and header consistency in Task 4"
```
