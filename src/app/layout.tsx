import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RouteFocus } from "@/components/route-focus";
import { StructuredData } from "@/components/structured-data";
import { SITE_URL, site, absoluteUrl } from "@/lib/site";
import { searchVerification } from "@/lib/metadata";
import "@/styles/globals.css";
import "@/styles/article.css";
import "@/styles/illustrations.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  verification: searchVerification,
};
export const viewport: Viewport = {
  themeColor: "#0d0f11",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <RouteFocus />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            name: site.name,
            url: SITE_URL,
            inLanguage: "en",
            author: {
              "@type": "Person",
              "@id": absoluteUrl("/#person"),
              name: site.name,
              url: absoluteUrl("/about"),
            },
          }}
        />
      </body>
    </html>
  );
}
