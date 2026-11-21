import type { Metadata } from "next";
import { site } from "@/content/site";
import "@/styles/globals.css";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "ERK Dynamics", template: "%s | ERK Dynamics" },
  description:
    "Industrial exoskeletons and advanced technologies for safer, more efficient operations in Türkiye.",
  openGraph: {
    title: "ERK Dynamics",
    description: "Strength, engineered around people.",
    type: "website",
    images: ["/media/liftsuit-hero.webp"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
