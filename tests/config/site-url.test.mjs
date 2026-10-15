import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveSiteUrl } from "../../src/lib/site-url.ts";

function withEnvironment(values, run) {
  const original = { ...process.env };
  delete process.env.SITE_URL;
  delete process.env.SITE_TEST_MODE;
  delete process.env.WRITING_FIXTURES;
  Object.assign(process.env, values);
  try {
    run();
  } finally {
    process.env = original;
  }
}

test("development has a local fallback", () =>
  withEnvironment({ NODE_ENV: "development" }, () =>
    assert.equal(resolveSiteUrl(), "http://localhost:3000"),
  ));
test("production requires an explicit origin", () =>
  withEnvironment({ NODE_ENV: "production" }, () =>
    assert.throws(resolveSiteUrl, /required/),
  ));
test("production rejects unsafe or non-canonical origins", () => {
  for (const SITE_URL of [
    "http://jegors.dev",
    "https://localhost",
    "https://127.0.0.1",
    "https://192.168.1.1",
    "https://10.0.0.1",
    "https://my-computer.local",
    "https://[::1]",
    "https://portfolio.example",
    "https://example.com",
    "https://jegors.dev/path",
    "https://user:pass@jegors.dev",
    "https://jegors.dev?q=1",
    "https://jegors.dev/#fragment",
    "not-a-url",
  ]) {
    withEnvironment({ NODE_ENV: "production", SITE_URL }, () =>
      assert.throws(resolveSiteUrl, Error, SITE_URL),
    );
  }
});
test("a public HTTPS origin is normalized", () =>
  withEnvironment(
    { NODE_ENV: "production", SITE_URL: "https://jegors.dev/" },
    () => assert.equal(resolveSiteUrl(), "https://jegors.dev"),
  ));
test("fixture builds require explicit test mode", () =>
  withEnvironment(
    {
      NODE_ENV: "production",
      SITE_URL: "https://jegors.dev",
      WRITING_FIXTURES: "1",
    },
    () => assert.throws(resolveSiteUrl, /isolated test mode/),
  ));
test("reserved test domain is allowed only for isolated verification", () =>
  withEnvironment(
    {
      NODE_ENV: "production",
      SITE_URL: "https://portfolio.example",
      SITE_TEST_MODE: "1",
    },
    () => assert.equal(resolveSiteUrl(), "https://portfolio.example"),
  ));
