import { test, expect } from "@playwright/test";

const siteUrl = process.env.SITE_URL ?? "https://portfolio.example";

// Local compatibility checks, not evidence of actual indexing or bot visits.
const agents = [
  [
    "Googlebot",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  ],
  [
    "Bingbot",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  ],
  [
    "OAI-SearchBot",
    "Mozilla/5.0 (compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot)",
  ],
  [
    "ChatGPT-User",
    "Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)",
  ],
  ["Claude-SearchBot", "Claude-SearchBot/1.0"],
  [
    "PerplexityBot",
    "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  ],
] as const;

const pages = [
  {
    path: "/",
    heading: "Jegors Dorofejevs",
    content: "release signing and backend reliability",
  },
  { path: "/about", heading: "About", content: "I use the name Hold404" },
  {
    path: "/work/robotics-startup",
    heading: "Robotics Startup",
    content: "The platform is in MVP development",
  },
  { path: "/writing", heading: "Writing", content: "The site is up" },
  {
    path: "/writing/the-site-is-up",
    heading: "The site is up",
    content: "More soon. Thanks for stopping by.",
  },
] as const;

for (const [name, userAgent] of agents) {
  test(`${name} receives readable content and metadata without JavaScript`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      userAgent,
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    try {
      const robots = await context.request.get(`${baseURL}/robots.txt`);
      expect(robots.status()).toBe(200);
      // The shared wildcard rule is deliberately inclusive; no agent-specific
      // group may accidentally override it with a narrower policy.
      expect((await robots.text()).trim()).toBe(
        `User-Agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml`,
      );
      for (const entry of pages) {
        const response = await page.goto(`${baseURL}${entry.path}`);
        expect(response?.status()).toBe(200);
        expect(response?.headers()["x-robots-tag"] ?? "").not.toMatch(
          /noindex|nosnippet/i,
        );
        const html = await response!.text();
        expect(html).not.toContain("isolated-google-verification");
        expect(html).not.toContain("isolated-bing-verification");
        await expect(page.locator("h1")).toHaveText(entry.heading);
        await expect(
          page.getByText(entry.content, { exact: false }).first(),
        ).toBeVisible();
        await expect(page.locator("head title")).toHaveCount(1);
        await expect(
          page.locator('head meta[name="description"]'),
        ).toHaveAttribute("content", /\S.{40,}/);
        await expect(
          page.locator('head link[rel="canonical"]'),
        ).toHaveAttribute(
          "href",
          `${siteUrl}${entry.path === "/" ? "" : entry.path}`,
        );
        await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
          "content",
          /index, follow/,
        );
        await expect(
          page.locator('head meta[name="robots"]'),
        ).not.toHaveAttribute("content", /noindex|nosnippet/);
        const schemas: Record<string, unknown>[] = await page
          .locator('script[type="application/ld+json"]')
          .evaluateAll((nodes) =>
            nodes.map((node) => JSON.parse(node.textContent ?? "")),
          );
        const website = schemas.find((schema) => schema["@type"] === "WebSite");
        expect(website?.author).toMatchObject({
          "@id": `${siteUrl}/#person`,
          name: "Jegors Dorofejevs",
          url: `${siteUrl}/about`,
        });
        if (entry.path === "/about") {
          const profile = schemas.find(
            (schema) => schema["@type"] === "ProfilePage",
          );
          expect(profile?.mainEntity).toMatchObject({
            "@type": "Person",
            "@id": `${siteUrl}/#person`,
            name: "Jegors Dorofejevs",
            alternateName: "Hold404",
          });
        }
        if (entry.path === "/writing/the-site-is-up") {
          const article = schemas.find(
            (schema) => schema["@type"] === "BlogPosting",
          );
          expect(article?.author).toMatchObject({
            "@id": `${siteUrl}/#person`,
            url: `${siteUrl}/about`,
          });
        }
      }
    } finally {
      await context.close();
    }
  });
}
