// Referral click tracking — only fires on pages opened via /marvin, /jenna
// etc. (api/l/[slug].js tags the page with window.__CF_REF). Uses
// sendBeacon so it doesn't race the navigation away from the page.
function trackDownloadClick() {
  var ref = window.__CF_REF;
  if (!ref) return;
  var payload = JSON.stringify({ slug: ref, type: "click" });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
  } else {
    fetch("/api/track", { method: "POST", body: payload, keepalive: true });
  }
}

document.querySelectorAll('a[href*="apps.apple.com"]').forEach(function (link) {
  if (!link.hasAttribute("data-hold-link")) {
    link.addEventListener("click", trackDownloadClick);
  }
});

// "Hold to open" row — a normal tap/click navigates like any link.
// The sustained press is only a fallback for TikTok's in-app browser,
// which blocks plain link clicks but doesn't intercept a long press.
(function () {
  var HOLD_MS = 550;

  document.querySelectorAll("[data-hold-link]").forEach(function (link) {
    var timer = null;
    var triggeredByHold = false;

    function start() {
      link.classList.add("pressing");
      timer = setTimeout(function () {
        triggeredByHold = true;
        link.classList.remove("pressing");
        trackDownloadClick();
        window.location.href = link.href;
      }, HOLD_MS);
    }

    function cancel() {
      link.classList.remove("pressing");
      clearTimeout(timer);
    }

    link.addEventListener("click", function (e) {
      if (triggeredByHold) {
        e.preventDefault();
        triggeredByHold = false;
        return;
      }
      trackDownloadClick();
    });
    link.addEventListener("pointerdown", start);
    link.addEventListener("pointerup", cancel);
    link.addEventListener("pointerleave", cancel);
    link.addEventListener("pointercancel", cancel);

    link.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && !timer) start();
    });
    link.addEventListener("keyup", cancel);
  });
})();
