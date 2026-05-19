# Branding & favicon assets

Raster icons for **favicons**, **Apple touch**, **Open Graph / Twitter** previews, and **`site.webmanifest`** live here. Paths are referenced from the site root (see HTML `<head>` and root `site.webmanifest`).

## Files

| File | Role |
|------|------|
| `favicon-96x96.png` | Modern `rel="icon"` PNG (`sizes="96x96"`). |
| `apple-touch-icon.png` | iOS / Safari “Add to Home Screen” (180×180). |
| `web-app-manifest-192x192.png` | Manifest icon (192). |
| `web-app-manifest-512x512.png` | Manifest icon (512). |
| `og-image.jpg` | **Shared** Open Graph + Twitter preview image (`og:image` / `twitter:image` on all pages). Production asset: **1200×630** JPEG (~80KB). Update `og:image:width` / `og:image:height` in HTML/JS if you replace it. |
| `og-image-source-1730x909.png` | Optional design master (not linked in HTML); regenerate JPEG with your toolchain. |

## Root `favicon.ico`

Many clients request **`/favicon.ico`** by convention. A multi-resolution ICO stays at the **repository root** (`chessbird-web/favicon.ico`), not under `assets/`, so that request resolves without extra server rules.

## What we intentionally omit

- **`favicon.svg`** — not linked in production HTML (can be large; raster set is enough for MVP).
- **browserconfig.xml**, extra PNG sizes, and heavy PWA surfaces — not required for this static site.

## Regenerating art

Replace the PNG/ICO files while keeping the same filenames so HTML and the manifest stay stable. For **GitHub Pages preview** or another host, run `npm run inject:public-origin` with `CHESSBIRD_PUBLIC_ORIGIN` set (see `docs/hosting/README.md`) to rewrite pinned **`https://chessbird.app`** strings in HTML/manifest; in-page links and manifest icon paths are **root-relative** (`/assets/branding/…`).
