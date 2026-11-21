import { PageSchema } from "@/components/seo/StructuredData";
import { staticPageMetadata } from "@/lib/metadata";
import { IndustriesExperience } from "@/components/industries/IndustriesExperience";

export const metadata = staticPageMetadata("/industries");

export default function Page() {
  return (
    <>
      <PageSchema pathname="/industries" />
      <IndustriesExperience />
    </>
  );
}
