"use client";

import { useEffect, useRef, type PointerEvent } from "react";

/** Pointer motion for hero SVG layers, with one animation frame and cleanup. */
export function useLayerParallax() {
  const heroRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const cancel = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  };

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const moveHero = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const { clientX, clientY } = event;
    cancel();
    frameRef.current = requestAnimationFrame(() => {
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      hero.querySelectorAll<SVGGElement>("[data-depth]").forEach((layer) => {
        const depth = Number(layer.dataset.depth || 0);
        layer.style.setProperty("--move-x", `${(x * depth).toFixed(2)}px`);
        layer.style.setProperty("--move-y", `${(y * depth * 0.68).toFixed(2)}px`);
      });
    });
  };

  const resetHero = () => {
    cancel();
    heroRef.current?.querySelectorAll<SVGGElement>("[data-depth]").forEach((layer) => {
      layer.style.setProperty("--move-x", "0px");
      layer.style.setProperty("--move-y", "0px");
    });
  };

  return { heroRef, moveHero, resetHero };
}
