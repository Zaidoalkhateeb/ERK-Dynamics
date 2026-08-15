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
  const heroRef = useRef<HTMLElement>(null);
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

  // Each art layer drifts by its own `data-depth`, matching the partners hero.
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
    <main className="industries-page">
      <section
        ref={heroRef}
        className="page-hero hero-partners technology-hero hero-industries"
        aria-labelledby="ind-title"
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
            <linearGradient id="indCyanStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#62d5e8" stopOpacity="0.1" />
              <stop offset="0.5" stopColor="#0bb7d3" stopOpacity="0.45" />
              <stop offset="1" stopColor="#0299b7" stopOpacity="0.75" />
            </linearGradient>
            <pattern id="indDotPattern" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="3.6" fill="#37bdd5" fillOpacity="0.42" />
            </pattern>
          </defs>

          {/* Outer orbit — the hub the industries directory revolves around. */}
          <g className="parallax-layer" data-depth="9">
            <g className="object-spin">
              <circle cx="1210" cy="455" r="500" fill="none" stroke="url(#indCyanStroke)" strokeWidth="8" strokeDasharray="610 1150" opacity="0.5" />
              <circle cx="1210" cy="455" r="418" fill="none" stroke="#20b6cf" strokeWidth="2" strokeDasharray="180 48 42 82" opacity="0.25" />
            </g>
          </g>

          {/* Spokes and node ring — carried over from the old hub diagram. */}
          <g className="parallax-layer" data-depth="16">
            <g className="object-spin-reverse">
              <g fill="none" stroke="#0a9db9" strokeWidth="2" opacity="0.3">
                <path d="M1210 455 1210 175M1210 455 1452 315M1210 455 1452 595M1210 455 1210 735M1210 455 968 595M1210 455 968 315" />
              </g>
              <circle cx="1210" cy="455" r="280" fill="none" stroke="#079dbb" strokeWidth="11" strokeDasharray="14 13" opacity="0.22" />
              <g fill="#0a9db9" opacity="0.55">
                <circle cx="1210" cy="175" r="11" /><circle cx="1452" cy="315" r="11" />
                <circle cx="1452" cy="595" r="11" /><circle cx="1210" cy="735" r="11" />
                <circle cx="968" cy="595" r="11" /><circle cx="968" cy="315" r="11" />
              </g>
            </g>
          </g>

          <g className="parallax-layer" data-depth="14">
            <g className="object-float-reverse">
              <path d="M1090 0H1600V640L1475 610L1404 483L1180 426L1092 245Z" fill="url(#indDotPattern)" opacity="0.55" />
            </g>
          </g>

          {/* Diamond core — the industries signature mark. */}
          <g className="parallax-layer" data-depth="23">
            <g className="object-float" fill="none" stroke="#08a8c5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1130" y="375" width="160" height="160" rx="8" transform="rotate(45 1210 455)" strokeWidth="11" opacity="0.4" />
              <rect x="1170" y="415" width="80" height="80" rx="5" transform="rotate(45 1210 455)" strokeWidth="8" opacity="0.3" />
              <path d="M1362 300L1544 300L1635 457L1544 614L1362 614L1271 457Z" strokeWidth="6" opacity="0.2" />
            </g>
          </g>

          {/* Production line running under the hub. */}
          <g className="parallax-layer" data-depth="19" fill="none" stroke="#17afc9" strokeLinecap="round">
            <path className="object-line-flow" d="M736 645H1020L1128 536H1406" strokeWidth="5" strokeDasharray="16 30" opacity="0.3" />
          </g>

          <g className="parallax-layer" data-depth="27" fill="none" stroke="#49cadd" strokeWidth="1.5" opacity="0.35">
            <path className="object-wave" d="M817 925C1005 755 1174 801 1333 693C1458 608 1535 497 1670 448" strokeDasharray="15 10 2 12" />
            <path className="object-wave object-wave--delayed" d="M857 930C1042 824 1210 855 1375 771C1504 706 1580 626 1694 590" strokeDasharray="22 12 3 16" />
          </g>
        </svg>

        <div className="technology-hero__wash" aria-hidden="true" />

        <div className="partners-hero-copy technology-hero__content">
          <h1 id="ind-title">
            <span>Technology for every</span>
            <span>industrial challenge</span>
          </h1>
          <p>
            From manufacturing and logistics to energy and shipbuilding, we connect industries with proven
            technologies built for real operational needs.
          </p>
          <div className="ind-hero-actions">
            <a className="ind-button ind-button--primary" href="#industry-directory">Explore industries <Arrow /></a>
            <Link className="ind-button ind-button--secondary" href="/contact">Talk to our team <Arrow /></Link>
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
