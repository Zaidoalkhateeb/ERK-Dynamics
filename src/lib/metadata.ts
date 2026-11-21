import type { Metadata } from "next";
import { site } from "@/content/site";

export function pageMetadata(title: string, description: string, pathname: string): Metadata {
  const canonical = pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: canonical,
      siteName: site.name,
      type: "website",
      images: ["/media/liftsuit-hero.webp"],
    },
  };
}

/** Escape less-than signs so editorial text cannot terminate a JSON-LD script. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
