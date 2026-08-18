// "Hold to open" row — mirrors an iOS Shortcuts Home Screen bookmark:
// a plain tap does nothing, only a sustained press navigates.
(function () {
  var HOLD_MS = 550;

  document.querySelectorAll("[data-hold-link]").forEach(function (link) {
    var timer = null;

    function start(e) {
      link.classList.add("pressing");
      timer = setTimeout(function () {
        link.classList.remove("pressing");
        window.location.href = link.href;
      }, HOLD_MS);
    }

    function cancel() {
      link.classList.remove("pressing");
      clearTimeout(timer);
    }

    link.addEventListener("click", function (e) { e.preventDefault(); });
    link.addEventListener("pointerdown", start);
    link.addEventListener("pointerup", cancel);
    link.addEventListener("pointerleave", cancel);
    link.addEventListener("pointercancel", cancel);

    link.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && !timer) start(e);
    });
    link.addEventListener("keyup", cancel);
  });
})();
