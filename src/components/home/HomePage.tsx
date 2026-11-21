"use client";
import { Arrow } from "@/components/ui/Arrow";
import { PartnerArt, TechGlyph, HomeRouteMap, HomeRouteMapBlock } from "./HomeArtwork";
import { useLayerParallax } from "@/hooks/useLayerParallax";
import { technologies, partners, productImages, figures } from "@/content/home";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useEffect, useRef } from "react";

import { publishedProducts } from "@/content/products";

export function HomePage() {
  const mainRef = useRef<HTMLElement>(null);
  const { heroRef, moveHero, resetHero } = useLayerParallax();
  const figuresRef = useRef<HTMLElement>(null);
  const featured = publishedProducts;

  // Elements rise into place as they enter the viewport. The hiding styles are gated
  // behind `.reveal-ready`, which only this effect adds, so the page stays fully
  // readable if the script never runs or motion is reduced.
  useEffect(() => {
    const root = mainRef.current;
    if (
      !root ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
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
            <span>Advanced technology</span> <span>for industrial work</span>
          </h1>

          {/* Sits here so phones read headline, then map, then buttons. */}
          <HomeRouteMapBlock />

          <p>
            ERK Dynamics brings proven industrial technologies to Türkiye, including wearable
            robotics, spatial sensing, and reliable power selected around real operational needs and
            evaluated in the environments where they will actually be used.
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
            <path
              className="home-figures-line home-figures-line--slow"
              d="M-40 62h300l58 60h360l72-74h480"
            />
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
            Four Auxivo systems, each built around a different movement pattern. Selection starts
            with the work being done.
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
