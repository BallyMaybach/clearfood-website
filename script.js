// Scroll-reveal for feature cards.
(function () {
  var cards = document.querySelectorAll(".feature-card");
  if (!cards.length) return;

  if (!("IntersectionObserver" in window)) {
    cards.forEach(function (c) { c.classList.add("in-view"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach(function (c) { observer.observe(c); });
})();
