import Link from "next/link";
import type { ReactNode } from "react";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span aria-hidden="true" className="arrow">
      {diagonal ? "↗" : "→"}
    </span>
  );
}

export function TextLink({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`text-link ${className}`}>
      {children}
      {external && <Arrow diagonal />}
    </Link>
  );
}

export function PageIntro({
  label,
  title,
  description,
}: {
  label?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      {label && <p className="eyebrow">{label}</p>}
      <h1>{title}</h1>
      <p className="intro-description">{description}</p>
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && linkLabel && <TextLink href={href}>{linkLabel}</TextLink>}
    </div>
  );
}

export function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="tags" aria-label="Technical focus">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function CaseSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="case-section">
      <h2>{title}</h2>
      <div className="prose">{children}</div>
    </section>
  );
}
