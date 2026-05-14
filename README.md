# ChessBird Web (Static MVP)

Pure static landing website for the ChessBird Android app.

## Principles

- Framework-free (`HTML`, `CSS`, minimal vanilla `JS`) for the shipped site
- GitHub Pages compatible
- Mobile-first and lightweight
- **Metadata:** HTML and **`site.webmanifest`** ship pinned to **`https://chessbird.app`** for Open Graph, Twitter/X, canonical, favicon, and manifest. **`npm run inject:public-origin`** is only needed to **rewrite** those URLs for a non-production host (e.g. `github.io` preview); see **`docs/hosting/README.md`**. `npm install` only adds the tiny script runner in `package.json`.

## Structure

- `index.html` - landing page with hero, features, screenshots, and footer links
- `404.html` - custom **Page not found** for GitHub Pages (same layout/theme as the rest of the site; keep at publish root next to `index.html`)
- `contact.html` - Contact form (FormSubmit → **hello@chessbird.app**); success redirect → **`thank-you.html`**
- `thank-you.html` - Branded post-submit page after FormSubmit completes
- `privacy.html` - privacy policy
- `terms.html` - terms of use
- `css/style.css` - shared site styling
- `js/main.js` - lightweight screenshot rotation (`screenshotGroups`); see **`assets/screenshots/README.md`** for architecture, two-layer crossfade rules, and how to add shots
- `assets/` - replaceable static assets
- `favicon.ico` - root ICO for default browser `/favicon.ico` requests
- `assets/branding/` - favicon PNGs, Apple touch icon, manifest icons (see **`assets/branding/README.md`**)

## Contact form (FormSubmit)

- Submissions go to **hello@chessbird.app** via [FormSubmit](https://formsubmit.co/) (`contact.html` form `action`).
- **First-time activation:** FormSubmit sends a **confirmation link** to that inbox the first time the form endpoint is used. You must **open the email and confirm** before messages are delivered. If you already confirmed an inbox for a **previous** contact domain, switching to **hello@chessbird.app** requires **confirming again** for the new address.
- After a successful submit (including FormSubmit’s built-in CAPTCHA step), users are redirected to **`https://chessbird.app/thank-you.html`** (`_next` hidden field). Form subject line is still prefixed on submit via a small inline script in `contact.html`.
- **Spam:** Honeypot field `_honey` (hidden, leave empty) plus FormSubmit’s default CAPTCHA; do not add `_captcha=false` unless you intentionally disable it.

## Repository

The GitHub repository is **`chessbird-web`**. Your local clone folder name may differ; keep **`404.html`** and **`index.html`** at the **published site root** for Pages.

## Placeholder Content

- Play Store URL uses a sample package id (`com.example.chessbird`); replace with the live listing when ready.
- Legal pages may still include bracketed placeholders (e.g. support URL) where noted; site footers and contact flow use **hello@chessbird.app**.
- Screenshots live under `assets/screenshots/{home,room,gameplay,other}/`. **Rotation is driven only by `screenshotGroups` in `js/main.js`** — files in folders are not auto-discovered. Full workflow, two-`<img>` crossfade rules, and troubleshooting: **`assets/screenshots/README.md`**
- Logo can be replaced in place with the same filename
