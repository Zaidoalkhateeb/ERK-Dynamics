"use client";

import Link from "next/link";
import { PointerEvent, useEffect, useRef, useState } from "react";

const industries = [
  {
    id: "manufacturing",
    number: "01",
    name: "Manufacturing",
    tagline: "Production support",
    description:
      "Technologies supporting workforce ergonomics, automation, spatial awareness, and reliable power across modern production environments.",
    support: "Exoskeletons · LiDAR · Power Solutions",
  },
  {
    id: "logistics",
    number: "02",
    name: "Logistics & Warehousing",
    tagline: "Warehouse operations",
    description:
      "Solutions supporting safer material handling, workforce efficiency, navigation, mapping, and automation across warehouses and distribution operations.",
    support: "Exoskeletons · LiDAR",
  },
  {
    id: "construction",
    number: "03",
    name: "Construction",
    tagline: "On-site support",
    description:
      "Technologies supporting demanding physical work, site surveying and mapping, equipment operation, and dependable power across changing jobsite conditions.",
    support: "Exoskeletons · LiDAR · Power Solutions",
  },
  {
    id: "automotive",
    number: "04",
    name: "Automotive",
    tagline: "Assembly-line support",
    description:
      "Advanced solutions supporting worker ergonomics, production processes, automation, measurement, and intelligent sensing across automotive operations.",
    support: "Exoskeletons · LiDAR",
  },
  {
    id: "shipbuilding",
    number: "05",
    name: "Shipbuilding & Heavy Industry",
    tagline: "Heavy industrial work",
    description:
      "Robust technologies supporting physically demanding work, inspection and measurement, complex industrial environments, and reliable power for heavy-duty operations.",
    support: "Exoskeletons · LiDAR · Power Solutions",
  },
] as const;

export function IndustriesExperience() {
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<number | null>(null);
  const current = industries[active];

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [modalOpen]);

  const selectIndustry = (index: number) => {
    setActive(index);
    if (window.matchMedia("(max-width: 900px)").matches) setModalOpen(true);
  };

  const moveHero = (event: PointerEvent<HTMLDivElement>) => {
    const visual = heroVisualRef.current;
    if (!visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      visual.style.setProperty("--ind-x", `${(x * 24).toFixed(2)}px`);
      visual.style.setProperty("--ind-y", `${(y * 18).toFixed(2)}px`);
    });
  };

  const resetHero = () => {
    heroVisualRef.current?.style.setProperty("--ind-x", "0px");
    heroVisualRef.current?.style.setProperty("--ind-y", "0px");
  };

  return (
    <main className="industries-page">
      <section className="ind-hero" aria-labelledby="ind-title">
        <div className="ind-hero-grid" aria-hidden="true" />
        <div className="ind-hero-glow" aria-hidden="true" />
        <div className="ind-hero-inner">
          <div className="ind-hero-copy">
            <p className="ind-kicker"></p>
            <h1 id="ind-title">
              <span>Technology for every</span>
              <span>industrial challenge</span>
            </h1>
            <p className="ind-hero-lead">
              From manufacturing and logistics to energy and shipbuilding, we connect industries with proven
              technologies built for real operational needs.
            </p>
            <div className="ind-hero-actions">
              <a className="ind-button ind-button--primary" href="#industry-directory">Explore industries <Arrow /></a>
              <Link className="ind-button ind-button--secondary" href="/contact">Talk to our team <Arrow /></Link>
            </div>
          </div>

          <div ref={heroVisualRef} className="ind-hero-visual" onPointerMove={moveHero} onPointerLeave={resetHero} aria-hidden="true">
            <svg viewBox="0 0 640 640" role="presentation">
              <defs>
                <radialGradient id="ind-hub-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#27bfd4" stopOpacity=".2" />
                  <stop offset="60%" stopColor="#27bfd4" stopOpacity=".05" />
                  <stop offset="100%" stopColor="#27bfd4" stopOpacity="0" />
                </radialGradient>
                <filter id="ind-core-shadow" x="-60%" y="-60%" width="220%" height="220%">
                  <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#0a5365" floodOpacity=".18" />
                </filter>
              </defs>

              <circle cx="320" cy="320" r="290" fill="url(#ind-hub-glow)" />

              <g className="ind-hero-spokes">
                <path d="M320 320 320 96M320 320 514 208M320 320 514 432M320 320 320 544M320 320 126 432M320 320 126 208" />
              </g>

              <g className="ind-hero-ring">
                <circle className="ind-hero-orbit ind-hero-orbit--inner" cx="320" cy="320" r="202" />
                <circle className="ind-hero-orbit" cx="320" cy="320" r="248" />
                <circle className="ind-hero-orbit ind-hero-orbit--outer" cx="320" cy="320" r="286" />
                <g className="ind-hero-nodes">
                  <circle cx="320" cy="96" r="12" /><circle cx="514" cy="208" r="12" />
                  <circle cx="514" cy="432" r="12" /><circle cx="320" cy="544" r="12" />
                  <circle cx="126" cy="432" r="12" /><circle cx="126" cy="208" r="12" />
                </g>
              </g>

              <g className="ind-hero-core" filter="url(#ind-core-shadow)">
                <rect x="264" y="264" width="112" height="112" rx="6" transform="rotate(45 320 320)" />
                <rect x="292" y="292" width="56" height="56" rx="4" transform="rotate(45 320 320)" />
                <circle className="ind-hero-core-pulse" cx="320" cy="320" r="14" />
              </g>

              <g className="ind-hero-ticks">
                <path d="M320 40v22M320 578v22M40 320h22M578 320h22" />
              </g>
            </svg>
          </div>
        </div>
        <a className="page-scroll-cue" href="#industry-directory"><span>Scroll to discover</span><i aria-hidden="true" /></a>
      </section>

      <section id="industry-directory" className="ind-directory" aria-labelledby="ind-dir-title">
        <div className="ind-directory-inner">
          <div className="ind-directory-head">
            <p className="ind-kicker"></p>
            <h2 id="ind-dir-title">
              <span>Technology matched</span>
              <span>to your industry.</span>
            </h2>
            <p className="ind-directory-intro">
              Select an industry to see the tasks we focus on and the technology designed for it.
            </p>
            <ol className="ind-tablist" role="tablist" aria-label="Industries">
              {industries.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active === index}
                    className={active === index ? "is-active" : ""}
                    onClick={() => selectIndustry(index)}
                  >
                    <span className="ind-tab-num">{item.number}</span>
                    <span className="ind-tab-name">{item.name}</span>
                    <span className="site-arrow ind-tab-arrow" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="ind-panel" key={current.id} role="tabpanel">
            <div className="ind-panel-visual" aria-hidden="true">
              <svg className={`ind-industry-glyph ind-industry-glyph--${current.id}`} viewBox="0 0 120 120" role="presentation"><IndustryGlyph id={current.id} /></svg>
              <span className="ind-panel-tag">{current.number} / {current.name}</span>
            </div>
            <div className="ind-panel-copy">
              <p className="ind-kicker">{current.tagline}</p>
              <h3>{current.name}</h3>
              <p className="ind-panel-desc">{current.description}</p>
              <dl className="ind-panel-meta">
                <div><dt>Recommended technologies</dt><dd>{current.support}</dd></div>
              </dl>
              <Link className="ind-button ind-button--primary" href="/contact">Discuss this application <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          className="ind-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <section
            className="ind-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ind-modal-title"
          >
            <button
              ref={closeButtonRef}
              className="ind-modal-close"
              type="button"
              aria-label="Close industry details"
              onClick={() => setModalOpen(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <div className="ind-modal-copy">
              <p className="ind-modal-kicker">{current.number} / {current.tagline}</p>
              <h3 id="ind-modal-title">{current.name}</h3>
              <p>{current.description}</p>
            </div>

            <div className="ind-modal-visual" aria-hidden="true">
              <svg className={`ind-industry-glyph ind-industry-glyph--${current.id}`} viewBox="0 0 120 120" role="presentation"><IndustryGlyph id={current.id} /></svg>
            </div>

            <div className="ind-modal-support">
              <span>Recommended technologies</span>
              <strong>{current.support}</strong>
            </div>

            <Link className="ind-button ind-button--primary" href="/contact">
              Discuss this application <Arrow />
            </Link>
          </section>
        </div>
      )}

    </main>
  );
}

function IndustryGlyph({ id }: { id: string }) {
  switch (id) {
    case "manufacturing":
      return (
        <g>
          <g className="ind-glyph-primary">
            <circle cx="60" cy="52" r="20" />
            <circle cx="60" cy="52" r="7" />
            <path d="M60 24v8M60 72v8M32 52h8M80 52h8M74 66l6 6M46 66l-6 6M46 38l-6-6M74 38l6-6" />
          </g>
          <path d="M30 98h60" />
          <path d="M42 98v0M60 98v0M78 98v0" />
          <circle cx="42" cy="98" r="3.5" /><circle cx="60" cy="98" r="3.5" /><circle cx="78" cy="98" r="3.5" />
        </g>
      );
    case "logistics":
      return (
        <g>
          <g className="ind-glyph-primary">
            <path d="M50 28h24v20H50z" />
            <path d="M34 50h26v24H34z" />
            <path d="M62 50h24v24H62z" />
            <path d="M60 28v20M46 50v24M74 50v24" />
          </g>
          <path d="M30 78h60" />
          <path d="M38 78v8M82 78v8" />
        </g>
      );
    case "automotive":
      return (
        <g className="ind-glyph-primary">
          <path d="M28 70V60c0-3 2-5 5-5h6l8-10h22l8 10h6c3 0 5 2 5 5v10" />
          <path d="M24 70h72" />
          <path d="M46 55l-4 0M74 55h4" />
          <circle cx="44" cy="72" r="8" /><circle cx="80" cy="72" r="8" />
        </g>
      );
    case "construction":
      return (
        <g>
          <path d="M40 92V34" />
          <path d="M40 34h46" />
          <path d="M40 48 84 34" />
          <g className="ind-glyph-primary">
            <path d="M78 34v12" />
            <path d="M72 46h12v9H72z" />
          </g>
          <path d="M28 92h40" />
          <path d="M34 92l6-8 6 8" />
        </g>
      );
    case "shipbuilding":
      return (
        <g>
          <g className="ind-glyph-primary">
            <path d="M24 68h72L84 84H38L24 68Z" />
            <path d="M42 68V42h34v26M48 42V30h18v12" />
          </g>
          <path className="ind-glyph-secondary" d="M30 91c8-5 16-5 24 0 8-5 16-5 24 0 6-4 12-5 18-2" />
        </g>
      );
    default:
      return null;
  }
}

function Arrow() {
  return <span className="site-arrow" aria-hidden="true" />;
}
