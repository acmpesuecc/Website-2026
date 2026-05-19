# Design Doc: Members Directory and List Headers Improvement

## Goal
Organize members into two categories (Core and Club), implement role-based sorting for Core, create compact list cards that link to detailed profiles, and add consistent, attractive headers to all collection list pages.

## 1. Directory Structure & Content
### Subfolders
- `site/content/members/core/`: Files for Chair, Vice Chair, etc.
- `site/content/members/club/`: Files for general club members.

### Frontmatter Updates (Member Profiles)
New fields for all members:
- `tagline`: Short personal motto or description.
- `hobbies`: List of strings.
- `interesting_info`: Longer text with fun facts.
- `previewImage`: (Existing) Path to profile picture.
- `description`: (Existing) The Role (e.g., "Webmaster").

## 2. Layout: Members List (`all-members.html`)
### Design
- Two distinct sections: "Core Team" and "Club Members".
- **Compact Cards**:
    - Image (square or circular).
    - Name (h3).
    - Role (span/p).
    - Entire card is a link to the member's profile page.
    - No social icons or description text in the list view.

### Sorting Logic
- **Core Team**: Ordered by role:
    1. Chair
    2. Vice Chair
    3. Secretary
    4. Treasurer
    5. Membership Chair
    6. Webmaster
- **Club Members**: Ordered alphabetically by Name.

## 3. Layout: Individual Profile (`page.html`)
### Enhancements
When a page is in the `members` collection:
- **Header Section**: Large image, Name, Role.
- **Tagline**: Italicized or highlighted text below the name.
- **Content Grid**:
    - **About Me**: Body content from the markdown file.
    - **Stats/Info**: Hobbies and Interesting Info.
- **Socials**: Row of standard-sized icons (Github, LinkedIn, Instagram) at the bottom or side.

## 4. Collection List Headers
Improve headers for `all-posts.html`, `all-events.html`, and `all-announcements.html`.
- Add a hero section to each list page.
- **Title**: Large, bold (e.g., "Our Blog", "Upcoming Events").
- **Description**: Subtitle explaining the collection content.
- Consistent styling with a separator or subtle background color.

## Verification
- Confirm member cards link to correct profiles.
- Confirm Core roles follow the specified order.
- Verify profile pages display all new fields (tagline, hobbies, etc.).
- Verify headers appear on Blog, Events, and Announcement list pages.
