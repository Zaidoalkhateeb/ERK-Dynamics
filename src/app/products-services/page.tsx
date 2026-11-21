import { PageSchema } from "@/components/seo/StructuredData";
import { staticPageMetadata } from "@/lib/metadata";
import { ProductsServicesExperience } from "@/components/products/ProductsServicesExperience";

export const metadata = staticPageMetadata("/products-services");

export default function Page() {
  return (
    <>
      <PageSchema pathname="/products-services" />
      <ProductsServicesExperience />
    </>
  );
}
