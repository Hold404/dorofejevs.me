import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { Arrow, PageIntro } from "@/components/ui";
export const metadata = pageMetadata(
  "Contact",
  "Get in touch with Jegors Dorofejevs about software engineering, infrastructure, developer tools, or an interesting technical problem. Based in Enschede, Netherlands.",
  "/contact",
);
export default function ContactPage() {
  return (
    <div className="shell page-content">
      <PageIntro
        title="Contact"
        description="Email is the best way to reach me."
      />
      <div className="contact-section">
        <dl className="contact-directory">
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${site.email}`}>
                {site.email}
                <Arrow diagonal />
              </a>
            </dd>
          </div>
          <div>
            <dt>GitHub</dt>
            <dd>
              <a href={site.github}>
                github.com/Hold404
                <Arrow diagonal />
              </a>
            </dd>
          </div>
          <div>
            <dt>LinkedIn</dt>
            <dd>
              <a href={site.linkedin}>
                linkedin.com/in/hold404
                <Arrow diagonal />
              </a>
            </dd>
          </div>
        </dl>
        <p className="mono contact-location">Based in {site.location}.</p>
      </div>
    </div>
  );
}
