import { pageMetadata } from "@/lib/metadata";
import { PageIntro, TextLink } from "@/components/ui";
export const metadata = pageMetadata(
  "Page not found",
  "This page could not be found. Return to Jegors Dorofejevs’s website.",
  "/404",
  true,
);
export default function NotFound() {
  return (
    <div className="shell short-page">
      <PageIntro
        label="404 / NOT FOUND"
        title="Nothing at this address."
        description="The page may have moved, or the link may be incorrect."
      />
      <TextLink href="/">Return home</TextLink>
    </div>
  );
}
