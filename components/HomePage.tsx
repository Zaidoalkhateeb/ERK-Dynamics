"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, PointerEvent, useEffect, useRef } from "react";

import { products } from "@/content/products";
import { ROUTE_SUMMARY, RouteMapDefs, RouteMapLand, RouteMapRoutes } from "./RouteMapArt";
import { MAP_HEIGHT, MAP_WIDTH } from "./worldMap.data";

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
    tags: ["Wearable robotics", "Passive support"],
    website: "https://www.auxivo.com/",
  },
  {
    id: "leice",
    name: "",
    logo: "/media/partners/leice-logo.png",
    origin: "",
    description:
      "Sensing and measurement technologies supporting mapping, navigation, and spatial awareness in industrial settings.",
    tags: ["LiDAR systems", "Remote sensing"],
    website: "https://www.leice-lidar.com/en/",
  },
] as const;

// Pre-sized copies of the product photography — see scripts/make-home-thumbs.mjs.
const productImages: Record<string, string> = {
  "auxivo-omnisuit": "/media/home/omnisuit-card.webp",
  "auxivo-liftsuit": "/media/home/liftsuit-card.webp",
  "auxivo-deltasuit": "/media/home/deltasuit-card.webp",
  "auxivo-carrysuit": "/media/home/carrysuit-card.webp",
};

// Home-page headline figures: three partners, four published Auxivo systems,
// three technology categories, and five industries on /industries.
const figures = [
  { value: 3, label: "Global technology partners", suffix: "" },
  { value: 4, label: "Exoskeleton solutions", suffix: "" },
  { value: 3, label: "Core technology areas", suffix: "" },
  { value: 5, label: "Industrial sectors", suffix: "+" },
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

        <HomeRouteMap />

        <div className="technology-hero__wash" aria-hidden="true" />

        <div className="partners-hero-copy technology-hero__content">
          <h1 id="home-title">
            <span>Advanced technology</span>{" "}
            <span>for industrial work</span>
          </h1>

          {/* Sits here so phones read headline, then map, then buttons. */}
          <HomeRouteMapBlock />

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
                {figure.suffix}
              </strong>
              <span className="home-figure-label">{figure.label}</span>
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

function HomeRouteMap() {
  return (
    <svg
      className="technology-hero__objects home-route-map"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Routes from İstanbul to ${ROUTE_SUMMARY}`}
      focusable="false"
    >
      <RouteMapDefs prefix="erkHeroMap" />
      <defs>
        {/* The map runs up against the headline on its left, so it dissolves into the
            background there rather than ending on a hard vertical edge. */}
        <linearGradient id="homeMapFadeRamp" gradientUnits="userSpaceOnUse" x1="652" y1="0" x2="800" y2="0">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <mask id="homeMapFade" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
          <rect x="0" y="0" width="1600" height="900" fill="url(#homeMapFadeRamp)" />
        </mask>
        {/* The frame is cropped just below Johannesburg, which clips the Patagonian
            tail. Fading the last stretch turns that cut into a horizon. */}
        <linearGradient id="homeMapFadeFloor" gradientUnits="userSpaceOnUse" x1="0" y1="655" x2="0" y2="716">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <mask id="homeMapFadeBottom" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
          <rect x="0" y="0" width="1600" height="900" fill="url(#homeMapFadeFloor)" />
        </mask>
      </defs>

      {/* Both masks sit on untransformed wrappers on purpose: userSpaceOnUse resolves
          against the masked element's own coordinate system, so hanging either on the
          scaled group below would stretch the ramp along with the map. Nesting them
          composes the two edges. */}
      <g mask="url(#homeMapFade)">
        <g mask="url(#homeMapFadeBottom)">
          {/* The shared artwork is baked in its own 1000 x 516 space; this drops it into
              the right half of the hero canvas, clear of the headline. Land and routes
              keep their own parallax depth, so the routes drift a little ahead of the
              continents as the cursor moves. */}
          <g transform="translate(672 205) scale(0.98)">
            <g className="parallax-layer" data-depth="10">
              <RouteMapLand prefix="erkHeroMap" highlight />
            </g>
            <g className="parallax-layer" data-depth="16">
              <RouteMapRoutes prefix="erkHeroMap" labels />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

/**
 * The phone version of the hero map. The backdrop above is framed for the 1600 x 900
 * hero canvas and cropped to its right half, which is wrong once the hero stacks — so
 * phones get the artwork in its own box instead, in flow between the headline and the
 * buttons. Only one of the two is ever displayed.
 */
function HomeRouteMapBlock() {
  return (
    <svg
      className="home-route-map-block"
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Routes from İstanbul to ${ROUTE_SUMMARY}`}
      focusable="false"
    >
      <RouteMapDefs prefix="erkBlockMap" />
      <RouteMapLand prefix="erkBlockMap" highlight />
      <RouteMapRoutes prefix="erkBlockMap" labels />
    </svg>
  );
}

function Arrow() {
  return <span className="site-arrow" aria-hidden="true" />;
}
