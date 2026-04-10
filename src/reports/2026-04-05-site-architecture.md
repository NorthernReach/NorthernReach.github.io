---
title: "Site Architecture Notes"
date: 2026-04-05
category: "technical"
tags:
  - technical
  - web
---

A brief overview of how this site is built and the decisions behind it.

## Stack

- **Generator**: Eleventy (11ty) v3 — fast, zero-config static site generation
- **Hosting**: GitHub Pages with GitHub Actions CI/CD
- **Styling**: Custom CSS with ANSI color palette, no frameworks
- **Interactivity**: Vanilla JavaScript — terminal command bar, client-side search

## Design Philosophy

The visual language draws from the `.nfo` file tradition and BBS-era text art. Everything is rendered in monospace. Box-drawing characters define structure. Color is used sparingly and functionally, pulled from the standard ANSI palette.

## Content Workflow

1. Write a Markdown file in `src/reports/`
2. Add frontmatter (title, date, category, tags)
3. Commit and push — GitHub Actions builds and deploys

No CMS. No build tools beyond npm and Eleventy. The site should be maintainable with a text editor and a terminal.

## Search

Client-side search is built from a JSON index generated at build time. No external services, no API calls. The search index contains titles, tags, and content excerpts for all reports.
