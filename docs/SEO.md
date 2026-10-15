# Search and AI discovery

Reviewed on 15 October 2026. This document describes technical readiness and the steps needed after publishing. Local tests cannot establish Google indexing, rankings, a Knowledge Panel, AI citations, or what a model knows without web search.

## Identity and content

`src/lib/site.ts` is the source for the owner's name, public handle, role, contact links, and site description. The visible About page connects **Jegors Dorofejevs**, **Hold404**, the CTO role at **Robotics Startup**, Enschede, and ongoing study at the University of Twente. Keep these facts consistent with the owner's public profiles.

The About page has `ProfilePage` structured data with a complete `Person` as its `mainEntity`. The same stable `/#person` identifier connects the homepage, website author, and article authors. `sameAs` contains only the supplied GitHub and LinkedIn profiles. Education remains an ongoing student affiliation, not `alumniOf` or a completed credential. The generic company name is intentional; do not add a registered company identity or company URL without the owner's instruction.

Case-study `BreadcrumbList` data mirrors the visible navigation. Published articles retain `BlogPosting`, actual publication/update dates, author links, canonical URLs, and sitemap/RSS inclusion. No invented profile statistics, profile creation dates, FAQ answers, or credentials are added for search engines.

All important biography, work, and article content is server rendered. Metadata is emitted using Next.js, with unique titles/descriptions, canonical URLs, OG/Twitter data, and public-page preview permissions. Drafts and missing pages remain excluded. No special bot-only content is served.

## Crawling and GEO

The wildcard `Allow: /` in `robots.txt` permits search crawlers, including Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, and PerplexityBot. It also retains the site's existing policy for other crawlers; training preferences were not changed by this work.

Search retrieval and model training are different. OpenAI documents OAI-SearchBot for ChatGPT search and GPTBot for potential training use. Allowing training does not guarantee that a model will know or cite the owner. A user-directed fetcher, such as ChatGPT-User, also differs from an indexing crawler. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)

The hosting/CDN must allow legitimate crawlers too. Check for accidental authentication, CAPTCHA challenges, blanket AI-bot blocks, or `X-Robots-Tag: noindex` on the public production site. Where allowlisting is needed, use the provider's current verified IP ranges and bot identity, rather than trusting a User-Agent string alone. [Perplexity guidance](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), [Anthropic guidance](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)

No `llms.txt`, hidden keywords, or AI-directed instructions are added. Google says its Search systems do not use `llms.txt` as an optimization signal, and recommends normal crawlability, useful content, and clear organization for generative search. Structured data describes the existing content; it is not a ranking or citation guarantee. [Google's AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

## Production domain and verification

1. Choose the canonical HTTPS origin and set `SITE_URL` before building. Do not use the reserved test origin for deployment. Use the same origin for redirects, canonical links, sitemap, and external profile links.
2. Verify the domain in Google Search Console and Bing Webmaster Tools. DNS verification is usually suitable for a domain property. If using their HTML-tag verification instead, set the exact public tokens from those tools:

   ```dotenv
   SITE_URL=https://your-actual-domain.com
   GOOGLE_SITE_VERIFICATION=token-from-google
   BING_SITE_VERIFICATION=token-from-bing
   ```

   These verification tokens are intended to appear in HTML; they are not account credentials. They are optional. Rebuild after setting or changing them. Google renders as `google-site-verification`; Bing renders as `msvalidate.01`. The isolated MDX test build verifies the mapping with temporary test tokens, never the normal build.

3. Build with `SITE_TEST_MODE` and `WRITING_FIXTURES` unset. Validate the generated HTML, `/robots.txt`, `/sitemap.xml`, `/rss.xml`, and social image against the real public origin.
4. Redirect alternate hostnames and HTTP to the chosen HTTPS origin at the host/CDN. Preserve the existing permanent case-study redirect. Avoid duplicate accessible versions of the same site.
5. After the owner publishes, use Search Console URL Inspection for `/`, `/about`, and `/writing/the-site-is-up`. Check the fetched HTML and rendered page, indexability, HTTP 200, and Google's selected canonical. Request indexing once those checks are correct.
6. Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Check fetch status and indexed-page reports. Bing also uses sitemaps to discover content for AI-powered search experiences. [Bing sitemap guidance](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/)
7. Review the property's available Search generative AI controls and performance reports in Search Console. Keep the site eligible for inclusion if AI visibility is desired. [Google guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
8. Add the canonical website link to the owner's GitHub and LinkedIn profiles and keep the name/role consistent. These are owner actions; this implementation does not modify external profiles or submit anything to search engines.

The initial Pages origin is `https://dorofejevs-me.pages.dev`. Canonicals, sitemap, RSS, and structured data use the build-time `SITE_URL`. Custom-domain ownership/connection, Search Console verification, public URL inspection, Rich Results Test and actual indexing remain separate checks. See `docs/DEPLOYMENT.md` before changing the canonical domain.

## Ongoing publishing and measurement

Write original engineering notes and case-study updates based on real work. Keep current responsibilities and dates accurate. Add links between relevant work, projects, and articles when useful to readers. Do not create near-duplicate pages for every query or generate articles solely to fill the index.

Use queries such as `Jegors Dorofejevs`, `Jegors Dorofejevs CTO`, and `Hold404 software engineer` to track discovery after indexing. For AI services with web search, ask who Jegors Dorofejevs is and inspect cited sources and factual accuracy. Record the service, date, query, cited URL, and incorrect details; responses vary and a single answer is not a stable ranking measure.

Monitor Search Console/Bing reports for impressions, indexed pages, crawl errors, and any AI visibility metrics available to the property. Use legitimate server logs to check crawler access. Lighthouse SEO is a technical diagnostic; a score of 100 is not evidence of rankings or citations.

## Repeatable local checks

```sh
npm run lint
npm run typecheck
npm run format:check
npm run test:config
npm run build:test
npm run test:e2e
npm run test:articles
npm run test:authoring
```

`tests/e2e/crawlers.spec.ts` verifies five routes with six search/fetcher User-Agents and JavaScript disabled. It checks visible text, real status codes, metadata in the HTML head, crawl policy, and the linked author/profile identity. These are simulated requests to the local production server, not visits by the real crawlers.

`tests/e2e/seo.spec.ts` checks the full public route set, structured data, snippets, canonical URLs, headings, RSS, sitemap, and image responses. The isolated article suite checks published-only behavior and verification-token rendering. `VERIFICATION.md` records executed results and limitations.

## Implementation references

- [Google ProfilePage guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page): an About Me page is an eligible profile use case; `mainEntity` identifies its person.
- [Next.js JSON-LD](https://nextjs.org/docs/app/guides/json-ld): server-rendered script with safe serialization.
- [Vercel React Best Practices](https://vercel.com/blog/introducing-react-best-practices): preserve server rendering and avoid unnecessary client JavaScript.
