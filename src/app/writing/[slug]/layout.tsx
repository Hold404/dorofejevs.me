import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/writing";

export default async function ArticleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  // Validate before the loading boundary streams a successful HTTP response.
  if (!(await getArticle((await params).slug))) notFound();
  return children;
}
