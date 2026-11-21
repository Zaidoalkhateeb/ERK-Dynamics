import type { Metadata } from "next";
import { site } from "@/content/site";
import "@/styles/globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { OrganizationSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: "%s | ERK Dynamics" },
  description: site.description,
  applicationName: site.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <OrganizationSchema />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
