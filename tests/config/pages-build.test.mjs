import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

for (const flag of ["SITE_TEST_MODE", "WRITING_FIXTURES"]) {
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
