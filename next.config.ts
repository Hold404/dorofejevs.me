import type { NextConfig } from "next";
import { resolveSiteUrl } from "./src/lib/site-url";

resolveSiteUrl();
const pagesExport = process.env.CLOUDFLARE_PAGES_BUILD === "1";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(pagesExport ? { output: "export" as const } : {}),
  distDir: process.env.WRITING_FIXTURES === "1" ? ".next-fixtures" : ".next",
  ...(!pagesExport && {
    async redirects() {
      return [
        {
          source: "/work/robotsci",
          destination: "/work/robotics-startup",
          permanent: true,
        },
      ];
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            { key: "X-Frame-Options", value: "DENY" },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=()",
            },
          ],
        },
      ];
    },
  }),
};
export default nextConfig;
