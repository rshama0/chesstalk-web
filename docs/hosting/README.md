# Hosting Docs

Static site hosting notes for **`chessbird-web`** live here.

## Open Graph, Twitter/X, favicon, and manifest (absolute URLs)

HTML and `site.webmanifest` use a single placeholder token: **`__CHESSBIRD_PUBLIC_ORIGIN__`** (no trailing slash). Crawlers (WhatsApp, Telegram, Discord, X, LinkedIn, Facebook, Slack) expect **fully qualified** `https://…` URLs in **`og:image`**, **`og:url`**, **`twitter:image`**, **`link rel="canonical"`**, favicon / **`apple-touch-icon`**, and **`manifest`** `href` / icon `src` values.

### Production deploy

1. Set your public site origin, e.g. `https://www.chessbird.app` (HTTPS, no trailing slash).
2. From the **`chessbird-web`** repo root, run:

   ```bash
   npm install
   CHESSBIRD_PUBLIC_ORIGIN=https://www.chessbird.app npm run inject:public-origin
   ```

   The script **`scripts/inject-public-origin.mjs`** replaces every **`__CHESSBIRD_PUBLIC_ORIGIN__`** in the listed HTML files and **`site.webmanifest`**. You can use **`PUBLIC_APP_BASE_URL`** instead of **`CHESSBIRD_PUBLIC_ORIGIN`** (same effect).

3. Deploy the **resulting** files (or run the same command in CI before uploading to static hosting).

If the env var is **unset**, the script removes the token so URLs become **root-relative** (e.g. `/assets/icons/...`) — fine for quick local static servers; **not** ideal for social previews. Always inject before production publish.

**Reference:** `env.example` in the **`chessbird-web`** repo root lists the variable.

### After deploy

- Re-scrape URLs with **Facebook Sharing Debugger**, **Twitter Card Validator**, **LinkedIn Post Inspector**, etc. Preview caches can lag.

## Related

- GitHub Pages workflow: `docs/github-pages/README.md`
- Domain/DNS: `docs/domain/README.md`
