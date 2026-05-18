"use strict";

/**
 * Copy room code on /play/:roomId invite landings.
 */
(function () {
  var roomId = document.body && document.body.getAttribute("data-play-invite");
  if (!roomId) return;

  var copyBtn = document.getElementById("play-copy-room");
  if (!copyBtn) return;

  var copyIcon = copyBtn.querySelector(".play-invite__copy-icon");
  var feedback = copyBtn.querySelector(".play-invite__copy-feedback");
  var resetTimer = 0;

  function showCopied() {
    copyBtn.classList.add("play-invite__copy--done");
    copyBtn.setAttribute("aria-label", "Room code copied");
    if (copyIcon) copyIcon.hidden = true;
    if (feedback) feedback.hidden = false;
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(function () {
      copyBtn.classList.remove("play-invite__copy--done");
      copyBtn.setAttribute("aria-label", "Copy room code");
      if (copyIcon) copyIcon.hidden = false;
      if (feedback) feedback.hidden = true;
    }, 2000);
  }

  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_err) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function copyRoomCode() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(roomId).then(
        function () {
          showCopied();
        },
        function () {
          if (legacyCopy(roomId)) showCopied();
        },
      );
    }
    if (legacyCopy(roomId)) showCopied();
    return undefined;
  }

  copyBtn.addEventListener("click", function () {
    copyRoomCode();
  });
})();
