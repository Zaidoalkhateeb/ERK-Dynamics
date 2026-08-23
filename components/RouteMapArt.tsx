import { HUB, HUB_COUNTRY_PATH, LAND_PATH, MARKET_COUNTRIES_PATH, ROUTES } from "./worldMap.data";

/**
 * The shared parts of the İstanbul route map, drawn at two very different sizes:
 * the About page renders them as a self-contained card, the home hero renders the
 * same geometry as a full-bleed backdrop behind the headline.
 *
 * Everything here is projected at build time by `scripts/make-world-map.mjs`, so
 * both pages ship plain SVG — no map library, no runtime projection, nothing to
 * hydrate. All coordinates live in the baked 1000 x 483 map space; the hero simply
 * wraps them in a transform.
 */

type Placement = { dx: number; dy: number; anchor: "start" | "middle" | "end" };

// Every name sits beside its own dot — no leader lines. Offsets are relative to the
// dot rather than absolute, so re-cropping the projection moves the labels with their
// cities instead of stranding them. The four European stops land close together, so
// they take turns around the cluster instead of stacking: London to its left,
// Frankfurt up and right, Zurich down and left, Sarajevo further down and left.
const LABELS: Record<string, Placement> = {
  london: { dx: -9, dy: -2, anchor: "end" },
  frankfurt: { dx: 9, dy: -7, anchor: "start" },
  zurich: { dx: -10, dy: 6, anchor: "end" },
  sarajevo: { dx: -5, dy: 21, anchor: "end" },
  // Westernmost stop, so its name goes right: to the left it would run off the
  // map and into the hero headline.
  toronto: { dx: 9, dy: 4, anchor: "start" },
  baku: { dx: 8, dy: 5, anchor: "start" },
  beijing: { dx: 9, dy: 5, anchor: "start" },
  amman: { dx: 8, dy: 4, anchor: "start" },
  dubai: { dx: 9, dy: 4, anchor: "start" },
  johannesburg: { dx: 0, dy: 20, anchor: "middle" },
};

// The hub badge, and the ERK dragonfly sitting inside it at the source aspect ratio
// (833 x 479). The mark is kept just small enough to read as a map marker and just
// large enough that its thin line work survives the downscale.
const HUB_BADGE = 16;
const LOGO = { w: 27, h: 27 * (479 / 833) };

// Ten arcs radiate from the hub, so there is no clear gap immediately beside it. The
// name sits down and left over the Mediterranean, the nearest open water.
const HUB_LABEL: Placement = { dx: -29, dy: 43, anchor: "end" };

export const ROUTE_SUMMARY = ROUTES.map((route) => route.name).join(", ");

/**
 * Gradients and filters, namespaced per instance. The home page renders two copies of
 * this artwork (a desktop backdrop and a phone block, one hidden at any width), and
 * duplicate ids would make both `url(#…)` references resolve to the hidden one — which
 * paints nothing. Hence the prefix, and hence fill/stroke are set inline rather than
 * in CSS: a shared stylesheet cannot name a per-instance id.
 */
export function RouteMapDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      <linearGradient id={`${prefix}-land`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bcd2da" />
        <stop offset="100%" stopColor="#9bb9c4" />
      </linearGradient>
      {/* Anchored to the hub in user space rather than to each path's own box, so
          every route reads as darkest at İstanbul and fades outward — the same
          direction of travel whether it runs east to Beijing or west to Toronto. */}
      <radialGradient id={`${prefix}-arc`} gradientUnits="userSpaceOnUse" cx={HUB.x} cy={HUB.y} r={330}>
        <stop offset="0%" stopColor="#00697d" />
        <stop offset="45%" stopColor="#0e9bb4" />
        <stop offset="100%" stopColor="#4cc0d4" />
      </radialGradient>
      {/* A whisper of depth: enough to lift the continents off the water,
          not enough to read as a shadow. */}
      <filter id={`${prefix}-lift`} x="-2%" y="-2%" width="104%" height="104%">
        <feDropShadow dx="0" dy="1.4" stdDeviation="1.8" floodColor="#0b3d49" floodOpacity="0.18" />
      </filter>
    </defs>
  );
}

/** The land silhouette, plus — where asked for — the served countries tinted. */
export function RouteMapLand({ prefix, highlight = false }: { prefix: string; highlight?: boolean }) {
  return (
    <g className="erkRouteMapGeo">
      <path className="erkRouteMapLand" d={LAND_PATH} fill={`url(#${prefix}-land)`} filter={`url(#${prefix}-lift)`} />
      {highlight ? (
        <>
          <path className="erkRouteMapMarketCountry" d={MARKET_COUNTRIES_PATH} />
          <path className="erkRouteMapHubCountry" d={HUB_COUNTRY_PATH} />
        </>
      ) : null}
    </g>
  );
}

/** Arcs, travelling beads, city markers and the İstanbul hub. */
export function RouteMapRoutes({ prefix, labels = false }: { prefix: string; labels?: boolean }) {
  return (
    <>
      <g className="erkRouteMapArcs">
        {ROUTES.map((route, index) => (
          <g key={route.id} style={{ ["--erk-route-index" as string]: index }}>
            <path className="erkRouteMapArcGlow" d={route.d} pathLength={1} />
            <path className="erkRouteMapArcLine" d={route.d} stroke={`url(#${prefix}-arc)`} pathLength={1} />
            <circle className="erkRouteMapPulse" r={2.8}>
              {/* SMIL rather than a CSS motion path: it is the one technique every
                  current browser animates natively inside an inline SVG. */}
              <animateMotion
                path={route.d}
                dur={`${(4.2 + route.length / 130).toFixed(1)}s`}
                begin={`${(index * 0.55).toFixed(2)}s`}
                repeatCount="indefinite"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
          </g>
        ))}
      </g>

      <g className="erkRouteMapCities">
        {ROUTES.map((route) => {
          const label = LABELS[route.id];
          return (
            <g key={route.id}>
              <circle className="erkRouteMapDotHalo" cx={route.x} cy={route.y} r={8} />
              <circle className="erkRouteMapDot" cx={route.x} cy={route.y} r={4.3} />
              {labels ? (
                <text
                  className="erkRouteMapLabel"
                  x={route.x + label.dx}
                  y={route.y + label.dy}
                  textAnchor={label.anchor}
                >
                  {route.name}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>

      <g className="erkRouteMapHub">
        <circle className="erkRouteMapHubWave" cx={HUB.x} cy={HUB.y} r={HUB_BADGE} />
        <circle className="erkRouteMapHubWave erkRouteMapHubWave--late" cx={HUB.x} cy={HUB.y} r={HUB_BADGE} />
        {/* İstanbul is marked by the company mark itself. The white disc is what makes
            it legible: this is the one spot on the map where ten arcs converge, and
            fine line art has nothing to hold against them. */}
        <circle className="erkRouteMapHubBadge" cx={HUB.x} cy={HUB.y} r={HUB_BADGE} />
        <image
          className="erkRouteMapHubMark"
          href="/media/erk-dragonfly.png"
          x={HUB.x - LOGO.w / 2}
          y={HUB.y - LOGO.h / 2}
          width={LOGO.w}
          height={LOGO.h}
          preserveAspectRatio="xMidYMid meet"
        />
        <text
          className="erkRouteMapHubName"
          x={HUB.x + HUB_LABEL.dx}
          y={HUB.y + HUB_LABEL.dy}
          textAnchor={HUB_LABEL.anchor}
        >
          İSTANBUL
        </text>
      </g>
    </>
  );
}
