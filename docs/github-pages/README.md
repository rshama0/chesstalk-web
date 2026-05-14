# GitHub Pages Docs

GitHub Pages publishing workflow notes for **`chessbird-web`** live here.

## Before you publish

1. **Production metadata:** Sources already use **`https://chessbird.app`** for Open Graph, Twitter, canonical, favicon, and manifest. For a **Project Pages** URL (`https://user.github.io/repo/`), run the inject script so those absolute URLs match the preview host:

   ```bash
   cd chessbird-web
   npm install
   CHESSBIRD_PUBLIC_ORIGIN=https://yourusername.github.io/yourrepo npm run inject:public-origin
   ```

   **Custom domain** (e.g. `https://chessbird.app`): deploy the repo as-is; no inject required. Details: **`docs/hosting/README.md`**.

2. Keep **`404.html`** and **`index.html`** at the **site root** of the published output (GitHub Pages requirement).

3. Re-validate social previews after each deploy (platform caches vary).

## Related

- Hosting and OG checklist: `docs/hosting/README.md`
- Domain setup: `docs/domain/README.md`
