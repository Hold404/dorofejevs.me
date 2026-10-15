import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/authoring",
  forbidOnly: !!process.env.CI,
  workers: 1,
  reporter: "list",
  outputDir: "output/playwright/authoring-results",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:3102",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command:
      "node node_modules/next/dist/bin/next dev --hostname localhost --port 3102",
    url: "http://localhost:3102",
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      WRITING_FIXTURES: "1",
      SITE_TEST_MODE: "1",
      SITE_URL: "https://portfolio.example",
    },
  },
});
