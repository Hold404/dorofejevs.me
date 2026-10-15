import { pageMetadata } from "@/lib/metadata";
import { work } from "@/lib/content";
import { PageIntro } from "@/components/ui";
import { WorkEntry } from "@/components/work-entry";
export const metadata = pageMetadata(
  "Work & Experience",
  "Professional work by Jegors Dorofejevs: robotics developer infrastructure at Robotics Startup, reliable backend systems at DomiDo, and distributed infrastructure at VirtuosoHub.",
  "/work",
);
export default function WorkPage() {
  return (
    <div className="shell page-content">
      <PageIntro
        title="Work & experience"
        description="Current and previous roles."
      />
      <div className="work-list">
        {work.map((entry) => (
          <WorkEntry key={entry.slug} entry={entry} detailed headingLevel={2} />
        ))}
      </div>
    </div>
  );
}
