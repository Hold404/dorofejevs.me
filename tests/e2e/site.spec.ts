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

test("homepage introduces the engineer and links to the main content", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Jegors Dorofejevs",
  );
  await expect(
    page.getByRole("link", { name: "Jegors Dorofejevs, home" }),
  ).toBeVisible();
  await expect(
    page.getByText("CTO at Robotics Startup and Software engineer", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "All experience" }),
  ).toHaveAttribute("href", "/work");
  await expect(
    page.getByRole("link", { name: "Volleyball tracking & replay" }),
  ).toHaveAttribute("href", "/projects/volleyball-tracking");
  await expect(
    page.getByRole("link", { name: "Read my writing" }),
  ).toHaveAttribute("href", "/writing");
});

test("desktop navigation and browser back/forward work", async ({ page }) => {
  await page.goto("/");
  for (const label of ["Work", "Projects", "Writing", "About", "Contact"]) {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: label, exact: label !== "Contact" })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${label.toLowerCase()}$`));
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: label, exact: label !== "Contact" }),
    ).toHaveAttribute("aria-current", "page");
  }
  await page.goBack();
  await expect(page).toHaveURL(/\/about$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/contact$/);
});

test("experience and supplied results remain accurate", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator("#robotics-startup .work-role")).toHaveText("CTO");
  await expect(page.locator("#robotics-startup")).toContainText(
    "Jul 2026 — Present",
  );
  await expect(page.locator("#domido")).toContainText("Avvyland Ltd.");
  await expect(page.locator("#domido")).toContainText("May 2026 — Present");
  await expect(page.locator("#virtuosohub")).toContainText(
    "Apr 2025 — May 2026",
  );
  await page.getByRole("link", { name: "VirtuosoHub", exact: false }).click();
  await expect(page.locator(".metrics")).toContainText("55%");
  await expect(page.locator(".metrics")).toContainText("40%");
  await page.goto("/work/robotics-startup");
  await expect(page.locator(".case-meta")).toContainText("CTO");
  await expect(
    page.getByRole("heading", { name: "My role as CTO" }),
  ).toBeVisible();
  await expect(
    page.getByText("Leading a four-person development team."),
  ).toBeVisible();
  await expect(
    page.getByText(/The platform is in MVP development/),
  ).toBeVisible();
  await expect(page.locator("main")).toContainText(
    "build caching and retention",
  );
  await expect(page.locator("main")).toContainText(
    "signing-worker integration and recovery",
  );
  await expect(page.locator("main")).toContainText(
    "Creating a release and authorizing its deployment are separate steps.",
  );
});

test("the previous work URL redirects permanently to the generic startup case", async ({
  page,
  request,
}) => {
  const response = await request.get("/work/robotsci", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/work/robotics-startup");
  await page.goto("/work/robotsci");
  await expect(page).toHaveURL(/\/work\/robotics-startup$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Robotics Startup",
  );
});

test("project explains detection, triangulation and replay", async ({
  page,
}) => {
  await page.goto("/projects");
  await expect(page.getByRole("link", { name: "How it works" })).toHaveCount(0);
  await page
    .getByRole("link", { name: "Volleyball tracking & replay" })
    .click();
  await expect(page).toHaveURL(/\/projects\/volleyball-tracking$/);
  for (const heading of [
    "Overview",
    "Problem",
    "Technical approach",
    "Detection",
    "Triangulation",
    "Replay generation",
    "Technologies",
  ])
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  await expect(
    page.getByText(/Conceptual illustration · multi-view triangulation/),
  ).toBeVisible();
});

test("DomiDo uses the correct name and all work cases have consistent navigation", async ({
  page,
}) => {
  for (const route of ["/", "/work"]) {
    await page.goto(route);
    await page
      .locator("#domido")
      .getByRole("link", { name: "DomiDo", exact: true })
      .click();
    await expect(page).toHaveURL(/\/work\/domido$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("DomiDo");
    await expect(page.locator(".case-meta")).toContainText("Avvyland Ltd.");
    await expect(page.locator(".case-meta")).toContainText(
      "May 2026 – Present",
    );
    await expect(
      page.getByRole("heading", { name: "Asynchronous processing" }),
    ).toBeVisible();
  }
  for (const [slug, name] of [
    ["robotics-startup", "Robotics Startup"],
    ["domido", "DomiDo"],
    ["virtuosohub", "VirtuosoHub"],
  ]) {
    await page.goto(`/work/${slug}`);
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText(name!);
    await expect(
      breadcrumb.getByRole("link", { name: "Work", exact: true }),
    ).toHaveAttribute("href", "/work");
    const other = page.getByRole("navigation", { name: "Other work" });
    await expect(other.getByRole("link")).toHaveCount(2);
    await expect(
      other.getByRole("link", { name: name!, exact: true }),
    ).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(
      /Next:|Discuss an engineering problem|Domido/,
    );
    await other.getByRole("link").first().click();
    await expect(page).not.toHaveURL(new RegExp(`/work/${slug}$`));
  }
  await page.goto("/projects/volleyball-tracking");
  await expect(page.locator("main")).not.toContainText(
    "Discuss an engineering problem",
  );
});

test("writing shows only the launch note and contact destinations are correct", async ({
  page,
}) => {
  for (const route of ["/", "/writing"]) {
    await page.goto(route);
    await expect(page.locator(".article-preview")).toHaveCount(1);
    await page.getByRole("link", { name: "Open: The site is up" }).click();
    await expect(page).toHaveURL(/\/writing\/the-site-is-up$/);
    await expect(page.locator("h1")).toHaveText("The site is up");
    await expect(page.locator(".article-prose")).toContainText(
      "More soon. Thanks for stopping by.",
    );
    await expect(page.locator(".draft-notice")).toHaveCount(0);
  }
  await expect(
    page.getByText(/fixture|lorem ipsum|Replace with your article/i),
  ).toHaveCount(0);
  await page.goto("/contact");
  await expect(
    page.locator("main a[href='mailto:jegors.s.dorofejevs@gmail.com']"),
  ).toBeVisible();
  await expect(
    page.locator("main a[href='https://github.com/Hold404']"),
  ).toBeVisible();
  await expect(
    page.locator("main a[href='https://www.linkedin.com/in/hold404']"),
  ).toBeVisible();
  await expect(page.locator("a[href^='tel:']")).toHaveCount(0);
});

test("all public routes load without errors or broken internal links", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const links = new Set<string>();
  for (const route of routes) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("body")).not.toContainText(
      /Co-CEO|Robots\s?CI|technical founder/i,
    );
    for (const href of await page
      .locator("a[href^='/']")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")!)))
      links.add(href);
  }
  for (const href of links)
    expect((await request.get(href)).status(), href).toBe(200);
  expect(errors).toEqual([]);
  await page.goto("/about");
  await expect(page.getByRole("link", { name: "Explore my work" })).toHaveCount(
    0,
  );
});

test("missing pages and missing articles return real 404s", async ({
  page,
}) => {
  for (const path of [
    "/this-does-not-exist",
    "/writing/missing-article",
    "/writing/draft-fixture",
    "/writing/test-retries-and-idempotency",
    "/writing/test-robot-software-rollouts",
    "/writing/test-reconstructing-a-trajectory",
  ]) {
    expect((await page.goto(path))?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Nothing at this address.",
    );
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
  }
});

test("mobile navigation supports keyboard, Escape, selection and focus", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeHidden();
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Close" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("navigation")
      .getByRole("link", { name: "Work", exact: true }),
  ).toBeFocused();
  await page.screenshot({
    path: testInfo.outputPath("mobile-menu-keyboard-focus.png"),
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
  await page.screenshot({
    path: testInfo.outputPath("mobile-menu-escape-focus.png"),
  });
  await page.keyboard.press("Space");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.screenshot({
    path: testInfo.outputPath("mobile-route-heading-focus.png"),
  });
});

test("skip link is the first keyboard stop and focus is visible", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  expect(
    await skip.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("homepage introduction and work render without waiting for client scripts", async ({
  browser,
  baseURL,
}) => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  try {
    await page.goto(baseURL ?? "http://127.0.0.1:3100");
    await expect(
      page.getByRole("heading", { level: 1, name: "Jegors Dorofejevs" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Work", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Projects", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: "A robot arm" })).toBeVisible();
    await expect(page.locator(".loading-state")).toHaveCount(0);
  } finally {
    await page.close();
  }
});
