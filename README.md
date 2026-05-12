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
- `contact.html` - Contact form (FormSubmit → **hello@chesstalk.app**); success redirect → **`thank-you.html`**
- `thank-you.html` - Branded post-submit page after FormSubmit completes
- `privacy.html` - privacy policy placeholder page
- `terms.html` - terms placeholder page
- `css/style.css` - shared site styling
- `js/main.js` - lightweight screenshot rotation (`screenshotGroups`); see **`assets/screenshots/README.md`** for architecture, two-layer crossfade rules, and how to add shots
- `assets/` - replaceable static assets

## Contact form (FormSubmit)

- Submissions go to **hello@chesstalk.app** via [FormSubmit](https://formsubmit.co/) (`contact.html` form `action`).
- **First-time activation:** FormSubmit sends a **confirmation link** to that inbox the first time the form is used (or when the endpoint is new). You must **open the email and confirm** before messages are delivered. Until then, submissions may not arrive — use this as a launch checklist item.
- After a successful submit (including FormSubmit’s built-in CAPTCHA step), users are redirected to **`thank-you.html`** (`_next` hidden field, URL built in `contact.html` so it works on GitHub Pages).
- **Spam:** Honeypot field `_honey` (hidden, leave empty) plus FormSubmit’s default CAPTCHA; do not add `_captcha=false` unless you intentionally disable it.

## Placeholder Content

- Play Store URL is a placeholder
- Legal body copy may still use placeholder addresses where noted; site footers and contact flow use **hello@chesstalk.app**
- Legal pages are placeholders for final legal copy
- Screenshots live under `assets/screenshots/{home,room,gameplay,other}/`. **Rotation is driven only by `screenshotGroups` in `js/main.js`** — files in folders are not auto-discovered. Full workflow, two-`<img>` crossfade rules, and troubleshooting: **`assets/screenshots/README.md`**
- Logo can be replaced in place with the same filename
