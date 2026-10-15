# Canonical-domain correction — 16 October 2026

The owner connected `dorofejevs.me` to the existing Pages project. HTTPS returned HTTP 200, and HTTP already redirected to HTTPS, but generated canonical URLs still referenced the original Pages hostname. The production `SITE_URL`, workflow fallback, build examples, sitemap/RSS/structured-data origin and alias indexing policy were updated for `https://dorofejevs.me`.

For this change, formatting, lint, TypeScript, the Pages production build and **95 local Playwright tests passed** (including 33 visual comparisons and 12 axe checks). No design or article content changed. Before the correction, 19 live SEO/crawler tests passed against the previous canonical origin; those results did not validate the newly connected domain.

The custom domain is indexable. Both the primary `pages.dev` alias and deployment-specific hostnames are marked `noindex`. Cloudflare Pages does not support host-level redirects in `_redirects`; a separate optional Bulk Redirect is documented but has not been configured. Search Console/Bing ownership verification, sitemap submission and actual indexing remain unverified. Missing HTML verification tags do not establish whether DNS verification has already been completed by the owner.

The CI token blocker in the historical record below was resolved: workflow run 38813132913, attempt 2, passed all checks and published production deployment `99f91e18-c3c2-4474-a046-c24f292cdddf`. The deployed site then passed 62 additional browser tests.

Commands for the domain correction:

```sh
npm run format:check
npm run lint
npm run typecheck
SITE_URL=https://dorofejevs.me npm run build:pages
SITE_URL=https://dorofejevs.me npm run test:pages
gh variable set SITE_URL --body https://dorofejevs.me --repo Hold404/dorofejevs.me
```

The following sections preserve the initial Pages deployment history.

# Cloudflare Pages verification

Checked 15 October 2026. This repository contains the portfolio copied from the existing local project, with a separate static-export build for Cloudflare Pages. The original checkout and development server remain untouched.

## Executed results

- `npm run lint`: passed, no warnings.
- `npm run typecheck`: passed.
- `npm run format:check`: passed.
- `npm run test:config`: **10 passed, 0 failed**, including rejection of test/fixture Pages builds.
- `SITE_URL=https://dorofejevs-me.pages.dev npm run build:pages`: passed. Pages, MDX, RSS, sitemap and social image generated statically.
- `SITE_URL=https://dorofejevs-me.pages.dev npm run test:pages`: **95 passed, 0 failed** against local Wrangler, including **33 visual comparisons** and **12 axe checks**.
- `npm run test:articles`: **14 passed, 0 failed** against an isolated fixture build; no fixture content is in the exported site.
- `npm run test:authoring`: **1 passed, 0 failed**; new MDX files open, update and disappear without restarting development.
- Responsive widths: **320, 375, 390, 768, 1024, 1440, 1920px**. Screenshot comparisons: **390, 768, 1440px**, covering all 11 public pages.
- `npm audit --omit=dev`: **0 vulnerabilities**. Full audit reports five development-only entries for the existing `braces` advisory through the Next.js lint dependency chain; the suggested incompatible major downgrade was not applied.
- Local Wrangler published 153 static files to project **dorofejevs-me**. Production: <https://dorofejevs-me.pages.dev>. Initial deployment: <https://94628e07.dorofejevs-me.pages.dev>.

## Corrections made during verification

The first browser run had one failing sitemap assertion because the test still assumed the reserved local origin; it now checks the configured build origin. Wrangler also exposed unnecessary React prefetches for RSS links; these links now use native anchors. The full suite passed after both fixes, without changing visual baselines. An unused import was removed to satisfy zero-warning lint.

Wrangler's Pages deploy validation rejects `account_id` in the config file. The account is now supplied through `CLOUDFLARE_ACCOUNT_ID` locally and the matching GitHub repository variable. Local preview and deployment share the same project name and static output directory.

## CI and public verification

The repository workflow runs verification before deploying on `main`. A separate `CLOUDFLARE_API_TOKEN` GitHub secret is required; a local interactive OAuth login does not satisfy this requirement. The first public-site browser run passed **62 tests, 0 failed**, including 12 axe checks. The deployment-specific hostname returned `X-Robots-Tag: noindex`; the primary hostname stayed indexable. Public mobile/tablet/desktop screenshots were captured and inspected.

[Initial GitHub Actions run](https://github.com/Hold404/dorofejevs.me/actions/runs/38812783329): installation, format, lint, types, build guards, production build and all **62 browser tests passed**. The deploy step stopped with the explicit missing `CLOUDFLARE_API_TOKEN` error. The live site was deployed successfully using local Wrangler; unattended CI publication is not verified until that secret is added and the workflow succeeds.

The screenshot review found a transient Writing loading fallback in the original homepage. Article data is now awaited before static rendering, and the no-JavaScript test requires the visible article card. The full 95-test local Pages suite passed again after this fix. Build guards now also run when Next.js loads environment files, preventing local `.env` values from enabling fixture content in an export.

## Commands

```sh
git clone https://github.com/Hold404/dorofejevs.me.git
npm install --save-dev --save-exact wrangler@4.151.0
npm run format:check
npm run lint
npm run typecheck
npm run test:config
npm audit --json
npm audit --omit=dev
SITE_URL=https://dorofejevs-me.pages.dev npm run build:pages
SITE_URL=https://dorofejevs-me.pages.dev npm run test:pages
npm run test:authoring
npm run test:articles
CLOUDFLARE_ACCOUNT_ID=4885cc5878d5767dbef79f56c1a2cfed wrangler pages project create dorofejevs-me --production-branch main
CLOUDFLARE_ACCOUNT_ID=4885cc5878d5767dbef79f56c1a2cfed node node_modules/wrangler/bin/wrangler.js pages deploy out --branch main --commit-dirty=true
SITE_URL=https://dorofejevs-me.pages.dev PAGES_TEST_URL=https://dorofejevs-me.pages.dev npm run test:pages
```

Local verification used the supplied Node runtime, `OPENSSL_CONF=/dev/null`, workspace-local npm/browser caches, and the supplied shell because of host OpenSSL/toolchain restrictions. GitHub uses Node.js 24 on Ubuntu. Local CLI authentication used the installed Wrangler; CI uses lockfile-pinned Wrangler.

## Limits

Custom domain `dorofejevs.me` is not connected or verified. The deployed Pages hostname is used consistently as the canonical origin. Search Console/Bing ownership verification and actual Google/AI indexing are not established by browser tests. No Lighthouse result from the earlier local Next.js implementation is claimed as a measurement of this deployment.

MAS1 Standard: one completed post-artifact internal review; no external agents or independent review. Graphify was unavailable and no graph existed; direct source inspection of build/config → static routes → Pages headers/redirects → CI and rendered tests provided the necessary cross-file evidence. The deployment uses build-time rendering and adds no client runtime dependencies.
