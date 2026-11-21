import { notFound } from "next/navigation";
import { publishedProducts, getPublishedProduct } from "@/content/products";
import { site } from "@/content/site";
import { ProductExperience } from "@/components/products/ProductExperience";
import { pageMetadata, serializeJsonLd } from "@/lib/metadata";

type ProductPageProps = { params: Promise<{ "product-slug": string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return publishedProducts.map((p) => ({ "product-slug": p.slug }));
}
export async function generateMetadata({ params }: ProductPageProps) {
  const { "product-slug": slug } = await params;
  const product = getPublishedProduct(slug);
  return product ? pageMetadata(product.name, product.summary, `/products/${product.slug}`) : {};
}
export default async function Page({ params }: ProductPageProps) {
  const { "product-slug": slug } = await params;
  const product = getPublishedProduct(slug);
  if (!product) notFound();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.manufacturer} ${product.name}`,
    description: product.summary,
    brand: { "@type": "Brand", name: product.manufacturer },
    url: `${site.url}/products/${product.slug}/`,
  };
  return (
    <>
      <ProductExperience product={product} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
    </>
  );
}
