# Chesstalk Web (Static MVP)

Pure static landing website for the Chesstalk Android app.

## Principles

- Framework-free (`HTML`, `CSS`, minimal vanilla `JS`)
- GitHub Pages compatible
- Mobile-first and lightweight
- No backend logic, build tooling, or dependencies

## Structure

- `index.html` - landing page with hero, features, screenshots, and footer links
- `404.html` - custom **Page not found** for GitHub Pages (same layout/theme as the rest of the site; keep at publish root next to `index.html`)
- `privacy.html` - privacy policy placeholder page
- `terms.html` - terms placeholder page
- `css/style.css` - shared site styling
- `js/main.js` - lightweight screenshot rotation (`screenshotGroups`); see **`assets/screenshots/README.md`** for architecture, two-layer crossfade rules, and how to add shots
- `assets/` - replaceable static assets

## Placeholder Content

- Play Store URL is a placeholder
- Contact email is `abc@example.com`
- Legal pages are placeholders for final legal copy
- Screenshots live under `assets/screenshots/{home,room,gameplay,other}/`. **Rotation is driven only by `screenshotGroups` in `js/main.js`** — files in folders are not auto-discovered. Full workflow, two-`<img>` crossfade rules, and troubleshooting: **`assets/screenshots/README.md`**
- Logo can be replaced in place with the same filename
