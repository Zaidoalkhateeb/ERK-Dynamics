"use client";

import type { GlobeInstance } from "globe.gl";
import { useEffect, useRef, useState } from "react";

const ISTANBUL = { name: "Istanbul", lat: 41.0082, lng: 28.9784, hub: true };

const markets = [
  { name: "Dubai, UAE", label: "Dubai", lat: 25.2048, lng: 55.2708, labelLat: 29, labelLng: 45 },
  {
    name: "London, United Kingdom",
    label: "London",
    lat: 51.5074,
    lng: -0.1278,
    labelLat: 51,
    labelLng: -7,
  },
  {
    name: "Frankfurt, Germany",
    label: "Frankfurt",
    lat: 50.1109,
    lng: 8.6821,
    labelLat: 50,
    labelLng: 5,
  },
  {
    name: "Johannesburg, South Africa",
    label: "Johannesburg",
    lat: -26.2041,
    lng: 28.0473,
    labelLat: -5,
    labelLng: 29,
  },
  {
    name: "Toronto, Canada",
    label: "Toronto",
    lat: 43.6532,
    lng: -79.3832,
    labelLat: 49,
    labelLng: -45,
  },
  {
    name: "Zurich, Switzerland",
    label: "Zurich",
    lat: 47.3769,
    lng: 8.5417,
    labelLat: 46,
    labelLng: 12,
  },
  {
    name: "Sarajevo, Bosnia and Herzegovina",
    label: "Sarajevo",
    lat: 43.8563,
    lng: 18.4131,
    labelLat: 44,
    labelLng: 20,
  },
  { name: "Amman, Jordan", label: "Amman", lat: 31.9539, lng: 35.9106, labelLat: 35, labelLng: 33 },
  {
    name: "Beijing, China",
    label: "Beijing",
    lat: 39.9042,
    lng: 116.4074,
    labelLat: 44,
    labelLng: 82,
  },
  {
    name: "Baku, Azerbaijan",
    label: "Baku",
    lat: 40.4093,
    lng: 49.8671,
    labelLat: 42,
    labelLng: 43,
  },
] as const;

const routeLabels = markets.map((market) => ({
  name: market.label,
  lat: market.labelLat,
  lng: market.labelLng,
  routeLabel: true,
}));

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

// Served from our own origin: three-globe only calls onGlobeReady from the texture
// loader's success path, so a blocked or slow CDN would leave the loader spinning forever.
const GLOBE_TEXTURE = "/globe/earth-blue-marble.jpg";
const GLOBE_BUMP_MAP = "/globe/earth-topology.png";
// Backstop for the same reason: reveal the globe even if the texture never resolves.
const READY_TIMEOUT_MS = 8000;

export function GlobalRouteGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;
    let readyTimer: number | undefined;

    const reveal = () => {
      if (disposed) return;
      window.clearTimeout(readyTimer);
      setReady(true);
    };

    const initialise = async () => {
      const { default: Globe } = await import("globe.gl");
      if (disposed || !mountRef.current) return;

      const globe = new Globe(mountRef.current, {
        animateIn: false,
        rendererConfig: { antialias: true, alpha: true },
      });
      globeRef.current = globe;

      // The sphere, arcs and labels render without the texture, so a failed image
      // should degrade the globe rather than hide the whole section behind the loader.
      readyTimer = window.setTimeout(reveal, READY_TIMEOUT_MS);

      globe
        .width(mount.clientWidth)
        .height(mount.clientHeight)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl(GLOBE_TEXTURE)
        .bumpImageUrl(GLOBE_BUMP_MAP)
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
        .htmlElementsData([ISTANBUL, ...routeLabels])
        .htmlLat("lat")
        .htmlLng("lng")
        .htmlAltitude(0.02)
        .htmlElement((obj) => {
          const d = obj as { name: string; hub?: boolean; routeLabel?: boolean };
          const el = document.createElement("div");
          el.className = `erk-globe-city${d.hub ? " is-hub" : ""}${d.routeLabel ? " is-route-label" : ""}`;
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
        .onGlobeReady(reveal);

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

    // WebGL can be unavailable or blocked; clearing the loader beats an endless spinner.
    void initialise().catch(reveal);

    return () => {
      disposed = true;
      window.clearTimeout(readyTimer);
      resizeObserver?.disconnect();
      globeRef.current?._destructor();
      globeRef.current = null;
    };
  }, []);

  return (
    <div className="erkGlobePanel">
      <div className={`erkGlobeExperience ${ready ? "is-ready" : ""}`}>
        <div
          ref={mountRef}
          className="erkGlobeMount"
          aria-label="Interactive globe showing routes from Istanbul to international industrial markets"
        />
        <div className="erkGlobeLoader" aria-hidden="true">
          <i />
          <span>Building global routes</span>
        </div>
        <div className="erkGlobeHub" aria-hidden="true">
          <i />
          <span>Istanbul hub</span>
        </div>
      </div>
      <div className="erkGlobeMarkets" aria-label="Markets connected to Istanbul">
        <span>Connected markets</span>
        <ul>
          {markets.map((market) => (
            <li key={market.name}>{market.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
