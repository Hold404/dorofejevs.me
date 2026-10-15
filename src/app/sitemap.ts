import type { MetadataRoute } from "next";
import { publicRoutes, absoluteUrl } from "@/lib/site";
import { getArticles } from "@/lib/writing";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles(true);
  return [
    ...publicRoutes.map((route) => ({ url: absoluteUrl(route) })),
    ...articles
      .filter(
        (article) =>
          !article.canonicalUrl ||
          article.canonicalUrl === absoluteUrl(`/writing/${article.slug}`),
      )
      .map((article) => ({
        url: absoluteUrl(`/writing/${article.slug}`),
        lastModified: article.updatedAt ?? article.date,
      })),
  ];
}
