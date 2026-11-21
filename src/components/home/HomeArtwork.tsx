import {
  ROUTE_SUMMARY,
  RouteMapDefs,
  RouteMapLand,
  RouteMapRoutes,
} from "@/components/maps/RouteMapArt";
import { MAP_HEIGHT, MAP_WIDTH } from "@/components/maps/worldMap.data";

export function PartnerArt({ id }: { id: string }) {
  // Auxivo: a wearable frame with support paths running through it.
  if (id === "auxivo") {
    return (
      <g>
        <g className="home-partner-frame">
          <circle cx="150" cy="42" r="16" />
          <path d="M150 58v72M150 74l-34 28M150 74l34 28M150 130l-24 62M150 130l24 62" />
        </g>
        <path
          className="home-partner-flow"
          d="M116 102 128 66h44l12 36-14 44-22 16-22-16z"
          pathLength="1"
        />
        <path
          className="home-partner-flow home-partner-flow--late"
          d="m126 192 4-60 20 20 20-20 4 60"
          pathLength="1"
        />
        <g className="home-partner-node">
          <circle cx="122" cy="112" r="5" />
          <circle cx="178" cy="112" r="5" />
        </g>
      </g>
    );
  }

  // LEICE: a sensor head sweeping the space in front of it.
  return (
    <g>
      <g className="home-partner-frame">
        <path d="M120 86h60l10 20-10 21h-60l-10-21z" />
        <path d="M130 127v22h40v-22M138 149l-8 26h40l-8-26" />
        <circle cx="150" cy="106" r="12" />
      </g>
      <g className="home-partner-scan">
        <path d="M150 106 268 40" />
        <path d="M150 106h124" />
        <path d="M150 106 262 168" />
      </g>
      <path className="home-partner-arc" d="M268 40a104 104 0 0 1 0 132" pathLength="1" />
      <g className="home-partner-node">
        <circle cx="268" cy="40" r="5" />
        <circle cx="262" cy="168" r="5" />
      </g>
    </g>
  );
}

export function TechGlyph({ id }: { id: string }) {
  switch (id) {
    case "exoskeletons":
      return (
        <g>
          <g className="home-glyph-primary">
            <circle cx="60" cy="26" r="11" />
            <path d="M60 37v30" />
            <path d="M60 44 38 58M60 44l22 14" />
            <path d="M60 67 46 96M60 67l14 29" />
          </g>
          <path d="M32 52c-4 10-4 21 0 31" />
          <path d="M88 52c4 10 4 21 0 31" />
        </g>
      );
    case "lidar":
      return (
        <g>
          <g className="home-glyph-primary">
            <circle cx="60" cy="60" r="8" />
            <path d="M60 60 96 34" />
          </g>
          <path d="M60 26a34 34 0 0 1 29 17" />
          <path d="M60 39a21 21 0 0 1 18 10" />
          <path d="M24 88h72" />
          <path d="M42 88V72M78 88V66" />
        </g>
      );
    case "power":
      return (
        <g>
          <g className="home-glyph-primary">
            <path d="M64 24 42 64h16l-4 32 24-42H62z" />
          </g>
          <path d="M30 40v40l30 17 30-17V40L60 23z" />
        </g>
      );
    default:
      return null;
  }
}

export function HomeRouteMap() {
  return (
    <svg
      className="technology-hero__objects home-route-map"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Routes from İstanbul to ${ROUTE_SUMMARY}`}
      focusable="false"
    >
      <RouteMapDefs prefix="erkHeroMap" />
      <defs>
        {/* The map runs up against the headline on its left, so it dissolves into the
            background there rather than ending on a hard vertical edge. */}
        <linearGradient
          id="homeMapFadeRamp"
          gradientUnits="userSpaceOnUse"
          x1="652"
          y1="0"
          x2="800"
          y2="0"
        >
          <stop offset="0%" stopColor="#000000" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <mask id="homeMapFade" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
          <rect x="0" y="0" width="1600" height="900" fill="url(#homeMapFadeRamp)" />
        </mask>
        {/* The frame is cropped just below Johannesburg, which clips the Patagonian
            tail. Fading the last stretch turns that cut into a horizon. */}
        <linearGradient
          id="homeMapFadeFloor"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="655"
          x2="0"
          y2="716"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <mask
          id="homeMapFadeBottom"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1600"
          height="900"
        >
          <rect x="0" y="0" width="1600" height="900" fill="url(#homeMapFadeFloor)" />
        </mask>
      </defs>

      {/* Both masks sit on untransformed wrappers on purpose: userSpaceOnUse resolves
          against the masked element's own coordinate system, so hanging either on the
          scaled group below would stretch the ramp along with the map. Nesting them
          composes the two edges. */}
      <g mask="url(#homeMapFade)">
        <g mask="url(#homeMapFadeBottom)">
          {/* The shared artwork is baked in its own 1000 x 516 space; this drops it into
              the right half of the hero canvas, clear of the headline. Land and routes
              keep their own parallax depth, so the routes drift a little ahead of the
              continents as the cursor moves. */}
          <g transform="translate(672 205) scale(0.98)">
            <g className="parallax-layer" data-depth="10">
              <RouteMapLand prefix="erkHeroMap" highlight />
            </g>
            <g className="parallax-layer" data-depth="16">
              <RouteMapRoutes prefix="erkHeroMap" labels />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export function HomeRouteMapBlock() {
  return (
    <svg
      className="home-route-map-block"
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Routes from İstanbul to ${ROUTE_SUMMARY}`}
      focusable="false"
    >
      <RouteMapDefs prefix="erkBlockMap" />
      <RouteMapLand prefix="erkBlockMap" highlight />
      <RouteMapRoutes prefix="erkBlockMap" labels />
    </svg>
  );
}
