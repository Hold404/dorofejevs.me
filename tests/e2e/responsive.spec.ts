import { test, expect } from "@playwright/test";
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

for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
  test(`layout integrity across all pages at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const problems = await page.evaluate(() => {
        const overflow =
          document.documentElement.scrollWidth > window.innerWidth;
        const clipped = [
          ...document.querySelectorAll("h1,h2,h3,p,dt,dd,a,li,figcaption"),
        ]
          .filter((element) => {
            const style = getComputedStyle(element);
            if (
              element.getClientRects().length === 0 ||
              style.position === "fixed"
            )
              return false;
            const box = element.getBoundingClientRect();
            return (
              box.right > window.innerWidth + 1 ||
              box.left < -1 ||
              ((style.overflow === "hidden" || style.overflow === "clip") &&
                (element.scrollHeight > element.clientHeight + 1 ||
                  element.scrollWidth > element.clientWidth + 1))
            );
          })
          .map((element) => element.textContent?.slice(0, 80));
        const nav = document
          .querySelector(".main-nav")
          ?.getBoundingClientRect();
        const logo = document
          .querySelector(".wordmark")
          ?.getBoundingClientRect();
        const overlap =
          nav &&
          logo &&
          nav.width > 0 &&
          nav.left < logo.right &&
          nav.top < logo.bottom &&
          nav.bottom > logo.top;
        return { overflow, clipped, overlap: Boolean(overlap) };
      });
      expect(problems, `${route} at ${width}px`).toEqual({
        overflow: false,
        clipped: [],
        overlap: false,
      });
      await page.screenshot({
        path: testInfo.outputPath(
          `${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${width}.png`,
        ),
        fullPage: true,
      });
    }
    if (width < 768) {
      await page.getByRole("button", { name: "Menu" }).click();
      const links = page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link");
      for (const link of await links.all()) {
        await expect(link).toBeVisible();
        expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  });
}

test("reduced motion disables transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator(".intro-links a")
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe("0s");
});
