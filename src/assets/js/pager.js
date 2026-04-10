/**
 * Northern Reach — Terminal Pager
 *
 * Locks the page to the viewport and provides keyboard-driven
 * scrolling like `less`. Content never overflows the screen —
 * the user pages through it with keys.
 *
 * Keys (when terminal input is NOT focused):
 *   j / ArrowDown    — scroll down one line
 *   k / ArrowUp      — scroll up one line
 *   Space / PageDown  — scroll down one page
 *   Shift+Space / PageUp — scroll up one page
 *   g                — jump to top
 *   G (shift+g)      — jump to bottom
 *   d                — scroll down half page
 *   u                — scroll up half page
 *   /                — focus terminal input
 *   q                — focus terminal input
 */

(function () {
  "use strict";

  const wrapper = document.querySelector(".site-wrapper");
  const terminalInput = document.getElementById("terminal-input");
  if (!wrapper) return;

  // --- Constants ---
  const LINE_HEIGHT = parseFloat(getComputedStyle(document.documentElement).fontSize) *
    parseFloat(getComputedStyle(document.body).lineHeight || 1.65);
  const SCROLL_LINES = 1; // lines per j/k press

  // --- Status bar element ---
  const statusBar = document.createElement("div");
  statusBar.className = "pager-status";
  statusBar.setAttribute("aria-live", "polite");
  document.body.appendChild(statusBar);

  // --- Helpers ---

  function getViewportHeight() {
    // Available height = viewport minus terminal bar
    const terminalBar = document.querySelector(".terminal-bar");
    const barHeight = terminalBar ? terminalBar.offsetHeight : 0;
    return window.innerHeight - barHeight;
  }

  function getScrollInfo() {
    const scrollTop = wrapper.scrollTop;
    const scrollHeight = wrapper.scrollHeight;
    const clientHeight = wrapper.clientHeight;
    const maxScroll = scrollHeight - clientHeight;
    const percent = maxScroll > 0 ? Math.round((scrollTop / maxScroll) * 100) : 100;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop >= maxScroll - 1;

    return { scrollTop, scrollHeight, clientHeight, maxScroll, percent, atTop, atBottom };
  }

  function updateStatus() {
    const info = getScrollInfo();

    let position;
    if (info.maxScroll <= 0) {
      position = "(ALL)";
    } else if (info.atTop) {
      position = "(TOP)";
    } else if (info.atBottom) {
      position = "(END)";
    } else {
      position = `(${info.percent}%)`;
    }

    // Show if content overflows; hide if everything fits
    if (info.scrollHeight <= info.clientHeight + 2) {
      statusBar.classList.remove("active");
      return;
    }

    statusBar.classList.add("active");
    statusBar.textContent = ` j/k:line  Space:page  g/G:top/end  /:cmd  ${position}`;
  }

  function scrollBy(px) {
    wrapper.scrollBy({ top: px, behavior: "smooth" });
    updateStatus();
  }

  function scrollTo(pos) {
    wrapper.scrollTo({ top: pos, behavior: "smooth" });
    updateStatus();
  }

  // --- Setup ---

  function initPager() {
    const viewH = getViewportHeight();
    wrapper.style.height = viewH + "px";
    wrapper.style.overflow = "hidden auto";
    updateStatus();
  }

  // --- Keyboard handler ---

  function isInputFocused() {
    const tag = document.activeElement?.tagName;
    return tag === "INPUT" || tag === "TEXTAREA";
  }

  document.addEventListener("keydown", function (e) {
    // Don't intercept when typing in the terminal input
    if (isInputFocused()) return;

    const pageH = getViewportHeight();
    const lineH = LINE_HEIGHT * SCROLL_LINES;

    switch (e.key) {
      case "j":
      case "ArrowDown":
        e.preventDefault();
        scrollBy(lineH);
        break;

      case "k":
      case "ArrowUp":
        e.preventDefault();
        scrollBy(-lineH);
        break;

      case " ":
        e.preventDefault();
        if (e.shiftKey) {
          scrollBy(-(pageH - LINE_HEIGHT * 2));
        } else {
          scrollBy(pageH - LINE_HEIGHT * 2);
        }
        break;

      case "PageDown":
        e.preventDefault();
        scrollBy(pageH - LINE_HEIGHT * 2);
        break;

      case "PageUp":
        e.preventDefault();
        scrollBy(-(pageH - LINE_HEIGHT * 2));
        break;

      case "d":
        if (e.ctrlKey) return; // don't capture browser bookmark
        e.preventDefault();
        scrollBy(pageH / 2);
        break;

      case "u":
        e.preventDefault();
        scrollBy(-(pageH / 2));
        break;

      case "g":
        if (e.shiftKey) {
          // G — bottom
          e.preventDefault();
          scrollTo(wrapper.scrollHeight);
        } else {
          // g — top
          e.preventDefault();
          scrollTo(0);
        }
        break;

      case "q":
        e.preventDefault();
        if (terminalInput) terminalInput.focus();
        break;

      default:
        return; // don't call updateStatus for unhandled keys
    }
  });

  // --- Resize handler ---
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initPager, 100);
  });

  // --- Scroll event for status updates ---
  wrapper.addEventListener("scroll", updateStatus, { passive: true });

  // --- Init ---
  initPager();
})();
