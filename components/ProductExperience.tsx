"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/content/products";
import { useEffect, useRef, useState } from "react";

const productMedia = {
  "auxivo-liftsuit": ["/media/liftsuit-hero.webp", "/media/liftsuit-detail.webp", "/media/liftsuit-work.webp", "/media/liftsuit-hero.webp"],
  "auxivo-omnisuit": ["/media/omnisuit-work.webp", "/media/omnisuit-detail.webp", "/media/dual-product.webp", "/media/omnisuit-work.webp"],
} as const;

export function ProductExperience({ product: p }: { product: Product }) {
  const story = useRef<HTMLElement>(null);
  const [feature, setFeature] = useState(0);
  const media = productMedia[p.slug as keyof typeof productMedia] || productMedia["auxivo-liftsuit"];
  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (!story.current) return;
      const rect = story.current.getBoundingClientRect();
      const distance = Math.max(1, rect.height - innerHeight);
      setFeature(Math.min(p.features.length - 1, Math.max(0, Math.floor((-rect.top / distance) * p.features.length))));
    };
    const onScroll=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(update)};
    update();addEventListener("scroll",onScroll,{passive:true});return()=>{cancelAnimationFrame(raf);removeEventListener("scroll",onScroll)};
  }, [p.features.length]);

  return <main className="product-experience">
    <Link href="/contact" className="demo-dock"><i/>Contact Us <span>↗</span></Link>
    <section className="product-motion-hero">
      <div className="product-hero-media"><Image src={media[0]} alt={`Auxivo ${p.name} shown in an industrial task`} fill priority sizes="100vw"/><div className="product-hero-wash"/></div>
      <div className="product-motion-title"><p className="eyebrow">{p.number} / AUXIVO / {p.category.toUpperCase()}</p><h1>{p.name}</h1><p>{p.tagline}</p><div><Link href="#product-story" className="button primary">Inspect the system ↓</Link><Link href="/contact" className="button glass">Request a quote</Link></div></div>
      <div className="product-axis" aria-hidden="true"><span>X / MOVEMENT</span><i/><span>Y / SUPPORT</span></div>
    </section>

    <section id="product-story" ref={story} className="product-scroll-story" style={{"--feature-count":p.features.length} as React.CSSProperties}>
      <div className="product-story-sticky">
        <div className="product-story-stage">{media.map((src,i)=><Image key={src+i} src={src} alt={i===feature?`${p.name}: ${p.features[i]}`:""} fill sizes="65vw" className={i===feature?"active":""}/>) }<div className="story-grid"/><div className="story-target" aria-hidden="true"><i/><i/><span>0{feature+1}</span></div><div className="stage-caption">SCROLL-LINKED INSPECTION / {feature+1} OF {p.features.length}</div></div>
        <aside className="product-story-panel"><p className="eyebrow">HOW IT WORKS</p><h2>{p.features[feature]}</h2><p>{feature===0?p.summary:feature===1?p.support:"The active view highlights the product in a task-relevant context. Suitability remains subject to assessment and correct fitting."}</p><div className="story-tabs">{p.features.map((name,i)=><button key={name} onClick={()=>setFeature(i)} className={i===feature?"active":""} aria-label={`View feature ${i+1}: ${name}`}><span>0{i+1}</span><i/></button>)}</div><div className="story-actions"><Link href="/contact" className="button primary">Contact Us <span>↗</span></Link><span>SIZES / {p.sizes.join(" · ")}</span></div></aside>
      </div>
    </section>

    <section className="product-editorial section"><div><p className="eyebrow">APPLICATION RANGE</p><h2>Designed for the task.<br/>Evaluated with the team.</h2></div><div className="application-lines">{p.applications.map((a,i)=><div key={a}><span>0{i+1}</span><h3>{a}</h3><p>Potential application, subject to task assessment and operating conditions.</p></div>)}</div></section>

    <section className="product-specifications section"><header><p className="eyebrow">TECHNICAL / STABLE VIEW</p><h2>Product information.</h2><p>Detailed technical values and certifications will be published only from approved manufacturer documentation.</p></header><dl><div><dt>Support system</dt><dd>Passive / battery-free</dd></div><div><dt>Available sizes</dt><dd>{p.sizes.join(" / ")}</dd></div><div><dt>Primary focus</dt><dd>{p.name==="LiftSuit"?"Lower back and hips":"Shoulders, lower back, and hips"}</dd></div><div><dt>Evaluation</dt><dd>Demonstration and task assessment</dd></div><div><dt>Availability</dt><dd>Contact ERK Dynamics</dd></div></dl></section>

    <section className="product-final-cta"><Image src={media[2]} alt={`${p.name} in an industrial environment`} fill sizes="100vw"/><div/><article><p className="eyebrow">NEXT STEP</p><h2>Experience {p.name}<br/>in the work.</h2><p>Speak with the ERK Dynamics team about {p.name}.</p><Link href="/contact" className="button primary">Contact Us <span>↗</span></Link></article></section>
  </main>;
}
