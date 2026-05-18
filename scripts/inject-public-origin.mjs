/**
 * Rewrites pinned production absolute URLs (`https://chessbird.app`) in static HTML + `site.webmanifest`
 * when `CHESSBIRD_PUBLIC_ORIGIN` or `PUBLIC_APP_BASE_URL` is set to a different origin (e.g. GitHub Pages
 * preview `https://user.github.io/repo` or a staging host).
 *
 * Shipped sources use **https://chessbird.app** for Open Graph, Twitter, canonical, favicon, manifest
 * reference URL, and icon `src` values where pinned for crawlers. In-page navigation and most static
 * asset paths in HTML use **root-relative** `/…` URLs (not rewritten by this script).
 *
 * Usage:
 *   CHESSBIRD_PUBLIC_ORIGIN=https://user.github.io/myrepo npm run inject:public-origin
 *
 * If the env var is **unset**, the script exits without changes (production URLs remain).
 * If the env var equals `https://chessbird.app`, no rewrite is needed.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const PRODUCTION_ORIGIN = "https://chessbird.app";

const raw = String(process.env.CHESSBIRD_PUBLIC_ORIGIN || process.env.PUBLIC_APP_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");

const files = [
  "index.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "404.html",
  "js/play-invite-bootstrap.js",
  "thank-you.html",
  "site.webmanifest",
];

if (!raw) {
  process.stderr.write(
    `[inject-public-origin] No CHESSBIRD_PUBLIC_ORIGIN — leaving pinned ${PRODUCTION_ORIGIN} URLs unchanged.\n`,
  );
  process.exit(0);
}

if (raw === PRODUCTION_ORIGIN) {
  process.stderr.write(`[inject-public-origin] origin is production; no changes.\n`);
  process.exit(0);
}

const esc = PRODUCTION_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const prodRe = new RegExp(esc, "g");

for (const name of files) {
  const fp = path.join(root, name);
  if (!fs.existsSync(fp)) continue;
  const before = fs.readFileSync(fp, "utf8");
  let after = before.replace(/__CHESSBIRD_PUBLIC_ORIGIN__/g, raw);
  after = after.replace(prodRe, raw);
  if (after !== before) {
    fs.writeFileSync(fp, after, "utf8");
    process.stdout.write(`[inject-public-origin] updated ${name}\n`);
  }
}
