"use strict";

/**
 * GitHub Pages serves unknown paths (e.g. /play/482019) via 404.html.
 * This bootstrap runs synchronously in <head> and document.writes a complete
 * invite landing page with crawler-visible OG/Twitter meta, or the standard 404 page.
 */
(function () {
  var pathMatch = /^\/play\/(\d{6})\/?$/i.exec(window.location.pathname);
  if (!pathMatch) {
    var previewRoom = new URLSearchParams(window.location.search).get("room");
    if (previewRoom && /^\d{6}$/.test(previewRoom)) {
      pathMatch = ["", previewRoom];
    }
  }
  if (pathMatch) {
    document.write(renderInvitePage(pathMatch[1]));
    return;
  }
  if (/^\/play\/?/i.test(window.location.pathname)) {
    document.write(renderInvalidInvitePage());
    return;
  }
  document.write(renderNotFoundPage());
})();

function publicOrigin() {
  return String(window.location.origin || "https://chessbird.app").replace(/\/+$/, "");
}

function siteBaseHref() {
  if (typeof window.cbSiteBaseHref === "function") return window.cbSiteBaseHref();
  return publicOrigin() + "/";
}

function asset(rel) {
  if (typeof window.cbAsset === "function") return window.cbAsset(rel);
  return "/" + String(rel || "").replace(/^\//, "");
}

function absoluteAsset(rel) {
  return new URL(String(rel || "").replace(/^\//, ""), siteBaseHref()).href;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(text) {
  return escapeHtml(text);
}

function ogHeadBlock(opts) {
  var origin = publicOrigin();
  var pageUrl = escapeAttr(opts.pageUrl);
  var title = escapeAttr(opts.title);
  var description = escapeAttr(opts.description);
  var image = escapeAttr(opts.image || absoluteAsset("assets/branding/og-image.png"));
  return (
    '<meta charset="utf-8" />' +
    '<base href="' +
    escapeAttr(siteBaseHref()) +
    '" />' +
    '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
    "<title>" +
    title +
    "</title>" +
    '<meta name="description" content="' +
    description +
    '" />' +
    '<meta name="theme-color" content="#0F0A2A" />' +
    '<meta name="apple-mobile-web-app-title" content="ChessBird" />' +
    '<meta name="application-name" content="ChessBird" />' +
    '<meta name="mobile-web-app-capable" content="yes" />' +
    '<link rel="canonical" href="' +
    pageUrl +
    '" />' +
    '<meta property="og:site_name" content="ChessBird" />' +
    '<meta property="og:type" content="website" />' +
    '<meta property="og:url" content="' +
    pageUrl +
    '" />' +
    '<meta property="og:title" content="' +
    title +
    '" />' +
    '<meta property="og:description" content="' +
    description +
    '" />' +
    '<meta property="og:image" content="' +
    image +
    '" />' +
    '<meta property="og:image:alt" content="ChessBird — social voice chess with friends, together." />' +
    '<meta property="og:image:width" content="512" />' +
    '<meta property="og:image:height" content="512" />' +
    '<meta name="twitter:card" content="summary_large_image" />' +
    '<meta name="twitter:title" content="' +
    title +
    '" />' +
    '<meta name="twitter:description" content="' +
    description +
    '" />' +
    '<meta name="twitter:image" content="' +
    image +
    '" />' +
    '<link rel="icon" href="' +
    escapeAttr(absoluteAsset("favicon.ico")) +
    '" sizes="any" />' +
    '<link rel="icon" type="image/png" sizes="96x96" href="' +
    escapeAttr(absoluteAsset("assets/branding/favicon-96x96.png")) +
    '" />' +
    '<link rel="apple-touch-icon" href="' +
    escapeAttr(absoluteAsset("assets/branding/apple-touch-icon.png")) +
    '" />' +
    '<link rel="manifest" href="' +
    escapeAttr(absoluteAsset("site.webmanifest")) +
    '" />' +
    '<link rel="stylesheet" href="css/style.css" />'
  );
}

function copyIconSvg() {
  return (
    '<svg class="play-invite__copy-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>' +
    "</svg>" +
    '<span class="play-invite__copy-feedback" hidden>Copied</span>'
  );
}

function siteHeader() {
  return (
    '<header class="site-header"><div class="container header-inner">' +
    '<a class="brand" href="index.html" aria-label="ChessBird home">' +
    '<img src="assets/logo/logo.svg" alt="ChessBird logo" width="36" height="36" />' +
    "<span>ChessBird</span></a>" +
    '<nav class="site-nav" aria-label="Site">' +
    '<a href="index.html">Website</a>' +
    '<a href="contact.html">Contact Us</a>' +
    '<a href="privacy.html">Privacy Policy</a>' +
    '<a href="terms.html">Terms of Service</a>' +
    "</nav></div></header>"
  );
}

function siteFooter() {
  return (
    '<footer class="site-footer"><div class="container footer-links">' +
    '<a href="index.html">Website</a>' +
    '<a href="privacy.html">Privacy Policy</a>' +
    '<a href="terms.html">Terms of Service</a>' +
    '<a href="contact.html">Contact Us</a>' +
    "</div></footer>"
  );
}

function renderInvitePage(roomId) {
  var origin = publicOrigin();
  var inviteUrl = origin + "/play/" + roomId;
  var titlePlain = "Join room " + roomId + " on ChessBird";
  var descPlain = "Join a ChessBird chess room and play together with voice.";
  var playStore =
    "https://play.google.com/store/apps/details?id=com.chessbird.app";
  var head = ogHeadBlock({
    pageUrl: inviteUrl,
    title: titlePlain,
    description: descPlain,
  });
  var roomDisplay = escapeHtml(roomId);
  return (
    '<!doctype html><html lang="en"><head>' +
    head +
    '<meta name="chessbird:room-id" content="' +
    escapeAttr(roomId) +
    '" />' +
    '</head><body data-play-invite="' +
    escapeAttr(roomId) +
    '">' +
    siteHeader() +
    '<main class="legal-main" id="main-content">' +
    '<section class="section"><div class="container play-invite">' +
    '<p class="eyebrow">ChessBird invite</p>' +
    '<h1 class="play-invite__title">You\'re invited to play</h1>' +
    '<div class="play-invite__code-row">' +
    '<span class="play-invite__code" id="play-invite-room-code">' +
    roomDisplay +
    "</span>" +
    '<button type="button" class="play-invite__copy" id="play-copy-room" aria-label="Copy room code">' +
    copyIconSvg() +
    "</button>" +
    "</div>" +
    '<p class="play-invite__actions">' +
    '<a class="playstore-btn play-invite__cta" id="play-now" href="' +
    escapeAttr(playStore) +
    '" rel="noopener noreferrer">Play Now</a>' +
    "</p>" +
    "</div></section></main>" +
    siteFooter() +
    '<script src="js/play-invite-ui.js" defer></script>' +
    "</body></html>"
  );
}

function renderInvalidInvitePage() {
  var origin = publicOrigin();
  var pageUrl = origin + window.location.pathname;
  var titlePlain = "Invalid invite link | ChessBird";
  var descPlain =
    "This ChessBird invite link is not valid. Ask your friend to share a new room invite.";
  return (
    '<!doctype html><html lang="en"><head>' +
    ogHeadBlock({ pageUrl: pageUrl, title: titlePlain, description: descPlain }) +
    '</head><body class="play-invite play-invite--invalid">' +
    siteHeader() +
    '<main class="legal-main"><section class="section"><div class="container not-found">' +
    '<p class="eyebrow">ChessBird</p>' +
    '<h1 class="not-found__title">This invite link isn\'t valid</h1>' +
    '<p class="not-found__lede">Room codes are six digits. Check the link or ask for a new invite.</p>' +
    '<p class="not-found__actions"><a class="playstore-btn not-found__cta" href="index.html">Back to homepage</a></p>' +
    "</div></section></main>" +
    siteFooter() +
    "</body></html>"
  );
}

function renderNotFoundPage() {
  var origin = publicOrigin();
  var pageUrl = origin + "/404.html";
  var titlePlain = "Page not found | ChessBird";
  var descPlain =
    "That page isn't on the board. Head back to ChessBird's homepage or use the links below.";
  return (
    '<!doctype html><html lang="en"><head>' +
    ogHeadBlock({ pageUrl: pageUrl, title: titlePlain, description: descPlain }) +
    '</head><body class="not-found-page">' +
    siteHeader() +
    '<main class="legal-main" id="main-content">' +
    '<section class="section"><div class="container not-found">' +
    '<p class="eyebrow">ChessBird</p>' +
    '<h1 class="not-found__title">This page isn\'t on the board</h1>' +
    '<p class="not-found__lede">The link may have moved, or something was mistyped along the way. No worries — you can step back to the homepage and pick up where you left off.</p>' +
    '<p class="not-found__actions"><a class="playstore-btn not-found__cta" href="index.html">Back to homepage</a></p>' +
    '<div class="contact-panel not-found__panel" role="note"><p class="not-found__hint">Looking for something specific? Try <a href="index.html">Website</a>, <a href="contact.html">Contact Us</a>, <a href="privacy.html">Privacy Policy</a>, or <a href="terms.html">Terms of Service</a>.</p></div>' +
    "</div></section></main>" +
    siteFooter() +
    "</body></html>"
  );
}
