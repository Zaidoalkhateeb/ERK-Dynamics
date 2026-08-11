"use client";

import Image from "next/image";
import Link from "next/link";
import { PointerEvent, useEffect, useRef, useState } from "react";

const exoskeletons = [
  {
    id: "liftsuit",
    number: "01",
    name: "LiftSuit",
    image: "/media/liftsuit-work.webp",
    detail: "/media/liftsuit-hero.webp",
    alt: "Worker using the Auxivo LiftSuit during industrial work",
    focus: "Lower back + hips",
    description: "Lightweight passive support for repetitive lifting, low handling, and prolonged forward-leaning work.",
    tasks: ["Lifting", "Forward leaning", "Repetitive handling"],
    href: "/products/auxivo-liftsuit",
  },
  {
    id: "omnisuit",
    number: "02",
    name: "OmniSuit",
    image: "/media/omnisuit-work.webp",
    detail: "/media/omnisuit-detail.webp",
    alt: "Worker using the Auxivo OmniSuit during an overhead task",
    focus: "Shoulders + lower back",
    description: "One passive system for work that moves between overhead activity, lifting, and forward-leaning positions.",
    tasks: ["Overhead work", "Lifting", "Mixed tasks"],
    href: "/products/auxivo-omnisuit",
  },
] as const;

export function ProductsServicesExperience() {
  const [activeProduct, setActiveProduct] = useState<0 | 1>(0);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const product = exoskeletons[activeProduct];

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const moveHero = (event: PointerEvent<HTMLDivElement>) => {
    const visual = heroVisualRef.current;
    if (!visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

  return (
    <main className="portfolio-page">
      <section className="portfolio-hero" aria-labelledby="portfolio-title">
        <div className="portfolio-hero-grid" aria-hidden="true" />
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
            <svg className="portfolio-business-system" viewBox="0 0 900 650" role="presentation">
              <defs>
                <linearGradient id="portfolio-system-line" x1="75" y1="530" x2="830" y2="125">
                  <stop offset="0" stopColor="#087f96" stopOpacity=".25" />
                  <stop offset=".48" stopColor="#27b9cd" stopOpacity=".82" />
                  <stop offset="1" stopColor="#087f96" stopOpacity=".25" />
                </linearGradient>
                <radialGradient id="portfolio-system-glow">
                  <stop offset="0" stopColor="#2fc2d5" stopOpacity=".22" />
                  <stop offset="1" stopColor="#2fc2d5" stopOpacity="0" />
                </radialGradient>
              </defs>

              <g className="portfolio-system-grid">
                <path d="M26 80h848M26 180h848M26 280h848M26 380h848M26 480h848M26 580h848" />
                <path d="M90 24v602M230 24v602M370 24v602M510 24v602M650 24v602M790 24v602" />
              </g>

              <circle className="portfolio-system-glow" cx="451" cy="326" r="285" fill="url(#portfolio-system-glow)" />
              <path className="portfolio-system-route" d="M104 493 C 220 405 293 424 398 327 S 601 245 744 145 C 804 205 817 350 792 500" />
              <path className="portfolio-system-flow" d="M104 493 C 220 405 293 424 398 327 S 601 245 744 145 C 804 205 817 350 792 500" />

              <g className="portfolio-system-human">
                <circle cx="118" cy="281" r="27" />
                <path d="M118 308v94m0-64-52 48m52-48 58 31m-58 33-42 91m42-91 55 82" />
                <path className="portfolio-system-support" d="M92 316q26 24 52 0l18 70q-43 34-88 0Z" />
                <circle cx="66" cy="386" r="7" /><circle cx="176" cy="369" r="7" /><circle cx="76" cy="493" r="7" /><circle cx="173" cy="484" r="7" />
              </g>

              <g className="portfolio-system-sensing">
                <circle cx="744" cy="145" r="112" />
                <circle cx="744" cy="145" r="76" />
                <circle cx="744" cy="145" r="35" />
                <path d="M744 145 833 79A112 112 0 0 1 856 145Z" />
                <path d="M632 145h224M744 33v224" />
                <circle className="portfolio-system-signal" cx="813" cy="91" r="7" />
              </g>

              <g className="portfolio-system-power">
                <path d="M704 438h176v126H704Z" />
                <path d="M742 419h100v19H742Z" />
                <path d="m802 458-39 52h30l-17 33 48-58h-29Z" />
                <path d="M653 500h51M880 500h18" />
                <circle cx="653" cy="500" r="7" /><circle cx="898" cy="500" r="7" />
              </g>

              <g className="portfolio-system-nodes">
                <circle cx="104" cy="493" r="7" />
                <circle cx="398" cy="327" r="9" />
                <circle cx="744" cy="145" r="8" />
                <circle cx="792" cy="500" r="8" />
              </g>
              <g className="portfolio-system-core">
                <rect x="367" y="296" width="62" height="62" transform="rotate(45 398 327)" />
                <circle cx="398" cy="327" r="10" />
              </g>
            </svg>
            <div className="portfolio-hero-image portfolio-hero-image--rear">
              <Image src="/media/liftsuit-hero.webp" alt="" fill priority sizes="(max-width: 900px) 72vw, 36vw" />
            </div>
            <div className="portfolio-hero-image portfolio-hero-image--front">
              <Image src="/media/omnisuit-work.webp" alt="" fill priority sizes="(max-width: 900px) 72vw, 39vw" />
            </div>
            <span className="portfolio-hero-index portfolio-hero-index--one">01 / Human support</span>
            <span className="portfolio-hero-index portfolio-hero-index--two">02 / Sensing</span>
            <span className="portfolio-hero-index portfolio-hero-index--three">03 / Remote power</span>
          </div>
        </div>
        <a className="page-scroll-cue" href="#technology-portfolio"><span>Scroll to discover</span><i aria-hidden="true" /></a>
      </section>

      <nav id="technology-portfolio" className="portfolio-category-nav" aria-label="Technology categories">
        <a href="#exoskeletons"><span>01</span><strong>Exoskeletons</strong><i></i></a>
        <a href="#lidar"><span>02</span><strong>LiDAR</strong><i></i></a>
        <a href="#remote-power"><span>03</span><strong>Power Supply</strong><i></i></a>
      </nav>

      <section id="exoskeletons" className="portfolio-exo" aria-labelledby="exo-title">
        <header className="portfolio-section-heading">
          <div><span>01 / Wearable robotics</span><h2 id="exo-title">Support engineered<br />around movement</h2></div>
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
            <span className="portfolio-product-motion-label">Product in operation</span>
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
                  onClick={() => setActiveProduct(index as 0 | 1)}
                >
                  <span>{item.number}</span>{item.name}
                </button>
              ))}
            </div>
            <div className="portfolio-product-copy" key={product.id}>
              <p className="portfolio-kicker">Auxivo / {product.focus}</p>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="portfolio-task-list">{product.tasks.map((task) => <span key={task}>{task}</span>)}</div>
              <dl>
                <div><dt>System</dt><dd>Passive / battery-free</dd></div>
                <div><dt>Sizes</dt><dd>S/M · L/XL</dd></div>
              </dl>
              <Link className="portfolio-button portfolio-button--primary" href={product.href}>Experience {product.name} <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="lidar" className="portfolio-tech portfolio-tech--lidar" aria-labelledby="lidar-title">
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
          <p className="portfolio-kicker">02 / LiDAR systems</p>
          <h2 id="lidar-title">See the atmosphere<br />in motion</h2>
          <p>Advanced LiDAR systems for measurement led applications across wind power, meteorology, environmental monitoring, and aviation.</p>
          <ul><li>Wind measurement</li><li>Meteorology</li><li>Environmental monitoring</li><li>Aviation applications</li></ul>
          <div className="portfolio-group-note"><span>ERK Group Company</span><strong>Explore this category through Think Metric.</strong></div>
          <a className="portfolio-button portfolio-button--primary" href="https://think-metric.co/products/lidars" target="_blank" rel="noopener noreferrer">Explore LiDAR systems <Arrow /></a>
        </div>
      </section>

      <section id="remote-power" className="portfolio-tech portfolio-tech--power" aria-labelledby="power-title">
        <div className="portfolio-tech-copy">
          <p className="portfolio-kicker">03 / Remote power supply</p>
          <h2 id="power-title">Power beyond<br />the conventional grid.</h2>
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
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>;
}
