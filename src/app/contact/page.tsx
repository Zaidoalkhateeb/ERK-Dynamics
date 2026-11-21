import { pageMetadata } from "@/lib/metadata";
import { ContactExperience } from "@/components/contact/ContactExperience";
export const metadata = pageMetadata(
  "Contact Us",
  "Request an industrial technology demonstration, quotation, or consultation with ERK Dynamics.",
  "/contact",
);
export default function Page() {
  return <ContactExperience />;
}
