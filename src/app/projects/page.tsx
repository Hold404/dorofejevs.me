import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/ui";
import { ProjectPreview } from "@/components/project-preview";
export const metadata = pageMetadata(
  "Independent Projects",
  "Independent engineering projects by Jegors Dorofejevs, including a multi-camera volleyball tracking and replay system using Python, YOLO, and Blender.",
  "/projects",
);
export default function ProjectsPage() {
  return (
    <div className="shell page-content">
      <PageIntro
        title="Independent projects"
        description="Personal projects in computer vision and applied mathematics."
      />
      <ProjectPreview headingLevel={2} />
    </div>
  );
}
