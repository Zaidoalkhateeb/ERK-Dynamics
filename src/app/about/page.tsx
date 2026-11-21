import { PageSchema } from "@/components/seo/StructuredData";
import { staticPageMetadata } from "@/lib/metadata";
import { AboutExperience } from "@/components/about/AboutExperience";

export const metadata = staticPageMetadata("/about");

export default function Page() {
  return (
    <>
      <PageSchema pathname="/about" />
      <AboutExperience />
    </>
  );
}
