"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useEffect, useRef, useState } from "react";

function useProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const travel = Math.max(1, rect.height - innerHeight);
      setProgress(Math.max(0, Math.min(1, -rect.top / travel)));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update(); addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);
  return [ref, progress] as const;
}

const tasks = [
  { id: "lifting", label: "Repetitive lifting", product: "LiftSuit", image: "/media/liftsuit-work.webp", text: "Lower-back and hip support for repeated lifting and forward-leaning work." },
  { id: "leaning", label: "Forward leaning", product: "LiftSuit", image: "/media/liftsuit-hero.webp", text: "A lightweight textile system designed around freedom of movement." },
  { id: "overhead", label: "Overhead work", product: "OmniSuit", image: "/media/omnisuit-work.webp", text: "Integrated shoulder and back support for mixed vertical workflows." },
  { id: "mixed", label: "Mixed tasks", product: "OmniSuit", image: "/media/omnisuit-detail.webp", text: "One passive system for work that shifts between lifting, leaning, and reaching." },
];

export function HomePage() {
  const [heroRef, heroProgress] = useProgress<HTMLElement>();
  const [transitionRef, transitionProgress] = useProgress<HTMLElement>();
  const [task, setTask] = useState(0);
  const [engineering, setEngineering] = useState(0);
  const heroStyle = { "--hero-progress": heroProgress } as CSSProperties;
  const lensStyle = { "--lens-progress": transitionProgress } as CSSProperties;
  const engineeringSteps = [
    ["Textile architecture", "Flexible construction follows the body instead of enclosing it."],
    ["Passive assistance", "Support is delivered without batteries, charging, or powered actuation."],
    ["Task-ready fitting", "Adjustable interfaces support a controlled, worker-specific setup."],
  ];

  return <main className="cinematic-home">
    <section ref={heroRef} className="motion-hero" style={heroStyle}>
      <div className="motion-hero-sticky">
        <div className="hero-media-layer hero-media-back"><Image src="/media/liftsuit-hero.webp" alt="Worker wearing an Auxivo LiftSuit in a warehouse" fill priority sizes="100vw"/></div>
        <div className="hero-media-layer hero-media-front"><Image src="/media/liftsuit-hero.webp" alt="" fill priority sizes="100vw" aria-hidden="true"/></div>
        <div className="hero-grid" aria-hidden="true"/><div className="hero-scan" aria-hidden="true"/>
        <div className="motion-hero-copy">
          <p className="eyebrow">LIFTSUIT / PASSIVE EXOSKELETON</p>
          <h1>Strength, engineered<br/><em>around people.</em></h1>
          <p>Industrial technology should move with the worker—not stand between people and the work.</p>
          <div><Link className="button primary" href="/products/auxivo-liftsuit">Experience LiftSuit <span className="site-arrow" aria-hidden="true" /></Link><Link className="motion-text-link" href="/products-services">Explore products ↓</Link></div>
        </div>
        <div className="motion-hero-readout"><span>01 / LIFTSUIT</span><span>PASSIVE SUPPORT</span><span>SCROLL / INSPECT</span></div>
      </div>
    </section>

    <section className="movement-statement">
      <div className="kinetic-word" aria-hidden="true"><span>MOVE</span><span>SUPPORT</span><span>REPEAT</span></div>
      <div><p className="eyebrow">THE PRINCIPLE / 01</p><h2>Technology that follows<br/>human movement.</h2><p>ERK Dynamics helps industrial teams evaluate wearable systems in the environment where they will actually be used.</p></div>
    </section>

    <section ref={transitionRef} className="product-transition" style={lensStyle}>
      <div className="transition-sticky">
        <div className="chapter-base"><Image src="/media/liftsuit-work.webp" alt="Worker using LiftSuit during a forward-leaning industrial task" fill sizes="100vw"/><div className="chapter-shade"/></div>
        <div className="inspection-lens"><Image src="/media/omnisuit-work.webp" alt="Worker wearing OmniSuit during an overhead warehouse task" fill sizes="100vw"/></div>
        <div className="lens-ring" aria-hidden="true"><span>02</span><i/><b>INSPECTION / SWITCH</b></div>
        <div className="chapter-copy lift-copy"><p className="eyebrow">01 / LIFTSUIT</p><h2>Lift.<br/>Lean.<br/><em>Move freely.</em></h2><p>Lightweight textile support focused on the lower back and hips.</p><Link href="/products/auxivo-liftsuit">Explore LiftSuit <span className="site-arrow" aria-hidden="true" /></Link></div>
        <div className="chapter-copy omni-copy"><p className="eyebrow">02 / OMNISUIT</p><h2>Reach.<br/>Lift.<br/><em>Keep moving.</em></h2><p>Integrated support for work across the full vertical range.</p><Link href="/products/auxivo-omnisuit">Explore OmniSuit <span className="site-arrow" aria-hidden="true" /></Link></div>
        <div className="transition-progress" aria-hidden="true"><i/></div>
      </div>
    </section>

    <section className="task-selector section">
      <header><p className="eyebrow">CHOOSE BY TASK / 03</p><h2>Start with<br/>the movement.</h2><p>Select a task to see which system is designed for evaluation.</p></header>
      <div className="task-console">
        <div className="task-media"><Image key={tasks[task].image} src={tasks[task].image} alt={`${tasks[task].product} shown for ${tasks[task].label.toLowerCase()}`} fill sizes="(max-width: 800px) 100vw, 60vw"/><div className="task-reticle" aria-hidden="true"><i/><i/></div><span>{tasks[task].product} / TASK MATCH</span></div>
        <div className="task-controls" role="tablist" aria-label="Choose an industrial task">{tasks.map((item, index) => <button key={item.id} role="tab" aria-selected={task===index} className={task===index?"active":""} onClick={()=>setTask(index)}><span>0{index+1}</span><b>{item.label}</b><i>→</i></button>)}<div className="task-result"><small>RECOMMENDED FOR EVALUATION</small><h3>{tasks[task].product}</h3><p>{tasks[task].text}</p><Link href={`/products/auxivo-${tasks[task].product.toLowerCase()}`}>Inspect product <span className="site-arrow" aria-hidden="true" /></Link></div></div>
      </div>
    </section>

    <section className="engineering-section">
      <div className="engineering-stage"><Image src={engineering===0?"/media/liftsuit-work.webp":"/media/omnisuit-detail.webp"} alt="Auxivo exoskeleton shown in an industrial application" fill sizes="60vw"/><div className={`engineering-hotspot hotspot-${engineering}`} aria-hidden="true"><i/><span>0{engineering+1}</span></div><div className="engineering-sweep" aria-hidden="true"/></div>
      <div className="engineering-copy"><p className="eyebrow">ENGINEERING / 04</p><h2>Support without standing in the way.</h2><ol>{engineeringSteps.map(([title,text],i)=><li key={title} className={engineering===i?'active':''}><button onClick={()=>setEngineering(i)}><span>0{i+1}</span><b>{title}</b></button><p>{text}</p></li>)}</ol></div>
    </section>

    <section className="industry-motion section">
      <p className="eyebrow">INDUSTRIAL CONTEXT / 05</p><h2>One technology.<br/>Many operating realities.</h2><div className="industry-marquee" aria-label="Industries"><div><span>LOGISTICS</span><i/> <span>MANUFACTURING</span><i/> <span>AUTOMOTIVE</span><i/> <span>MAINTENANCE</span><i/> <span>CONSTRUCTION</span><i/> <span>LOGISTICS</span><i/> <span>MANUFACTURING</span></div></div><Link className="button primary" href="/industries">Explore applications <span className="site-arrow" aria-hidden="true" /></Link>
    </section>

    <section className="dual-finale">
      <div className="dual-image"><Image src="/media/dual-product.webp" alt="Two workers using OmniSuit for lifting and overhead work" fill sizes="100vw"/></div><div className="dual-image echo" aria-hidden="true"><Image src="/media/liftsuit-work.webp" alt="" fill sizes="50vw"/></div><div className="dual-shade"/>
      <div className="dual-copy"><p className="eyebrow">TWO SYSTEMS / ONE GOAL</p><h2>Find the support<br/>that fits the work.</h2><div><Link href="/products/auxivo-liftsuit">01 — LiftSuit <span className="site-arrow" aria-hidden="true" /></Link><Link href="/products/auxivo-omnisuit">02 — OmniSuit <span className="site-arrow" aria-hidden="true" /></Link></div></div>
    </section>
  </main>;
}
