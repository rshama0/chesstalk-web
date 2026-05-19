"use strict";

/**
 * Shared Open Graph / Twitter constants for invite and static pages.
 * Loaded synchronously in 404.html before play-invite-bootstrap.js.
 */
(function (global) {
  var ORIGIN = String(global.location && global.location.origin
    ? global.location.origin
    : "https://chessbird.app").replace(/\/+$/, "");

  var IMAGE_PATH = "assets/branding/og-image.jpg";
  var IMAGE_WIDTH = 1200;
  var IMAGE_HEIGHT = 630;
  var DEFAULT_TITLE = "Join a ChessBird game";
  var DEFAULT_DESCRIPTION =
    "Join a ChessBird chess room and play together with voice.";
  var IMAGE_ALT = "ChessBird — social voice chess with friends, together.";

  function absoluteImageUrl() {
    if (typeof global.cbAsset === "function") {
      return new URL(IMAGE_PATH.replace(/^\//, ""), global.cbSiteBaseHref()).href;
    }
    return ORIGIN + "/" + IMAGE_PATH;
  }

  function setMetaContent(selector, value) {
    var el = global.document.querySelector(selector);
    if (el) el.setAttribute("content", value);
  }

  function setLinkHref(selector, value) {
    var el = global.document.querySelector(selector);
    if (el) el.setAttribute("href", value);
  }

  /** Updates head tags for /play/:roomId without document.write (crawler-friendly). */
  function applyPlayInviteOgMeta(roomId) {
    var digits = String(roomId || "").replace(/\D/g, "").slice(0, 6);
    if (!/^\d{6}$/.test(digits)) return false;
    var pageUrl = ORIGIN + "/play/" + digits;
    var title = "Join room " + digits + " on ChessBird";
    var image = absoluteImageUrl();
    global.document.title = title;
    setMetaContent('meta[name="description"]', DEFAULT_DESCRIPTION);
    setLinkHref('link[rel="canonical"]', pageUrl);
    setMetaContent('meta[property="og:url"]', pageUrl);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', DEFAULT_DESCRIPTION);
    setMetaContent('meta[property="og:image"]', image);
    setMetaContent('meta[property="og:image:secure_url"]', image);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', DEFAULT_DESCRIPTION);
    setMetaContent('meta[name="twitter:image"]', image);
    return true;
  }

  function parsePlayRoomId(pathname) {
    var m = /^\/play\/(\d{6})\/?$/i.exec(String(pathname || ""));
    return m ? m[1] : null;
  }

  global.cbOgSocial = {
    origin: ORIGIN,
    imagePath: IMAGE_PATH,
    imageWidth: IMAGE_WIDTH,
    imageHeight: IMAGE_HEIGHT,
    defaultTitle: DEFAULT_TITLE,
    defaultDescription: DEFAULT_DESCRIPTION,
    imageAlt: IMAGE_ALT,
    absoluteImageUrl: absoluteImageUrl,
    applyPlayInviteOgMeta: applyPlayInviteOgMeta,
    parsePlayRoomId: parsePlayRoomId,
  };

  var roomFromPath = parsePlayRoomId(global.location && global.location.pathname);
  if (roomFromPath) applyPlayInviteOgMeta(roomFromPath);
})(typeof window !== "undefined" ? window : globalThis);
