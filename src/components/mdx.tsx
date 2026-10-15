import "server-only";
import { cache } from "react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import type { MDXComponents } from "mdx/types";
import type { Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";

type Heading = { id: string; title: string; depth: number };
const components: MDXComponents = {
  pre: (props) => (
    <pre
      {...props}
      tabIndex={0}
      aria-label="Code block — scroll horizontally if needed"
    />
  ),
  table: (props) => (
    <div
      className="table-scroll"
      role="region"
      aria-label="Article data table"
      tabIndex={0}
    >
      <table {...props} />
    </div>
  ),
};

export const compileArticle = cache(async (source: string) => {
  const headings: Heading[] = [];
  const slugger = new GithubSlugger();
  function collectHeadings() {
    return (tree: Root) => {
      let previousDepth = 1;
      visit(tree, "heading", (node) => {
        if (node.depth === 1)
          throw new Error(
            "Article body must start at H2; its title supplies the only H1.",
          );
        if (node.depth > previousDepth + 1)
          throw new Error("Article headings must not skip levels.");
        previousDepth = node.depth;
        const title = toString(node);
        headings.push({ id: slugger.slug(title), title, depth: node.depth });
      });
    };
  }
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm, remarkMath, collectHeadings],
    rehypePlugins: [
      rehypeSlug,
      [rehypeKatex, { strict: "error", throwOnError: true }],
      [
        rehypePrettyCode,
        { theme: "github-dark-default", keepBackground: false },
      ],
    ],
  });
  return { content: <Content components={components} />, headings };
});
