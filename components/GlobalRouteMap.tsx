import { ROUTE_SUMMARY, RouteMapDefs, RouteMapLand, RouteMapRoutes } from "./RouteMapArt";
import { MAP_HEIGHT, MAP_WIDTH, ROUTES } from "./worldMap.data";

/**
 * The About page's route map: the shared artwork on the bare page — no plate behind
 * it — with the full label set, a key, and a caption listing every market in text.
 */
export function GlobalRouteMap() {
  return (
    <figure className="erkRouteMap">
      <svg
        className="erkRouteMapSvg"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        role="img"
        aria-label={`World map of routes from İstanbul to ${ROUTE_SUMMARY}`}
      >
        <RouteMapDefs prefix="erkAboutMap" />

        <RouteMapLand prefix="erkAboutMap" />
        <RouteMapRoutes prefix="erkAboutMap" labels />

        <g className="erkRouteMapKey" transform="translate(38 372)">
          <circle className="erkRouteMapHubRing" cx={6} cy={-4} r={5.4} />
          <circle className="erkRouteMapHubCore" cx={6} cy={-4} r={2.8} />
          <text className="erkRouteMapKeyText" x={20} y={0}>İstanbul hub</text>
          <circle className="erkRouteMapDotHalo" cx={6} cy={20} r={6} />
          <circle className="erkRouteMapDot" cx={6} cy={20} r={3} />
          <text className="erkRouteMapKeyText" x={20} y={24}>Served market</text>
        </g>
      </svg>

      <figcaption className="erkRouteMapCaption">
        <span className="erkRouteMapCount">{ROUTES.length} markets</span>
        <ul className="erkRouteMapList">
          {ROUTES.map((route) => (
            <li key={route.id}>
              <strong>{route.name}</strong>
              <span>{route.country}</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
