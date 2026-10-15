# Cloudflare Pages

## Assumptions and scope

The existing portfolio remains the source of the design and content. The cloned repository is the deployable copy. This task authorizes publication and GitHub pushes; no services are purchased. Use the owner's Cloudflare account and a dedicated `dorofejevs-me` Pages project. Until a custom domain is connected, use the working Pages origin as the canonical URL.

## Implementation

1. Clone the requested repository and copy the website without credentials, caches, or local reports.
2. Add a separate `build:pages` static-export mode, retaining normal Next.js development and test builds.
3. Move hosting-only headers and redirects to Pages configuration.
4. Generate MDX pages, RSS, sitemap, and social images at build time.
5. Test the exported artifact through Wrangler, including navigation, missing pages, metadata, accessibility, and visual comparisons.
6. Deploy locally with Wrangler and push `main` with the automated deployment workflow.
7. Verify the public origin and the GitHub Actions run.

## Commands

```sh
npm ci
npx playwright install chromium
npm run dev

npm run format:check
npm run lint
npm run typecheck
npm run test:config
SITE_URL=https://dorofejevs-me.pages.dev npm run build:pages
SITE_URL=https://dorofejevs-me.pages.dev npm run test:pages
npm run preview:pages

# First-time interactive account authorization, if needed:
npx wrangler login
# The project already exists; do not create another one for CI.
CLOUDFLARE_ACCOUNT_ID=4885cc5878d5767dbef79f56c1a2cfed SITE_URL=https://dorofejevs-me.pages.dev npm run deploy:pages
```

`deploy:pages` rebuilds with a validated real URL, then runs `wrangler pages deploy out --branch main`. Test-mode/fixture builds are rejected. No Node.js process runs in production: only exported static files are uploaded. `npm start` is for a normal `npm run build`, not an exported Pages build. Do not run competing builds in the same checkout simultaneously.

## GitHub Actions

The workflow runs on pushes to `main` and manual dispatches on `main`. It serializes deployments, pins third-party actions to commit SHAs, installs locked dependencies, and runs verification before publication. The Cloudflare token is available only to the deploy step. Repository permissions are read-only; deployment uses Cloudflare's token, not GitHub write access.

Add the repository Actions secret **CLOUDFLARE_API_TOKEN** at <https://github.com/Hold404/dorofejevs.me/settings/secrets/actions>. Create a dedicated Cloudflare API token with **Account → Cloudflare Pages → Edit**, restricted to account `4885cc5878d5767dbef79f56c1a2cfed`. Wrangler's local OAuth session is for interactive use and is not a CI credential.

Repository Actions variables:

- `CLOUDFLARE_ACCOUNT_ID`: `4885cc5878d5767dbef79f56c1a2cfed` (public account identifier).
- `SITE_URL`: initially `https://dorofejevs-me.pages.dev`.
- `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`: optional public webmaster verification values.

Both local CLI and CI use the project name in `wrangler.jsonc`. The account ID comes from `CLOUDFLARE_ACCOUNT_ID`, a public environment/Actions variable; Pages does not accept it in the Wrangler configuration file. Never commit a token or `.env.local`.

CI runs the browser, axe, crawler and hosting tests. Visual comparisons are excluded on Linux because the reviewed baselines were rendered on macOS; `npm run test:pages` locally includes them. A missing CI secret produces an explicit deployment error after verification, never a false successful deployment.

## Domains and indexing

Connect `dorofejevs.me` through this Pages project's **Custom domains**, following its DNS instructions. After HTTPS resolves correctly, change the repository `SITE_URL` variable and rebuild. Add a host-specific permanent redirect from `dorofejevs-me.pages.dev` to the custom domain. Do not redirect the primary hostname before the target works.

`public/_headers` keeps the primary hostname indexable and applies `noindex` to deployment-specific subdomains. `public/_redirects` preserves the old case-study URL with HTTP 308. The generated `404.html` prevents Pages' SPA fallback from returning HTTP 200 for nonexistent articles. RSS uses native anchors to avoid React prefetches for an XML document.

After a deployment, check all public pages, canonical URLs, the PNG social image, RSS/XML content types, the sitemap, robots.txt, the legacy redirect, and real 404 responses. Confirm Google/Bing verification and submit the sitemap separately; deployment alone does not establish indexing or AI citations.

## Rollback

Use the Pages dashboard's deployment history to roll back to an earlier successful production deployment. Then revert the responsible Git commit and push `main`, so source and deployment match. Changing a domain requires rebuilding because metadata is generated statically.

## Sources

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Pages static Next.js hosting](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Wrangler direct upload with CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)
- [Pages headers](https://developers.cloudflare.com/pages/configuration/headers/) and [redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Vercel React best practices](https://vercel.com/blog/introducing-react-best-practices): keep static content server-rendered and avoid unnecessary client work.
