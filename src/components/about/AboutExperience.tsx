"use client";
import { Arrow as ArrowIcon } from "@/components/ui/Arrow";
import { HeroArtwork } from "./HeroArtwork";
import { principles } from "@/content/about";

import Link from "next/link";
import { PointerEvent, useEffect, useRef } from "react";
import { GlobalRouteGlobe } from "@/components/maps/GlobalRouteGlobe";

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
    const observer = new IntersectionObserver(
      (entries) => {
        reported = true;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.28 },
    );

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
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
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
              Global Technology
              <br />
              Local Expertise
            </h1>
            <p className="erkAboutHeroLead">
              ERK Dynamics brings advanced technologies from global manufacturers to the Turkish
              market, providing industrial businesses with solutions in wearable robotics, condition
              monitoring, smart technologies, and automation.
            </p>
            <div className="erkAboutHeroActions">
              <a className="erkAboutButton erkAboutButton--primary" href="#our-point-of-view">
                <span>How we create value</span>
                <ArrowIcon />
              </a>
              <Link className="erkAboutButton erkAboutButton--secondary" href="/contact">
                <span>Talk to our team</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
        <a className="page-scroll-cue" href="#our-point-of-view">
          <span>Scroll to discover</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section id="our-point-of-view" className="erkAboutPointOfView" aria-labelledby="point-title">
        <div className="erkAboutStatementPanel">
          <div className="erkAboutStatementDecoration" aria-hidden="true" />
          <div className="erkAboutStatementInner">
            <h2 id="point-title" className="erkAboutStatementTitle">
              Technology should create progress, not complexity
            </h2>
            <p className="erkAboutStatementCopy">
              We bring proven industrial technologies from global manufacturers to businesses in
              Türkiye, combining local market knowledge, product expertise, and support beyond the
              sale.
            </p>
            <div className="erkAboutOutcomes">
              <span>Safer work</span>
              <span>Higher productivity</span>
              <span>Lower operating cost</span>
            </div>
          </div>
        </div>
        <div className="erkAboutPrinciplesPanel">
          <ol className="erkAboutPrinciplesList">
            {principles.map((principle, index) => (
              <li className="erkAboutPrinciple" key={principle.title}>
                <span className="erkAboutPrincipleNumber">0{index + 1}</span>
                <div className="erkAboutPrincipleCopy">
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </div>
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
              We connect proven global technology manufacturers with industrial businesses across
              Türkiye. By combining product expertise, local market knowledge, and ongoing support,
              we turn advanced technologies into practical operational value.
            </p>
          </div>
          <div
            className="erkAboutJourney"
            aria-label="İstanbul connected with global industrial markets"
          >
            <div className="erkAboutGlobe erkAboutGlobe--interactive">
              <GlobalRouteGlobe />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
