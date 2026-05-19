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

## Local preview (Live Server / VS Code)

The site uses **relative** asset paths (`css/style.css`, `assets/…`) on normal pages so CSS loads whether Live Server’s root is the `chessbird-web` folder or a parent repo folder. **`404.html` keeps root-absolute `/js/…` scripts** because GitHub Pages serves it for URLs like `/play/482019` (the browser path is still `/play/…`, not `/404.html`).

1. **Open the `chessbird-web` folder** in VS Code (recommended), then **Go Live** on `index.html`.
2. **Invite landing locally:** Live Server does not emulate GitHub Pages `404.html` routing, so `/play/482019` will not work offline. Use:
   - **`play-preview.html?room=482019`** (six digits) — same invite UI + CSS as production.
3. If styles still fail, confirm the browser is not loading from the wrong folder (URL should contain `/chessbird-web/` only when the parent folder is the Live Server root).

Production deploy is unchanged: `https://chessbird.app/play/:roomId` is served via **`404.html`** on GitHub Pages.

## Invite links (`/play/:roomId`)

Invite URLs stay on the marketing host:

`https://chessbird.app/play/482019` (six-digit room code)

GitHub Pages has no dynamic routes, so **`404.html`** loads **`js/play-invite-bootstrap.js`**, which `document.write`s a full HTML invite page (OG/Twitter meta, branded fallback, Open in App / Get the App). Social crawlers receive title, description, and **`/assets/branding/og-image.png`** from that response.

| Concern | Where it lives |
|--------|----------------|
| Link previews (WhatsApp, Telegram, Discord, X) | `chessbird.app` via 404 bootstrap |
| Android App Links | `/.well-known/assetlinks.json` + app manifest `https://chessbird.app/play/` |
| Optional session-server OG (if `/play` is proxied to Railway) | `chessbird-server` `GET /play/:roomId` — set **`PUBLIC_APP_BASE_URL=https://chessbird.app`** |

### Android App Links (`.well-known`)

GitHub Pages runs **Jekyll** by default. Jekyll **does not publish** dot-directories such as **`.well-known/`**, so the file can exist in git while **`https://chessbird.app/.well-known/assetlinks.json` returns 404**. Android then cannot verify the domain and invite links stay in the browser.

**Fix (required):** keep an empty **`.nojekyll`** file at the site root (disables Jekyll; static files deploy as-is).

**After deploy, confirm:**

1. `https://chessbird.app/.well-known/assetlinks.json` → **HTTP 200**, valid JSON, `Content-Type: application/json` (or `text/plain`).
2. `package_name` is **`com.chessbird.app`**.
3. **`sha256_cert_fingerprints`** includes the **Play App Signing** certificate SHA-256 (Play Console → App integrity). Add upload-key SHA only if you sideload builds signed with it.
4. Purge **Cloudflare** cache for `/.well-known/assetlinks.json` if the URL still 404s after Pages deploy.
5. On device: Settings → Apps → ChessBird → **Open by default** → add/verify links, or reinstall the app to re-run verification.

**Manual checks after deploy:**

1. Open `https://chessbird.app/play/123456` in a browser — room code visible, **Play Now** CTA works.
2. Share the URL in WhatsApp/Telegram — preview shows ChessBird image and title (not a blank card).
3. With the app installed, tap the link — app opens, room code prefilled, user taps **Join** (no auto-join).

## Related

- GitHub Pages workflow: `docs/github-pages/README.md`
- Domain/DNS: `docs/domain/README.md`
