import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("optional webmaster verification tokens are emitted from build configuration", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(
    page.locator('head meta[name="google-site-verification"]'),
  ).toHaveAttribute("content", "isolated-google-verification");
  await expect(page.locator('head meta[name="msvalidate.01"]')).toHaveAttribute(
    "content",
    "isolated-bing-verification",
  );
});

test("article index is chronological and excludes draft and future content", async ({
  page,
}) => {
  await page.goto("/writing");
  await expect(
    page.locator(".article-preview").getByRole("heading", { level: 2 }),
  ).toHaveText(["MDX verification fixture", "Earlier verification fixture"]);
  await expect(page.getByText("No articles published yet.")).toHaveCount(0);
  await page.locator(".article-preview a").first().click();
  await expect(page).toHaveURL(/\/writing\/published-fixture$/);
  for (const slug of ["draft-fixture", "future-fixture", "missing"])
    expect((await page.goto(`/writing/${slug}`))?.status()).toBe(404);
});

test("Open actions are explicit, keyboard accessible, and target their own article", async ({
  page,
}, testInfo) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/writing"]) {
      await page.goto(route);
      const previews = page.locator(".article-preview");
      await expect(previews).toHaveCount(2);
      const open = previews.first().getByRole("link", {
        name: "Open: MDX verification fixture",
        exact: true,
      });
      await expect(open).toHaveText("Open →");
      await expect(open).toHaveAttribute("href", "/writing/published-fixture");
      await expect(
        previews.nth(1).getByRole("link", {
          name: "Open: Earlier verification fixture",
          exact: true,
        }),
      ).toHaveAttribute("href", "/writing/older-fixture");
      expect((await open.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await open.focus();
      expect(
        await open.evaluate(
          (element) => getComputedStyle(element).outlineStyle,
        ),
      ).toBe("solid");
      await previews.first().screenshot({
        path: testInfo.outputPath(
          `open-${route === "/" ? "home" : "index"}-${width}.png`,
        ),
      });
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/writing\/published-fixture$/);
    }
  }
});

test("MDX renders JSX, highlighted code, math, tables, reading time and unique TOC anchors", async ({
  page,
}) => {
  await page.goto("/writing/published-fixture");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("[data-mdx-expression]")).toHaveText(
    "Server rendered MDX",
  );
  await expect(page.locator("pre code span[style]").first()).toBeVisible();
  await expect(page.locator(".katex").first()).toBeVisible();
  await expect(page.locator(".article-byline")).toContainText("1 min read");
  await expect(page.locator("table")).toBeVisible();
  const toc = page.getByRole("navigation", { name: "Table of contents" });
  await toc
    .getByRole("link", { name: "Typed results", exact: true })
    .nth(1)
    .click();
  await expect(page).toHaveURL(/#typed-results-1$/);
  await expect(page.locator("#typed-results-1")).toBeInViewport();
  await expect(page.locator("pre")).toHaveAttribute("tabindex", "0");
});

test("published metadata, canonical, and BlogPosting are generated in HTML", async ({
  page,
}) => {
  await page.goto("/writing/published-fixture");
  await expect(page).toHaveTitle(
    "MDX verification fixture — Jegors Dorofejevs",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
  await expect(
    page.locator('meta[property="article:published_time"]'),
  ).toHaveAttribute("content", "2026-01-15");
  await expect(
    page.locator('meta[property="article:modified_time"]'),
  ).toHaveAttribute("content", "2026-01-16");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://portfolio.example/writing/published-fixture",
  );
  const schemas: Record<string, unknown>[] = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((elements) =>
      elements.map((element) => JSON.parse(element.textContent ?? "")),
    );
  expect(
    schemas.find((schema) => schema["@type"] === "BlogPosting"),
  ).toMatchObject({
    headline: "MDX verification fixture",
    datePublished: "2026-01-15",
    dateModified: "2026-01-16",
  });
  await page.goto("/writing/older-fixture");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://original.example/engineering-note",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://original.example/engineering-note",
  );
});

test("published-only RSS and sitemap honor canonical ownership and escape XML", async ({
  request,
  page,
}) => {
  const rss = await (await request.get("/rss.xml")).text();
  expect(rss).toContain("published-fixture");
  expect(rss).toContain("older-fixture");
  expect(rss).toContain("math &amp; code");
  expect(rss).not.toContain("draft-fixture");
  expect(rss).not.toContain("future-fixture");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("published-fixture");
  expect(sitemap).not.toContain("older-fixture");
  expect(sitemap).not.toContain("draft-fixture");
  expect(sitemap).not.toContain("future-fixture");
  await page.goto("/");
  const parsed = await page.evaluate((xml) => {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    return {
      errors: doc.querySelectorAll("parsererror").length,
      items: doc.querySelectorAll("item").length,
    };
  }, rss);
  expect(parsed).toEqual({ errors: 0, items: 2 });
});

for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
  test(`article remains readable and code scrolls within ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/writing");
    await expect(page.locator(".article-open").first()).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.goto("/writing/published-fixture");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const pre = page.locator("pre");
    expect(
      await pre.evaluate(
        (element) => element.scrollWidth > element.clientWidth,
      ),
    ).toBeTruthy();
    await pre.focus();
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() => pre.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0);
    if ([390, 768, 1440].includes(width))
      await page.screenshot({
        path: testInfo.outputPath(`article-${width}.png`),
        fullPage: true,
      });
  });
}

test("published article passes WCAG automated checks", async ({ page }) => {
  await page.goto("/writing");
  await expect(page.locator(".article-open").first()).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.goto("/writing/published-fixture");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
