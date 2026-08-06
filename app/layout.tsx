import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.erkdynamics.com"),
  title: { default: "ERK Dynamics | Advanced Industrial Technologies in Türkiye", template: "%s | ERK Dynamics" },
  description: "Industrial exoskeletons and advanced technologies for safer, more efficient operations in Türkiye.",
  openGraph: { title: "ERK Dynamics", description: "Strength, engineered around people.", type: "website", images: ["/media/liftsuit-hero.webp"] },
  alternates: { canonical: "/", languages: { en: "/", tr: "/?lang=tr" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>;
}
