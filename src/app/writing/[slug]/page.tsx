import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import {
  getArticle,
  getArticles,
  isPublished,
  formatDate,
} from "@/lib/writing";
import { compileArticle } from "@/components/mdx";
import { StructuredData } from "@/components/structured-data";
import { TextLink } from "@/components/ui";
import "katex/dist/katex.min.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-static";
// Leave dynamicParams at its framework default: development discovers new
// files, while static export emits only the slugs returned below.
export async function generateStaticParams() {
  return (await getArticles()).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  const url = article.canonicalUrl ?? absoluteUrl(`/writing/${article.slug}`);
  const metadata = pageMetadata(
    article.title,
    article.description,
    `/writing/${article.slug}`,
    !isPublished(article),
  );
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: url },
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      url,
      publishedTime: isPublished(article) ? article.date : undefined,
      modifiedTime: article.updatedAt,
      authors: [site.name],
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  const { content, headings } = await compileArticle(article.content);
  return (
    <div className="shell page-content">
      <div className="article-shell">
        <nav className="article-back" aria-label="Writing navigation">
          <TextLink href="/writing">
            <span aria-hidden="true">←</span> All writing
          </TextLink>
        </nav>
        <article>
          <header className="article-header">
            <div className="article-kicker">
              <p className="eyebrow">Writing</p>
              {article.tags.length > 0 && (
                <ul className="article-topics" aria-label="Article topics">
                  {article.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </div>
            <h1>{article.title}</h1>
            <p className="article-description">{article.description}</p>
            <div className="article-meta">
              <Link className="article-author" href="/about" rel="author">
                {site.name}
              </Link>
              <div className="article-byline">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span>{article.readingMinutes} min read</span>
                {article.updatedAt && (
                  <span className="article-updated">
                    Updated{" "}
                    <time dateTime={article.updatedAt}>
                      {formatDate(article.updatedAt)}
                    </time>
                  </span>
                )}
              </div>
            </div>
            {!isPublished(article) && (
              <p className="draft-notice">
                Unpublished preview — excluded from production, RSS, and
                sitemap.
              </p>
            )}
          </header>
          <div className="article-reading">
            {headings.length >= 3 && (
              <nav className="table-of-contents" aria-label="Table of contents">
                <h2>On this page</h2>
                <ul>
                  {headings
                    .filter((heading) => heading.depth === 2)
                    .map((heading) => (
                      <li key={heading.id}>
                        <a href={`#${heading.id}`}>{heading.title}</a>
                      </li>
                    ))}
                </ul>
              </nav>
            )}
            <div className="article-prose">{content}</div>
          </div>
        </article>
        <nav className="article-end" aria-label="Article navigation">
          <TextLink href="/writing">
            <span aria-hidden="true">←</span> Back to writing
          </TextLink>
          <a className="text-link" href="/rss.xml">
            RSS feed
          </a>
        </nav>
      </div>
      {isPublished(article) && (
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.description,
            datePublished: article.date,
            ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
            url:
              article.canonicalUrl ?? absoluteUrl(`/writing/${article.slug}`),
            mainEntityOfPage:
              article.canonicalUrl ?? absoluteUrl(`/writing/${article.slug}`),
            author: {
              "@type": "Person",
              name: site.name,
              url: absoluteUrl("/about"),
              "@id": absoluteUrl("/#person"),
            },
            image: absoluteUrl("/opengraph-image"),
            keywords: article.tags,
            inLanguage: "en",
          }}
        />
      )}
    </div>
  );
}
