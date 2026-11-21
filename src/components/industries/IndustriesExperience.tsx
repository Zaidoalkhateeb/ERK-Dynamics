"use client";
import { Arrow } from "@/components/ui/Arrow";
import { IndustryGlyph } from "./IndustryGlyph";
import { useLayerParallax } from "@/hooks/useLayerParallax";
import { industries } from "@/content/industries";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const MOBILE_QUERY = "(max-width: 900px)";

export function IndustriesExperience() {
  // Null means nothing is selected. The desktop panel is always on screen, so it
  // takes a default; on mobile the detail is a modal, so nothing is highlighted
  // until one is opened and the highlight clears again when it is dismissed.
  const [active, setActive] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { heroRef, moveHero, resetHero } = useLayerParallax();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const current = industries[active ?? 0];

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const applyDesktopDefault = () => setActive((value) => (query.matches ? value : (value ?? 0)));

    applyDesktopDefault();
    query.addEventListener("change", applyDesktopDefault);
    return () => query.removeEventListener("change", applyDesktopDefault);
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    if (window.matchMedia(MOBILE_QUERY).matches) setActive(null);
  };

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
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
    if (window.matchMedia(MOBILE_QUERY).matches) setModalOpen(true);
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
              <circle
                cx="1210"
                cy="455"
                r="500"
                fill="none"
                stroke="url(#indCyanStroke)"
                strokeWidth="8"
                strokeDasharray="610 1150"
                opacity="0.5"
              />
              <circle
                cx="1210"
                cy="455"
                r="418"
                fill="none"
                stroke="#20b6cf"
                strokeWidth="2"
                strokeDasharray="180 48 42 82"
                opacity="0.25"
              />
            </g>
          </g>

          {/* Spokes and node ring — carried over from the old hub diagram. */}
          <g className="parallax-layer" data-depth="16">
            <g className="object-spin-reverse">
              <g fill="none" stroke="#0a9db9" strokeWidth="2" opacity="0.3">
                <path d="M1210 455 1210 175M1210 455 1452 315M1210 455 1452 595M1210 455 1210 735M1210 455 968 595M1210 455 968 315" />
              </g>
              <circle
                cx="1210"
                cy="455"
                r="280"
                fill="none"
                stroke="#079dbb"
                strokeWidth="11"
                strokeDasharray="14 13"
                opacity="0.22"
              />
              <g fill="#0a9db9" opacity="0.55">
                <circle cx="1210" cy="175" r="11" />
                <circle cx="1452" cy="315" r="11" />
                <circle cx="1452" cy="595" r="11" />
                <circle cx="1210" cy="735" r="11" />
                <circle cx="968" cy="595" r="11" />
                <circle cx="968" cy="315" r="11" />
              </g>
            </g>
          </g>

          <g className="parallax-layer" data-depth="14">
            <g className="object-float-reverse">
              <path
                d="M1090 0H1600V640L1475 610L1404 483L1180 426L1092 245Z"
                fill="url(#indDotPattern)"
                opacity="0.55"
              />
            </g>
          </g>

          {/* Diamond core — the industries signature mark. */}
          <g className="parallax-layer" data-depth="23">
            <g
              className="object-float"
              fill="none"
              stroke="#08a8c5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="1130"
                y="375"
                width="160"
                height="160"
                rx="8"
                transform="rotate(45 1210 455)"
                strokeWidth="11"
                opacity="0.4"
              />
              <rect
                x="1170"
                y="415"
                width="80"
                height="80"
                rx="5"
                transform="rotate(45 1210 455)"
                strokeWidth="8"
                opacity="0.3"
              />
              <path
                d="M1362 300L1544 300L1635 457L1544 614L1362 614L1271 457Z"
                strokeWidth="6"
                opacity="0.2"
              />
            </g>
          </g>

          {/* Production line running under the hub. */}
          <g
            className="parallax-layer"
            data-depth="19"
            fill="none"
            stroke="#17afc9"
            strokeLinecap="round"
          >
            <path
              className="object-line-flow"
              d="M736 645H1020L1128 536H1406"
              strokeWidth="5"
              strokeDasharray="16 30"
              opacity="0.3"
            />
          </g>

          <g
            className="parallax-layer"
            data-depth="27"
            fill="none"
            stroke="#49cadd"
            strokeWidth="1.5"
            opacity="0.35"
          >
            <path
              className="object-wave"
              d="M817 925C1005 755 1174 801 1333 693C1458 608 1535 497 1670 448"
              strokeDasharray="15 10 2 12"
            />
            <path
              className="object-wave object-wave--delayed"
              d="M857 930C1042 824 1210 855 1375 771C1504 706 1580 626 1694 590"
              strokeDasharray="22 12 3 16"
            />
          </g>
        </svg>

        <div className="technology-hero__wash" aria-hidden="true" />

        <div className="partners-hero-copy technology-hero__content">
          <h1 id="ind-title">
            <span>Technology for every</span>
            <span>industrial challenge</span>
          </h1>
          <p>
            From manufacturing and logistics to energy and shipbuilding, we connect industries with
            proven technologies built for real operational needs.
          </p>
          <div className="ind-hero-actions">
            <a className="ind-button ind-button--primary" href="#industry-directory">
              Explore industries <Arrow />
            </a>
            <Link className="ind-button ind-button--secondary" href="/contact">
              Talk to our team <Arrow />
            </Link>
          </div>
        </div>

        <a className="page-scroll-cue" href="#industry-directory">
          <span>Scroll to discover</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section id="industry-directory" className="ind-directory" aria-labelledby="ind-dir-title">
        <div className="ind-directory-inner">
          <div className="ind-directory-head">
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
              <svg
                className={`ind-industry-glyph ind-industry-glyph--${current.id}`}
                viewBox="0 0 120 120"
                role="presentation"
              >
                <IndustryGlyph id={current.id} />
              </svg>
              <span className="ind-panel-tag">
                {current.number} / {current.name}
              </span>
            </div>
            <div className="ind-panel-copy">
              <p className="ind-kicker">{current.tagline}</p>
              <h3>{current.name}</h3>
              <p className="ind-panel-desc">{current.description}</p>
              <dl className="ind-panel-meta">
                <div>
                  <dt>Recommended technologies</dt>
                  <dd>{current.support}</dd>
                </div>
              </dl>
              <Link className="ind-button ind-button--primary" href="/contact">
                Discuss this application <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          className="ind-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
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
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <div className="ind-modal-copy">
              <p className="ind-modal-kicker">
                {current.number} / {current.tagline}
              </p>
              <h3 id="ind-modal-title">{current.name}</h3>
              <p>{current.description}</p>
            </div>

            <div className="ind-modal-visual" aria-hidden="true">
              <svg
                className={`ind-industry-glyph ind-industry-glyph--${current.id}`}
                viewBox="0 0 120 120"
                role="presentation"
              >
                <IndustryGlyph id={current.id} />
              </svg>
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
