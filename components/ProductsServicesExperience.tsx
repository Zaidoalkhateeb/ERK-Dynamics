"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEvent, PointerEvent, useEffect, useRef, useState } from "react";

const categories = [
  { id: "exoskeletons", label: "Exoskeleton" },
  { id: "lidar", label: "LiDAR" },
  { id: "remote-power", label: "Power Supply" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

const exoskeletons = [
  {
    id: "omnisuit",
    name: "OmniSuit",
    image: "/media/omnisuit-work.webp",
    detail: "/media/omnisuit-detail.webp",
    alt: "Worker using the Auxivo OmniSuit during an overhead task",
    focus: "Shoulders + lower back",
    description: "One passive system for work that moves between overhead activity, lifting, and forward-leaning positions.",
    tasks: ["Overhead work", "Lifting", "Mixed tasks"],
    href: "/products/auxivo-omnisuit",
    specLabel: "Sizes",
    specValue: "S/M · L/XL",
    cta: "Experience OmniSuit",
  },
  {
    id: "liftsuit",
    name: "LiftSuit",
    image: "/media/liftsuit-work.webp",
    detail: "/media/liftsuit-hero.webp",
    alt: "Worker using the Auxivo LiftSuit during industrial work",
    focus: "",
    description: "Lightweight passive support for repetitive lifting, low handling, and prolonged forward-leaning work.",
    tasks: ["Lifting", "Forward leaning", "Repetitive handling"],
    href: "/products/auxivo-liftsuit",
    specLabel: "Sizes",
    specValue: "S/M · L/XL",
    cta: "Experience LiftSuit",
  },
  {
    id: "deltasuit",
    name: "DeltaSuit",
    image: "/media/deltasuit-1.jpeg",
    detail: "/media/deltasuit-3.jpeg",
    alt: "Worker using the Auxivo DeltaSuit during overhead industrial work",
    focus: "Shoulders + neck",
    description: "Lightweight passive support for repetitive overhead work, arm elevation, and prolonged shoulder-intensive tasks.",
    tasks: ["Overhead work", "Arm support", "Shoulder relief"],
    href: "/products/auxivo-deltasuit",
    specLabel: "Sizes",
    specValue: "S/M · L/XL",
    cta: "Experience DeltaSuit",
  },
  {
    id: "carrysuit",
    name: "CarrySuit",
    image: "/media/carrysuit-1.jpeg",
    detail: "/media/carrysuit-3.jpeg",
    alt: "Worker using the Auxivo CarrySuit to carry an industrial load",
    focus: "Upper body + hips",
    description: "Passive load-transfer support for repetitive carrying, heavy material handling, and physically demanding transport tasks.",
    tasks: ["Load carrying", "Material handling", "Load transfer"],
    href: "/products/auxivo-carrysuit",
    specLabel: "Sizes",
    specValue: "S/M · L/XL",
    cta: "Experience CarrySuit",
  },
] as const;

export function ProductsServicesExperience() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [category, setCategory] = useState<CategoryId>("exoskeletons");
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const product = exoskeletons[activeProduct];

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  // Deep links such as /products-services#lidar must open that category, since
  // every other one is unmounted.
  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.slice(1);
      if (categories.some((item) => item.id === id)) setCategory(id as CategoryId);
    };
    syncFromHash();
    addEventListener("hashchange", syncFromHash);
    return () => removeEventListener("hashchange", syncFromHash);
  }, []);

  const moveHero = (event: PointerEvent<HTMLDivElement>) => {
    const visual = heroVisualRef.current;
    if (!visual || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      visual.style.setProperty("--portfolio-x", `${(x * 22).toFixed(2)}px`);
      visual.style.setProperty("--portfolio-y", `${(y * 16).toFixed(2)}px`);
    });
  };

  const resetHero = () => {
    heroVisualRef.current?.style.setProperty("--portfolio-x", "0px");
    heroVisualRef.current?.style.setProperty("--portfolio-y", "0px");
  };

  const selectCategory = (event: MouseEvent<HTMLAnchorElement>, id: CategoryId) => {
    setCategory(id);
    // Only the chosen category stays mounted, so the anchor target has moved:
    // scroll back to the tab bar instead of letting the browser jump.
    event.preventDefault();
    requestAnimationFrame(() => {
      document.getElementById("technology-portfolio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main className="portfolio-page" data-active-category={category}>
      <section className="portfolio-hero" aria-labelledby="portfolio-title">
        <div className="portfolio-hero-grid" aria-hidden="true" />
        <div className="portfolio-hero-glow" aria-hidden="true" />
        <div className="portfolio-hero-inner">
          <div className="portfolio-hero-copy">
            <h1 id="portfolio-title">Technology selected<br />for real operations</h1>
            <p className="portfolio-hero-intro">
              ERK Dynamics connects industrial teams with wearable robotics, sensing systems, and remote power
              technologies then supports the evaluation, adoption, and deployment around them.
            </p>
            <div className="portfolio-hero-actions">
              <a className="portfolio-button portfolio-button--primary" href="#technology-portfolio">Explore the portfolio <Arrow /></a>
              <Link className="portfolio-button portfolio-button--secondary" href="/contact">Discuss a requirement <Arrow /></Link>
            </div>
          </div>

          <div ref={heroVisualRef} className="portfolio-hero-visual" onPointerMove={moveHero} onPointerLeave={resetHero} aria-hidden="true">
            <div className="portfolio-hero-image portfolio-hero-image--rear">
              <Image src="/media/liftsuit-hero.webp" alt="" fill preload sizes="(max-width: 900px) 72vw, 36vw" />
            </div>
            <div className="portfolio-hero-image portfolio-hero-image--front">
              <Image src="/media/omnisuit-work.webp" alt="" fill preload sizes="(max-width: 900px) 72vw, 39vw" />
            </div>
          </div>
        </div>
        <a className="page-scroll-cue" href="#technology-portfolio"><span>Scroll to discover</span><i aria-hidden="true" /></a>
      </section>

      <nav id="technology-portfolio" className="portfolio-category-nav" aria-label="Technology categories">
        {categories.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={category === item.id ? "is-active" : ""}
            aria-current={category === item.id ? "true" : undefined}
            onClick={(event) => selectCategory(event, item.id)}
          >
            <strong>{item.label}</strong><i></i>
          </a>
        ))}
      </nav>

      <section id="exoskeletons" data-category="exoskeletons" className="portfolio-exo" aria-labelledby="exo-title">
        <header className="portfolio-section-heading">
          <div>
            <span>Wearable robotics</span>
            <h2 id="exo-title" className="portfolio-visually-hidden">Exoskeleton</h2>
          </div>
        </header>

        <div className="portfolio-product-stage">
          <div className="portfolio-product-media">
            {exoskeletons.map((item, index) => (
              <div className={`portfolio-product-image ${activeProduct === index ? "is-active" : ""}`} key={item.id}>
                <Image src={item.image} alt={activeProduct === index ? item.alt : ""} fill sizes="(max-width: 900px) 100vw, 64vw" />
              </div>
            ))}
            <div className="portfolio-product-detail" aria-hidden="true">
              <Image src={product.detail} alt="" fill sizes="240px" key={product.detail} />
            </div>
          </div>

          <div className="portfolio-product-panel">
            <div className="portfolio-product-switcher" role="tablist" aria-label="Choose an exoskeleton">
              {exoskeletons.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeProduct === index}
                  className={activeProduct === index ? "is-active" : ""}
                  onClick={() => setActiveProduct(index)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="portfolio-product-copy" key={product.id}>
              <p>{product.description}</p>
              <div className="portfolio-task-list">{product.tasks.map((task) => <span key={task}>{task}</span>)}</div>
              <dl>
                <div><dt>System</dt><dd>Passive / battery free</dd></div>
                <div><dt>{product.specLabel}</dt><dd>{product.specValue}</dd></div>
              </dl>
              <Link className="portfolio-button portfolio-button--primary" href={product.href}>{product.cta} <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="lidar" data-category="lidar" className="portfolio-tech portfolio-tech--lidar" aria-labelledby="lidar-title">
        <div className="portfolio-tech-visual portfolio-lidar-visual" aria-hidden="true">
          <svg viewBox="0 0 760 650" role="presentation">
            <defs>
              <linearGradient id="lidar-beam" x1="380" y1="500" x2="380" y2="60">
                <stop offset="0" stopColor="#0a8ca3" stopOpacity=".65" />
                <stop offset="1" stopColor="#58d7e8" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="lidar-halo"><stop offset="0" stopColor="#33bfd2" stopOpacity=".18" /><stop offset="1" stopColor="#33bfd2" stopOpacity="0" /></radialGradient>
            </defs>
            <circle cx="380" cy="322" r="276" fill="url(#lidar-halo)" />
            <g className="portfolio-lidar-rings"><circle cx="380" cy="322" r="245"/><circle cx="380" cy="322" r="188"/><circle cx="380" cy="322" r="128"/></g>
            <g className="portfolio-lidar-crosshair"><path d="M80 322h600M380 24v596"/><path d="m168 110 424 424M592 110 168 534"/></g>
            <path className="portfolio-lidar-beam" d="m337 500 43-432 43 432Z" fill="url(#lidar-beam)" />
            <g className="portfolio-lidar-scan"><path d="M380 500 605 238"/><circle cx="605" cy="238" r="8"/></g>
            <g className="portfolio-lidar-unit"><path d="m300 508 28-58h104l28 58-20 76H320Z"/><path d="M328 450h104l-18-41h-68Z"/><circle cx="380" cy="428" r="12"/></g>
          </svg>
          <span className="portfolio-data-tag portfolio-data-tag--one">Wind field / live</span>
          <span className="portfolio-data-tag portfolio-data-tag--two">Remote sensing</span>
          <span className="portfolio-data-tag portfolio-data-tag--three">360° scan</span>
        </div>
        <div className="portfolio-tech-copy">
          <p className="portfolio-kicker">LiDAR systems</p>
          <h2 id="lidar-title">See the atmosphere<br />in motion</h2>
          <p>Advanced LiDAR systems for measurement led applications across wind power, meteorology, environmental monitoring, and aviation.</p>
          <ul><li>Wind measurement</li><li>Meteorology</li><li>Environmental monitoring</li><li>Aviation applications</li></ul>
          <div className="portfolio-group-note"><span>ERK Group Company</span><strong>Explore this category through Think Metric.</strong></div>
          <a className="portfolio-button portfolio-button--primary" href="https://think-metric.co/products/lidars" target="_blank" rel="noopener noreferrer">Explore LiDAR systems <Arrow /></a>
        </div>
      </section>

      <section id="remote-power" data-category="remote-power" className="portfolio-tech portfolio-tech--power" aria-labelledby="power-title">
        <div className="portfolio-tech-copy">
          <p className="portfolio-kicker">Remote power supply</p>
          <h2 id="power-title">Power beyond<br />the conventional grid</h2>
          <p>Remote power supply systems for equipment and monitoring infrastructure deployed where conventional power access is limited or unavailable.</p>
          <ul><li>Remote monitoring sites</li><li>Field infrastructure</li><li>System-level evaluation</li><li>Application-led configuration</li></ul>
          <div className="portfolio-group-note"><span>ERK Group Company</span><strong>Explore this category through Think Metric.</strong></div>
          <a className="portfolio-button portfolio-button--light" href="https://think-metric.co/products/remote-power-supply-systems" target="_blank" rel="noopener noreferrer">Explore power systems <Arrow /></a>
        </div>
        <div className="portfolio-tech-visual portfolio-power-visual" aria-hidden="true">
          <svg viewBox="0 0 760 650" role="presentation">
            <defs><linearGradient id="power-cell" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#71d9e7" stopOpacity=".8"/><stop offset="1" stopColor="#0a8ca3" stopOpacity=".15"/></linearGradient></defs>
            <g className="portfolio-power-grid">
              {Array.from({ length: 24 }).map((_, index) => {
                const x = 84 + (index % 6) * 96;
                const y = 92 + Math.floor(index / 6) * 86;
                return <path key={index} d={`M${x} ${y}h72l18 35-18 35h-72l-18-35Z`} />;
              })}
            </g>
            <g className="portfolio-power-lines"><path d="M96 504h180l64-64h172l62-62h94"/><path d="M151 552h228l62-62h176"/></g>
            <g className="portfolio-power-core"><rect x="282" y="224" width="196" height="224" rx="18"/><rect x="313" y="256" width="134" height="114" rx="8"/><path d="m390 274-39 57h34l-17 29 51-61h-34Z"/><path d="M334 404h92"/></g>
            <g className="portfolio-power-pulses"><circle cx="96" cy="504" r="6"/><circle cx="668" cy="378" r="6"/><circle cx="617" cy="490" r="6"/></g>
          </svg>
          <span className="portfolio-power-status">System status / active</span>
        </div>
      </section>

    </main>
  );
}

function Arrow() {
  return <span className="site-arrow" aria-hidden="true" />;
}
