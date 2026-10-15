export function resolveSiteUrl(): string {
  const value = process.env.SITE_URL;
  if (!value) {
    if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
    throw new Error(
      "SITE_URL is required for production. Set your real HTTPS origin before building. Use npm run build:test for isolated local verification.",
    );
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("SITE_URL must be an absolute HTTPS origin.");
  }
  const local =
    url.hostname === "localhost" ||
    url.hostname.startsWith("[") ||
    /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname) ||
    /\.(local|internal|lan)$/.test(url.hostname) ||
    !url.hostname.includes(".");
  const reserved =
    /\.(example|test|invalid|localhost)$/.test(url.hostname) ||
    /^example\.(com|org|net)$/.test(url.hostname);
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error(
      "SITE_URL must be an origin without credentials, a path, query, or fragment.",
    );
  if (
    process.env.NODE_ENV === "production" &&
    (url.protocol !== "https:" ||
      local ||
      (reserved && process.env.SITE_TEST_MODE !== "1"))
  )
    throw new Error(
      "Production SITE_URL must be a real public HTTPS origin. Local and reserved domains are rejected.",
    );
  if (!["https:", "http:"].includes(url.protocol))
    throw new Error("SITE_URL must use HTTP or HTTPS.");
  if (
    process.env.WRITING_FIXTURES === "1" &&
    process.env.SITE_TEST_MODE !== "1"
  )
    throw new Error("Writing fixtures are only allowed in isolated test mode.");
  return url.origin;
}
