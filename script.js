// Ochi (N. Ochirtulga) portfolio. Total JS budget: this file.
// 1) Bagana scroll fill  2) view windows  3) Mongolian font fallback check.
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

  // 2. Windows: the masthead tabs show one view at a time. Unknown hashes
  // (like #main from the skip link) are ignored; without JS the page is
  // one long sheet and these tabs are plain anchors.
  var views = document.querySelectorAll(".view");
  var tabs = document.querySelectorAll(".masthead__links [data-view]");
  function showView(name, jump) {
    var known = false, i;
    for (i = 0; i < views.length; i++) {
      if (views[i].id === name) known = true;
    }
    if (!known) return false;
    for (i = 0; i < views.length; i++) {
      views[i].classList.toggle("view--active", views[i].id === name);
    }
    for (i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute("data-view") === name) {
        tabs[i].setAttribute("aria-current", "page");
      } else {
        tabs[i].removeAttribute("aria-current");
      }
    }
    if (jump) window.scrollTo(0, 0);
    return true;
  }
  if (views.length && tabs.length) {
    window.addEventListener("hashchange", function () {
      showView(location.hash.slice(1) || "profile", true);
    });
    if (!showView(location.hash.slice(1) || "profile", false)) {
      showView("profile", false);
    }
  }

  // 3. If Noto Sans Mongolian never arrives, the vertical name would render
  // as tofu · swap the script for the plain progress rule instead.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (!document.fonts.check('1rem "Noto Sans Mongolian"')) {
        var bagana = document.querySelector(".bagana");
        if (bagana) bagana.classList.add("bagana--fallback");
      }
    });
  }
})();
