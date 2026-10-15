import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  noindex = false,
): Metadata {
  const fullTitle =
    path === "/" ? `${site.name} — ${site.role}` : `${title} — ${site.name}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: absoluteUrl(path),
      types: { "application/rss+xml": absoluteUrl("/rss.xml") },
    },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: site.name,
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: `${site.name} — ${site.role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
  };
}

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": absoluteUrl("/#person"),
  name: site.name,
  alternateName: site.handle,
  description: site.description,
  url: absoluteUrl("/about"),
  mainEntityOfPage: { "@id": absoluteUrl("/about#profile") },
  jobTitle: site.role,
  sameAs: [site.github, site.linkedin],
  homeLocation: { "@type": "Place", name: site.location },
  worksFor: { "@type": "Organization", name: "Robotics Startup" },
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Twente",
    description: "BSc Applied Mathematics student, September 2026 – Present",
  },
  knowsAbout: [
    "Backend systems",
    "Distributed systems",
    "Developer infrastructure",
    "Cloud infrastructure",
    "CI/CD",
    "Robotics software delivery",
    "Computer vision",
  ],
};

export const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": absoluteUrl("/about#profile"),
  url: absoluteUrl("/about"),
  name: `About ${site.name}`,
  description: site.description,
  inLanguage: "en",
  isPartOf: { "@id": absoluteUrl("/#website") },
  mainEntity: personSchema,
};

// These public ownership-verification tokens are optional, never fabricated.
export const searchVerification: Metadata["verification"] = {
  google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
  ...(process.env.BING_SITE_VERIFICATION?.trim()
    ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION.trim() } }
    : {}),
};
