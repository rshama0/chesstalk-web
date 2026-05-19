# Invite link Open Graph / social previews

## Diagnosis summary (production)

| Finding | Impact |
|--------|--------|
| **`GET /play/:roomId` returns HTTP 404** on GitHub Pages | GitHub Pages serves `404.html` for unknown paths; status stays **404**. Some scrapers still read OG tags; others (WhatsApp, Facebook) are **more reliable with 200**. |
| **OG image was ~1.5MB PNG at 1730×909** while meta claimed **512×512** | Slow/failed fetches, dimension mismatch, weak `summary_large_image` behavior. |
| **`document.write` invite page** | Browsers get full invite UI; **non-JS crawlers** only see the initial `404.html` `<head>`. |
| **Homepage `index.html` returns 200** | Explains why `https://chessbird.app` previews work while `/play/…` was inconsistent. |

## What we ship

1. **`404.html`** — complete static OG/Twitter tags in `<head>` (no JS required for basic preview).
2. **`js/og-social.js`** — synchronously sets room-specific `og:title`, `og:url`, and canonical for `/play/######` before bootstrap runs (helps JS-capable scrapers).
3. **`assets/branding/og-image.jpg`** — **1200×630**, ~80KB JPEG; meta `og:image:width` / `height` match.
4. **`cloudflare/play-invite-og-worker.mjs`** (optional) — returns **HTTP 200** + room-specific OG HTML **only for crawler User-Agents**; humans still get GitHub Pages `404.html` + invite UI.

## WhatsApp not showing previews (homepage or invites)

This is usually **not** “WhatsApp is broken” — it is one of:

| Cause | Check |
|--------|--------|
| **Stale WhatsApp/Meta cache** | After any OG fix, run [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) on the exact URL you share, click **Scrape Again**, wait 2–5 minutes, then share in WhatsApp. |
| **`og:url` ≠ shared URL** | Homepage must use `https://chessbird.app/` in `og:url` and canonical when users share the apex URL (not `/index.html`). |
| **Invite URL is HTTP 404** | `GET /play/482019` is **404** on GitHub Pages. DebugBear may show “no OG data”; WhatsApp is stricter. Deploy `cloudflare/chessbird-og-worker.mjs`. |
| **OG image returns 206** | Meta/WhatsApp often send `Range:`; GitHub Pages returns **206 Partial Content**. Deploy the worker route for `og-image.jpg` so bots get **200** + full file. |
| **Cloudflare Bot Fight** | In Cloudflare → Security, ensure **Bot Fight Mode** / aggressive rules do not block `facebookexternalhit` or `WhatsApp`. |

Test image for bots:

```bash
curl -sI -A "facebookexternalhit/1.1" -H "Range: bytes=0-1023" https://chessbird.app/assets/branding/og-image.jpg
```

Without the worker you may see `HTTP/1.1 206`. After the worker: `200` and no `Content-Range` header.

## Deploy checklist

1. Push `chessbird-web` and confirm Pages deploy.
2. Verify:
   - `https://chessbird.app/assets/branding/og-image.jpg` → **200**, `Content-Type: image/jpeg`, loads quickly.
   - `https://chessbird.app/play/482019` → body from invite (browser); OG tags in view-source `<head>`.
3. **Cloudflare (required for reliable WhatsApp):** deploy `cloudflare/chessbird-og-worker.mjs` with routes:
   - `chessbird.app/play/*`
   - `chessbird.app/assets/branding/og-image.jpg`  
   Purge cache for those paths.
4. **Re-scrape** (platform caches are sticky):
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter/X Card Validator](https://cards-dev.twitter.com/validator)
   - LinkedIn Post Inspector  
   Re-scrape each invite URL after deploy.

## Optional: proxy `/play` to session server

`chessbird-server` exposes `GET /play/:roomId` (200 + OG HTML). If Cloudflare routes only `/play/*` to Railway, set `PUBLIC_APP_BASE_URL=https://chessbird.app`. Static site + App Links remain on Pages.

## Local testing

Live Server does not emulate Pages 404 routing. Use **`play-preview.html?room=482019`**. Inspect `<head>` meta in view-source; compare with production `view-source:https://chessbird.app/play/482019` after deploy.
