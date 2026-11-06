/* Email copy, strip progress, mobile nav. */
(function () {
  "use strict";

  var button = document.getElementById("copyEmail");
  var status = document.getElementById("copyStatus");
  var resetTimer;
  if (button) {
    function fallbackCopy(text) {
      var field = document.createElement("textarea");
      var previousFocus = document.activeElement;
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      var copied = false;
      try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
      field.remove();
      if (previousFocus) previousFocus.focus();
      return copied;
    }

    button.addEventListener("click", async function () {
      var email = button.getAttribute("data-email");
      var copied = false;
      button.disabled = true;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          copied = true;
        } else {
          copied = fallbackCopy(email);
        }
      } catch (error) {
        copied = fallbackCopy(email);
      }
      button.disabled = false;
      button.textContent = copied ? "已复制" : "请手动复制";
      if (status) {
        status.textContent = copied
          ? "邮箱已复制：" + email
          : "复制失败，请选中邮箱地址手动复制。";
      }
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        button.textContent = "复制";
      }, 2000);
    });
  }

  function bindStrip(root) {
    var track = root.querySelector(".media-strip__track, .shelf__track");
    var thumb = root.querySelector(".strip-progress__thumb");
    if (!track || !thumb) return;

    function update() {
      var max = track.scrollWidth - track.clientWidth;
      if (max <= 0) {
        thumb.style.width = "100%";
        thumb.style.left = "0%";
        return;
      }
      var ratio = track.clientWidth / track.scrollWidth;
      var widthPct = Math.max(ratio * 100, 12);
      var leftPct = (track.scrollLeft / max) * (100 - widthPct);
      thumb.style.width = widthPct.toFixed(2) + "%";
      thumb.style.left = leftPct.toFixed(2) + "%";
    }

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  document.querySelectorAll("[data-strip]").forEach(bindStrip);

  /* Mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
      nav.classList.toggle("is-open", open);
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });
  }

  /* Respect reduced motion for smooth scroll (html may set smooth in styles.css) */
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.scrollBehavior = "auto";
  }

  /* Transparent topbar → subtle bar after scroll */
  var topbar = document.querySelector(".topbar");
  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
