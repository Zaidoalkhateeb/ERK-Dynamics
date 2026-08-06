import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PartnerTechnologyHero } from "@/components/PartnerTechnologyHero";

const partners = [
  {
    name: "Auxivo",
    number: "01",
    category: "Wearable robotics",
    description:
      "Swiss developed wearable exoskeletons designed to support people during physically demanding industrial work",
    website: "https://www.auxivo.com/",
    logo: "/media/partners/auxivo-logo.png",
    logoWidth: 600,
    logoHeight: 98,
  },
  {
    name: "LEICE",
    number: "02",
    category: "LiDAR technology",
    description:
      "Advanced LiDAR systems for wind power, meteorology, environmental monitoring, and aviation applications.",
    website: "https://www.leice-lidar.com/en/",
    logo: "/media/partners/leice-logo.png",
    logoWidth: 386,
    logoHeight: 118,
  },
] as const;

export const metadata: Metadata = {
  title: "Technology Partners",
  description:
    "Explore ERK Dynamics technology partners Auxivo and LEICE, and discover their industrial products and solutions.",
};

export default function PartnersPage() {
  return (
    <main className="partners-page">
      <PartnerTechnologyHero />

      <section className="partner-directory section" aria-labelledby="partner-directory-title">
        <header className="partner-directory-head">
          <p className="eyebrow"></p>
          <h2 id="partner-directory-title">Meet our partners</h2>
        </header>

        <div className="partner-list">
          {partners.map((partner) => (
            <article className="partner-feature" key={partner.name}>
              <div className="partner-logo-stage">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={partner.logoWidth}
                  height={partner.logoHeight}
                  sizes="(max-width: 800px) 70vw, 34vw"
                />
              </div>

              <div className="partner-feature-copy">
                <p className="eyebrow">
                  {partner.number} / {partner.category}
                </p>
                <h3>{partner.name}</h3>
                <p>{partner.description}</p>
                <div className="partner-actions">
                  <a
                    className="button primary"
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Partner Website <span>↗</span>
                  </a>
                  <Link className="button partner-products-button" href="/products-services">
                    Products &amp; Services <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="inline-cta section">
        <p className="eyebrow"></p>
        <h2>
          Let’s evaluate what fits
          <br />
          your operation.
        </h2>
        <Link href="/contact" className="button primary">
          Contact our team <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
