# Design: Formalize Announcements Collection

Formalize announcements as a collection to allow listing and future growth.

## Architecture

- **Content**: `site/content/announcements/` contains individual posts and an index.
- **Layout**: `all-announcements.html` handles the list view.
- **Config**: `config.json` maps index to layout and updates navigation.

## Components

### 1. `site/content/announcements/latest.md`
- Add `date: "2026-05-18"`
- Add `collections: ["announcements"]`

### 2. `site/content/announcements/index.md`
- Frontmatter: `title: Announcements`, `layout: all-announcements`

### 3. `site/layout/all-announcements.html`
- Cloned from `all-posts.html`.
- Filters for `collections/announcements.html`.
- Uses `niri-logic` partial.

### 4. `site/layout/config.json`
- `collectionLayouts`: `"collections/announcements.html": "all-announcements"`
- `navbar`: `{"Announcements": "collections/announcements.html"}`

## Verification

- Check file existence.
- Verify `config.json` JSON validity.
- Git commit as proof.
