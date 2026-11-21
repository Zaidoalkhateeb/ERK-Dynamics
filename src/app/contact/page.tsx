import { PageSchema } from "@/components/seo/StructuredData";
import { staticPageMetadata } from "@/lib/metadata";
import { ContactExperience } from "@/components/contact/ContactExperience";
export const metadata = staticPageMetadata("/contact");
export default function Page() {
  return (
    <>
      <PageSchema pathname="/contact" />
      <ContactExperience />
    </>
  );
}
