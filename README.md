# Jegors Dorofejevs — personal website

A statically rendered Next.js App Router website for Jegors Dorofejevs. Built with strict TypeScript, React, Tailwind CSS, local MDX, Geist/Geist Mono through `next/font`, and Playwright. No CMS, database, analytics, authentication, or external runtime API.

## Install and develop

Use Node.js 24 LTS (minimum 22.18) and npm. The lockfile pins the tested dependency graph.

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open <http://localhost:3000>. Development uses localhost only when `SITE_URL` is absent. Fonts are fetched at build time by `next/font` and served locally to visitors; a first build needs network access to the font provider.

## Build for your production domain

```sh
cp .env.example .env.local
# Add SITE_URL=https://your-actual-domain.com to .env.local
npm run build
npm start
```

`SITE_URL` is the only required production environment variable. It must be the real public HTTPS **origin**, without a path, query, fragment, or credentials. Production builds reject missing values, localhost, loopback addresses, HTTP, and reserved example domains. Set it before building and keep the same value when starting the server. Changing domains requires a rebuild because pages are prerendered.

## Deploy to Cloudflare Pages

Production project: **dorofejevs-me**, public origin: <https://dorofejevs.me>.
Repository: <https://github.com/Hold404/dorofejevs.me>.

```sh
SITE_URL=https://dorofejevs.me npm run build:pages
SITE_URL=https://dorofejevs.me npm run test:pages
npm run preview:pages
# Publish using your local Wrangler login:
CLOUDFLARE_ACCOUNT_ID=4885cc5878d5767dbef79f56c1a2cfed SITE_URL=https://dorofejevs.me npm run deploy:pages
```

Pushes to `main` run `.github/workflows/deploy.yml`: install, format, lint, typecheck, configuration tests, static export, Playwright through Wrangler, then deploy the tested artifact to the same project. The workflow requires the repository secret `CLOUDFLARE_API_TOKEN` (Account → Cloudflare Pages → Edit for your account). `SITE_URL` is an Actions variable. See [deployment documentation](docs/DEPLOYMENT.md) for token setup, domains, testing, and rollback.

### Local production verification without an assigned domain

```sh
npm run build:test
npm run test:e2e
```

`build:test` creates a normal optimized production build with the deliberately reserved origin `https://portfolio.example`. `SITE_TEST_MODE=1` permits that origin **only for local testing**. The test runner starts its own production server at `http://127.0.0.1:3100` and stops it afterward.

For manual local inspection of that build:

```sh
SITE_URL=https://portfolio.example SITE_TEST_MODE=1 npm start
```

**Do not deploy test-mode build artifacts.** Before deployment, unset `SITE_TEST_MODE` and `WRITING_FIXTURES`, set the real `SITE_URL`, and run `npm run build` again. The presence of a build that passes tests does not establish ownership of a domain.

## Routes

| Route                           | Content                                                              |
| ------------------------------- | -------------------------------------------------------------------- |
| `/`                             | Introduction, selected work, project, writing, and about previews    |
| `/work`                         | Robotics Startup, DomiDo / Avvyland Ltd., and VirtuosoHub experience |
| `/work/robotics-startup`        | CTO responsibilities, software delivery, and ongoing MVP work        |
| `/work/domido`                  | Backend services and asynchronous processing at Avvyland Ltd.        |
| `/work/virtuosohub`             | Infrastructure work and supplied performance results                 |
| `/projects`                     | Independent projects index                                           |
| `/projects/volleyball-tracking` | Detection, triangulation, and replay project                         |
| `/writing`                      | Automatically generated article cards and the launch note            |
| `/writing/[slug]`               | Local MDX articles                                                   |
| `/about`                        | Biography, interests, toolkit, and ongoing education                 |
| `/contact`                      | Email, GitHub, and LinkedIn                                          |
| `/sitemap.xml`                  | Canonical pages and published articles                               |
| `/robots.txt`                   | Crawl rules and sitemap location                                     |
| `/rss.xml`                      | Published articles only                                              |
| `/opengraph-image`              | Generated social image                                               |

Unknown routes, missing articles, production drafts, and future-dated articles return HTTP 404 with noindex metadata. Article pages have a scoped loading state after availability validation; a shared retryable error boundary handles rendering failures. The Writing index and other static pages render their content directly instead of flashing a global loading placeholder.

## Project structure

```text
content/writing/          # Owner articles, including the site launch note
templates/article.mdx    # Unpublished authoring template
src/
  app/                   # Routes, layouts, metadata endpoints, error states
  components/            # Header, footer, content entries, MDX, focus management
  lib/
    content.ts           # Professional experience and project data
    site.ts              # Public identity, contact details, and canonical routes
    site-url.ts          # Production-origin validation
    metadata.ts          # Route metadata and Person schema
    writing.ts           # Validated MDX index, publication rules, reading time
  styles/                # Tailwind tokens and editorial layout/prose styles
tests/
  e2e/                   # Navigation, content, SEO, responsive layout, axe
  visual/                # Screenshot tests and reviewed baselines
  articles/              # Isolated published/draft article tests
  authoring/             # Add/edit/delete MDX while a dev server is running
  fixtures/writing/      # Test-only MDX, excluded from the regular build
  config/                # Production-origin validation tests
scripts/                 # Test builds, typechecking, Lighthouse
output/                  # Ignored local reports, traces, and screenshots
```

## Updating the website

### Cards and role copy

Experience, the project preview, and About details use restrained bordered cards in `src/styles/globals.css`. The homepage uses a full-width Robotics Startup card followed by two experience cards; mobile stacks them. Each work card groups the company and role together, with the period alongside on desktop and below on mobile. Description and technical focus follow underneath. The detailed work index keeps a single column. Project navigation is on the project title. Work case studies share breadcrumbs and a related-work navigation block with company names; the project case links directly to Projects and Work. About has no trailing work CTA.

Robotics Startup is presented as a CTO role: MVP architecture, engineering leadership, the technical roadmap, and hands-on Rust/Go development. Keep `src/lib/content.ts`, biography/case-study copy, site metadata, and Person structured data consistent when changing that role.

### Illustrations and motion

The homepage is a short personal introduction followed by experience, a project, and writing. A large conceptual industrial manipulator (`src/components/robot-note.tsx`) accompanies the Robotics Startup introduction. The complete biography column, including the name and role, is vertically centered against the figure on desktop and tablet; mobile stacks the columns. The SVG is rendered on the server and has six animated parts: shoulder, elbow, wrist, tool, and two gripper fingers. The figure has a 360px desktop column and uses the available content width on mobile. It contains no Rust/Go labels. Contact links stay beside the biography. Experience and project titles use H2 on index pages and H3 within homepage sections.

Both illustrations loop while they are visible, with no pause/play buttons. The manipulator uses an **eight-second** pick-and-place cycle: approach, close the jaws, lift the box, lower it onto the platform, open the jaws, and return. `src/lib/robot-motion.ts` solves the joint rotations and box positions on the server from a single tool trajectory. The gripper stays upright and the box follows it only while held. CSS interpolates those keyframes; there are no per-frame React updates or animation-library dependencies.

The volleyball travels forwards and backwards along the same arc, taking **4.8 seconds per direction**. Camera-ray angles stay continuous across atan2's +π/−π boundary; this prevents the second camera's ray from spinning between keyframes. The ball, its projection, and all three rays share the timeline.

`MotionFigure` only observes viewport visibility: offscreen motion resets, and returning to the figure starts it again. The volleyball figure owns its visible caption. The robot has no visible title, link, caption, or caption divider; its SVG title and description remain available to assistive technology. CSS respects reduced motion, including preference changes, and shows a complete static scene. Continuous motion without an on-page pause control follows the owner's explicit design request; automated axe results alone do not establish full WCAG conformance.

Article previews use bordered cards in a two-column grid, stacking into one column below 768px. Each card shows the date, reading estimate, title, description, and an explicit **Open** link at the bottom; actions align within each row. The link's accessible name includes the article title. The title remains a link as well. This shared component covers the homepage and Writing index; no button or placeholder article appears when the index is empty. The isolated MDX suite verifies both destinations and keyboard interaction without adding public articles.

The volleyball illustration (`src/components/tracking-diagram.tsx`) animates a ball, its court projection, and three camera sight lines from one shared trajectory in `src/lib/tracking-motion.ts`. CSS keyframes are generated on the server; there is no animation library or per-frame React state. `MotionFigure` is the small client boundary that starts the loop on viewport entry and resets it offscreen. Reduced motion displays the static mid-flight illustration. The trajectory is conceptual, not recorded project data.

The tests in `tests/e2e/motion.spec.ts` check pickup/placement order, attachment of the carried box, repetition across cycles, camera convergence at 4ms intervals between keyframes, loop-boundary continuity, offscreen replay, hero alignment, absence of robot labels, and reduced-motion changes. Visual tests disable animation for reproducible comparisons.

Public identity, contact details, and canonical route inventory live in `src/lib/site.ts`. Professional experience and project summaries live in `src/lib/content.ts`. Long-form biography and case-study copy is in the corresponding route file. Header navigation is in `src/components/header.tsx`.

To update experience, edit the appropriate `work` entry. `WorkEntry` renders it on both the homepage and work index. Keep the relevant case study consistent. Robotics Startup product goals are explicitly distinguished from development work; do not convert them into shipped-feature or commercial-traction claims without evidence.

The public role is centralized as `CTO at Robotics Startup and Software engineer`. The startup uses the generic name **Robotics Startup** throughout visible copy, metadata, structured data, and the social image. Its canonical case-study URL is `/work/robotics-startup`; the previous URL permanently redirects with HTTP 308 and is excluded from the sitemap.

The startup description was checked against current Plane tasks and GitHub implementation work on 15 October 2026. It emphasizes hosted builds, release verification/signing, controlled device updates, and the CTO's work on signing workers, artifact storage/caching, and backend reliability. The complete MVP is still being integrated and validated. Private source references are retained only in the local delivery report, outside public content.

Article pages separate the title and summary, author and publication metadata, optional table of contents, article body, and return/RSS navigation. The reading column is limited to 720px. Long code and tables scroll inside their own containers.

To add a project, add its data in `src/lib/content.ts`, a preview in the projects index, and a route under `src/app/projects/`. Add metadata with `pageMetadata`, add the URL to `publicRoutes`, and include it in the route/link/responsive tests. Update selected homepage projects if appropriate. Do not fill the index with fictional projects.

## Current articles

`content/writing/the-site-is-up.mdx` is the site's first published note: **The site is up**. It announces the website and future writing about software and robotics. It appears on the homepage, the Writing index, RSS, and the sitemap in both development and production.

The three former test drafts have been removed. Test-only articles remain isolated in `tests/fixtures/writing` and never appear in the normal website build. Future owner drafts can still be previewed locally with noindex and no BlogPosting schema; publication requires `draft: false` and a publication date that has arrived.

## Publishing an MDX article

The article directory is **`content/writing/`**. Every `.mdx` file there is discovered automatically: the filename becomes `/writing/<filename-without-extension>`, and frontmatter supplies the Writing card and page metadata. No imports, route files, or manual list edits are needed. A short authoring guide is also available in [`content/writing/README.md`](content/writing/README.md).

1. Copy `templates/article.mdx` to `content/writing/your-article-slug.mdx`. Filenames must be lowercase kebab-case.
2. Write the article and replace every template field. Keep `draft: true` while writing.
3. Preview through `npm run dev` at `/writing/your-article-slug`. Development previews include an unpublished notice and noindex metadata.
4. Set a real publication date and `draft: false` when ready. Run the checks below and rebuild.

```yaml
---
title: "Your actual article title"
description: "A concise, accurate summary of your article."
date: "2026-10-15"
updatedAt: "2026-10-16" # optional; cannot precede date
tags: [distributed-systems, reliability]
draft: true
# canonicalUrl: "https://original-publication.com/article" # optional
---
```

The article title supplies H1. Start body sections at `##` and do not skip heading levels. Three or more body headings enable a table of contents; duplicate heading names get distinct anchors. Use fenced code blocks with a language, such as `typescript`, `go`, `rust`, or `python`. Optional code titles use `title="filename.ts"`. Code and tables scroll within the reading column and are keyboard focusable.

GitHub-flavored Markdown, JSX using native HTML elements, expressions, tables, inline mathematics (`$x^2$`), and display mathematics (`$$...$$`) are supported. MDX is compiled and rendered on the server; it does not require a client-side runtime. Custom components must be registered in `src/components/mdx.tsx`; relative component imports are not configured. Code highlighting uses Shiki through `rehype-pretty-code`; math uses `remark-math` and `rehype-katex`. The KaTeX override keeps the renderer and parser on the patched version tested by the fixture suite. Invalid frontmatter and skipped Markdown heading levels fail the build. Inspect mathematical expressions in the preview; KaTeX may render invalid expressions as an error.

Reading time is an estimate at 220 prose words per minute, excluding fenced code, with a one-minute minimum. The index sorts by date descending, with a stable slug tie-breaker. Dates are interpreted in UTC. Future-dated content is withheld until a build on or after that date; this is a static site, so publishing a scheduled article requires a rebuild.

MDX is executable content and must be authored by the trusted website owner. Do not pass visitor input or untrusted remote MDX to the evaluator. Keep verification examples in `tests/fixtures/writing`, separate from owner articles.

### Drafts and feed behavior

- Production excludes drafts and future-dated articles from routes, index, RSS, and sitemap.
- Development can preview drafts and future articles, with noindex and no BlogPosting schema.
- RSS always includes only published articles, even during development.
- An external `canonicalUrl` identifies the original publication. Such an article remains readable and in RSS, but its duplicate local URL is excluded from the sitemap.
- Editing or adding articles requires a production rebuild. During development, refresh the browser after changing a file; newly added slugs resolve without restarting the server.

## SEO and architecture

See [Search and AI discovery](docs/SEO.md) for the SEO/GEO audit, crawler policy, canonical-domain setup, optional Google/Bing verification tokens, publication steps, and the limits of local tests. The About page has a `ProfilePage` with the shared `Person` identity and visible Hold404 profile links. Case studies include structured breadcrumbs matching their navigation.

Every public page has a unique title and description, canonical URL, Open Graph data, and Twitter card metadata through the Next.js Metadata API. `Person` structured data represents ongoing university attendance as an affiliation, not a completed degree. `WebSite` and published `BlogPosting` schemas share the same owner identity. JSON-LD is safely serialized. The sitemap does not invent last-modified dates for static biography pages.

Public pages are Server Components and prerender at build time. Small client boundaries handle the menu, route-change focus, retryable errors, and illustration viewport visibility. The diagrams and motion keyframes are rendered on the server. Content reads run in parallel and are request-memoized. The homepage streams only its Writing preview through a local Suspense boundary; the introduction, robot, and work do not wait for article loading and render without client JavaScript. Robot keyframes retain exact phase boundaries while limiting sampled frames and numeric precision to keep the HTML small. There is no client data-fetching layer because all content is local. This follows the priorities in [Vercel’s React Best Practices](https://vercel.com/blog/introducing-react-best-practices): avoid waterfalls and unnecessary client JavaScript. See also the [official Next.js MDX guide](https://nextjs.org/docs/app/guides/mdx).

Geist fonts are self-hosted through `next/font`. The original SVG schematic is labelled conceptual; there are no project screenshots, fake code decorations, tracking scripts, or remote images. Links open in the current tab so users control whether to open a new tab. The menu is an inline disclosure, so it does not trap focus. Escape closes it and returns focus to the menu button; navigation moves focus to the page heading.

## Verification

```sh
npm run format:check
npm run lint
npm run typecheck
npm run test:config
npm run build:test
npm run test:e2e
npm run test:articles
npm run test:authoring
npm run audit:lighthouse
npm audit --omit=dev
```

The main Playwright suite covers all ten public page routes, browser history, contact targets, missing routes, rendered metadata, structured data, heading hierarchy, internal links, responsive overflow, focus, and WCAG 2.2 AA checks through axe. Responsive tests use **320, 375, 390, 768, 1024, 1440, and 1920px**. Screenshots are saved for all ten pages at every width; visual comparison baselines cover **390, 768, and 1440px**.

```sh
# Inspect the latest report
npx playwright show-report output/playwright/report

# Update visual baselines only after inspecting intentional changes
npm run test:visual -- --update-snapshots
```

Baselines were captured with bundled Playwright Chromium on macOS arm64. Font rasterization can differ on other operating systems. Review legitimate differences before approving new baselines. Passing snapshots does not replace visual inspection or manual keyboard checks.

`npm run test:articles` builds to `.next-fixtures`, serves on port 3101, and exercises published articles, canonical overrides, draft/future exclusion, chronological ordering, highlighting, math, TOC anchors, feed escaping, accessibility, and code overflow. It never writes into `content/writing` or replaces the ordinary `.next` build. `WRITING_FIXTURES=1` requires `SITE_TEST_MODE=1` and must never be used for deployment.

`npm run test:authoring` starts an isolated development server on port 3102, warms an article route, then creates, opens, edits, and deletes a temporary MDX fixture without restarting the server. It verifies automatic cards, keyboard Open navigation, JSX rendering, noindex, and HTTP 404 after removal. The temporary file is cleaned up in `finally`; owner articles in `content/writing` are never modified. Run this suite separately from `test:articles` because they share the isolated fixture directory.

Development discovers new MDX slugs without restarting. `generateStaticParams` prerenders known published articles; Pages serves only these exported routes, so a new article requires a new build and deployment. The article layout checks availability before its loading boundary can stream a response, so missing and production-unpublished slugs return HTTP 404. Filesystem reads are request-memoized across layout, metadata, and page rendering.

Lighthouse runs against the ordinary production build at port 3200, using the installed Playwright Chromium executable, the standard mobile configuration, and Lighthouse’s desktop preset. It audits the homepage, work index, and volleyball project. HTML, JSON, and a score summary are written under `output/lighthouse/`. Scores are lab measurements on the local machine; real hosting and field Core Web Vitals can differ.

Quick manual checklist:

- Navigate using only Tab, Shift+Tab, Enter, Space, and Escape.
- Check the mobile menu, skip link, visible focus, and focus after navigation.
- Read the home, case-study, contact, and article layouts at narrow and wide sizes.
- Confirm the real domain in generated HTML, RSS, sitemap, and social metadata before deployment.
- Confirm that no draft, test fixture, phone number, or invented achievement is published.

See `VERIFICATION.md` for executed checks, results, environment details, and remaining limitations.
