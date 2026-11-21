import { PageSchema } from "@/components/seo/StructuredData";
import { PartnerMotion } from "@/components/partners/PartnerMotion";
import { partners } from "@/content/partners";
import { staticPageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { PartnerTechnologyHero } from "@/components/partners/PartnerTechnologyHero";
import { PartnerReveal } from "@/components/partners/PartnerReveal";

export const metadata = staticPageMetadata("/partners");

export default function PartnersPage() {
  return (
    <main className="partners-page">
      <PageSchema pathname="/partners" />
      <PartnerTechnologyHero />

      <section
        id="partner-directory"
        className="partner-directory section"
        aria-labelledby="partner-directory-title"
      >
        <header className="partner-directory-head">
          <h2 id="partner-directory-title">Meet our partners</h2>
        </header>

        <PartnerReveal>
          {partners.map((partner) => (
            <article className="partner-feature" key={partner.name}>
              <div className="partner-logo-stage">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={partner.logoWidth}
                  height={partner.logoHeight}
                  className={`partner-logo partner-logo--${partner.name.toLowerCase()}`}
                  sizes="(max-width: 800px) 70vw, 34vw"
                />
              </div>

              <div className="partner-feature-copy">
                <p className="eyebrow">
                  {partner.number} / {partner.category}
                </p>
                <h3>{partner.name}</h3>
                <p>{partner.description}</p>
                <PartnerMotion name={partner.name} />
                <div className="partner-actions">
                  <a
                    className="button primary"
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Partner Website <span className="site-arrow" aria-hidden="true" />
                  </a>
                  <Link className="button partner-products-button" href="/products-services">
                    Products &amp; Services <span className="site-arrow" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}

          <article className="partner-feature partner-feature--join">
            <div className="partner-logo-stage partner-join-stage">
              <svg viewBox="0 0 320 240" aria-hidden="true">
                <path className="partner-join-wire" d="M42 120h48" />
                <path className="partner-join-wire" d="M230 120h48" />
                <circle
                  className="partner-join-ring partner-join-ring--left"
                  cx="128"
                  cy="120"
                  r="58"
                />
                <circle
                  className="partner-join-ring partner-join-ring--right"
                  cx="192"
                  cy="120"
                  r="58"
                />
                <g className="partner-join-core">
                  <rect
                    x="144"
                    y="104"
                    width="32"
                    height="32"
                    rx="4"
                    transform="rotate(45 160 120)"
                  />
                  <circle cx="160" cy="120" r="6" />
                </g>
                <circle className="partner-join-end" cx="36" cy="120" r="6" />
                <circle className="partner-join-end" cx="284" cy="120" r="6" />
                <circle className="partner-join-flow" r="4">
                  <animateMotion
                    dur="3.6s"
                    begin="0s"
                    repeatCount="indefinite"
                    path="M36 120H160"
                  />
                </circle>
                <circle className="partner-join-flow" r="4">
                  <animateMotion
                    dur="3.6s"
                    begin="-1.8s"
                    repeatCount="indefinite"
                    path="M284 120H160"
                  />
                </circle>
                <text className="partner-join-tag" x="36" y="156" textAnchor="middle">
                  GLOBAL
                </text>
                <text className="partner-join-tag" x="284" y="156" textAnchor="middle">
                  LOCAL
                </text>
                <text
                  className="partner-join-tag partner-join-tag--core"
                  x="160"
                  y="200"
                  textAnchor="middle"
                >
                  SHARED VALUE
                </text>
              </svg>
            </div>

            <div className="partner-feature-copy">
              <p className="eyebrow">Open call</p>
              <h3>Become a partner</h3>
              <p>
                We work with manufacturers and specialists whose technologies solve clear industrial
                challenges across Türkiye. If that sounds like you, let&rsquo;s talk.
              </p>
              <div className="partner-actions">
                <Link className="button primary" href="/become-a-partner">
                  Start the conversation <span className="site-arrow" aria-hidden="true" />
                </Link>
                <Link className="button partner-products-button" href="/contact">
                  Contact us <span className="site-arrow" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        </PartnerReveal>
      </section>
    </main>
  );
}
