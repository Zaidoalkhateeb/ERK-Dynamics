import Link from "next/link";

export type Block = { title: string; text: string };

export function ContentPage({ eyebrow, title, intro, blocks, children }: { eyebrow: string; title: string; intro: string; blocks: readonly Block[]; children?: React.ReactNode }) {
  const variant = eyebrow.split(" ")[0].toLowerCase();
  return <main>
    <section className={`page-hero animated-page-hero hero-${variant}`}>
      <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p>
      <span className="page-orbit" aria-hidden="true"/><span className="page-motion-shape" aria-hidden="true"><i/><i/><i/></span>
    </section>
    <section className="content-grid section">{blocks.map((b,i)=><article key={b.title}><span>0{i+1}</span><h2>{b.title}</h2><p>{b.text}</p></article>)}</section>
    {children}
    <section className="inline-cta section"><p className="eyebrow">START A CONVERSATION</p><h2><span>Move your operations forward</span><span>with the right technology</span></h2><Link href="/contact" className="button primary">Contact our team <span className="site-arrow" aria-hidden="true" /></Link></section>
  </main>;
}
