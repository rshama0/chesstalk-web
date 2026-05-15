"use strict";

/**
 * Folder-based screenshot rotation (vanilla JS, no dependencies).
 * Layers live inside `.screenshot-rotator__screen`; paths are explicit for static hosting.
 */
const screenshotGroups = {
  home: ["/assets/screenshots/home/1.webp", "/assets/screenshots/home/2.webp"],
  room: ["/assets/screenshots/room/1.webp", "/assets/screenshots/room/2.webp", "/assets/screenshots/room/3.webp", "/assets/screenshots/room/4.webp"],
  gameplay: [
    "/assets/screenshots/gameplay/1.webp",
    "/assets/screenshots/gameplay/2.webp",
    "/assets/screenshots/gameplay/3.webp",
    "/assets/screenshots/gameplay/4.webp",
    "/assets/screenshots/gameplay/5.webp",
    "/assets/screenshots/gameplay/6.webp",
    "/assets/screenshots/gameplay/7.webp",
    "/assets/screenshots/gameplay/8.webp",
    "/assets/screenshots/gameplay/9.webp",
    "/assets/screenshots/gameplay/10.webp",
  ],
  other: ["/assets/screenshots/other/1.webp", "/assets/screenshots/other/2.webp", "/assets/screenshots/other/3.webp", "/assets/screenshots/other/4.webp", "/assets/screenshots/other/5.webp", "/assets/screenshots/other/6.webp"],
};

const SCREENSHOT_ROTATE_MS = 3500;

/** Keep in sync with `.screenshot-rotator__layer` transition in `css/style.css` */
const SCREENSHOT_FADE_MS = 750;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initScreenshotRotators() {
  const roots = document.querySelectorAll("[data-screenshot-group]");
  if (!roots.length) return;

  const reduceMotion = prefersReducedMotion();

  roots.forEach((root) => {
    const rawKey = root.getAttribute("data-screenshot-group");
    const key = rawKey ? String(rawKey).trim() : "";
    const paths = screenshotGroups[key];
    if (!paths || paths.length === 0) return;

    const screenEl = root.querySelector(".screenshot-rotator__screen");
    if (!screenEl) return;

    const layers = screenEl.querySelectorAll(":scope > .screenshot-rotator__layer");
    if (layers.length < 2) return;

    let fore = layers[0];
    let back = layers[1];
    let index = 0;
    let animating = false;

    fore.src = paths[0];
    fore.classList.add("screenshot-rotator__layer--visible");

    if (paths.length === 1) {
      back.removeAttribute("src");
      back.setAttribute("aria-hidden", "true");
      return;
    }

    back.src = paths[1 % paths.length];
    back.classList.remove("screenshot-rotator__layer--visible");

    if (reduceMotion) {
      back.remove();
      return;
    }

    window.setInterval(() => {
      if (animating) return;
      animating = true;

      const fadingOut = fore;
      let cycleDone = false;
      let safetyTimer = 0;

      const finishCycle = () => {
        if (cycleDone) return;
        cycleDone = true;

        fadingOut.removeEventListener("transitionend", onEnd);
        window.clearTimeout(safetyTimer);

        index = (index + 1) % paths.length;
        const tmp = fore;
        fore = back;
        back = tmp;

        const preloadUrl = paths[(index + 1) % paths.length];
        window.requestAnimationFrame(() => {
          back.src = preloadUrl;
          if (typeof back.decode === "function") {
            back.decode().catch(() => {});
          }
        });

        animating = false;
      };

      const onEnd = (ev) => {
        if (ev.target !== fadingOut || ev.propertyName !== "opacity") return;
        finishCycle();
      };

      fadingOut.addEventListener("transitionend", onEnd);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          back.classList.add("screenshot-rotator__layer--visible");
          fore.classList.remove("screenshot-rotator__layer--visible");
          void fadingOut.offsetWidth;
          safetyTimer = window.setTimeout(finishCycle, SCREENSHOT_FADE_MS + 200);
        });
      });
    }, SCREENSHOT_ROTATE_MS);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScreenshotRotators);
} else {
  initScreenshotRotators();
}
