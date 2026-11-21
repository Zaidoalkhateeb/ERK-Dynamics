import type { Metadata } from "next";
import { site } from "@/content/site";
import { pageSeo } from "@/content/seo";
import { canonicalPath } from "./site-url";

export function pageMetadata(
  title: string,
  description: string,
  pathname: string,
  image: string = site.socialImage,
): Metadata {
  const canonical = `${site.url}${canonicalPath(pathname)}`;
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  const socialImage = {
    url: `${site.url}${image}`,
    alt: title,
    ...(image === site.socialImage ? { width: 1200, height: 630 } : {}),
  };
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: site.name,
      type: "website",
      locale: "en_US",
      images: [socialImage],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [socialImage] },
  };
}

export function staticPageMetadata(pathname: keyof typeof pageSeo): Metadata {
  const page = pageSeo[pathname];
  return pageMetadata(page.title, page.description, pathname);
}
