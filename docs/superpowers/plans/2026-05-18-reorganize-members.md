# Reorganize Member Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize member files into subdirectories and update metadata.

**Architecture:** Moving files into `core/` and `club/` subdirectories under `site/content/members/`. Updating frontmatter for each moved file.

**Tech Stack:** Bash, Markdown, Git.

---

### Task 1: Scaffolding and File Movement

**Files:**
- Create: `site/content/members/core/`
- Create: `site/content/members/club/`
- Move: `site/content/members/Vinaayak.md` -> `site/content/members/core/Vinaayak.md`
- Move: `site/content/members/Ashmita.md` -> `site/content/members/core/Ashmita.md`
- Move: `site/content/members/Lakshit.md` -> `site/content/members/core/Lakshit.md`
- Move: `site/content/members/Shivangi.md` -> `site/content/members/core/Shivangi.md`
- Move: `site/content/members/Saankhya.md` -> `site/content/members/core/Saankhya.md`
- Move: `site/content/members/Andey.md` -> `site/content/members/core/Andey.md`
- Move: `site/content/members/Bhuvigna.md` -> `site/content/members/core/Bhuvigna.md`
- Move: `site/content/members/FirstLastName.md` -> `site/content/members/club/FirstLastName.md`

- [ ] **Step 1: Create directories**
Run: `mkdir -p site/content/members/core site/content/members/club`

- [ ] **Step 2: Move core members**
Run: `mv site/content/members/{Vinaayak,Ashmita,Lakshit,Shivangi,Saankhya,Andey,Bhuvigna}.md site/content/members/core/`

- [ ] **Step 3: Move club members**
Run: `mv site/content/members/FirstLastName.md site/content/members/club/`

- [ ] **Step 4: Verify movement**
Run: `ls -R site/content/members/`

### Task 2: Update Metadata for Core Members

**Files:**
- Modify: `site/content/members/core/*.md`

- [ ] **Step 1: Update Vinaayak.md**
Add tagline, hobbies, interesting_info. Set description to "Chair". Ensure collections: ["members"].

- [ ] **Step 2: Update Ashmita.md**
Add tagline, hobbies, interesting_info. Set description to "Vice Chair". Ensure collections: ["members"].

- [ ] **Step 3: Update Lakshit.md**
Add tagline, hobbies, interesting_info. Set description to "Secretary". Ensure collections: ["members"].

- [ ] **Step 4: Update Shivangi.md**
Add tagline, hobbies, interesting_info. Set description to "Treasurer". Ensure collections: ["members"].

- [ ] **Step 5: Update Saankhya.md**
Add tagline, hobbies, interesting_info. Set description to "Webmaster". Ensure collections: ["members"].

- [ ] **Step 6: Update Andey.md**
Add tagline, hobbies, interesting_info. Set description to "Webmaster". Ensure collections: ["members"].

- [ ] **Step 7: Update Bhuvigna.md**
Add tagline, hobbies, interesting_info. Set description to "Membership Chair". Ensure collections: ["members"].

### Task 3: Update Metadata for Club Members

**Files:**
- Modify: `site/content/members/club/FirstLastName.md`

- [ ] **Step 1: Update FirstLastName.md**
Add tagline, hobbies, interesting_info. Set description to "Club Member". Ensure collections: ["members"].

### Task 4: Final Verification and Commit

- [ ] **Step 1: Run final check**
Run: `grep -r "tagline" site/content/members/`

- [ ] **Step 2: Commit changes**
Run: `git add site/content/members/ && git commit -m "chore: reorganize member content into core and club subdirectories"`
