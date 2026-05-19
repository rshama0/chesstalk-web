/**
 * Cloudflare Worker for WhatsApp / Meta link previews.
 *
 * Fixes two production issues on GitHub Pages + Cloudflare:
 * 1. /play/:roomId returns HTTP 404 (WhatsApp often ignores OG on 404).
 * 2. og-image.jpg returns 206 Partial Content for Range requests (Meta/WhatsApp
 *    may fail to show the image).
 *
 * Deploy one worker with routes:
 *   chessbird.app/play/*
 *   chessbird.app/assets/branding/og-image.jpg
 *
 * Humans: pass-through to origin (404.html invite UI unchanged).
 */

const CRAWLER_UA =
  /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|Discordbot|TelegramBot|Googlebot|bingbot|Pinterest|Embedly|vkShare|W3C_Validator/i;

const SITE = "https://chessbird.app";
const OG_IMAGE_PATH = "/assets/branding/og-image.jpg";
const OG_IMAGE = `${SITE}${OG_IMAGE_PATH}`;
const OG_W = "1200";
const OG_H = "630";
const INVITE_DESC =
  "Join a ChessBird chess room and play together with voice.";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function crawlerInviteHtml(roomId) {
  const pageUrl = `${SITE}/play/${roomId}`;
  const title = `Join room ${roomId} on ChessBird`;
  const t = escapeHtml(title);
  const d = escapeHtml(INVITE_DESC);
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

function isCrawler(request) {
  return CRAWLER_UA.test(request.headers.get("User-Agent") || "");
}

/** Fetch full JPEG from origin without Range so response is 200, not 206. */
async function fetchOgImage200() {
  const originRes = await fetch(OG_IMAGE, {
    headers: { "User-Agent": "ChessBirdOgWorker/1" },
    cf: { cacheTtl: 86400 },
  });
  if (!originRes.ok) return originRes;
  const body = await originRes.arrayBuffer();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (!isCrawler(request)) return fetch(request);

    if (url.pathname === OG_IMAGE_PATH) {
      return fetchOgImage200();
    }

    const playMatch = url.pathname.match(/^\/play\/(\d{6})\/?$/);
    if (playMatch) {
      return new Response(crawlerInviteHtml(playMatch[1]), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    return fetch(request);
  },
};
