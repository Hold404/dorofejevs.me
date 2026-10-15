import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    // Includes Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, and
    // PerplexityBot. Hosting/CDN rules must permit them as well.
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
