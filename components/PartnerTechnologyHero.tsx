"use client";

import { PointerEvent, useEffect, useRef } from "react";

export function PartnerTechnologyHero() {
  const heroRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const moveLayers = (clientX: number, clientY: number) => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = hero.getBoundingClientRect();
    const normalizedX = (clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (clientY - rect.top) / rect.height - 0.5;

    hero.querySelectorAll<SVGGElement>("[data-depth]").forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0);
      layer.style.setProperty("--move-x", `${(normalizedX * depth).toFixed(2)}px`);
      layer.style.setProperty("--move-y", `${(normalizedY * depth * 0.68).toFixed(2)}px`);
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => moveLayers(event.clientX, event.clientY));
  };

  const resetLayers = () => {
    const hero = heroRef.current;
    if (!hero) return;
    hero.querySelectorAll<SVGGElement>("[data-depth]").forEach((layer) => {
      layer.style.setProperty("--move-x", "0px");
      layer.style.setProperty("--move-y", "0px");
    });
  };

  return (
    <section
      ref={heroRef}
      className="page-hero hero-partners technology-hero"
      id="technologyHero"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetLayers}
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
          <linearGradient id="cyanStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#62d5e8" stopOpacity="0.1" />
            <stop offset="0.5" stopColor="#0bb7d3" stopOpacity="0.45" />
            <stop offset="1" stopColor="#0299b7" stopOpacity="0.75" />
          </linearGradient>
          <pattern id="dotPattern" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="3.6" fill="#37bdd5" fillOpacity="0.42" />
          </pattern>
        </defs>

        <g className="parallax-layer" data-depth="9">
          <g className="object-spin">
            <circle
              cx="1210"
              cy="455"
              r="500"
              fill="none"
              stroke="url(#cyanStroke)"
              strokeWidth="8"
              strokeDasharray="610 1150"
              opacity="0.5"
            />
            <circle
              cx="1210"
              cy="455"
              r="425"
              fill="none"
              stroke="#20b6cf"
              strokeWidth="2"
              strokeDasharray="180 48 42 82"
              opacity="0.25"
            />
          </g>
        </g>

        <g className="parallax-layer" data-depth="16">
          <g className="object-spin-reverse">
            <circle
              cx="1184"
              cy="560"
              r="142"
              fill="none"
              stroke="#079dbb"
              strokeWidth="13"
              strokeDasharray="14 13"
              opacity="0.25"
            />
            <circle
              cx="1184"
              cy="560"
              r="106"
              fill="none"
              stroke="#079dbb"
              strokeWidth="4"
              strokeDasharray="86 28 12 40"
              opacity="0.4"
            />
          </g>
        </g>

        <g className="parallax-layer" data-depth="14">
          <g className="object-float-reverse">
            <path
              d="M1090 0H1600V640L1475 610L1404 483L1180 426L1092 245Z"
              fill="url(#dotPattern)"
              opacity="0.55"
            />
          </g>
        </g>

        <g className="parallax-layer" data-depth="23">
          <g
            className="object-float"
            fill="none"
            stroke="#08a8c5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M1252 235L1434 235L1525 392L1434 550L1252 550L1161 392Z"
              strokeWidth="11"
              opacity="0.4"
            />
            <path
              d="M1434 235L1616 235L1707 392L1616 550L1434 550L1525 392Z"
              strokeWidth="8"
              opacity="0.28"
            />
            <path
              d="M1342 78L1524 78L1615 235L1524 392L1342 392L1251 235Z"
              strokeWidth="6"
              opacity="0.2"
            />
          </g>
        </g>

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
        <h1>
          <span>Global Technology</span>
          <span>Local Expertise</span>
        </h1>
        <p>
          We partner with leading technology manufacturers to bring innovative industrial solutions to the Turkish
          market through local expertise, technical support, and business development.
        </p>
      </div>
      <a className="page-scroll-cue" href="#partner-directory">
        <span>Scroll to discover</span><i aria-hidden="true" />
      </a>
    </section>
  );
}
