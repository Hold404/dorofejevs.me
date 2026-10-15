import Link from "next/link";
import type { Article } from "@/lib/writing";
import { formatDate, isPublished } from "@/lib/writing";
import { Arrow } from "./ui";

export function ArticlePreview({
  article,
  headingLevel = 3,
}: {
  article: Article;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="article-preview">
      <div className="article-preview-copy">
        <div className="article-preview-meta">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span>{article.readingMinutes} min read</span>
          {!isPublished(article) && <span>Unpublished preview</span>}
        </div>
        <Heading>
          <Link href={`/writing/${article.slug}`}>{article.title}</Link>
        </Heading>
        <p>{article.description}</p>
      </div>
      <Link
        className="article-open"
        href={`/writing/${article.slug}`}
        aria-label={`Open: ${article.title}`}
      >
        Open <Arrow />
      </Link>
    </article>
  );
}

export function WritingList({
  articles,
  headingLevel = 3,
}: {
  articles: readonly Article[];
  headingLevel?: 2 | 3;
}) {
  if (articles.length === 0)
    return <p className="writing-empty">No articles published yet.</p>;
  return (
    <div className="article-list">
      {articles.map((article) => (
        <ArticlePreview
          key={article.slug}
          article={article}
          headingLevel={headingLevel}
        />
      ))}
    </div>
  );
}
