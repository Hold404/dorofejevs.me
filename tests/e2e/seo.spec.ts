import { test, expect } from "@playwright/test";

const siteUrl = process.env.SITE_URL ?? "https://portfolio.example";

const routes = [
  "/",
  "/work",
  "/work/robotics-startup",
  "/work/domido",
  "/work/virtuosohub",
  "/projects",
  "/projects/volleyball-tracking",
  "/writing",
  "/writing/the-site-is-up",
  "/about",
  "/contact",
];
for (const route of routes) {
  test(`rendered HTML metadata and heading structure: ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page).toHaveTitle(/Jegors Dorofejevs/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S.{40,}/,
    );
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ]) {
      await expect(page.locator(selector)).not.toHaveAttribute(
        "content",
        /Co-CEO|Robots\s?CI|technical founder/i,
      );
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${siteUrl}${route === "/" ? "" : route}`,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `${siteUrl}${route === "/" ? "" : route}`,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      await page.title(),
    );
    const socialImage = new URL(
      (await page
        .locator('meta[property="og:image"]')
        .first()
        .getAttribute("content"))!,
    );
    expect(socialImage.origin).toBe(siteUrl);
    expect(socialImage.pathname).toBe("/opengraph-image");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow, max-image-preview:large, max-snippet:-1",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    const headings = await page
      .locator("h1,h2,h3,h4,h5,h6")
      .evaluateAll((elements) =>
        elements.map((element) => Number(element.tagName.slice(1))),
      );
    for (let index = 1; index < headings.length; index++)
      expect(
        headings[index]! - headings[index - 1]!,
        `heading ${index}`,
      ).toBeLessThanOrEqual(1);
    const schemas: Record<string, unknown>[] = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((elements) =>
        elements.map((element) => JSON.parse(element.textContent ?? "")),
      );
    expect(
      schemas.some((schema) => schema["@type"] === "WebSite"),
    ).toBeTruthy();
    if (route === "/writing/the-site-is-up") {
      expect(
        schemas.find((schema) => schema["@type"] === "BlogPosting"),
      ).toMatchObject({
        headline: "The site is up",
        datePublished: "2026-10-15",
      });
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
        "content",
        "article",
      );
    }
    if (route === "/" || route === "/about") {
      const profile = schemas.find(
        (schema) => schema["@type"] === "ProfilePage",
      );
      const person =
        route === "/about"
          ? (profile?.mainEntity as Record<string, unknown> | undefined)
          : schemas.find((schema) => schema["@type"] === "Person");
      expect(person?.name).toBe("Jegors Dorofejevs");
      expect(person?.["@id"]).toBe(`${siteUrl}/#person`);
      expect(person?.alternateName).toBe("Hold404");
      expect(person?.url).toBe(`${siteUrl}/about`);
      expect(person?.description).toContain("Jegors Dorofejevs");
      if (route === "/about") {
        expect(profile).toMatchObject({
          "@id": `${siteUrl}/about#profile`,
          url: `${siteUrl}/about`,
          isPartOf: { "@id": `${siteUrl}/#website` },
        });
        await expect(page.locator("main")).toContainText("Hold404");
      }
      expect(person?.jobTitle).toBe(
        "CTO at Robotics Startup and Software engineer",
      );
      expect(person?.worksFor).toEqual({
        "@type": "Organization",
        name: "Robotics Startup",
      });
      expect(person?.sameAs).toEqual([
        "https://github.com/Hold404",
        "https://www.linkedin.com/in/hold404",
      ]);
      expect(person).not.toHaveProperty("alumniOf");
      expect(JSON.stringify(person?.affiliation)).toContain("student");
    }
    if (route.startsWith("/work/") || route.startsWith("/projects/")) {
      const breadcrumb = schemas.find(
        (schema) => schema["@type"] === "BreadcrumbList",
      );
      expect(breadcrumb?.itemListElement).toEqual([
        {
          "@type": "ListItem",
          position: 1,
          name: route.startsWith("/work/") ? "Work" : "Projects",
          item: `${siteUrl}/${route.split("/")[1]}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: await page
            .locator('.breadcrumb [aria-current="page"]')
            .textContent(),
          item: `${siteUrl}${route}`,
        },
      ]);
    }
  });
}

test("titles and descriptions are unique across routes", async ({ page }) => {
  const titles: string[] = [];
  const descriptions: string[] = [];
  for (const route of routes) {
    await page.goto(route);
    titles.push(await page.title());
    descriptions.push(
      (await page.locator('meta[name="description"]').getAttribute("content"))!,
    );
  }
  expect(new Set(titles).size).toBe(routes.length);
  expect(new Set(descriptions).size).toBe(routes.length);
});

test("sitemap, robots, RSS and social image are generated correctly", async ({
  request,
  page,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const route of routes)
    expect(xml).toContain(
      `<loc>${siteUrl}${route === "/" ? "/" : route}</loc>`,
    );
  expect(xml).not.toContain("fixture");
  expect(xml).not.toContain("/writing/test-");
  expect(xml).not.toContain("localhost");
  expect(xml).not.toContain("robotsci");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("User-Agent: *");
  expect(robots).toContain("Allow: /");
  expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  const feed = await request.get("/rss.xml");
  expect(feed.headers()["content-type"]).toContain("application/rss+xml");
  const rss = await feed.text();
  expect(rss.match(/<item>/g)).toHaveLength(1);
  expect(rss).toContain("The site is up");
  expect(rss).toContain(`${siteUrl}/writing/the-site-is-up`);
  expect(rss).not.toContain("/writing/test-");
  await page.goto("/");
  expect(
    await page.evaluate(
      (xmlSource) =>
        new DOMParser()
          .parseFromString(xmlSource, "text/xml")
          .querySelector("parsererror") === null,
      rss,
    ),
  ).toBeTruthy();
  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  expect((await image.body()).length).toBeGreaterThan(5000);
});
