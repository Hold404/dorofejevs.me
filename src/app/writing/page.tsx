import { pageMetadata } from "@/lib/metadata";
import { getArticles } from "@/lib/writing";
import { PageIntro } from "@/components/ui";
import { WritingList } from "@/components/writing-list";
export const metadata = pageMetadata(
  "Writing",
  "Notes by Jegors Dorofejevs on software engineering, infrastructure, architecture, and building technology products.",
  "/writing",
);
export default async function WritingPage() {
  return (
    <div className="shell page-content writing-index">
      <PageIntro title="Writing" description="Notes on software engineering." />
      <WritingList articles={await getArticles()} headingLevel={2} />
      <div className="writing-subscribe">
        <a className="text-link" href="/rss.xml">
          RSS feed
        </a>
      </div>
    </div>
  );
}
