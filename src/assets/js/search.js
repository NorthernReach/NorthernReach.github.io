/**
 * Northern Reach — Client-Side Search
 * Loads a JSON index at build time and provides fuzzy search.
 */

(function () {
  "use strict";

  let searchIndex = null;

  // Load the search index
  fetch("/search.json")
    .then((res) => res.json())
    .then((data) => {
      searchIndex = data;
    })
    .catch(() => {
      // Search index failed to load — search will show an error
    });

  /**
   * Simple scoring: count how many query terms appear in the searchable text.
   * Returns 0 if no match, higher numbers = better match.
   */
  function score(item, terms) {
    const haystack = [
      item.title,
      item.content,
      item.category,
      ...(item.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    let total = 0;
    for (const term of terms) {
      if (haystack.includes(term)) {
        total++;
        // Boost title matches
        if (item.title.toLowerCase().includes(term)) {
          total += 2;
        }
        // Boost tag matches
        if ((item.tags || []).some((t) => t.toLowerCase().includes(term))) {
          total += 1;
        }
      }
    }
    return total;
  }

  /**
   * Search function exposed to the terminal.
   * Returns terminal output lines.
   */
  window.__nrSearch = function (query) {
    if (!searchIndex) {
      return [{ type: "error", text: "Search index not loaded." }];
    }

    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 1);

    if (!terms.length) {
      return [{ type: "error", text: "Please enter a search query." }];
    }

    const results = searchIndex
      .map((item) => ({ ...item, score: score(item, terms) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    if (!results.length) {
      return [
        {
          type: "info",
          text: `No results found for "${query}".`,
        },
      ];
    }

    const lines = [
      {
        type: "cmd",
        text: `Found ${results.length} result${results.length !== 1 ? "s" : ""} for "${query}":`,
      },
      { type: "info", text: "" },
    ];

    results.forEach((r, i) => {
      lines.push({
        type: "info",
        text: "",
        html: `  <a href="${r.url}" style="color:var(--cyan)">${r.title}</a> <span style="color:var(--fg-dim)">[${r.date}]</span>`,
      });
      if (r.content) {
        lines.push({
          type: "info",
          text: `    ${r.content.substring(0, 80)}...`,
        });
      }
    });

    return lines;
  };
})();
