import type { Work } from "@/lib/content";
import Link from "next/link";
import { Tags } from "./ui";

export function WorkEntry({
  entry,
  detailed = false,
  headingLevel = 3,
}: {
  entry: Work;
  detailed?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const featured = entry.slug === "robotics-startup";
  return (
    <article
      className={`work-entry${featured ? " work-entry-featured" : ""}`}
      id={entry.slug}
    >
      <div className="work-header">
        <div className="work-identity">
          <Heading>
            {entry.href ? (
              <Link href={entry.href}>{entry.name}</Link>
            ) : (
              entry.name
            )}
          </Heading>
          <p className="work-role">{entry.role}</p>
        </div>
        <p className="work-period mono">{entry.period}</p>
      </div>
      <div className="work-body">
        <p className="work-description">{entry.description}</p>
        {entry.slug === "virtuosohub" && (
          <p className="work-result">
            55% reduction in application load time · 40% improvement in
            Lighthouse scores
          </p>
        )}
        {(detailed || featured) && <Tags items={entry.technologies} />}
        {detailed && (
          <ul className="responsibilities">
            {entry.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
