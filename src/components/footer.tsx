import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <h2>Contact</h2>
          <ul className="contact-links">
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={site.github}>GitHub</a>
            </li>
            <li>
              <a href={site.linkedin}>LinkedIn</a>
            </li>
          </ul>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getUTCFullYear()} {site.name}
          </span>
          <span>{site.location}</span>
          <a href="/rss.xml">RSS</a>
        </div>
      </div>
    </footer>
  );
}
