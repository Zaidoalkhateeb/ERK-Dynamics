import { pageMetadata } from "@/lib/metadata";
import { IndustriesExperience } from "@/components/industries/IndustriesExperience";

export const metadata = pageMetadata(
  "Industries",
  "Explore potential applications for industrial technology across manufacturing, logistics, automotive, construction, maintenance, and food & beverage.",
  "/industries",
);

export default function Page() {
  return <IndustriesExperience />;
}
