/**
 * Optional Cloudflare Worker: HTTP 200 + room-specific OG HTML for social crawlers.
 *
 * GitHub Pages always returns 404 for /play/:roomId (404.html body). Many scrapers
 * still parse OG tags from 404 responses, but WhatsApp/Facebook are more reliable
 * with status 200. Humans keep the normal 404.html + JS invite flow.
 *
 * Deploy: Workers & Pages → Create Worker → paste/adapt this script → Route:
 *   chessbird.app/play/*
 * Purge CDN cache for /assets/branding/og-image.jpg after deploy.
 */

const CRAWLER_UA =
  /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|Discordbot|TelegramBot|Googlebot|bingbot|Pinterest|Embedly|vkShare|W3C_Validator/i;

const SITE = "https://chessbird.app";
const OG_IMAGE = `${SITE}/assets/branding/og-image.jpg`;
const OG_W = "1200";
const OG_H = "630";
const DESC =
  "Join a ChessBird chess room and play together with voice.";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function crawlerOgHtml(roomId) {
  const pageUrl = `${SITE}/play/${roomId}`;
  const title = `Join room ${roomId} on ChessBird`;
  const t = escapeHtml(title);
  const d = escapeHtml(DESC);
  const u = escapeHtml(pageUrl);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${t}</title>
<meta name="description" content="${d}" />
<link rel="canonical" href="${u}" />
<meta property="og:site_name" content="ChessBird" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${u}" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:image" content="${OG_IMAGE}" />
<meta property="og:image:secure_url" content="${OG_IMAGE}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="${OG_W}" />
<meta property="og:image:height" content="${OG_H}" />
<meta property="og:image:alt" content="ChessBird — social voice chess with friends, together." />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${OG_IMAGE}" />
</head>
<body>
<p><strong>ChessBird</strong> — ${t}</p>
<p><a href="${u}">Open invite</a></p>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/play\/(\d{6})\/?$/);
    if (!match) return fetch(request);

    const ua = request.headers.get("User-Agent") || "";
    if (!CRAWLER_UA.test(ua)) return fetch(request);

    return new Response(crawlerOgHtml(match[1]), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  },
};
