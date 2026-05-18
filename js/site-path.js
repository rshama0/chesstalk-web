"use strict";

/**
 * Resolves the site root path for static assets (works with Live Server at repo root or chessbird-web/).
 * Exposes window.CHESSBIRD_SITE_ROOT (pathname, trailing slash) and window.cbAsset("css/style.css").
 */
(function (global) {
  function rootFromScriptUrl(scriptUrl) {
    if (!scriptUrl) return null;
    try {
      var pathname = new URL(scriptUrl, global.location.href).pathname;
      return pathname.replace(/\/js\/[^/]+$/, "/");
    } catch (_err) {
      return null;
    }
  }

  function rootFromLocation() {
    var path = global.location.pathname || "/";
    if (path.endsWith("/")) return path;
    if (/\.[a-z0-9]+$/i.test(path.split("/").pop() || "")) {
      return path.replace(/\/[^/]*$/, "/") || "/";
    }
    return path + "/";
  }

  var root = rootFromScriptUrl(
    (document.currentScript && document.currentScript.src) || "",
  );
  if (!root) root = rootFromLocation();

  global.CHESSBIRD_SITE_ROOT = root;

  global.cbAsset = function (relativePath) {
    var rel = String(relativePath || "").replace(/^\//, "");
    return root + rel;
  };

  global.cbSiteBaseHref = function () {
    return new URL(root, global.location.origin).href;
  };
})(window);
