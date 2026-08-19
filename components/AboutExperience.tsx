"use client";

import Link from "next/link";
import { PointerEvent, RefObject, useEffect, useRef } from "react";
import { GlobalRouteGlobe } from "./GlobalRouteGlobe";

const principles = [
  {
    title: "Start with the operational outcome.",
    text: "We begin with the site, the process, and the result that matters then define what a successful technology deployment must actually change.",
  },
  {
    title: "Select proven technology.",
    text: "We assess global solutions for technical fit, integration requirements, commercial logic, and real world operating value not features alone.",
  },
  {
    title: "Support adoption and growth.",
    text: "From first evaluation through implementation, training, and expansion, we work alongside customers and technology partners to build long term value.",
  },
] as const;

export function AboutExperience() {
  const visualRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".erkAboutPrinciple"));
    const revealAll = () => items.forEach((item) => item.classList.add("is-visible"));

    const cleanUpParallax = () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };

    if (!items.length) return cleanUpParallax;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealAll();
      return cleanUpParallax;
    }

    let reported = false;
    const observer = new IntersectionObserver((entries) => {
      reported = true;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.28 });

    items.forEach((item) => observer.observe(item));

    // The principles are the whole right-hand panel, so they must never stay blank.
    // An observer always reports on setup; silence means it is not working — show everything.
    const failsafe = window.setTimeout(() => {
      if (reported) return;
      observer.disconnect();
      revealAll();
    }, 2000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
      cleanUpParallax();
    };
  }, []);

  const moveVisual = (event: PointerEvent<HTMLElement>) => {
    const visual = visualRef.current;
    if (!visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      visual.style.setProperty("--erk-about-parallax-x", `${(x * 28).toFixed(2)}px`);
      visual.style.setProperty("--erk-about-parallax-y", `${(y * 20).toFixed(2)}px`);
    });
  };

  const resetVisual = () => {
    visualRef.current?.style.setProperty("--erk-about-parallax-x", "0px");
    visualRef.current?.style.setProperty("--erk-about-parallax-y", "0px");
  };

  return (
    <main className="erkAboutPage" id="about-top">
      <section
        className="erkAboutHero"
        aria-labelledby="about-title"
        onPointerMove={moveVisual}
        onPointerLeave={resetVisual}
      >
        <div className="erkAboutHeroGrid" aria-hidden="true" />
        <div className="erkAboutHeroGlow" aria-hidden="true" />
        <HeroArtwork stageRef={visualRef} />
        <div className="erkAboutHeroInner">
          <div className="erkAboutHeroCopy">
            <h1 id="about-title" className="erkAboutHeroTitle">
              Global Technology<br />Local Expertise
            </h1>
            <p className="erkAboutHeroLead">
              ERK Dynamics brings advanced technologies from global manufacturers to the Turkish market, providing
              industrial businesses with solutions in wearable robotics, condition monitoring, smart technologies,
              and automation.
            </p>
            <div className="erkAboutHeroActions">
              <a className="erkAboutButton erkAboutButton--primary" href="#our-point-of-view">
                <span>How we create value</span><ArrowIcon />
              </a>
              <Link className="erkAboutButton erkAboutButton--secondary" href="/contact">
                <span>Talk to our team</span><ArrowIcon />
              </Link>
            </div>
          </div>

        </div>
        <a className="page-scroll-cue" href="#our-point-of-view"><span>Scroll to discover</span><i aria-hidden="true" /></a>
      </section>

      <section id="our-point-of-view" className="erkAboutPointOfView" aria-labelledby="point-title">
        <div className="erkAboutStatementPanel">
          <div className="erkAboutStatementDecoration" aria-hidden="true" />
          <div className="erkAboutStatementInner">
            <h2 id="point-title" className="erkAboutStatementTitle">Technology should create progress, not complexity</h2>
            <p className="erkAboutStatementCopy">
              We bring proven industrial technologies from global manufacturers to businesses in Türkiye, combining
              local market knowledge, product expertise, and support beyond the sale.
            </p>
            <div className="erkAboutOutcomes"><span>Safer work</span><span>Higher productivity</span><span>Lower operating cost</span></div>
          </div>
        </div>
        <div className="erkAboutPrinciplesPanel">
          <ol className="erkAboutPrinciplesList">
            {principles.map((principle, index) => (
              <li className="erkAboutPrinciple" key={principle.title}>
                <span className="erkAboutPrincipleNumber">0{index + 1}</span>
                <div className="erkAboutPrincipleCopy"><h3>{principle.title}</h3><p>{principle.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="erkAboutBridge" aria-labelledby="bridge-title">
        <div className="erkAboutBridgeInner">
          <div className="erkAboutBridgeHeading">
            <h2 id="bridge-title">One bridge Two worlds</h2>
          </div>
          <div className="erkAboutBridgeCopy">
            <p>
              We connect proven global technology manufacturers with industrial businesses across Türkiye. By
              combining product expertise, local market knowledge, and ongoing support, we turn advanced
              technologies into practical operational value.
            </p>
          </div>
          <div className="erkAboutJourney" aria-label="İstanbul connected with global industrial markets">
            <div className="erkAboutGlobe erkAboutGlobe--interactive">
              <GlobalRouteGlobe />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}


/* Full-bleed hero backdrop, drawn on the same wide 1600x900 canvas the Partners
   and Home heroes use so `slice` crops it the same way at every width. The whole
   composition sits in the right half, clear of the copy. */
function HeroArtwork({ stageRef }: { stageRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="erkAboutVisual" aria-hidden="true">
      <div ref={stageRef} className="erkAboutVisualStage">
        <svg
          className="erkAboutVisualSvg"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          role="presentation"
          focusable="false"
        >
          <defs>
            <linearGradient id="erk-about-hex-stroke" x1="950" y1="100" x2="1560" y2="740">
              <stop offset="0%" stopColor="#7fd7e5" stopOpacity=".55" />
              <stop offset="52%" stopColor="#12a2bb" stopOpacity=".85" />
              <stop offset="100%" stopColor="#0a7288" stopOpacity=".45" />
            </linearGradient>
            <linearGradient id="erk-about-ring-stroke" x1="860" y1="10" x2="1640" y2="790">
              <stop offset="0%" stopColor="#86dce8" stopOpacity=".18" />
              <stop offset="50%" stopColor="#0a91a8" stopOpacity=".5" />
              <stop offset="100%" stopColor="#0a7288" stopOpacity=".14" />
            </linearGradient>
            <pattern id="erk-about-dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="2.8" fill="#37bdd5" fillOpacity=".34" />
            </pattern>
          </defs>

          {/* Scaled and nudged about the cluster centre so the honeycomb clears both
              the copy on the left and the contact rail on the right. */}
          <g transform="translate(1140 410) scale(0.86) translate(-1250 -400)">
          <g className="erkAboutOrbitSpin erkAboutOrbitSpin--slow">
            <circle className="erkAboutRing erkAboutRing--outer" cx="1250" cy="400" r="390" />
          </g>
          <g className="erkAboutOrbitSpin erkAboutOrbitSpin--reverse">
            <ellipse className="erkAboutRing erkAboutRing--middle" cx="1250" cy="400" rx="320" ry="255" transform="rotate(-20 1250 400)" />
          </g>

          <g className="erkAboutHexDrift">
            <path className="erkAboutHex erkAboutHex--ghost" d="M1300 190 1225 320 1075 320 1000 190 1075 60 1225 60Z" />
            <path className="erkAboutHex erkAboutHex--lead" d="M1300 450 1225 580 1075 580 1000 450 1075 320 1225 320Z" />
            <path className="erkAboutHex erkAboutHex--mid" d="M1525 580 1450 710 1300 710 1225 580 1300 450 1450 450Z" />
            <path className="erkAboutHex erkAboutHex--mid" d="M1525 320 1450 450 1300 450 1225 320 1300 190 1450 190Z" />
          </g>

          <g className="erkAboutHexDrift erkAboutHexDrift--slow">
            <path className="erkAboutHexDots" d="M985 210 933 301 828 301 775 210 828 119 933 119Z" />
          </g>

          <g className="erkAboutFlow">
            <path d="M880 301V450H1000" />
          </g>
          <g className="erkAboutFlow erkAboutFlow--wave">
            <path d="M812 800C960 730 1050 776 1170 706" />
            <path className="erkAboutFlow--delayed" d="M846 852C1000 786 1090 826 1215 754" />
          </g>

          <g className="erkAboutNodes">
            <circle className="erkAboutOrbitNode erkAboutOrbitNode--solid" cx="1300" cy="450" r="7" />
            <circle className="erkAboutOrbitNode" cx="1225" cy="320" r="5" />
            <circle className="erkAboutOrbitNode" cx="1225" cy="580" r="5" />
            <circle className="erkAboutOrbitNode" cx="1525" cy="320" r="4.5" />
            <circle className="erkAboutOrbitNode" cx="1525" cy="580" r="4.5" />
            <circle className="erkAboutOrbitNode erkAboutOrbitNode--solid" cx="880" cy="210" r="5.5" />
          </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return <span className="site-arrow" aria-hidden="true" />;
}
