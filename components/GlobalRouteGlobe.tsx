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
  color: "hub" in city ? "#68e5f2" : "#11afc4",
  altitude: "hub" in city ? 0.075 : 0.035,
  radius: "hub" in city ? 0.38 : 0.2,
  labelColor: "hub" in city ? "#7ceaf4" : "rgba(255,255,255,0.92)",
  labelSize: "hub" in city ? 1.3 : 0.92,
  labelAltitude: "hub" in city ? 0.09 : 0.045,
  label: `<div class="erk-globe-tooltip"><strong>${city.name}</strong><span>${"hub" in city ? "ERK DYNAMICS HUB" : "CONNECTED MARKET"}</span></div>`,
}));

const routes = markets.map((market, index) => ({
  startLat: ISTANBUL.lat,
  startLng: ISTANBUL.lng,
  endLat: market.lat,
  endLng: market.lng,
  name: `Istanbul → ${market.name}`,
  color: ["rgba(103,229,242,0.95)", "rgba(9,145,168,0.34)"],
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
        animateIn: !reducedMotion,
        rendererConfig: { antialias: true, alpha: true },
      });
      globeRef.current = globe;

      globe
        .width(mount.clientWidth)
        .height(mount.clientHeight)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
        .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
        .showGraticules(true)
        .showAtmosphere(true)
        .atmosphereColor("#36bed1")
        .atmosphereAltitude(0.18)
        .pointsData(points)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor("color")
        .pointAltitude("altitude")
        .pointRadius("radius")
        .pointLabel("label")
        .pointsTransitionDuration(700)
        .labelsData(points)
        .labelLat("lat")
        .labelLng("lng")
        .labelText("name")
        .labelColor("labelColor")
        .labelSize("labelSize")
        .labelAltitude("labelAltitude")
        .labelIncludeDot(false)
        .labelResolution(2)
        .labelsTransitionDuration(reducedMotion ? 0 : 700)
        .arcsData(routes)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor("color")
        .arcLabel("name")
        .arcStroke(0.42)
        .arcAltitudeAutoScale(0.32)
        .arcDashLength(0.32)
        .arcDashGap(0.12)
        .arcDashInitialGap("delay")
        .arcDashAnimateTime(reducedMotion ? 0 : 1900)
        .arcsTransitionDuration(reducedMotion ? 0 : 900)
        .ringsData([ISTANBUL])
        .ringLat("lat")
        .ringLng("lng")
        .ringColor(() => (t: number) => `rgba(89, 220, 236, ${1 - t})`)
        .ringMaxRadius(4)
        .ringPropagationSpeed(2.2)
        .ringRepeatPeriod(reducedMotion ? 0 : 950)
        .pointOfView({ lat: 30, lng: 38, altitude: 2.05 }, 0)
        .onGlobeReady(() => setReady(true));

      const controls = globe.controls();
      controls.autoRotate = !reducedMotion;
      controls.autoRotateSpeed = 0.42;
      controls.enablePan = false;
      controls.minDistance = 170;
      controls.maxDistance = 420;

      globe.onPointHover((point) => {
        controls.autoRotate = !reducedMotion && !point;
        mount.style.cursor = point ? "pointer" : "grab";
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
      <div className="erkGlobeControls" aria-hidden="true">
        <span>Drag to rotate</span>
        <span>Scroll to zoom</span>
        <span>Hover to identify</span>
      </div>
      <div className="erkGlobeHub" aria-hidden="true"><i /><span>Istanbul hub</span></div>
    </div>
  );
}
