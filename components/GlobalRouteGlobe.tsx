"use client";

import type { GlobeInstance } from "globe.gl";
import { useEffect, useRef, useState } from "react";

const ISTANBUL = { name: "Istanbul", lat: 41.0082, lng: 28.9784, hub: true };

const markets = [
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Frankfurt", lat: 50.1109, lng: 8.6821 },
  { name: "South Africa", lat: -26.2041, lng: 28.0473 },
  { name: "Barcelona", lat: 41.3874, lng: 2.1686 },
  { name: "Beijing", lat: 39.9042, lng: 116.4074 },
  { name: "Baku", lat: 40.4093, lng: 49.8671 },
] as const;

const points = [ISTANBUL, ...markets].map((city) => ({
  ...city,
  color: "hub" in city ? "#7cf0ff" : "#2ec6dc",
  altitude: "hub" in city ? 0.02 : 0.01,
  radius: "hub" in city ? 0.55 : 0.32,
  labelColor: "hub" in city ? "#8ff0fb" : "rgba(255,255,255,0.96)",
  labelSize: "hub" in city ? 1.55 : 1.08,
  labelAltitude: "hub" in city ? 0.1 : 0.05,
  label: `<div class="erk-globe-tooltip"><strong>${city.name}</strong><span>${"hub" in city ? "ERK DYNAMICS HUB" : "CONNECTED MARKET"}</span></div>`,
}));

const routes = markets.map((market, index) => ({
  startLat: ISTANBUL.lat,
  startLng: ISTANBUL.lng,
  endLat: market.lat,
  endLng: market.lng,
  name: `Istanbul → ${market.name}`,
  color: ["rgba(150,242,255,0.98)", "rgba(110,225,245,0.92)"],
  delay: index * 0.11,
}));

export function GlobalRouteGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;

    const initialise = async () => {
      const { default: Globe } = await import("globe.gl");
      if (disposed || !mountRef.current) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const globe = new Globe(mountRef.current, {
        animateIn: false,
        rendererConfig: { antialias: true, alpha: true },
      });
      globeRef.current = globe;

      globe
        .width(mount.clientWidth)
        .height(mount.clientHeight)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
        .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
        .showGraticules(true)
        .showAtmosphere(true)
        .atmosphereColor("#8fd4e6")
        .atmosphereAltitude(0.2)
        .pointsData(points)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor("color")
        .pointAltitude("altitude")
        .pointRadius("radius")
        .pointLabel("label")
        .pointsTransitionDuration(700)
        .htmlElementsData(points)
        .htmlLat("lat")
        .htmlLng("lng")
        .htmlAltitude(0.02)
        .htmlElement((obj) => {
          const d = obj as { name: string; hub?: boolean };
          const el = document.createElement("div");
          el.className = "erk-globe-city" + (d.hub ? " is-hub" : "");
          el.textContent = d.name;
          return el;
        })
        .htmlElementVisibilityModifier((el: HTMLElement, isVisible: boolean) => {
          el.style.opacity = isVisible ? "1" : "0";
        })
        .arcsData(routes)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor("color")
        .arcLabel("name")
        .arcStroke(0.75)
        .arcAltitudeAutoScale(0.4)
        .arcDashLength(1)
        .arcDashGap(0)
        .arcDashAnimateTime(0)
        .arcsTransitionDuration(0)
        .pointOfView({ lat: 24, lng: 26, altitude: 2.5 }, 0)
        .onGlobeReady(() => setReady(true));

      // Static presentation: no auto-rotation, no drag/zoom, no animation — a fixed globe.
      const controls = globe.controls();
      controls.autoRotate = false;
      controls.enableRotate = false;
      controls.enableZoom = false;
      controls.enablePan = false;

      globe.onPointHover((point) => {
        mount.style.cursor = point ? "pointer" : "default";
      });

      resizeObserver = new ResizeObserver(() => {
        if (!mountRef.current || disposed) return;
        globe.width(mountRef.current.clientWidth).height(mountRef.current.clientHeight);
      });
      resizeObserver.observe(mount);
    };

    void initialise();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      globeRef.current?._destructor();
      globeRef.current = null;
    };
  }, []);

  return (
    <div className={`erkGlobeExperience ${ready ? "is-ready" : ""}`}>
      <div ref={mountRef} className="erkGlobeMount" aria-label="Interactive globe showing routes from Istanbul to international industrial markets" />
      <div className="erkGlobeLoader" aria-hidden="true"><i /><span>Building global routes</span></div>
      <div className="erkGlobeHub" aria-hidden="true"><i /><span>Istanbul hub</span></div>
    </div>
  );
}
