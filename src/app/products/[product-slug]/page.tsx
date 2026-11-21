import { notFound } from "next/navigation";
import { publishedProducts, getPublishedProduct } from "@/content/products";
import { productSeoDescriptions } from "@/content/seo";
import { productImages } from "@/content/home";
import { ProductExperience } from "@/components/products/ProductExperience";
import { PageSchema } from "@/components/seo/StructuredData";
import { pageMetadata } from "@/lib/metadata";
type ProductPageProps = { params: Promise<{ "product-slug": string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return publishedProducts.map((p) => ({ "product-slug": p.slug }));
}
export async function generateMetadata({ params }: ProductPageProps) {
  const { "product-slug": slug } = await params;
  const product = getPublishedProduct(slug);
  if (!product) notFound();
  return pageMetadata(
    `${product.manufacturer} ${product.name} | ${product.category}`,
    productSeoDescriptions[slug] ?? product.summary,
    `/products/${slug}`,
    productImages[slug],
  );
}
export default async function Page({ params }: ProductPageProps) {
  const { "product-slug": slug } = await params;
  const product = getPublishedProduct(slug);
  if (!product) notFound();
  return (
    <>
      <PageSchema pathname={`/products/${slug}`} product={product} />
      <ProductExperience product={product} />
    </>
  );
}
