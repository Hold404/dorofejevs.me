import { pageMetadata } from "@/lib/metadata";
import { work } from "@/lib/content";
import { CaseSection, PageIntro, Tags } from "@/components/ui";
import { Breadcrumb, WorkNavigation } from "@/components/case-navigation";
export const metadata = pageMetadata(
  "Robotics Startup — Software Delivery for Robotics",
  "Jegors Dorofejevs’s work as CTO at Robotics Startup: software delivery for robotics, release signing, backend reliability, and controlled device updates.",
  "/work/robotics-startup",
);
export default function RoboticsStartupPage() {
  const entry = work.find((item) => item.slug === "robotics-startup")!;
  return (
    <div className="shell page-content">
      <Breadcrumb
        parent={{ href: "/work", label: "Work" }}
        current="Robotics Startup"
        href="/work/robotics-startup"
      />
      <PageIntro
        title="Robotics Startup"
        description="As CTO, I lead architecture and engineering for a platform that connects software builds, signed releases, and controlled updates to robots."
      />
      <dl className="case-meta">
        <div>
          <dt>Company</dt>
          <dd>Robotics Startup</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{entry.role}</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{entry.fullPeriod}</dd>
        </div>
        <div>
          <dt>Stage</dt>
          <dd>Early-stage / MVP development</dd>
        </div>
      </dl>
      <CaseSection title="What we’re building">
        <p>
          Updating software on a fleet of robots involves more than publishing a
          build. Each device needs the right artifact, a way to verify it, and a
          recovery path if the update fails.
        </p>
        <p>
          We’re developing infrastructure for that workflow: building software
          from GitHub, verifying and signing release artifacts, and managing
          their delivery to devices. Creating a release and authorizing its
          deployment are separate steps.
        </p>
      </CaseSection>
      <CaseSection title="My role as CTO">
        <p>
          I lead a four-person development team, set the technical roadmap, and
          define how the build infrastructure, backend, and device runtime fit
          together. Architecture, implementation, and code review are all part
          of my work.
        </p>
        <p>
          My hands-on work includes signing workers that preserve state through
          retries and failures, tenant-isolated fleet models, and storage for
          release artifacts. I’m currently working on build caching and
          retention, alongside signing-worker integration and recovery.
        </p>
      </CaseSection>
      <CaseSection title="Engineering responsibilities">
        <ul>
          {entry.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CaseSection>
      <CaseSection title="MVP scope">
        <p>
          The build and release work covers hosted CI, independent artifact
          verification, cryptographic signing, and private artifact delivery.
          Release records are designed to retain a software bill of materials
          (SBOM), build provenance, and verification evidence.
        </p>
        <p>
          On the device side, the team is developing over-the-air updates,
          health checks, and rollback. Fleet workflows are being built around
          staged rollouts, with operator controls to pause, resume, or cancel a
          deployment.
        </p>
        <Tags items={entry.technologies} />
        <p className="editorial-note">
          The platform is in MVP development. Individual components are being
          implemented and tested; the complete workflow is still being
          integrated and validated.
        </p>
      </CaseSection>
      <WorkNavigation current="robotics-startup" />
    </div>
  );
}
