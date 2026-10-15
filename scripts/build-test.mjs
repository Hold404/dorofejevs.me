import { spawnSync } from "node:child_process";

const result = spawnSync(
  process.execPath,
  ["node_modules/next/dist/bin/next", "build"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      SITE_URL: "https://portfolio.example",
      SITE_TEST_MODE: "1",
    },
  },
);
process.exit(result.status ?? 1);
