import { pageMetadata } from "@/lib/metadata";
import { AboutExperience } from "@/components/about/AboutExperience";

export const metadata = pageMetadata(
  "About Us",
  "Meet ERK Dynamics, connecting global industrial innovation with local expertise in Türkiye.",
  "/about",
);

export default function Page() {
  return <AboutExperience />;
}
