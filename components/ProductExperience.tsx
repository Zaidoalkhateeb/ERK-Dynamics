"use client";

import Link from "next/link";
import { Product } from "@/content/products";
import { useEffect, useRef, useState } from "react";

const productMedia = {
  "auxivo-liftsuit": {
    hero: "/media/liftsuit-1.jpeg",
    story: ["/media/liftsuit-2.jpeg", "/media/liftsuit-3.jpeg", "/media/liftsuit-4.jpeg", "/media/liftsuit-5.jpeg"],
    cta: "/media/liftsuit-6.jpeg",
  },
  "auxivo-omnisuit": {
    hero: "/media/omnisuit-1.jpeg",
    story: ["/media/omnisuit-2.jpeg", "/media/omnisuit-3.jpeg", "/media/omnisuit-4.jpeg", "/media/omnisuit-5.jpeg"],
    cta: "/media/omnisuit-6.jpeg",
  },
  "auxivo-deltasuit": {
    hero: "/media/deltasuit-1.jpeg",
    story: ["/media/deltasuit-3.jpeg", "/media/deltasuit-2.jpeg", "/media/deltasuit-1.jpeg", "/media/deltasuit-4.jpeg"],
    cta: "/media/deltasuit-2.jpeg",
  },
  "auxivo-carrysuit": {
    hero: "/media/carrysuit-1.jpeg",
    story: ["/media/carrysuit-2.jpeg", "/media/carrysuit-3.jpeg", "/media/carrysuit-4.jpeg", "/media/carrysuit-5.jpeg"],
    cta: "/media/carrysuit-6.jpeg",
  },
} as const;

export function ProductExperience({ product: p }: { product: Product }) {
  const story = useRef<HTMLElement>(null);
  const [feature, setFeature] = useState(0);
  const media = productMedia[p.slug as keyof typeof productMedia] || productMedia["auxivo-liftsuit"];
  const storyMedia = media.story;
  const featureTitle = p.features[feature];
  const noBatteries = featureTitle.endsWith(" No batteries");
  const featureTitleLead = noBatteries ? featureTitle.slice(0, -" No batteries".length) : featureTitle;
  const featureTitleClass = featureTitle.length > 32 ? "is-long" : featureTitle.length > 20 ? "is-compact" : "";
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

  return <main className={`product-experience ${p.slug}`}>
    <section className="product-motion-hero">
      <div className="product-hero-media"><img src={media.hero} alt={`Auxivo ${p.name} shown in an industrial task`} loading="eager" decoding="async"/><div className="product-hero-wash"/></div>
      <div className="product-motion-title"><h1>{p.name}</h1><p>{p.tagline}</p><div><Link href="#product-story" className="button primary">Inspect the system <span className="site-arrow" aria-hidden="true" /></Link><Link href="/contact" className="button glass">Request a quote <span className="site-arrow" aria-hidden="true" /></Link></div></div>
      <div className="product-axis" aria-hidden="true"><span>X / MOVEMENT</span><i/><span>Y / SUPPORT</span></div>
    </section>

    <section id="product-story" ref={story} className="product-scroll-story">
      <div className="product-story-sticky">
        <div className="product-story-stage">{storyMedia.map((src,i)=><img key={src+i} src={src} alt={i===feature?`${p.name}: ${p.features[i]}`:""} loading="lazy" decoding="async" className={i===feature?"active":""}/>) }<div className="story-grid"/><div className={`story-target target-${feature+1}`} aria-hidden="true"><i/><i/><span>0{feature+1}</span></div></div>
        <aside className="product-story-panel"><p className="eyebrow">HOW IT WORKS</p><h2 className={`${featureTitleClass}${noBatteries ? " has-no-batteries" : ""}`}>{featureTitleLead}{noBatteries && <><br/><span>No batteries</span></>}</h2><p>{feature===0?p.summary:feature===1?p.support:"The active view highlights the product in a task relevant context. Suitability remains subject to assessment and correct fitting."}</p><div className="story-tabs">{p.features.map((name,i)=><button key={name} onClick={()=>setFeature(i)} className={i===feature?"active":""} aria-label={`View feature ${i+1}: ${name}`}><span>0{i+1}</span><i/></button>)}</div><div className="story-actions"><Link href="/contact" className="button primary">Contact Us <span className="site-arrow" aria-hidden="true" /></Link></div></aside>
      </div>
    </section>

    <section className="product-specifications section" data-header-light><header><p className="eyebrow">TECHNICAL / STABLE VIEW</p><h2>Product information</h2><p>Detailed technical values and certifications will be published only from approved manufacturer documentation.</p></header><dl><div><dt>Support system</dt><dd>Passive / battery-free</dd></div><div><dt>Available sizes</dt><dd>{p.sizes.join(" / ")}</dd></div><div><dt>Primary focus</dt><dd>{p.name==="LiftSuit"?"Lower back and hips":p.name==="DeltaSuit"?"Shoulders and arms":p.name==="CarrySuit"?"Upper body and hips":"Shoulders, lower back, and hips"}</dd></div><div><dt>Evaluation</dt><dd>Demonstration and task assessment</dd></div><div><dt>Availability</dt><dd>Contact ERK Dynamics</dd></div></dl></section>

    <section className="product-final-cta"><div className="product-final-media"><img src={media.cta} alt={`${p.name} in an industrial environment`} loading="lazy" decoding="async"/></div><div className="product-final-overlay"/><article><p className="eyebrow">NEXT STEP</p><h2>Experience<br/>{p.name}</h2><p>Speak with the ERK Dynamics team about {p.name}.</p><Link href="/contact" className="button primary">Contact Us <span className="site-arrow" aria-hidden="true" /></Link></article></section>
  </main>;
}
