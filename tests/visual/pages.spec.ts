import { test, expect } from "@playwright/test";
for (const width of [390, 768, 1440]) {
  for (const route of [
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
  ]) {
    test(`visual ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (route === "/" || route === "/writing") {
        await expect(page.locator(".article-preview")).toHaveCount(1);
        await expect(
          page.getByRole("link", { name: "Open: The site is up" }),
        ).toBeVisible();
      }
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(
        `${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${width}.png`,
        { fullPage: true },
      );
    });
  }
}
