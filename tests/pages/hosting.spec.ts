import { test, expect } from "@playwright/test";

test("Pages applies security headers and serves the generated binary image", async ({
  request,
}) => {
  for (const route of ["/", "/about", "/writing/the-site-is-up"]) {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
    expect(response.headers()["referrer-policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(response.headers()["permissions-policy"]).toBe(
      "camera=(), microphone=(), geolocation=()",
    );
    expect(response.headers()["x-robots-tag"] ?? "").not.toContain("noindex");
  }
  const image = await request.get("/opengraph-image");
  expect(image.headers()["content-type"]).toBe("image/png");
  expect((await image.body()).subarray(0, 8).toString("hex")).toBe(
    "89504e470d0a1a0a",
  );
});

test("Pages caches fingerprinted assets and delivers valid assets after navigation", async ({
  page,
  request,
}) => {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(response.url());
  });
  await page.goto("/");
  const script = await page
    .locator('script[src^="/_next/static/"]')
    .first()
    .getAttribute("src");
  expect(script).toBeTruthy();
  const response = await request.get(script!);
  expect(response.headers()["cache-control"]).toContain("immutable");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Writing", exact: true })
    .click();
  await page.getByRole("link", { name: "Open: The site is up" }).click();
  await expect(page.locator(".article-prose")).toContainText("More soon.");
  expect(failures).toEqual([]);
});
