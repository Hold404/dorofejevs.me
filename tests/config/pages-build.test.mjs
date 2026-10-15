import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolveSiteUrl } from "../../src/lib/site-url.ts";

for (const flag of ["SITE_TEST_MODE", "WRITING_FIXTURES"]) {
  test(`Next config rejects ${flag} loaded from an environment file`, () => {
    const original = { ...process.env };
    try {
      Object.assign(process.env, {
        SITE_URL: "https://dorofejevs-me.pages.dev",
        CLOUDFLARE_PAGES_BUILD: "1",
        [flag]: "1",
      });
      assert.throws(resolveSiteUrl, /Pages builds refuse/);
    } finally {
      process.env = original;
    }
  });
  test(`deployable Pages build rejects ${flag}`, () => {
    const result = spawnSync(process.execPath, ["scripts/build-pages.mjs"], {
      encoding: "utf8",
      env: {
        ...process.env,
        SITE_URL: "https://dorofejevs-me.pages.dev",
        [flag]: "1",
      },
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Pages builds refuse/);
  });
}
