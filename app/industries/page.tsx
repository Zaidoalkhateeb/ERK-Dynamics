import type { Metadata } from "next";
import { IndustriesExperience } from "@/components/IndustriesExperience";

export const metadata: Metadata = {
  title: "Industrial Technology Applications by Industry",
  description:
    "Explore potential applications for industrial technology across manufacturing, logistics, automotive, construction, maintenance, and food & beverage.",
};

export default function Page() {
  return <IndustriesExperience />;
}
