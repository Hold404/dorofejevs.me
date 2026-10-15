import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/articles",
  fullyParallel: true,
  workers: 2,
  reporter: [["list"]],
  outputDir: "output/playwright/article-results",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:3101",
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3101",
    url: "http://127.0.0.1:3101",
    reuseExistingServer: false,
    env: {
      SITE_URL: "https://portfolio.example",
      SITE_TEST_MODE: "1",
      WRITING_FIXTURES: "1",
    },
  },
});
