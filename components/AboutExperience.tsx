"use client";

import Link from "next/link";
import { PointerEvent, useEffect, useRef } from "react";

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
  const globeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const globeFrameRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (globeFrameRef.current !== null) cancelAnimationFrame(globeFrameRef.current);
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

  const moveGlobe = (event: PointerEvent<HTMLDivElement>) => {
    const globe = globeRef.current;
    if (!globe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = globe.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (globeFrameRef.current !== null) cancelAnimationFrame(globeFrameRef.current);
    globeFrameRef.current = requestAnimationFrame(() => {
      globe.style.setProperty("--erk-globe-rotate-x", `${(-y * 14).toFixed(2)}deg`);
      globe.style.setProperty("--erk-globe-rotate-y", `${(x * 18).toFixed(2)}deg`);
      globe.style.setProperty("--erk-globe-shift-x", `${(x * 10).toFixed(2)}px`);
      globe.style.setProperty("--erk-globe-shift-y", `${(y * 8).toFixed(2)}px`);
    });
  };

  const resetGlobe = () => {
    const globe = globeRef.current;
    globe?.style.setProperty("--erk-globe-rotate-x", "0deg");
    globe?.style.setProperty("--erk-globe-rotate-y", "0deg");
    globe?.style.setProperty("--erk-globe-shift-x", "0px");
    globe?.style.setProperty("--erk-globe-shift-y", "0px");
  };

  return (
    <main className="erkAboutPage" id="about-top">
      <section className="erkAboutHero" aria-labelledby="about-title">
        <div className="erkAboutHeroGrid" aria-hidden="true" />
        <div className="erkAboutHeroGlow" aria-hidden="true" />
        <div className="erkAboutHeroInner">
          <div className="erkAboutHeroCopy">
            <h1 id="about-title" className="erkAboutHeroTitle">
              Global Technology.<br />Local Expertise.
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
            <h2 id="point-title" className="erkAboutStatementTitle">Technology should create progress, not complexity </h2>
            <p className="erkAboutStatementCopy">
              We bring proven industrial technologies from global manufacturers to businesses in Türkiye, combining
              local market knowledge, product expertise, and support beyond the sale.
            </p>
            <div className="erkAboutOutcomes"><span>Safer work</span><span>Higher productivity</span><span>Lower operating cost</span></div>
          </div>
        </div>
        <div className="erkAboutPrinciplesPanel">
          <p className="erkAboutPrinciplesIntro"></p>
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
            <div ref={globeRef} className="erkAboutGlobe" onPointerMove={moveGlobe} onPointerLeave={resetGlobe} aria-hidden="true">
              <svg viewBox="0 0 720 520" role="presentation">
                <defs>
                  <radialGradient id="erk-globe-fill" cx="38%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity=".98" />
                    <stop offset="72%" stopColor="#e8f5f7" stopOpacity=".92" />
                    <stop offset="100%" stopColor="#cce9ee" stopOpacity=".72" />
                  </radialGradient>
                  <linearGradient id="erk-route-stroke" x1="262" y1="204" x2="472" y2="250">
                    <stop offset="0%" stopColor="#0a7e96" />
                    <stop offset="48%" stopColor="#22bfd1" />
                    <stop offset="100%" stopColor="#0a7e96" />
                  </linearGradient>
                  <filter id="erk-globe-shadow" x="-30%" y="-30%" width="160%" height="170%">
                    <feDropShadow dx="0" dy="24" stdDeviation="22" floodColor="#0a6274" floodOpacity=".16" />
                  </filter>
                  <filter id="erk-route-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <clipPath id="erk-globe-clip"><circle cx="360" cy="252" r="214" /></clipPath>
                </defs>

                <circle className="erkAboutGlobeShadow" cx="360" cy="252" r="214" filter="url(#erk-globe-shadow)" />
                <circle className="erkAboutGlobeSphere" cx="360" cy="252" r="214" fill="url(#erk-globe-fill)" />

                <g className="erkAboutGlobeGrid" clipPath="url(#erk-globe-clip)">
                  <ellipse cx="360" cy="252" rx="92" ry="214" />
                  <ellipse cx="360" cy="252" rx="164" ry="214" />
                  <ellipse cx="360" cy="252" rx="214" ry="70" />
                  <ellipse cx="360" cy="252" rx="214" ry="142" />
                  <path d="M146 252h428" />
                </g>

                <g className="erkAboutGlobeLand" clipPath="url(#erk-globe-clip)">
                  <path d="M132 171c34-38 80-71 132-91l38 13 21 25-14 30-38 13-15 32-37 8-19 27-35-6-33-51Z" />
                  <path d="M261 193l28-11 24 13 19-7 28 13 27-9 42 7 19-15 34 10 24-9 61 31 37 54-9 47-39 8-25-32-41 2-20-25-44 8-33-13-30 14-31-20-40 6-27-27-4-35Z" />
                  <path d="M310 277l39 5 25 29-10 48-19 52-31-26-21-51Z" />
                  <path d="M517 345l35 7 21 28-26 24-37-17Z" />
                </g>

                <g className="erkAboutRegionalRoutes">
                  <path d="M478 238 Q350 120 225 178" />
                  <path d="M478 238 Q370 145 280 202" />
                  <path d="M478 238 Q340 230 245 252" />
                  <path d="M478 238 Q522 267 524 342" />
                  <path d="M478 238 Q408 315 340 405" />
                  <path d="M478 238 Q532 205 548 225" />
                  <path d="M478 238 Q512 219 527 207" />
                </g>

                <g className="erkAboutShipment erkAboutShipment--regional">
                  <rect x="-7" y="-5" width="14" height="10" rx="1.5" />
                  <path d="M-7-1h14M0-5v10" />
                  <animateMotion begin="-1.1s" dur="4.3s" repeatCount="indefinite" path="M478 238 Q522 267 524 342" rotate="auto" />
                </g>
                <g className="erkAboutShipment erkAboutShipment--regional">
                  <rect x="-7" y="-5" width="14" height="10" rx="1.5" />
                  <path d="M-7-1h14M0-5v10" />
                  <animateMotion begin="-2.7s" dur="4.8s" repeatCount="indefinite" path="M478 238 Q350 120 225 178" rotate="auto" />
                </g>
                <g className="erkAboutShipment erkAboutShipment--regional">
                  <rect x="-7" y="-5" width="14" height="10" rx="1.5" />
                  <path d="M-7-1h14M0-5v10" />
                  <animateMotion begin="-.8s" dur="5.2s" repeatCount="indefinite" path="M478 238 Q532 205 548 225" rotate="auto" />
                </g>

                <g className="erkAboutMapPoint erkAboutMapPoint--destination" transform="translate(478 238)">
                  <circle className="erkAboutMapPointPulse" r="24" />
                  <circle className="erkAboutMapPointCore" r="9" />
                </g>
                <g className="erkAboutMarketPoints">
                  <circle cx="225" cy="178" r="4" />
                  <circle cx="280" cy="202" r="4" />
                  <circle cx="245" cy="252" r="4" />
                  <circle cx="524" cy="342" r="4" />
                  <circle cx="340" cy="405" r="4" />
                  <circle cx="548" cy="225" r="4" />
                  <circle cx="527" cy="207" r="4" />
                </g>

                <g className="erkAboutCountryLabels">
                  <text className="erkAboutCountryLabel--hub" x="492" y="246">ISTANBUL</text>
                  <text x="213" y="168" textAnchor="end">LONDON</text>
                  <text x="268" y="190" textAnchor="end">FRANKFURT</text>
                  <text x="232" y="270" textAnchor="end">BARCELONA</text>
                  <text x="534" y="355">DUBAI</text>
                  <text x="332" y="424" textAnchor="end">SOUTH AFRICA</text>
                  <text x="558" y="231">BEIJING</text>
                  <text x="538" y="198">BAKU</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>;
}
