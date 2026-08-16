"use client";

import Link from "next/link";
import { PointerEvent, useEffect, useRef } from "react";
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

  const moveVisual = (event: PointerEvent<HTMLDivElement>) => {
    const visual = visualRef.current;
    if (!visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = visual.getBoundingClientRect();
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
      <section className="erkAboutHero" aria-labelledby="about-title">
        <div className="erkAboutHeroGrid" aria-hidden="true" />
        <div className="erkAboutHeroGlow" aria-hidden="true" />
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

          <div ref={visualRef} className="erkAboutVisual" onPointerMove={moveVisual} onPointerLeave={resetVisual} aria-hidden="true">
            <div className="erkAboutVisualHalo" />
            <div className="erkAboutVisualStage">
              <svg className="erkAboutVisualSvg" viewBox="0 0 760 720" role="presentation">
                <defs>
                  <radialGradient id="erk-about-orbit-halo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#27bfd4" stopOpacity=".18" />
                    <stop offset="56%" stopColor="#27bfd4" stopOpacity=".06" />
                    <stop offset="100%" stopColor="#27bfd4" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="erk-about-orbit-stroke" x1="100" y1="100" x2="650" y2="650">
                    <stop offset="0%" stopColor="#86dce8" stopOpacity=".22" />
                    <stop offset="52%" stopColor="#0a91a8" stopOpacity=".55" />
                    <stop offset="100%" stopColor="#0a7288" stopOpacity=".18" />
                  </linearGradient>
                  <filter id="erk-about-core-shadow" x="-60%" y="-60%" width="220%" height="220%">
                    <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#0a5365" floodOpacity=".18" />
                  </filter>
                </defs>
                <circle cx="392" cy="362" r="302" fill="url(#erk-about-orbit-halo)" />
                <g className="erkAboutOrbitSpin erkAboutOrbitSpin--slow">
                  <circle className="erkAboutOrbitLine erkAboutOrbitLine--outer" cx="392" cy="362" r="284" />
                  <circle className="erkAboutOrbitNode erkAboutOrbitNode--solid" cx="392" cy="78" r="7" />
                  <circle className="erkAboutOrbitNode" cx="648" cy="238" r="5" />
                  <circle className="erkAboutOrbitNode" cx="146" cy="506" r="4" />
                </g>
                <g className="erkAboutOrbitSpin erkAboutOrbitSpin--reverse">
                  <ellipse className="erkAboutOrbitLine erkAboutOrbitLine--middle" cx="392" cy="362" rx="236" ry="188" transform="rotate(-22 392 362)" />
                  <circle className="erkAboutOrbitNode erkAboutOrbitNode--solid" cx="194" cy="230" r="6" />
                  <circle className="erkAboutOrbitNode" cx="585" cy="493" r="5" />
                </g>
                <g className="erkAboutOrbitSpin erkAboutOrbitSpin--medium">
                  <circle className="erkAboutOrbitLine erkAboutOrbitLine--inner" cx="392" cy="362" r="148" />
                  <circle className="erkAboutOrbitNode erkAboutOrbitNode--solid" cx="392" cy="214" r="5" />
                </g>
                <g className="erkAboutNetworkTrace">
                  <path d="M144 506 194 230 392 78 648 238 585 493 392 646 144 506Z" />
                  <path d="M194 230 585 493M392 78 392 646M144 506 648 238" />
                </g>
                <g className="erkAboutCoreFloat" filter="url(#erk-about-core-shadow)">
                  <rect className="erkAboutCoreFrame" x="300" y="270" width="184" height="184" rx="8" transform="rotate(45 392 362)" />
                  <rect className="erkAboutCoreFill" x="337" y="307" width="110" height="110" rx="5" transform="rotate(45 392 362)" />
                  <circle className="erkAboutCorePulse" cx="392" cy="362" r="18" />
                </g>
                <g className="erkAboutOrbitTicks">
                  <path d="M392 36v24M392 664v24M66 362h24M694 362h24" />
                  <path d="m162 132 17 17m426 426 17 17M162 592l17-17m426-426 17-17" />
                </g>
              </svg>
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
            <p>We connect proven global technology manufacturers with industrial businesses across Türkiye.</p>
            <p>By combining product expertise, local market knowledge, and ongoing support, we turn advanced technologies into practical operational value.</p>
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

function ArrowIcon() {
  return <span className="site-arrow" aria-hidden="true" />;
}
