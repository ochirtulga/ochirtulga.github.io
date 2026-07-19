// Ochirtulga — portfolio. Total JS budget: this file.
// 1) Bagana scroll fill  2) days-in-service count  3) Mongolian font check.
(function () {
  "use strict";

  // 1. Scroll progress → --scroll, read by the bagana's clip-path. Browsers
  // with scroll-driven animations handle this in pure CSS (see styles.css);
  // the JS path is the fallback for everyone else.
  var root = document.documentElement;
  var hasScrollTimeline = typeof CSS !== "undefined" && CSS.supports &&
    CSS.supports("animation-timeline: scroll()");
  if (!hasScrollTimeline) {
    var ticking = false;
    var updateScroll = function () {
      var max = Math.max(root.scrollHeight, document.body.scrollHeight) -
        root.clientHeight;
      var y = window.pageYOffset || root.scrollTop || 0;
      var pct = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      root.style.setProperty("--scroll", pct.toFixed(4));
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    }, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    updateScroll();
  }

  // 2. Days in service, computed once from the real start date (Khan Bank,
  // Feb 2018). Static "since Feb 2018" text already covers the no-JS case.
  var daysEl = document.querySelector("[data-days]");
  if (daysEl) {
    var days = Math.floor((Date.now() - new Date(2018, 1, 1)) / 86400000);
    if (days > 0) {
      daysEl.textContent = " · day " + days.toLocaleString("en-US");
      daysEl.hidden = false;
    }
  }

  // 3. If Noto Sans Mongolian never arrives, the vertical name would render
  // as tofu — swap the script for the plain progress rule instead.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (!document.fonts.check('1rem "Noto Sans Mongolian"')) {
        var bagana = document.querySelector(".bagana");
        if (bagana) bagana.classList.add("bagana--fallback");
      }
    });
  }
})();
