export function PartnerMotion({ name }: { name: "Auxivo" | "LEICE" }) {
  if (name === "Auxivo") {
    return (
      <div className="partner-motion-object partner-motion-object--auxivo" aria-hidden="true">
        <svg viewBox="0 0 260 300">
          <circle
            className="partner-motion-orbit partner-motion-orbit--one"
            cx="130"
            cy="146"
            r="102"
          />
          <circle
            className="partner-motion-orbit partner-motion-orbit--two"
            cx="130"
            cy="146"
            r="76"
          />
          <g className="partner-exoskeleton">
            <circle cx="130" cy="51" r="20" />
            <path d="M130 73v98M130 91l-45 40M130 91l45 40M111 100l-17 77M149 100l17 77M130 171l-32 83M130 171l32 83" />
            <path
              className="partner-motion-flow"
              d="M84 124 107 86h46l23 38-17 57-29 20-29-20-17-57Z"
              pathLength="1"
            />
            <path
              className="partner-motion-flow partner-motion-flow--delay"
              d="m98 254 4-79 28 26 28-26 4 79"
              pathLength="1"
            />
            <circle
              className="partner-motion-joint partner-motion-joint--one"
              cx="101"
              cy="181"
              r="6"
            />
            <circle
              className="partner-motion-joint partner-motion-joint--two"
              cx="159"
              cy="181"
              r="6"
            />
          </g>
          <path className="partner-motion-signal" d="M28 222c24 21 42 30 67 34" pathLength="1" />
          <path
            className="partner-motion-signal partner-motion-signal--reverse"
            d="M232 222c-24 21-42 30-67 34"
            pathLength="1"
          />
        </svg>
        <span>WEARABLE SUPPORT</span>
      </div>
    );
  }

  return (
    <div className="partner-motion-object partner-motion-object--leice" aria-hidden="true">
      <svg viewBox="0 0 300 300">
        <circle
          className="partner-motion-orbit partner-motion-orbit--one"
          cx="150"
          cy="150"
          r="112"
        />
        <circle
          className="partner-motion-orbit partner-motion-orbit--two"
          cx="150"
          cy="150"
          r="82"
        />
        <g className="partner-lidar-head">
          <path d="M112 121h76l12 25-12 27h-76l-12-27 12-25Z" />
          <path d="M122 173v25h56v-25M132 198l-12 30h60l-12-30" />
          <circle cx="150" cy="147" r="15" />
          <path d="M135 147h30M150 132v30" />
        </g>
        <g className="partner-lidar-scan">
          <path d="M150 147 251 72" />
          <path d="M150 147 273 124" />
          <path d="M150 147 271 180" />
          <path className="partner-lidar-arc" d="M251 72a126 126 0 0 1 20 108" pathLength="1" />
        </g>
        <circle className="partner-motion-joint partner-motion-joint--one" cx="251" cy="72" r="5" />
        <circle
          className="partner-motion-joint partner-motion-joint--two"
          cx="271"
          cy="180"
          r="5"
        />
      </svg>
      <span>LIDAR SCANNING</span>
    </div>
  );
}
