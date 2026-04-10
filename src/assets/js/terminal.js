/**
 * Northern Reach — Terminal Command Bar
 * Provides a command-line interface for navigating the site.
 */

(function () {
  "use strict";

  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");
  if (!input || !output) return;

  let history = [];
  let historyIndex = -1;
  let outputVisible = false;

  // --- Commands ---

  const commands = {
    help: {
      description: "Show available commands",
      run() {
        const lines = [
          line("cmd", "Available commands:"),
          line("info", ""),
        ];
        Object.keys(commands)
          .sort()
          .forEach((name) => {
            lines.push(
              line(
                "info",
                `  ${name.padEnd(14)} ${commands[name].description}`
              )
            );
          });
        lines.push(line("info", ""));
        lines.push(line("info", "Tip: use / to focus the terminal from anywhere"));
        return lines;
      },
    },

    home: {
      description: "Go to the homepage",
      run() {
        navigate("/");
        return [line("cmd", "Navigating to home...")];
      },
    },

    reports: {
      description: "Go to reports listing",
      run() {
        navigate("/reports/");
        return [line("cmd", "Navigating to reports...")];
      },
    },

    projects: {
      description: "Go to projects listing",
      run() {
        navigate("/projects/");
        return [line("cmd", "Navigating to projects...")];
      },
    },

    about: {
      description: "Go to about page",
      run() {
        navigate("/about/");
        return [line("cmd", "Navigating to about...")];
      },
    },

    tags: {
      description: "Go to tags page",
      run() {
        navigate("/tags/");
        return [line("cmd", "Navigating to tags...")];
      },
    },

    search: {
      description: "Search reports (usage: search <query>)",
      run(args) {
        if (!args.length) {
          return [line("error", "Usage: search <query>")];
        }
        const query = args.join(" ");
        if (window.__nrSearch) {
          return window.__nrSearch(query);
        }
        return [line("error", "Search index not loaded yet. Try again.")];
      },
    },

    clear: {
      description: "Clear terminal output",
      run() {
        output.innerHTML = "";
        hideOutput();
        return [];
      },
    },

    whoami: {
      description: "Display current user",
      run() {
        return [line("cmd", "visitor@northernreach")];
      },
    },

    date: {
      description: "Show current date",
      run() {
        const now = new Date();
        const formatted = now.toISOString().split("T")[0];
        return [line("cmd", formatted)];
      },
    },

    ls: {
      description: "List site sections",
      run() {
        return [
          line("cmd", "drwxr-xr-x  reports/"),
          line("cmd", "drwxr-xr-x  projects/"),
          line("cmd", "drwxr-xr-x  about/"),
          line("cmd", "drwxr-xr-x  tags/"),
          line("cmd", "-rw-r--r--  index.html"),
        ];
      },
    },

    cat: {
      description: "Display page info (usage: cat <section>)",
      run(args) {
        const section = args[0];
        const pages = {
          "reports": "Field reports, technical notes, and documentation.",
          "projects": "Active and archived projects with source links.",
          "about": "Information about Northern Reach.",
          "tags": "Browse content by tag.",
        };
        if (!section) {
          return [line("error", "Usage: cat <section>"), line("info", "Sections: " + Object.keys(pages).join(", "))];
        }
        if (pages[section]) {
          return [line("cmd", pages[section])];
        }
        return [line("error", `cat: ${section}: No such file or directory`)];
      },
    },

    motd: {
      description: "Display message of the day",
      run() {
        return [
          line("info", ""),
          line("cmd", "╔══════════════════════════════════════╗"),
          line("cmd", "║     NORTHERN REACH TERMINAL v1.0    ║"),
          line("cmd", "║   // signals from the frontier //   ║"),
          line("cmd", "╚══════════════════════════════════════╝"),
          line("info", ""),
          line("info", "Type 'help' for available commands."),
          line("info", ""),
        ];
      },
    },

    history: {
      description: "Show command history",
      run() {
        if (!history.length) {
          return [line("info", "No commands in history.")];
        }
        return history.map((cmd, i) =>
          line("info", `  ${String(i + 1).padStart(3)}  ${cmd}`)
        );
      },
    },
  };

  // --- Helpers ---

  function line(type, text) {
    return { type, text };
  }

  function navigate(url) {
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }

  function showOutput() {
    output.classList.add("active");
    outputVisible = true;
  }

  function hideOutput() {
    output.classList.remove("active");
    outputVisible = false;
  }

  function renderLines(lines) {
    if (!lines.length) return;
    showOutput();
    lines.forEach((l) => {
      const div = document.createElement("div");
      div.className = `terminal-output-line terminal-output-${l.type}`;
      if (l.html) {
        div.innerHTML = l.html;
      } else {
        div.textContent = l.text;
      }
      output.appendChild(div);
    });
    output.scrollTop = output.scrollHeight;
  }

  function processCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    history.push(trimmed);
    historyIndex = history.length;

    // Echo the command
    renderLines([line("cmd", `visitor@northernreach:~$ ${trimmed}`)]);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (commands[cmd]) {
      const result = commands[cmd].run(args);
      renderLines(result);
    } else {
      renderLines([
        line("error", `${cmd}: command not found`),
        line("info", "Type 'help' for available commands."),
      ]);
    }
  }

  // --- Event handlers ---

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      processCommand(input.value);
      input.value = "";
    } else if (e.key === "Escape") {
      hideOutput();
      input.blur();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = "";
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      commands.clear.run();
    }
  });

  // Global keyboard shortcut: / to focus terminal
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "/" &&
      !e.ctrlKey &&
      !e.metaKey &&
      document.activeElement !== input
    ) {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      input.focus();
    }
  });

  // Click outside to close output
  document.addEventListener("click", function (e) {
    if (
      outputVisible &&
      !output.contains(e.target) &&
      !e.target.closest(".terminal-bar")
    ) {
      hideOutput();
    }
  });
})();
