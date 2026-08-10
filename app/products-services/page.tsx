import type { Metadata } from "next";
import { ProductsServicesExperience } from "@/components/ProductsServicesExperience";

export const metadata: Metadata = {
  title: "Industrial Technology Products & Services",
  description: "Explore industrial exoskeletons, LiDAR systems, remote power supply systems, and deployment support from ERK Dynamics.",
};

export default function Page() {
  return <ProductsServicesExperience />;
}
