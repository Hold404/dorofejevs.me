import Link from "next/link";
import { work } from "@/lib/content";
import { Arrow } from "./ui";
import { absoluteUrl } from "@/lib/site";
import { StructuredData } from "./structured-data";

export function Breadcrumb({
  parent,
  current,
  href,
}: {
  parent: { href: string; label: string };
  current: string;
  href: string;
}) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href={parent.href}>{parent.label}</Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page">{current}</li>
      </ol>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: parent.label,
              item: absoluteUrl(parent.href),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: current,
              item: absoluteUrl(href),
            },
          ],
        }}
      />
    </nav>
  );
}

export function PageNavigation({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <nav className="page-navigation" aria-label={title}>
      <p>{title}</p>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              {link.label}
              <Arrow />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function WorkNavigation({ current }: { current: string }) {
  return (
    <PageNavigation
      title="Other work"
      links={work.flatMap((entry) =>
        entry.slug !== current && entry.href
          ? [{ href: entry.href, label: entry.name }]
          : [],
      )}
    />
  );
}
