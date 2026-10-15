import Link from "next/link";
import { volleyball } from "@/lib/content";
import { Tags } from "./ui";
import { TrackingDiagram } from "./tracking-diagram";

export function ProjectPreview({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="project-preview">
      <div className="project-copy">
        <Heading>
          <Link href={volleyball.href}>Volleyball tracking & replay</Link>
        </Heading>
        <p>{volleyball.description}</p>
        <Tags items={volleyball.technologies} />
      </div>
      <TrackingDiagram />
    </article>
  );
}
