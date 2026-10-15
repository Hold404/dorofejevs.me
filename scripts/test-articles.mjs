import { spawnSync } from "node:child_process";

const env = {
  ...process.env,
  WRITING_FIXTURES: "1",
  SITE_TEST_MODE: "1",
  SITE_URL: "https://portfolio.example",
  GOOGLE_SITE_VERIFICATION: "isolated-google-verification",
  BING_SITE_VERIFICATION: "isolated-bing-verification",
};
for (const args of [
  ["node_modules/next/dist/bin/next", "build"],
  [
    "node_modules/@playwright/test/cli.js",
    "test",
    "--config=playwright.articles.config.ts",
  ],
]) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit", env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
