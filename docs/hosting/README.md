# Hosting Docs

Static site hosting notes for **`chessbird-web`** live here.

## Open Graph, Twitter/X, favicon, and manifest (absolute URLs)

Shipped HTML pins **`https://chessbird.app`** (no trailing slash) for:

- **`og:url`**, **`og:title`**, **`og:description`**, **`og:image`**, **`og:image:alt`**, **`og:type`**, **`og:site_name`**
- **`twitter:card`**, **`twitter:title`**, **`twitter:description`**, **`twitter:image`**
- **`link rel="canonical"`**, favicon / **`apple-touch-icon`**, **`manifest`** document URL
- **`theme-color`**, **`apple-mobile-web-app-title`**, **`application-name`**, **`mobile-web-app-capable`**

**`site.webmanifest`** uses root-relative **`start_url`** and **`icons[].src`** (`/index.html`, `/assets/branding/…`) so the installed scope tracks the served origin; **`npm run inject:public-origin`** still replaces any remaining **`https://chessbird.app`** substrings inside the manifest if you add them later.

Crawlers (WhatsApp, Telegram, Discord, X, LinkedIn, Facebook, Slack) need **fully qualified HTTPS** asset URLs; the repo matches production so previews work without a build step.

**In-page navigation** (header, footer, legal links, stylesheets, scripts, and most images) uses **root-relative** paths (`/contact.html`, `/assets/...`, `/css/style.css`), which suit a **custom-domain apex** or a **`username.github.io` user site**. **Project Pages** at `username.github.io/reponame/` may need a documented `<base href="…/reponame/">` (see `404.html` footer comment) or publishing from `docs/` so `/…` resolves under the repo.

### Shared social image

All pages use **`https://chessbird.app/assets/branding/og-image.png`** for **`og:image`** and **`twitter:image`**. Replace that file (and optional width/height meta) when you ship a final art pass.

### Optional: GitHub Pages preview / alternate origin

If you serve the same files from **`https://user.github.io/repo/`** (or another host), re-root absolute URLs:

```bash
npm install
CHESSBIRD_PUBLIC_ORIGIN=https://user.github.io/yourrepo npm run inject:public-origin
```

The script **`scripts/inject-public-origin.mjs`** replaces every **`https://chessbird.app`** in the listed HTML files and **`site.webmanifest`** (metadata and pinned asset URLs). It does **not** rewrite root-relative internal links (`/contact.html`, etc.); use an apex or user-site deploy, or add `<base href>`, for Project Pages under a subpath.

- If **`CHESSBIRD_PUBLIC_ORIGIN` is unset**, the script **does nothing** (production URLs stay).
- If it **equals** `https://chessbird.app`, no rewrite is needed.

**Reference:** `env.example` in the **`chessbird-web`** repo root.

### After deploy

- Re-scrape URLs with **Facebook Sharing Debugger**, **Twitter Card Validator**, **LinkedIn Post Inspector**, etc. Preview caches can lag.

## Related

- GitHub Pages workflow: `docs/github-pages/README.md`
- Domain/DNS: `docs/domain/README.md`
