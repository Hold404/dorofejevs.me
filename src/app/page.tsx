import Link from "next/link";
import { pageMetadata, personSchema } from "@/lib/metadata";
import { site } from "@/lib/site";
import { work } from "@/lib/content";
import { getArticles } from "@/lib/writing";
import { SectionHeading } from "@/components/ui";
import { WorkEntry } from "@/components/work-entry";
import { ProjectPreview } from "@/components/project-preview";
import { WritingList } from "@/components/writing-list";
import { StructuredData } from "@/components/structured-data";
import { RobotNote } from "@/components/robot-note";

export const metadata = pageMetadata("Home", site.description, "/");

export default async function Home() {
  const articles = await getArticles();
  return (
    <div className="shell">
      <section className="hero">
        <div className="hero-body">
          <div className="hero-copy">
            <h1>Jegors Dorofejevs</h1>
            <p className="hero-role">{site.role}</p>
            <div className="hero-description">
              <p>
                I’m based in Enschede, Netherlands. Currently, I’m CTO at{" "}
                <Link href="/work/robotics-startup">Robotics Startup</Link>,
                where we’re building software delivery infrastructure for
                robotics teams: from builds and signed releases to controlled
                device updates. I lead architecture and engineering, with
                hands-on work on release signing and backend reliability.
              </p>
              <p>
                My background is in backend systems, GPU orchestration, and
                distributed CI/CD. Alongside work, I study Applied Mathematics
                at the University of Twente.{" "}
                <Link href="/about">More about me</Link>.
              </p>
            </div>
            <ul className="intro-links" aria-label="Contact and profiles">
              <li>
                <a href={`mailto:${site.email}`}>Email</a>
              </li>
              <li>
                <a href={site.github}>GitHub</a>
              </li>
              <li>
                <a href={site.linkedin}>LinkedIn</a>
              </li>
            </ul>
          </div>
          <RobotNote />
        </div>
      </section>
      <section className="home-section">
        <SectionHeading title="Work" href="/work" linkLabel="All experience" />
        <div className="work-grid">
          {work.map((entry) => (
            <WorkEntry key={entry.slug} entry={entry} />
          ))}
        </div>
      </section>
      <section className="home-section">
        <SectionHeading
          title="Projects"
          href="/projects"
          linkLabel="All projects"
        />
        <ProjectPreview />
      </section>
      <section className="home-section">
        <SectionHeading
          title="Writing"
          href="/writing"
          linkLabel="Read my writing"
        />
        <WritingList articles={articles.slice(0, 3)} />
      </section>
      <StructuredData data={personSchema} />
    </div>
  );
}
