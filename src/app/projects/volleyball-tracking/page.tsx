import { pageMetadata } from "@/lib/metadata";
import { volleyball } from "@/lib/content";
import { CaseSection, PageIntro, Tags } from "@/components/ui";
import { TrackingDiagram } from "@/components/tracking-diagram";
import { Breadcrumb, PageNavigation } from "@/components/case-navigation";
export const metadata = pageMetadata(
  "Volleyball Ball Tracking & Replay System",
  "A multi-camera volleyball tracking project using YOLO detection, three-view triangulation, position analysis, and Blender trajectory replays.",
  volleyball.href,
);
export default function VolleyballPage() {
  return (
    <div className="shell page-content">
      <Breadcrumb
        parent={{ href: "/projects", label: "Projects" }}
        current="Volleyball tracking"
        href="/projects/volleyball-tracking"
      />
      <PageIntro
        title="Volleyball Ball Tracking & Replay System"
        description="From three camera views to a reconstructed ball trajectory."
      />
      <Tags items={volleyball.technologies} />
      <div className="project-hero-diagram">
        <TrackingDiagram />
      </div>
      <CaseSection title="Overview">
        <p>
          Developed a multi-camera volleyball tracking and replay system. It
          brings together ball detection, spatial reconstruction, and animation
          to describe a ball’s movement relative to the court.
        </p>
      </CaseSection>
      <CaseSection title="Problem">
        <p>
          A single video view shows a ball’s position in an image, but does not
          directly describe where it is in three-dimensional space.
          Understanding a trajectory relative to court boundaries requires
          information from multiple views.
        </p>
      </CaseSection>
      <CaseSection title="Technical approach">
        <p>
          The system follows three stages: detect the ball across three video
          streams, estimate its position through multi-view triangulation, and
          visualize the reconstructed trajectory in a replay.
        </p>
        <ol className="process-list">
          <li>
            <span className="mono">01</span> Video streams → ball detection
          </li>
          <li>
            <span className="mono">02</span> Multiple views → position
            estimation
          </li>
          <li>
            <span className="mono">03</span> Ball trajectory → replay animation
          </li>
        </ol>
      </CaseSection>
      <CaseSection title="Detection">
        <p>
          YOLO-based detection identifies the volleyball across three video
          streams. Those detections provide the image-space observations for the
          position reconstruction stage.
        </p>
      </CaseSection>
      <CaseSection title="Triangulation">
        <p>
          Multi-view triangulation estimates the ball’s position relative to the
          court. Position analysis supports in/out decisions by relating the
          reconstructed position to court boundaries.
        </p>
      </CaseSection>
      <CaseSection title="Replay generation">
        <p>
          Blender-based replay animations visualize the ball trajectory, turning
          the reconstructed positions into a replay of its movement.
        </p>
      </CaseSection>
      <CaseSection title="Technologies">
        <Tags items={volleyball.technologies} />
      </CaseSection>
      <PageNavigation
        title="Explore"
        links={[
          { href: "/projects", label: "Projects" },
          { href: "/work", label: "Work" },
        ]}
      />
    </div>
  );
}
