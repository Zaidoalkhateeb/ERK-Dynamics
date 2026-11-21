/**
 * Bakes the flat world map used by <GlobalRouteMap /> into a plain TS module.
 *
 * Everything geographic is resolved here, at build time: the land silhouette, the
 * served-country fills and the projected city coordinates. The
 * component that consumes this file therefore ships as static SVG — no d3-geo,
 * topojson or world-atlas in the browser bundle.
 *
 *   node scripts/make-world-map.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const read = (name) => JSON.parse(readFileSync(require.resolve(`world-atlas/${name}`), "utf8"));

const WIDTH = 1000;
const PAD = 18;
// Antarctica adds a wide, empty band under a map whose southernmost stop is
// Johannesburg. Dropping it tightens the frame around the routes that matter.
const ANTARCTIC_LIMIT = -56;

// The frame is fitted to this window rather than to every scrap of land, so the map
// spends its pixels on the part of the world the routes actually cross. What falls
// outside is empty ocean plus Alaska's far tip and the Patagonian tail. The top stops
// at 84N rather than tighter so Greenland keeps its own coastline instead of a flat cut,
// and because
// Natural Earth curves its meridians inward towards the poles, the high-latitude
// coasts survive a longitude cut that would bite hard at the equator.
const WINDOW = { lon: [-125, 160], lat: [-44, 84] };

const HUB = {
  id: "istanbul",
  name: "Istanbul",
  country: "Türkiye",
  iso: "792",
  lat: 41.0082,
  lng: 28.9784,
};

// `bend` is signed curvature as a fraction of the chord: positive bows to the left
// of the direction of travel, so eastbound routes need +, westbound routes need -
// for every arc to lift towards the north. Values are hand-tuned per route.
const MARKETS = [
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    iso: "826",
    lat: 51.5074,
    lng: -0.1278,
    bend: -0.17,
  },
  {
    id: "frankfurt",
    name: "Frankfurt",
    country: "Germany",
    iso: "276",
    lat: 50.1109,
    lng: 8.6821,
    bend: -0.15,
  },
  {
    id: "zurich",
    name: "Zurich",
    country: "Switzerland",
    iso: "756",
    lat: 47.3769,
    lng: 8.5417,
    bend: -0.15,
  },
  {
    id: "sarajevo",
    name: "Sarajevo",
    country: "Bosnia and Herzegovina",
    iso: "070",
    lat: 43.8563,
    lng: 18.4131,
    bend: -0.18,
  },
  {
    id: "toronto",
    name: "Toronto",
    country: "Canada",
    iso: "124",
    lat: 43.6532,
    lng: -79.3832,
    bend: -0.2,
  },
  {
    id: "baku",
    name: "Baku",
    country: "Azerbaijan",
    iso: "031",
    lat: 40.4093,
    lng: 49.8671,
    bend: 0.16,
  },
  {
    id: "beijing",
    name: "Beijing",
    country: "China",
    iso: "156",
    lat: 39.9042,
    lng: 116.4074,
    bend: 0.18,
  },
  {
    id: "amman",
    name: "Amman",
    country: "Jordan",
    iso: "400",
    lat: 31.9539,
    lng: 35.9106,
    bend: 0.16,
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    iso: "784",
    lat: 25.2048,
    lng: 55.2708,
    bend: 0.17,
  },
  {
    id: "johannesburg",
    name: "Johannesburg",
    country: "South Africa",
    iso: "710",
    lat: -26.2041,
    lng: 28.0473,
    bend: -0.14,
  },
];

const landTopo = read("land-110m.json");
const countryTopo = read("countries-110m.json");

// `feature` hands back a FeatureCollection here (objects.land is a GeometryCollection
// holding a single MultiPolygon), so unwrap to the MultiPolygon before filtering it.
const landGeometry = feature(landTopo, landTopo.objects.land).features[0].geometry;
landGeometry.coordinates = landGeometry.coordinates.filter((polygon) => {
  const lats = polygon[0].map(([, lat]) => lat);
  return Math.max(...lats) > ANTARCTIC_LIMIT;
});
const land = landGeometry;

// The home hero tints the countries ERK serves. Baking them as two merged paths
// (hub, markets) keeps that highlight without shipping all 177 country outlines.
const countryPath = (isoCodes) => {
  const wanted = new Set(isoCodes);
  return {
    type: "GeometryCollection",
    geometries: countryTopo.objects.countries.geometries.filter((g) => wanted.has(String(g.id))),
  };
};
const hubCountry = feature(countryTopo, countryPath([HUB.iso]));
const marketCountries = feature(countryTopo, countryPath(MARKETS.map((m) => m.iso)));

// Centre the projection on 20°E: Istanbul sits close to the optical centre while
// Toronto and Beijing both keep a comfortable margin from the frame.
// Sampled along its edges, not just at the corners: Natural Earth bends meridians,
// so a four-point rectangle would project to the wrong bounds.
const along = (from, to, steps) =>
  Array.from({ length: steps + 1 }, (_, i) => from + ((to - from) * i) / steps);
const windowGeo = {
  type: "Polygon",
  coordinates: [
    [
      ...along(WINDOW.lon[0], WINDOW.lon[1], 72).map((lon) => [lon, WINDOW.lat[1]]),
      ...along(WINDOW.lat[1], WINDOW.lat[0], 36).map((lat) => [WINDOW.lon[1], lat]),
      ...along(WINDOW.lon[1], WINDOW.lon[0], 72).map((lon) => [lon, WINDOW.lat[0]]),
      ...along(WINDOW.lat[0], WINDOW.lat[1], 36).map((lat) => [WINDOW.lon[0], lat]),
    ],
  ],
};

const projection = geoNaturalEarth1().rotate([-20, 0]);
const bounds = geoPath(projection.fitWidth(WIDTH - PAD * 2, windowGeo)).bounds(windowGeo);
const HEIGHT = Math.round(bounds[1][1] - bounds[0][1] + PAD * 2);
projection.fitExtent(
  [
    [PAD, PAD],
    [WIDTH - PAD, HEIGHT - PAD],
  ],
  windowGeo,
);
// Land outside the window is cut here rather than filtered out of the geometry.
projection.clipExtent([
  [0, 0],
  [WIDTH, HEIGHT],
]);

const path = geoPath(projection);
// Sub-pixel precision on a 1000px-wide map is invisible and expensive: the land
// outline alone is thousands of points, and this trims the shipped string by ~40%.
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 10) / 10));
const at = (city) => projection([city.lng, city.lat]).map((n) => +n.toFixed(1));

const hubCity = { id: HUB.id, name: HUB.name, country: HUB.country, lat: HUB.lat, lng: HUB.lng };
const hub = { ...hubCity, x: at(HUB)[0], y: at(HUB)[1] };
const markets = MARKETS.map((market) => {
  const [x, y] = at(market);
  const dx = x - hub.x;
  const dy = y - hub.y;
  const length = Math.hypot(dx, dy);
  // Control point pushed off the chord midpoint along its normal; `bend` scales
  // with the chord so short hops and long hauls share one visual language.
  const cx = +(hub.x + dx / 2 + (dy / length) * length * market.bend).toFixed(1);
  const cy = +(hub.y + dy / 2 - (dx / length) * length * market.bend).toFixed(1);
  // `bend` is an input to the arc, not part of the emitted geometry.
  const city = {
    id: market.id,
    name: market.name,
    country: market.country,
    lat: market.lat,
    lng: market.lng,
  };
  return {
    ...city,
    x,
    y,
    d: `M${hub.x} ${hub.y}Q${cx} ${cy} ${x} ${y}`,
    length: Math.round(length),
  };
});

const out = `// GENERATED FILE — run \`node scripts/make-world-map.mjs\` to rebuild.
// Natural Earth I projection, rotated to 20°E, Antarctica removed.

export type RouteCity = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  d: string;
  length: number;
};

export const MAP_WIDTH = ${WIDTH};
export const MAP_HEIGHT = ${HEIGHT};

export const LAND_PATH = ${JSON.stringify(round(path(land)))};

export const HUB_COUNTRY_PATH = ${JSON.stringify(round(path(hubCountry)))};

export const MARKET_COUNTRIES_PATH = ${JSON.stringify(round(path(marketCountries)))};

export const HUB: Omit<RouteCity, "d" | "length"> = ${JSON.stringify(hub, null, 2)};

export const ROUTES: RouteCity[] = ${JSON.stringify(markets, null, 2)};
`;

writeFileSync(new URL("../src/components/maps/worldMap.data.ts", import.meta.url), out);
console.log(`world map → ${WIDTH}x${HEIGHT}, ${markets.length} routes`);
for (const m of markets)
  console.log(
    `  ${m.id.padEnd(13)} x=${String(m.x).padStart(6)} y=${String(m.y).padStart(6)}  ${m.length}px`,
  );
