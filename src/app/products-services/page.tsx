import { pageMetadata } from "@/lib/metadata";
import { ProductsServicesExperience } from "@/components/products/ProductsServicesExperience";

export const metadata = pageMetadata(
  "Products & Services",
  "Explore industrial exoskeletons, LiDAR systems, remote power supply systems, and deployment support from ERK Dynamics.",
  "/products-services",
);

export default function Page() {
  return <ProductsServicesExperience />;
}
