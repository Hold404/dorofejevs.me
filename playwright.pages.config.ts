import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

const remoteOrigin = process.env.PAGES_TEST_URL;

export default defineConfig(base, {
  testIgnore: [
    "**/articles/**",
    "**/authoring/**",
    "**/fixtures/**",
    "**/config/**",
    // Reviewed screenshots are macOS baselines; CI runs all behavioral checks.
    ...(process.env.CI || remoteOrigin ? ["**/visual/**"] : []),
  ],
  use: { baseURL: remoteOrigin ?? "http://127.0.0.1:3180" },
  webServer: remoteOrigin
    ? undefined
    : {
        command: "wrangler pages dev out --ip 127.0.0.1 --port 3180",
        url: "http://127.0.0.1:3180",
        reuseExistingServer: false,
        timeout: 60000,
      },
});
