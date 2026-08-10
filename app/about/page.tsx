import type { Metadata } from "next";
import { AboutExperience } from "@/components/AboutExperience";

export const metadata: Metadata = {
  title: "About ERK Dynamics | Industrial Technology Company in Türkiye",
  description: "Meet ERK Dynamics, connecting global industrial innovation with local expertise in Türkiye.",
};

export default function Page() {
  return <AboutExperience />;
}
