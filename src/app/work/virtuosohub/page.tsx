import { pageMetadata } from "@/lib/metadata";
import { work } from "@/lib/content";
import { CaseSection, PageIntro, Tags } from "@/components/ui";
import { Breadcrumb, WorkNavigation } from "@/components/case-navigation";
export const metadata = pageMetadata(
  "VirtuosoHub — Distributed Infrastructure",
  "CI/CD pipelines, GPU orchestration, and distributed infrastructure at VirtuosoHub. A 55% reduction in application load time and 40% improvement in Lighthouse scores.",
  "/work/virtuosohub",
);
export default function VirtuosoHubPage() {
  const entry = work.find((item) => item.slug === "virtuosohub")!;
  return (
    <div className="shell page-content">
      <Breadcrumb
        parent={{ href: "/work", label: "Work" }}
        current="VirtuosoHub"
        href="/work/virtuosohub"
      />
      <PageIntro
        title="VirtuosoHub"
        description="My work on CI/CD pipelines, GPU orchestration, and application performance."
      />
      <dl className="case-meta">
        <div>
          <dt>Company</dt>
          <dd>VirtuosoHub</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>Software Engineer</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{entry.fullPeriod}</dd>
        </div>
      </dl>
      <CaseSection title="CI/CD infrastructure">
        <p>
          Redesigned distributed CI/CD pipelines using parallel builds and
          selective execution, changing how build work was organized and
          executed.
        </p>
      </CaseSection>
      <CaseSection title="GPU orchestration">
        <p>
          Built orchestration for real-time AI workloads, supporting dynamic
          scaling, resource allocation, and workload isolation.
        </p>
      </CaseSection>
      <CaseSection title="Distributed systems">
        <p>
          Worked on geographically distributed infrastructure with region-aware
          deployments, routing, and failover.
        </p>
      </CaseSection>
      <section className="performance-section">
        <h2>Frontend performance</h2>
        <p>
          Architectural changes and rendering optimizations improved application
          performance.
        </p>
        <dl className="metrics">
          <div>
            <dt>Reduction in application load time</dt>
            <dd>
              55<span>%</span>
            </dd>
          </div>
          <div>
            <dt>Improvement in Lighthouse scores</dt>
            <dd>
              40<span>%</span>
            </dd>
          </div>
        </dl>
        <p className="metric-note">
          Results from my work at VirtuosoHub. These figures describe
          application load time and Lighthouse scores.
        </p>
      </section>
      <CaseSection title="Technical focus">
        <Tags items={entry.technologies} />
      </CaseSection>
      <WorkNavigation current="virtuosohub" />
    </div>
  );
}
