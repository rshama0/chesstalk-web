/**
 * Replaces __CHESSBIRD_PUBLIC_ORIGIN__ in static HTML + site.webmanifest with an absolute origin.
 *
 * Usage (production deploy):
 *   CHESSBIRD_PUBLIC_ORIGIN=https://www.your-domain.com npm run inject:public-origin
 *
 * Same variable name as optional Android/web docs; falls back to PUBLIC_APP_BASE_URL.
 *
 * If unset: token is removed so paths become root-relative (/assets/...), which is fine for
 * local static servers but NOT ideal for OG crawlers — set CHESSBIRD_PUBLIC_ORIGIN in prod CI.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const origin = String(process.env.CHESSBIRD_PUBLIC_ORIGIN || process.env.PUBLIC_APP_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");

const files = [
  "index.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "404.html",
  "thank-you.html",
  "site.webmanifest",
];

if (!origin) {
  process.stderr.write(
    "[inject-public-origin] CHESSBIRD_PUBLIC_ORIGIN (or PUBLIC_APP_BASE_URL) unset — replacing token with empty string (root-relative URLs).\n",
  );
}

for (const name of files) {
  const fp = path.join(root, name);
  if (!fs.existsSync(fp)) continue;
  const before = fs.readFileSync(fp, "utf8");
  const after = before.replace(/__CHESSBIRD_PUBLIC_ORIGIN__/g, origin);
  if (after !== before) {
    fs.writeFileSync(fp, after, "utf8");
    process.stdout.write(`[inject-public-origin] updated ${name}\n`);
  }
}
