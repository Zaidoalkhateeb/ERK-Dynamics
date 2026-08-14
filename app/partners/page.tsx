import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PartnerTechnologyHero } from "@/components/PartnerTechnologyHero";
import { PartnerReveal } from "@/components/PartnerReveal";

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

      <section id="partner-directory" className="partner-directory section" aria-labelledby="partner-directory-title">
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
                    Partner Website <span>↗</span>
                  </a>
                  <Link className="button partner-products-button" href="/products-services">
                    Products &amp; Services <span>→</span>
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
                <circle className="partner-join-ring partner-join-ring--left" cx="128" cy="120" r="58" />
                <circle className="partner-join-ring partner-join-ring--right" cx="192" cy="120" r="58" />
                <g className="partner-join-core">
                  <rect x="144" y="104" width="32" height="32" rx="4" transform="rotate(45 160 120)" />
                  <circle cx="160" cy="120" r="6" />
                </g>
                <circle className="partner-join-end" cx="36" cy="120" r="6" />
                <circle className="partner-join-end" cx="284" cy="120" r="6" />
                <circle className="partner-join-flow" r="4">
                  <animateMotion dur="3.6s" begin="0s" repeatCount="indefinite" path="M36 120H160" />
                </circle>
                <circle className="partner-join-flow" r="4">
                  <animateMotion dur="3.6s" begin="-1.8s" repeatCount="indefinite" path="M284 120H160" />
                </circle>
                <text className="partner-join-tag" x="36" y="156" textAnchor="middle">GLOBAL</text>
                <text className="partner-join-tag" x="284" y="156" textAnchor="middle">LOCAL</text>
                <text className="partner-join-tag partner-join-tag--core" x="160" y="200" textAnchor="middle">SHARED VALUE</text>
              </svg>
            </div>

            <div className="partner-feature-copy">
              <p className="eyebrow">Open call</p>
              <h3>Become a partner</h3>
              <p>
                We work with manufacturers and specialists whose technologies solve clear industrial challenges across
                Türkiye. If that sounds like you, let&rsquo;s talk.
              </p>
              <div className="partner-actions">
                <Link className="button primary" href="/become-a-partner">
                  Start the conversation <span>↗</span>
                </Link>
                <Link className="button partner-products-button" href="/contact">
                  Contact us <span>→</span>
                </Link>
              </div>
            </div>
          </article>
        </PartnerReveal>
      </section>
    </main>
  );
}

function PartnerMotion({ name }: { name: "Auxivo" | "LEICE" }) {
  if (name === "Auxivo") {
    return (
      <div className="partner-motion-object partner-motion-object--auxivo" aria-hidden="true">
        <svg viewBox="0 0 260 300">
          <circle className="partner-motion-orbit partner-motion-orbit--one" cx="130" cy="146" r="102" />
          <circle className="partner-motion-orbit partner-motion-orbit--two" cx="130" cy="146" r="76" />
          <g className="partner-exoskeleton">
            <circle cx="130" cy="51" r="20" />
            <path d="M130 73v98M130 91l-45 40M130 91l45 40M111 100l-17 77M149 100l17 77M130 171l-32 83M130 171l32 83" />
            <path className="partner-motion-flow" d="M84 124 107 86h46l23 38-17 57-29 20-29-20-17-57Z" pathLength="1" />
            <path className="partner-motion-flow partner-motion-flow--delay" d="m98 254 4-79 28 26 28-26 4 79" pathLength="1" />
            <circle className="partner-motion-joint partner-motion-joint--one" cx="101" cy="181" r="6" />
            <circle className="partner-motion-joint partner-motion-joint--two" cx="159" cy="181" r="6" />
          </g>
          <path className="partner-motion-signal" d="M28 222c24 21 42 30 67 34" pathLength="1" />
          <path className="partner-motion-signal partner-motion-signal--reverse" d="M232 222c-24 21-42 30-67 34" pathLength="1" />
        </svg>
        <span>WEARABLE SUPPORT</span>
      </div>
    );
  }

  return (
    <div className="partner-motion-object partner-motion-object--leice" aria-hidden="true">
      <svg viewBox="0 0 300 300">
        <circle className="partner-motion-orbit partner-motion-orbit--one" cx="150" cy="150" r="112" />
        <circle className="partner-motion-orbit partner-motion-orbit--two" cx="150" cy="150" r="82" />
        <g className="partner-lidar-head">
          <path d="M112 121h76l12 25-12 27h-76l-12-27 12-25Z" />
          <path d="M122 173v25h56v-25M132 198l-12 30h60l-12-30" />
          <circle cx="150" cy="147" r="15" />
          <path d="M135 147h30M150 132v30" />
        </g>
        <g className="partner-lidar-scan">
          <path d="M150 147 251 72" />
          <path d="M150 147 273 124" />
          <path d="M150 147 271 180" />
          <path className="partner-lidar-arc" d="M251 72a126 126 0 0 1 20 108" pathLength="1" />
        </g>
        <circle className="partner-motion-joint partner-motion-joint--one" cx="251" cy="72" r="5" />
        <circle className="partner-motion-joint partner-motion-joint--two" cx="271" cy="180" r="5" />
      </svg>
      <span>LIDAR SCANNING</span>
    </div>
  );
}
