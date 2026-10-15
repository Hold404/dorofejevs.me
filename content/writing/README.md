# Writing articles

Create a `.mdx` file in this directory. Its filename becomes the article URL:

`content/writing/my-article.mdx` → `/writing/my-article`

Use lowercase words separated by hyphens. Files appear automatically in the Writing cards; the homepage shows the three newest entries. No route or index edits are required. This README is ignored by the article index.

Copy `templates/article.mdx` from the project root, or start with:

```mdx
---
title: "My article"
description: "A short description for the card and search engines."
date: "2026-10-15"
tags: [engineering]
draft: true
---

Write the introduction here.

## First section

Markdown, links, lists, code blocks, tables, JSX, and mathematics are supported.
```

Run `npm run dev` and open `http://localhost:3000/writing`. Refresh after adding or editing a file. The title supplies the page's H1; begin body headings at `##`. Use fenced code blocks with a language for syntax highlighting. Write inline math as `$x^2$` or display math between `$$` delimiters. Native HTML JSX and expressions render on the server; custom components are registered in `src/components/mdx.tsx` rather than imported from the article.

Keep `draft: true` to preview locally. When ready to publish, set `draft: false`, use the actual publication date, and rebuild. Production excludes drafts and future-dated articles from pages, cards, RSS, and sitemap. The current published article is `the-site-is-up.mdx`; test-only examples live separately in `tests/fixtures/writing`.

Optional frontmatter: `updatedAt` (YYYY-MM-DD, not before `date`) and `canonicalUrl` (the original HTTPS article URL). Only trusted owner-authored MDX should be added here.

See the [project README](../../README.md#publishing-an-mdx-article) for the full publishing and verification workflow.
