// Score ring draw-in, mirrors ScoreRing.js gap logic (small fixed gap, arc length = score%).
(function () {
  var RADIUS = 22.5;
  var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  var ring = document.getElementById("heroRing");
  if (!ring) return;

  var score = 86;
  var gap = 10; // px along the circumference, kept constant regardless of score
  var arc = CIRCUMFERENCE * (score / 100) - gap;

  ring.style.strokeDasharray = CIRCUMFERENCE;
  ring.style.strokeDashoffset = CIRCUMFERENCE;

  requestAnimationFrame(function () {
    ring.style.strokeDashoffset = CIRCUMFERENCE - Math.max(arc, 0);
  });
})();

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
