# Design Doc: Improve Pages and Templates

## Goal
Improve formatting and information density for blogs, members, events, and announcements. Reduce layout code duplication.

## 1. Layout Refactor
### Niri Logic Extraction
Move inline JS from `<body>` in `page.html`, `all-posts.html`, `all-members.html`, and `all-events.html` to `site/layout/partials/niri-logic.html`.
Include via `{{template "niri-logic" .}}`.

## 2. Page Metadata Enhancement
### `site/layout/page.html`
- Show `Date` and `Authors` list for blogs/events.
- Show `Tags` as pill-style links.
- Style with CSS in `site/static/styles/main.css`.

## 3. List Views Enhancement
### `all-posts.html` & `all-events.html`
- Add `Tags` to cards.
- Improve card spacing and font sizes.

## 4. Announcement System
### Collection Setup
- Move `site/content/announcement.md` -> `site/content/announcements/latest.md`.
- Create `site/content/announcements/index.md`.
- Create `site/layout/all-announcements.html` based on `all-posts`.
- Update `site/layout/config.json` to include announcements collection.

## 5. Directory & Navigation
- Link "Announcements" in navbar to `collections/announcements.html`.
- Link "Members" in navbar to `collections/members.html` directly (removing the intermediate `members.html` manual list if redundant).

## Verification
- Build site.
- Check metadata render on blog posts.
- Check tag render on list pages.
- Check announcement history list.
