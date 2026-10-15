import { spawnSync } from "node:child_process";
import { resolveSiteUrl } from "../src/lib/site-url.ts";

// A deployable artifact must never contain the isolated test content or origin.
process.env.NODE_ENV = "production";
process.env.CLOUDFLARE_PAGES_BUILD = "1";
resolveSiteUrl();
const result = spawnSync(
  process.execPath,
  ["node_modules/next/dist/bin/next", "build"],
  {
    stdio: "inherit",
    env: process.env,
  },
);
if (result.status !== 0) process.exit(result.status ?? 1);
