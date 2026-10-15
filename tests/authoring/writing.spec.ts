import { randomUUID } from "node:crypto";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { test, expect } from "@playwright/test";

test("new MDX files open, update, and disappear without restarting development", async ({
  page,
}) => {
  const slug = `authoring-${randomUUID()}`;
  const filename = path.join(
    process.cwd(),
    "tests/fixtures/writing",
    `${slug}.mdx`,
  );
  const title = "Temporary authoring fixture";
  const source = `---
title: "${title}"
description: "Isolated authoring verification, removed after the test."
date: "2000-01-01"
draft: true
---

## Discovered from disk

<p data-mdx-expression>{["Server", "rendered", "MDX"].join(" ")}</p>
`;

  // Warm the dynamic route before adding a file to reproduce a cached slug list.
  await page.goto("/writing/published-fixture");
  await expect(page.locator("h1")).toHaveText("MDX verification fixture");
  await page.goto("/writing");
  await expect(page.locator(".article-open").first()).toBeVisible();
  const initialCount = await page.locator(".article-preview").count();
  let created = false;
  try {
    await writeFile(filename, source, { flag: "wx" });
    created = true;
    await page.reload();
    await expect(page.locator(".article-preview")).toHaveCount(
      initialCount + 1,
    );
    const open = page.getByRole("link", {
      name: `Open: ${title}`,
      exact: true,
    });
    await open.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/writing/${slug}$`));
    await expect(page.locator("[data-mdx-expression]")).toHaveText(
      "Server rendered MDX",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );

    await writeFile(
      filename,
      source.replace("Discovered from disk", "Edited on disk"),
    );
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Edited on disk" }),
    ).toBeVisible();
  } finally {
    if (created) await unlink(filename);
  }
  await page.goto("/writing");
  await expect(page.locator(".article-preview")).toHaveCount(initialCount);
  expect((await page.goto(`/writing/${slug}`))?.status()).toBe(404);
  // Next.js also injects its own noindex tag for notFound responses.
  const robots = page.locator('meta[name="robots"]');
  await expect(robots).not.toHaveCount(0);
  for (const tag of await robots.all())
    await expect(tag).toHaveAttribute("content", /noindex/);
});
