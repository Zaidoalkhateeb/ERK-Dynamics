import { PageSchema } from "@/components/seo/StructuredData";
import { staticPageMetadata } from "@/lib/metadata";
import { InquiryForm } from "@/components/forms/InquiryForm";
export const metadata = staticPageMetadata("/become-a-partner");
export default function Page() {
  return (
    <main className="partner-application-page">
      <PageSchema pathname="/become-a-partner" />
      <section className="page-hero partner-application-hero">
        <p className="eyebrow"></p>
        <h1>
          <span>Bring meaningful technology</span>
          <span>to Turkish industry</span>
        </h1>
        <p>
          We welcome conversations with manufacturers and specialists whose technologies solve clear
          industrial challenges.
        </p>
        <span className="page-orbit" />
      </section>
      <section className="form-section section">
        <div>
          <p className="eyebrow">PARTNER APPLICATION</p>
          <h2>Start the conversation</h2>
          <p>Share your organization, market focus, and the opportunity you see.</p>
        </div>
        <InquiryForm />
      </section>
    </main>
  );
}
