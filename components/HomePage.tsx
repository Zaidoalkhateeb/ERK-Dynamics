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
    href: "/products-services/#lidar",
  },
  {
    id: "power",
    number: "03",
    name: "Power Solutions",
    tagline: "Reliable energy",
    description:
      "Dependable power for equipment operating away from fixed infrastructure, across changing industrial conditions.",
    href: "/products-services/#remote-power",
  },
] as const;

const industries = [
  { number: "01", name: "Manufacturing" },
  { number: "02", name: "Logistics & Warehousing" },
  { number: "03", name: "Construction" },
  { number: "04", name: "Automotive" },
  { number: "05", name: "Shipbuilding & Heavy Industry" },
] as const;

const partners = [
  {
    id: "auxivo",
    name: "",
    logo: "/media/partners/auxivo-logo.png",
    origin: "",
    description:
      "Swiss developer of passive industrial exoskeletons, engineered around freedom of movement and fast daily use.",
  },
  {
    id: "leice",
    name: "",
    logo: "/media/partners/leice-logo.png",
    origin: "",
    description:
      "Sensing and measurement technologies supporting mapping, navigation, and spatial awareness in industrial settings.",
  },
] as const;

const principles = [
  ["Evaluation first", "Task assessment, fitting, and field trials before any wider rollout."],
  ["Local support", "An Istanbul-based team and a single point of contact through the product lifecycle."],
  ["Responsible claims", "Technical clarity about what a technology does and what it does not."],
] as const;

export function HomePage() {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
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
              {principles.map(([title, text]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
          {technologies.map((item, index) => (
            <li key={item.id} data-reveal style={{ "--reveal-i": index } as CSSProperties}>
              <Link className="home-tech-card" href={item.href}>
                <span className="home-tech-num">{item.number}</span>
                <span className="home-tech-glyph" aria-hidden="true">
                  <svg viewBox="0 0 120 120" role="presentation">
                    <TechGlyph id={item.id} />
                  </svg>
                </span>
                <span className="home-tech-tagline">{item.tagline}</span>
                <span className="home-tech-name">{item.name}</span>
                <span className="home-tech-desc">{item.description}</span>
                <span className="home-tech-cue">
                  Learn more <span className="site-arrow" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
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

        <Link className="ind-button ind-button--secondary home-section-action" href="/products-services">
          View the full portfolio <Arrow />
        </Link>
      </section>

      <section className="home-industries" aria-labelledby="home-industries-title">
        <div className="home-industries-inner">
          <div className="home-industries-copy" data-reveal>
            <h2 id="home-industries-title">
              <span>One technology set</span>
              <span>many operating realities</span>
            </h2>
            <p className="home-section-intro">
              The same systems behave differently on a production line, a jobsite, and a dock. We start
              with the environment.
            </p>
            <Link className="ind-button ind-button--primary" href="/industries">
              Explore industries <Arrow />
            </Link>
          </div>

          <ol className="home-industry-list">
            {industries.map((item, index) => (
              <li key={item.number} data-reveal style={{ "--reveal-i": index } as CSSProperties}>
                <Link href="/industries">
                  <span className="home-industry-num">{item.number}</span>
                  <span className="home-industry-name">{item.name}</span>
                  <span className="site-arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
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
                <span className="home-partner-logo">
                  <Image src={item.logo} alt={`${item.name} logo`} width={200} height={80} />
                </span>
                <p className="home-partner-origin">{item.origin}</p>
                <h3>{item.name}</h3>
                <p className="home-partner-desc">{item.description}</p>
              </article>
            </li>
          ))}
        </ul>

        <Link className="ind-button ind-button--secondary home-section-action" href="/partners">
          Meet our partners <Arrow />
        </Link>
      </section>

    </main>
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

function Arrow() {
  return <span className="site-arrow" aria-hidden="true" />;
}
