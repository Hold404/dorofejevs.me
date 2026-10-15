import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";
import { chromium } from "@playwright/test";

const origin = "http://127.0.0.1:3200";
const outputDirectory = "output/lighthouse";
await mkdir(outputDirectory, { recursive: true });
await mkdir(".cache", { recursive: true });
const profileDirectory = await mkdtemp(
  `${process.cwd()}/.cache/lighthouse-profile-`,
);

const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3200",
  ],
  {
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      SITE_URL: "https://portfolio.example",
      SITE_TEST_MODE: "1",
      WRITING_FIXTURES: "0",
    },
  },
);
let serverLogs = "";
server.stdout.on("data", (chunk) => {
  serverLogs += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverLogs += chunk.toString();
});
let chrome;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null)
      throw new Error(`Production server exited: ${serverLogs}`);
    try {
      if ((await fetch(origin)).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Server is starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (!ready) throw new Error(`Production server did not start: ${serverLogs}`);
  chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ["--headless", "--no-sandbox"],
    userDataDir: profileDirectory,
  });
  const summary = [];
  for (const route of ["/", "/work", "/projects/volleyball-tracking"]) {
    for (const mode of ["mobile", "desktop"]) {
      console.log(`Auditing ${route} (${mode})`);
      const result = await lighthouse(
        `${origin}${route}`,
        {
          port: chrome.port,
          output: ["html", "json"],
          logLevel: "error",
          onlyCategories: [
            "performance",
            "accessibility",
            "best-practices",
            "seo",
          ],
        },
        mode === "desktop" ? desktopConfig : undefined,
      );
      if (!result || result.lhr.runtimeError)
        throw new Error(
          result?.lhr.runtimeError?.message ?? "Lighthouse returned no result",
        );
      const name = `${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${mode}`;
      await writeFile(`${outputDirectory}/${name}.html`, result.report[0]);
      await writeFile(`${outputDirectory}/${name}.json`, result.report[1]);
      const scores = Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, category]) => [
          key,
          Math.round((category.score ?? 0) * 100),
        ]),
      );
      const entry = {
        route,
        mode,
        scores,
        lcp: result.lhr.audits["largest-contentful-paint"].displayValue,
        cls: result.lhr.audits["cumulative-layout-shift"].displayValue,
      };
      summary.push(entry);
      console.log(JSON.stringify(entry));
    }
  }
  await writeFile(
    `${outputDirectory}/summary.json`,
    JSON.stringify(summary, null, 2),
  );
} finally {
  if (chrome) await chrome.kill();
  server.kill("SIGTERM");
  await rm(profileDirectory, { recursive: true, force: true });
}
