import { HomePage } from "@/components/home/HomePage";
import { PageSchema } from "@/components/seo/StructuredData";
import { staticPageMetadata } from "@/lib/metadata";
export const metadata = staticPageMetadata("/");
export default function Page() {
  return (
    <>
      <PageSchema pathname="/" />
      <HomePage />
    </>
  );
}
