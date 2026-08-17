"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, PointerEvent, useEffect, useRef } from "react";

import { products } from "@/content/products";

const technologies = [
  {
    id: "exoskeletons",
    number: "01",
    name: "Exoskeletons",
    tagline: "Wearable robotics",
    description:
      "Passive wearable systems that support the back, shoulders, and hips during demanding physical work—without batteries or powered actuation.",
    href: "/products-services/#exoskeletons",
  },
  {
    id: "lidar",
    number: "02",
    name: "LiDAR",
    tagline: "Spatial sensing",
    description:
      "Measurement, mapping, and navigation systems that give machines and teams an accurate picture of the space they work in.",
    href: "https://think-metric.co/products/lidars",
    external: true,
  },
  {
    id: "power",
    number: "03",
    name: "Power Solutions",
    tagline: "Reliable energy",
    description:
      "Dependable power for equipment operating away from fixed infrastructure, across changing industrial conditions.",
    href: "https://think-metric.co/products/remote-power-supply-systems",
    external: true,
  },
] as const;

const partners = [
  {
    id: "auxivo",
    name: "",
    logo: "/media/partners/auxivo-logo.png",
    origin: "",
    description:
      "Swiss developer of passive industrial exoskeletons, engineered around freedom of movement and fast daily use.",
    tags: ["Wearable robotics", "Passive support", "Switzerland"],
    website: "https://www.auxivo.com/",
  },
  {
    id: "leice",
    name: "",
    logo: "/media/partners/leice-logo.png",
    origin: "",
    description:
      "Sensing and measurement technologies supporting mapping, navigation, and spatial awareness in industrial settings.",
    tags: ["LiDAR systems", "Remote sensing", "Measurement"],
    website: "https://www.leice-lidar.com/en/",
  },
] as const;

const principles = [
  {
    id: "evaluation",
    title: "Evaluation first",
    text: "Task assessment, fitting, and field trials before any wider rollout.",
  },
  {
    id: "support",
    title: "Local support",
    text: "An Istanbul-based team and a single point of contact through the product lifecycle.",
  },
  {
    id: "claims",
    title: "Responsible claims",
    text: "Technical clarity about what a technology does and what it does not.",
  },
] as const;

// Pre-sized copies of the product photography — see scripts/make-home-thumbs.mjs.
const productImages: Record<string, string> = {
  "auxivo-omnisuit": "/media/home/omnisuit-card.webp",
  "auxivo-liftsuit": "/media/home/liftsuit-card.webp",
  "auxivo-deltasuit": "/media/home/deltasuit-card.webp",
  "auxivo-carrysuit": "/media/home/carrysuit-card.webp",
};

// Every figure is countable from the site itself: two partners, four published
// Auxivo systems, three technology categories, five industries on /industries.
const figures = [
  { value: 2, label: "Technology partners", note: "" },
  { value: 4, label: "Exoskeleton systems", note: "" },
  { value: 3, label: "Technology categories", note: "" },
  { value: 5, label: "Industries served", note: "" },
] as const;

export function HomePage() {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const figuresRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const featured = products.filter((item) => item.status === "published");

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  // Elements rise into place as they enter the viewport. The hiding styles are gated
  // behind `.reveal-ready`, which only this effect adds, so the page stays fully
  // readable if the script never runs or motion is reduced.
  useEffect(() => {
    const root = mainRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!targets.length) return;

    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // The figures count up the first time the band is reached. Values are written
  // into the markup too, so they are correct before (and without) the script.
  useEffect(() => {
    const band = figuresRef.current;
    if (!band) return;
    const counters = Array.from(band.querySelectorAll<HTMLElement>("[data-count-to]"));
    if (!counters.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const run = () => {
      const started = performance.now();
      const step = (now: number) => {
        // easeOutCubic, so the numbers land softly rather than stopping dead.
        const t = Math.min(1, (now - started) / 900);
        const eased = 1 - (1 - t) ** 3;
        counters.forEach((node) => {
          const target = Number(node.dataset.countTo);
          node.textContent = String(Math.round(target * eased));
        });
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(band);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Each art layer drifts by its own `data-depth`, matching the industries and partners heroes.
  const shiftLayers = (clientX: number, clientY: number) => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = hero.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    hero.querySelectorAll<SVGGElement>("[data-depth]").forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0);
      layer.style.setProperty("--move-x", `${(x * depth).toFixed(2)}px`);
      layer.style.setProperty("--move-y", `${(y * depth * 0.68).toFixed(2)}px`);
    });
  };

  const moveHero = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const { clientX, clientY } = event;
    frameRef.current = requestAnimationFrame(() => shiftLayers(clientX, clientY));
  };

  const resetHero = () => {
    heroRef.current?.querySelectorAll<SVGGElement>("[data-depth]").forEach((layer) => {
      layer.style.setProperty("--move-x", "0px");
      layer.style.setProperty("--move-y", "0px");
    });
  };

  return (
    <main className="home-page" ref={mainRef}>
      <section
        ref={heroRef}
        className="page-hero hero-partners technology-hero hero-home"
        aria-labelledby="home-title"
        onPointerMove={moveHero}
        onPointerLeave={resetHero}
      >
        <div className="technology-hero__background" aria-hidden="true" />

        <svg
          className="technology-hero__objects"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="homeCyanStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#62d5e8" stopOpacity="0.1" />
              <stop offset="0.5" stopColor="#0bb7d3" stopOpacity="0.45" />
              <stop offset="1" stopColor="#0299b7" stopOpacity="0.75" />
            </linearGradient>
            <pattern id="homeDotPattern" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="3.6" fill="#37bdd5" fillOpacity="0.42" />
            </pattern>
          </defs>

          {/* Outer orbit — the shared signature ring across the site's heroes. */}
          <g className="parallax-layer" data-depth="9">
            <g className="object-spin">
              <circle cx="1195" cy="450" r="498" fill="none" stroke="url(#homeCyanStroke)" strokeWidth="8" strokeDasharray="640 1120" opacity="0.5" />
              <circle cx="1195" cy="450" r="405" fill="none" stroke="#20b6cf" strokeWidth="2" strokeDasharray="170 52 38 90" opacity="0.25" />
            </g>
          </g>

          {/* LiDAR sweep — concentric arcs radiating from the core. */}
          <g className="parallax-layer" data-depth="16">
            <g className="object-spin-reverse" fill="none" stroke="#0a9db9" strokeLinecap="round">
              <path d="M1195 180a270 270 0 0 1 234 135" strokeWidth="3" opacity="0.34" />
              <path d="M1195 245a205 205 0 0 1 178 103" strokeWidth="3" opacity="0.26" />
              <path d="M1195 310a140 140 0 0 1 121 70" strokeWidth="3" opacity="0.2" />
              <circle cx="1195" cy="450" r="268" strokeWidth="11" strokeDasharray="14 13" opacity="0.2" />
            </g>
          </g>

          <g className="parallax-layer" data-depth="14">
            <g className="object-float-reverse">
              <path d="M1080 0H1600V628L1470 598L1398 474L1172 418L1082 240Z" fill="url(#homeDotPattern)" opacity="0.55" />
            </g>
          </g>

          {/* Core diamond — the exoskeleton/support mark. */}
          <g className="parallax-layer" data-depth="23">
            <g className="object-float" fill="none" stroke="#08a8c5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1115" y="370" width="160" height="160" rx="8" transform="rotate(45 1195 450)" strokeWidth="11" opacity="0.4" />
              <rect x="1155" y="410" width="80" height="80" rx="5" transform="rotate(45 1195 450)" strokeWidth="8" opacity="0.3" />
              <path d="M1347 295L1529 295L1620 452L1529 609L1347 609L1256 452Z" strokeWidth="6" opacity="0.2" />
            </g>
          </g>

          {/* Power nodes — hex cells feeding the core. */}
          <g className="parallax-layer" data-depth="19">
            <g className="object-float" fill="none" stroke="#0a9db9" strokeWidth="2.5" opacity="0.32">
              <path d="M905 300l30-17 30 17v34l-30 17-30-17z" />
              <path d="M845 392l30-17 30 17v34l-30 17-30-17z" />
              <path d="M905 484l30-17 30 17v34l-30 17-30-17z" />
            </g>
          </g>

          {/* Line running under the hub. */}
          <g className="parallax-layer" data-depth="19" fill="none" stroke="#17afc9" strokeLinecap="round">
            <path className="object-line-flow" d="M700 640H1005L1113 531H1391" strokeWidth="5" strokeDasharray="16 30" opacity="0.3" />
          </g>

          <g className="parallax-layer" data-depth="27" fill="none" stroke="#49cadd" strokeWidth="1.5" opacity="0.35">
            <path className="object-wave" d="M800 920C990 750 1160 796 1320 688C1445 603 1522 492 1657 443" strokeDasharray="15 10 2 12" />
            <path className="object-wave object-wave--delayed" d="M840 925C1027 819 1195 850 1360 766C1489 701 1565 621 1679 585" strokeDasharray="22 12 3 16" />
          </g>
        </svg>

        <div className="technology-hero__wash" aria-hidden="true" />

        <div className="partners-hero-copy technology-hero__content">
          <h1 id="home-title">
            <span>Advanced technology</span>
            <span>for industrial work</span>
          </h1>
          <p>
            ERK Dynamics brings proven industrial technologies to Türkiye, including wearable robotics,
            spatial sensing, and reliable power selected around real operational needs and evaluated in the
            environments where they will actually be used.
          </p>
          <div className="home-hero-actions">
            <a className="ind-button ind-button--primary" href="#home-technologies">
              Explore technologies <Arrow />
            </a>
            <Link className="ind-button ind-button--secondary" href="/contact">
              Talk to our team <Arrow />
            </Link>
          </div>
        </div>

        <a className="page-scroll-cue" href="#home-technologies">
          <span>Scroll to discover</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section className="home-intro" aria-labelledby="home-intro-title">
        <div className="home-intro-inner">
          <div className="home-intro-lead" data-reveal>
            <h2 id="home-intro-title">
              <span>Technology chosen for</span>
              <span>the work, not the catalogue</span>
            </h2>
          </div>
          <div className="home-intro-body" data-reveal style={{ "--reveal-i": 1 } as CSSProperties}>
            <p>
              We are an Istanbul-based technology solutions company helping industrial teams evaluate,
              adopt, and scale advanced systems that improve worker safety and operational performance.
            </p>
            <ul className="home-principles">
              {principles.map((principle) => (
                <li key={principle.id}>
                  <span className="home-principle-icon" aria-hidden="true">
                    <svg viewBox="0 0 48 48" role="presentation">
                      <PrincipleIcon id={principle.id} />
                    </svg>
                  </span>
                  <strong>{principle.title}</strong>
                  <span className="home-principle-text">{principle.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section ref={figuresRef} className="home-figures" aria-label="ERK Dynamics at a glance">
        <div className="home-figures-art" aria-hidden="true">
          <svg viewBox="0 0 1400 260" preserveAspectRatio="xMidYMid slice" role="presentation">
            <g className="home-figures-rings">
              <circle cx="1180" cy="130" r="210" />
              <circle cx="1180" cy="130" r="150" />
              <circle cx="1180" cy="130" r="92" />
            </g>
            <path className="home-figures-line" d="M-40 210H360l70-72h330l64 66h420" />
            <path className="home-figures-line home-figures-line--slow" d="M-40 62h300l58 60h360l72-74h480" />
          </svg>
        </div>

        <ul className="home-figure-list">
          {figures.map((figure, index) => (
            <li key={figure.label} data-reveal style={{ "--reveal-i": index } as CSSProperties}>
              <strong>
                <span data-count-to={figure.value}>{figure.value}</span>
              </strong>
              <span className="home-figure-label">{figure.label}</span>
              <span className="home-figure-note">{figure.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="home-technologies" className="home-tech" aria-labelledby="home-tech-title">
        <div className="home-section-head" data-reveal>
          <h2 id="home-tech-title">
            <span>Three technologies</span>
            <span>one industrial focus</span>
          </h2>
          <p className="home-section-intro">
            Each is offered where it solves a clear, practical problem and supported from first
            demonstration through deployment.
          </p>
        </div>

        <ul className="home-tech-grid">
          {technologies.map((item, index) => {
            // Two of the three categories are handled by the ERK Group company.
            const CardTag = "external" in item && item.external ? "a" : Link;
            const externalProps =
              "external" in item && item.external
                ? { target: "_blank" as const, rel: "noopener noreferrer" }
                : {};
            return (
            <li key={item.id} data-reveal style={{ "--reveal-i": index } as CSSProperties}>
              <CardTag className="home-tech-card" href={item.href} {...externalProps}>
                <span className="home-tech-shine" aria-hidden="true" />
                <span className="home-tech-frame" aria-hidden="true" />
                <span className="home-tech-head">
                  <span className="home-tech-num">{item.number}</span>
                  <span className="home-tech-glyph" aria-hidden="true">
                    <svg viewBox="0 0 120 120" role="presentation">
                      <TechGlyph id={item.id} />
                    </svg>
                  </span>
                </span>
                <span className="home-tech-tagline">{item.tagline}</span>
                <span className="home-tech-name">{item.name}</span>
                <span className="home-tech-desc">{item.description}</span>
                <span className="home-tech-cue">
                  Learn more <span className="site-arrow" aria-hidden="true" />
                </span>
              </CardTag>
            </li>
            );
          })}
        </ul>
      </section>

      <section className="home-products" aria-labelledby="home-products-title">
        <div className="home-section-head" data-reveal>
          <h2 id="home-products-title">
            <span>Passive exoskeletons</span>
            <span>matched to the task</span>
          </h2>
          <p className="home-section-intro">
            Four Auxivo systems, each built around a different movement pattern. Selection starts with
            the work being done.
          </p>
        </div>

        <ul className="home-product-grid">
          {featured.map((item, index) => (
            <li key={item.slug} data-reveal style={{ "--reveal-i": index } as CSSProperties}>
              <Link className="home-product-card" href={`/products/${item.slug}`}>
                {productImages[item.slug] && (
                  <span className="home-product-media">
                    <Image
                      src={productImages[item.slug]}
                      alt={`Auxivo ${item.name} worn during industrial work`}
                      width={720}
                      height={540}
                      sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 23vw"
                    />
                  </span>
                )}
                <span className="home-product-top">
                  <span className="home-product-num">{item.number}</span>
                  <span className="home-product-cat">{item.category}</span>
                </span>
                <span className="home-product-name">{item.name}</span>
                <span className="home-product-tagline">{item.tagline}</span>
                <span className="home-product-cue">
                  Inspect product <span className="site-arrow" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-partners" aria-labelledby="home-partners-title">
        <div className="home-section-head" data-reveal>
          <h2 id="home-partners-title">
            <span>Proven global innovation</span>
            <span>represented locally</span>
          </h2>
          <p className="home-section-intro">
            We work with manufacturers whose products solve clear problems, and we represent them
            accurately.
          </p>
        </div>

        <ul className="home-partner-grid">
          {partners.map((item, index) => (
            <li key={item.id} data-reveal style={{ "--reveal-i": index } as CSSProperties}>
              <article className="home-partner-card">
                <div className="home-partner-body">
                  <span className="home-partner-logo">
                    <Image src={item.logo} alt={`${item.name} logo`} width={200} height={80} />
                  </span>
                  <p className="home-partner-origin">{item.origin}</p>
                  <p className="home-partner-desc">{item.description}</p>
                  <ul className="home-partner-tags">
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <a
                    className="home-partner-link"
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Partner website <span className="site-arrow" aria-hidden="true" />
                  </a>
                </div>

                {/* The artwork gets its own panel so it can never sit under the copy. */}
                <div className={`home-partner-art home-partner-art--${item.id}`} aria-hidden="true">
                  <svg viewBox="0 0 300 200" role="presentation">
                    <PartnerArt id={item.id} />
                  </svg>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}

function PartnerArt({ id }: { id: string }) {
  // Auxivo: a wearable frame with support paths running through it.
  if (id === "auxivo") {
    return (
      <g>
        <g className="home-partner-frame">
          <circle cx="150" cy="42" r="16" />
          <path d="M150 58v72M150 74l-34 28M150 74l34 28M150 130l-24 62M150 130l24 62" />
        </g>
        <path className="home-partner-flow" d="M116 102 128 66h44l12 36-14 44-22 16-22-16z" pathLength="1" />
        <path className="home-partner-flow home-partner-flow--late" d="m126 192 4-60 20 20 20-20 4 60" pathLength="1" />
        <g className="home-partner-node">
          <circle cx="122" cy="112" r="5" />
          <circle cx="178" cy="112" r="5" />
        </g>
      </g>
    );
  }

  // LEICE: a sensor head sweeping the space in front of it.
  return (
    <g>
      <g className="home-partner-frame">
        <path d="M120 86h60l10 20-10 21h-60l-10-21z" />
        <path d="M130 127v22h40v-22M138 149l-8 26h40l-8-26" />
        <circle cx="150" cy="106" r="12" />
      </g>
      <g className="home-partner-scan">
        <path d="M150 106 268 40" />
        <path d="M150 106h124" />
        <path d="M150 106 262 168" />
      </g>
      <path className="home-partner-arc" d="M268 40a104 104 0 0 1 0 132" pathLength="1" />
      <g className="home-partner-node">
        <circle cx="268" cy="40" r="5" />
        <circle cx="262" cy="168" r="5" />
      </g>
    </g>
  );
}

function TechGlyph({ id }: { id: string }) {
  switch (id) {
    case "exoskeletons":
      return (
        <g>
          <g className="home-glyph-primary">
            <circle cx="60" cy="26" r="11" />
            <path d="M60 37v30" />
            <path d="M60 44 38 58M60 44l22 14" />
            <path d="M60 67 46 96M60 67l14 29" />
          </g>
          <path d="M32 52c-4 10-4 21 0 31" />
          <path d="M88 52c4 10 4 21 0 31" />
        </g>
      );
    case "lidar":
      return (
        <g>
          <g className="home-glyph-primary">
            <circle cx="60" cy="60" r="8" />
            <path d="M60 60 96 34" />
          </g>
          <path d="M60 26a34 34 0 0 1 29 17" />
          <path d="M60 39a21 21 0 0 1 18 10" />
          <path d="M24 88h72" />
          <path d="M42 88V72M78 88V66" />
        </g>
      );
    case "power":
      return (
        <g>
          <g className="home-glyph-primary">
            <path d="M64 24 42 64h16l-4 32 24-42H62z" />
          </g>
          <path d="M30 40v40l30 17 30-17V40L60 23z" />
        </g>
      );
    default:
      return null;
  }
}

function PrincipleIcon({ id }: { id: string }) {
  switch (id) {
    // Clipboard with a checked line: the assessment that precedes a rollout.
    case "evaluation":
      return (
        <g>
          <path d="M14 10h20v6H14z" />
          <path d="M14 13H9v27h30V13h-5" />
          <path className="home-principle-mark" d="m16 26 5 5 11-11" />
          <path d="M16 36h16" />
        </g>
      );
    // Location pin over a base line: a team on the ground here.
    case "support":
      return (
        <g>
          <path className="home-principle-mark" d="M24 41c7-9 11-15 11-20a11 11 0 0 0-22 0c0 5 4 11 11 20Z" />
          <circle cx="24" cy="21" r="4" />
          <path d="M9 43h30" />
        </g>
      );
    // Balance scale: claims weighed against what the product actually does.
    default:
      return (
        <g>
          <path d="M24 12v29" />
          <path d="M12 18h24" />
          <path d="M15 41h18" />
          <path className="home-principle-mark" d="M12 18 6 31h12zM36 18l-6 13h12z" />
        </g>
      );
  }
}

function Arrow() {
  return <span className="site-arrow" aria-hidden="true" />;
}
