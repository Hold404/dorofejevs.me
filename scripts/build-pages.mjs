import { spawnSync } from "node:child_process";
import { resolveSiteUrl } from "../src/lib/site-url.ts";

// A deployable artifact must never contain the isolated test content or origin.
process.env.NODE_ENV = "production";
if (
  process.env.SITE_TEST_MODE === "1" ||
  process.env.WRITING_FIXTURES === "1"
) {
  throw new Error("Pages builds refuse SITE_TEST_MODE and WRITING_FIXTURES.");
}
resolveSiteUrl();
const result = spawnSync(
  process.execPath,
  ["node_modules/next/dist/bin/next", "build"],
  {
    stdio: "inherit",
    env: { ...process.env, CLOUDFLARE_PAGES_BUILD: "1" },
  },
);
if (result.status !== 0) process.exit(result.status ?? 1);
