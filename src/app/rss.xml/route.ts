import { getArticles } from "@/lib/writing";
import { absoluteUrl, site } from "@/lib/site";
export const dynamic = "force-static";
function xml(value: string): string {
  return value.replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  );
}
export async function GET() {
  const articles = await getArticles(true);
  const items = articles
    .map(
      (article) =>
        `<item><title>${xml(article.title)}</title><description>${xml(article.description)}</description><link>${xml(absoluteUrl(`/writing/${article.slug}`))}</link><guid isPermaLink="true">${xml(absoluteUrl(`/writing/${article.slug}`))}</guid><pubDate>${new Date(article.date).toUTCString()}</pubDate>${article.tags.map((tag) => `<category>${xml(tag)}</category>`).join("")}</item>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(site.name)} — Writing</title><link>${xml(absoluteUrl("/writing"))}</link><description>Notes on software engineering, infrastructure, and architecture.</description><language>en</language><atom:link href="${xml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
