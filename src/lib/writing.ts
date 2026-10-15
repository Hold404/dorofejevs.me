import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import { z } from "zod";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const parsed = new Date(value);
    return (
      !Number.isNaN(parsed.valueOf()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  }, "Use a real calendar date in YYYY-MM-DD format");

const frontmatterSchema = z
  .object({
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(300),
    date: isoDate,
    updatedAt: isoDate.optional(),
    tags: z.array(z.string().trim().min(1)).default([]),
    draft: z.boolean(),
    canonicalUrl: z
      .url()
      .refine((value) => {
        const url = new URL(value);
        return (
          url.protocol === "https:" &&
          !url.username &&
          !url.password &&
          !url.hash
        );
      }, "Canonical URLs must be HTTPS without credentials or fragments")
      .optional(),
  })
  .refine(
    (value) => !value.updatedAt || value.updatedAt >= value.date,
    "updatedAt must not precede date",
  );

export type Article = z.infer<typeof frontmatterSchema> & {
  slug: string;
  content: string;
  readingMinutes: number;
};

const contentDirectory =
  process.env.WRITING_FIXTURES === "1"
    ? path.join(process.cwd(), "tests/fixtures/writing")
    : path.join(process.cwd(), "content/writing");

const readArticles = cache(async (): Promise<Article[]> => {
  const filenames = await readdir(contentDirectory);
  const articles = await Promise.all(
    filenames
      .filter((name) => name.endsWith(".mdx"))
      .map(async (filename) => {
        const slug = filename.slice(0, -4);
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
          throw new Error(
            `Invalid article filename: ${filename}. Use a lowercase kebab-case slug.`,
          );
        const source = await readFile(
          path.join(contentDirectory, filename),
          "utf8",
        );
        const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(
          source,
        );
        if (!frontmatter)
          throw new Error(`Missing YAML frontmatter in ${filename}`);
        const data: unknown = parse(frontmatter[1]!);
        const content = source.slice(frontmatter[0].length);
        const result = frontmatterSchema.safeParse(data);
        if (!result.success)
          throw new Error(
            `Invalid frontmatter in ${filename}: ${result.error.message}`,
          );
        const words = content
          .replace(/```[\s\S]*?```/g, " ")
          .replace(/<[^>]+>/g, " ")
          .trim()
          .split(/\s+/)
          .filter(Boolean).length;
        return {
          ...result.data,
          slug,
          content,
          readingMinutes: Math.max(1, Math.ceil(words / 220)),
        };
      }),
  );
  return articles.sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
  );
});

export function isPublished(article: Article): boolean {
  return (
    !article.draft && article.date <= new Date().toISOString().slice(0, 10)
  );
}

export async function getArticles(
  publishedOnly = process.env.NODE_ENV === "production",
): Promise<Article[]> {
  const articles = await readArticles();
  return publishedOnly ? articles.filter(isPublished) : articles;
}

export const getArticle = cache(
  async (slug: string): Promise<Article | undefined> =>
    (await getArticles()).find((article) => article.slug === slug),
);

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
