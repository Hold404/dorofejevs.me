import { pageMetadata } from "@/lib/metadata";
import { work } from "@/lib/content";
import { CaseSection, PageIntro, Tags } from "@/components/ui";
import { Breadcrumb, WorkNavigation } from "@/components/case-navigation";

export const metadata = pageMetadata(
  "DomiDo — Backend Engineering",
  "Jegors Dorofejevs’s software engineering work on DomiDo at Avvyland Ltd.: backend services, asynchronous workers, failure recovery, and data consistency.",
  "/work/domido",
);

export default function DomiDoPage() {
  const entry = work.find((item) => item.slug === "domido")!;
  return (
    <div className="shell page-content">
      <Breadcrumb
        parent={{ href: "/work", label: "Work" }}
        current="DomiDo"
        href="/work/domido"
      />
      <PageIntro
        title="DomiDo"
        description="Backend services, asynchronous workers, and reliable service communication at Avvyland Ltd."
      />
      <dl className="case-meta">
        <div>
          <dt>Product</dt>
          <dd>DomiDo</dd>
        </div>
        <div>
          <dt>Employer</dt>
          <dd>Avvyland Ltd.</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{entry.role}</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{entry.fullPeriod}</dd>
        </div>
      </dl>
      <CaseSection title="My work">
        <p>
          I work on DomiDo’s backend at Avvyland Ltd. My responsibilities cover
          services and APIs, long-running workers, and the behavior of the
          system under concurrent workloads.
        </p>
      </CaseSection>
      <CaseSection title="Services & APIs">
        <p>
          I develop backend services and APIs, with a focus on reliable
          service-to-service communication and consistent data handling.
        </p>
      </CaseSection>
      <CaseSection title="Asynchronous processing">
        <p>
          My work includes long-running asynchronous workers, job execution,
          retries, and failure recovery. I focus on how background work behaves
          when operations fail or run concurrently.
        </p>
      </CaseSection>
      <CaseSection title="Consistency & reliability">
        <p>
          Data consistency and backend reliability are central to this work. I
          consider both the architecture and its operational behavior under
          concurrent workloads.
        </p>
      </CaseSection>
      <CaseSection title="Technical focus">
        <Tags items={entry.technologies} />
      </CaseSection>
      <WorkNavigation current="domido" />
    </div>
  );
}
