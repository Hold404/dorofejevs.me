import { pageMetadata, profileSchema } from "@/lib/metadata";
import { site } from "@/lib/site";
import { interests } from "@/lib/content";
import { CaseSection, PageIntro } from "@/components/ui";
import { StructuredData } from "@/components/structured-data";
export const metadata = pageMetadata(
  "About",
  "About Jegors Dorofejevs: CTO at Robotics Startup, software engineer, and Applied Mathematics student at the University of Twente.",
  "/about",
);
export default function AboutPage() {
  return (
    <div className="shell page-content">
      <PageIntro
        title="About"
        description="I’m Jegors Dorofejevs, CTO at Robotics Startup and a software engineer based in Enschede, Netherlands."
      />
      <div className="about-editorial">
        <p>
          I work on backend systems and developer infrastructure. As CTO at
          Robotics Startup, I lead a four-person development team building
          software delivery infrastructure for robotics. I set the technical
          roadmap and work on release signing, artifact storage, and backend
          reliability. The MVP connects hosted builds with verified releases and
          controlled updates to devices.
        </p>
        <p>
          My previous work includes GPU orchestration for real-time AI
          workloads, distributed CI/CD pipelines, region-aware deployments, and
          frontend performance. At DomiDo, I build backend services and
          asynchronous workers.
        </p>
        <p>
          Alongside work, I’m studying Applied Mathematics at the University of
          Twente. I’m interested in how mathematical reasoning can help with
          practical engineering problems, including computer vision.
        </p>
        <p>
          I use the name {site.handle} on{" "}
          <a className="text-link" href={site.github} rel="me">
            GitHub
          </a>{" "}
          and{" "}
          <a className="text-link" href={site.linkedin} rel="me">
            LinkedIn
          </a>
          .
        </p>
      </div>
      <div className="about-details">
        <CaseSection title="Areas of interest">
          <ul className="interest-list">
            {interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </CaseSection>
        <CaseSection title="Languages & tools">
          <dl className="toolkit">
            <div>
              <dt>Languages</dt>
              <dd>Rust, Go, TypeScript, Python</dd>
            </div>
            <div>
              <dt>Systems & tools</dt>
              <dd>
                Linux, Git, Docker, CI/CD, AWS, Hetzner, Google Cloud Platform
              </dd>
            </div>
          </dl>
        </CaseSection>
        <CaseSection title="Education">
          <p className="text-primary">BSc Applied Mathematics</p>
          <p>
            University of Twente
            <br />
            <span className="mono">September 2026 – Present</span>
          </p>
          <p>Ongoing undergraduate study.</p>
        </CaseSection>
      </div>
      <StructuredData data={profileSchema} />
    </div>
  );
}
