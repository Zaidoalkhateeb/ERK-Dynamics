"use client";

import { ReactNode, useEffect, useRef } from "react";

export function PartnerReveal({ children }: { children: ReactNode }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const partners = Array.from(list.querySelectorAll<HTMLElement>(".partner-feature"));
    if (!("IntersectionObserver" in window)) {
      partners.forEach((partner) => partner.classList.add("is-visible"));
      return;
    }

    list.classList.add("is-observing");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    partners.forEach((partner) => observer.observe(partner));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={listRef} className="partner-list partner-reveal">
      {children}
    </div>
  );
}
