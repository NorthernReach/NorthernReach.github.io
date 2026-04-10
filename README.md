```
 ╔══════════════════════════════════════════════════════════╗
 ║              NORTHERN REACH — SITE SOURCE                ║
 ╚══════════════════════════════════════════════════════════╝

> stack

  Generator ......... Eleventy (11ty) v3
  Templating ........ Nunjucks / Markdown
  Styling ........... Custom CSS, no frameworks
  Interactivity ..... Vanilla JS
  Hosting ........... GitHub Pages
  CI/CD ............. GitHub Actions

--------------------------------------------------------------

> structure

  src/
  ├── reports/          Field reports (Markdown)
  ├── projects/         Project listings and detail pages
  ├── _includes/        Layouts and partials
  ├── _data/            Site metadata and project data
  └── assets/           CSS and JS

--------------------------------------------------------------

> usage

  npm install            # Install dependencies
  npm run dev            # Local dev server at localhost:8080
  npm run build          # Production build to _site/

--------------------------------------------------------------

> add report

  Create src/reports/YYYY-MM-DD-slug.md with frontmatter

  ---
  title: "Title"
  date: YYYY-MM-DD
  category: "category"
  tags:
    - tag
  ---

--------------------------------------------------------------

> add project

  Add an entry to src/_data/projects_data.json 
  Include 'slug' and 'readme' fields to generate a detail page 
  * renders the project README at runtime

--------------------------------------------------------------

> license

  NORTHERN REACH. All ur rights are belong to me.

```
