/**
 * Northern Reach — README Renderer
 *
 * Fetches a raw Markdown file from GitHub and renders it
 * into the project detail page using marked.js.
 *
 * Expects:
 *   window.__projectReadme — raw GitHub URL for the markdown file
 *   window.__projectRepo   — GitHub repo URL (for resolving relative image paths)
 */

(function () {
  "use strict";

  const readmeUrl = window.__projectReadme;
  const repoUrl = window.__projectRepo;
  const container = document.getElementById("readme-content");
  if (!readmeUrl || !container) return;

  // Derive the raw base URL for resolving relative paths in the markdown
  // e.g. https://raw.githubusercontent.com/NorthernReach/PERK/refs/heads/main/README.md
  //   -> https://raw.githubusercontent.com/NorthernReach/PERK/refs/heads/main/
  const rawBase = readmeUrl.substring(0, readmeUrl.lastIndexOf("/") + 1);

  // Derive the GitHub blob base for linking to files
  // e.g. https://github.com/NorthernReach/PERK -> https://github.com/NorthernReach/PERK/blob/main/
  const blobBase = repoUrl ? repoUrl.replace(/\/$/, "") + "/blob/main/" : "";

  function loadMarked() {
    return new Promise(function (resolve, reject) {
      if (window.marked) {
        resolve(window.marked);
        return;
      }
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/marked@15/marked.min.js";
      script.onload = function () { resolve(window.marked); };
      script.onerror = function () { reject(new Error("Failed to load markdown parser")); };
      document.head.appendChild(script);
    });
  }

  function resolveRelativeUrls(html) {
    var div = document.createElement("div");
    div.innerHTML = html;

    // Resolve relative image sources to raw GitHub URLs
    div.querySelectorAll("img").forEach(function (img) {
      var src = img.getAttribute("src");
      if (src && !src.startsWith("http") && !src.startsWith("data:")) {
        img.setAttribute("src", rawBase + src.replace(/^\.\//, ""));
      }
    });

    // Resolve relative links to GitHub blob URLs
    div.querySelectorAll("a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto:")) {
        a.setAttribute("href", blobBase + href.replace(/^\.\//, ""));
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      }
    });

    return div.innerHTML;
  }

  async function render() {
    try {
      var response = await fetch(readmeUrl);
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      var markdown = await response.text();

      var markedLib = await loadMarked();
      var html = markedLib.parse(markdown);
      html = resolveRelativeUrls(html);

      container.innerHTML = html;
    } catch (err) {
      container.innerHTML =
        '<p class="ansi-red">Failed to load README: ' + err.message + "</p>" +
        '<p class="ansi-dim" style="margin-top:0.5rem;">View it directly at ' +
        '<a href="' + repoUrl + '" target="_blank" rel="noopener">' + repoUrl + "</a></p>";
    }
  }

  render();
})();
