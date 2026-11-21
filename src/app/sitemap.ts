import type { MetadataRoute } from "next";
import { publishedProducts } from "@/content/products";
import { site } from "@/content/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/products-services",
    "/about",
    "/industries",
    "/partners",
    "/contact",
    "/become-a-partner",
    ...publishedProducts.map((product) => `/products/${product.slug}`),
  ];
  return routes.map((route) => ({
    url: `${site.url}${route}/`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
