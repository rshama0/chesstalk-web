# GitHub Pages Docs

GitHub Pages publishing workflow notes for **`chessbird-web`** live here.

## Before you publish

1. **Absolute metadata URLs:** HTML and `site.webmanifest` ship with the placeholder **`__CHESSBIRD_PUBLIC_ORIGIN__`**. Before building or committing the **published** branch, run the inject script so Open Graph / Twitter / favicon / manifest URLs are full `https://yourusername.github.io/...` (or your custom domain).

   ```bash
   cd chessbird-web
   npm install
   CHESSBIRD_PUBLIC_ORIGIN=https://yourusername.github.io npm run inject:public-origin
   ```

   For a **custom domain**, use that origin (e.g. `https://www.chessbird.app`). Details: **`docs/hosting/README.md`**.

2. Keep **`404.html`** and **`index.html`** at the **site root** of the published output (GitHub Pages requirement).

3. Re-validate social previews after each deploy (platform caches vary).

## Related

- Hosting and OG checklist: `docs/hosting/README.md`
- Domain setup: `docs/domain/README.md`
