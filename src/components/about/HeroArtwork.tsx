import type { RefObject } from "react";

export function HeroArtwork({ stageRef }: { stageRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="erkAboutVisual" aria-hidden="true">
      <div ref={stageRef} className="erkAboutVisualStage">
        <svg
          className="erkAboutVisualSvg"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          role="presentation"
          focusable="false"
        >
          <defs>
            <linearGradient id="erk-about-hex-stroke" x1="950" y1="100" x2="1560" y2="740">
              <stop offset="0%" stopColor="#7fd7e5" stopOpacity=".55" />
              <stop offset="52%" stopColor="#12a2bb" stopOpacity=".85" />
              <stop offset="100%" stopColor="#0a7288" stopOpacity=".45" />
            </linearGradient>
            <linearGradient id="erk-about-ring-stroke" x1="860" y1="10" x2="1640" y2="790">
              <stop offset="0%" stopColor="#86dce8" stopOpacity=".18" />
              <stop offset="50%" stopColor="#0a91a8" stopOpacity=".5" />
              <stop offset="100%" stopColor="#0a7288" stopOpacity=".14" />
            </linearGradient>
            <pattern id="erk-about-dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="2.8" fill="#37bdd5" fillOpacity=".34" />
            </pattern>
          </defs>

          {/* Scaled and nudged about the cluster centre so the honeycomb clears both
              the copy on the left and the contact rail on the right. */}
          <g transform="translate(1140 410) scale(0.86) translate(-1250 -400)">
            <g className="erkAboutOrbitSpin erkAboutOrbitSpin--slow">
              <circle className="erkAboutRing erkAboutRing--outer" cx="1250" cy="400" r="390" />
            </g>
            <g className="erkAboutOrbitSpin erkAboutOrbitSpin--reverse">
              <ellipse
                className="erkAboutRing erkAboutRing--middle"
                cx="1250"
                cy="400"
                rx="320"
                ry="255"
                transform="rotate(-20 1250 400)"
              />
            </g>

            <g className="erkAboutHexDrift">
              <path
                className="erkAboutHex erkAboutHex--ghost"
                d="M1300 190 1225 320 1075 320 1000 190 1075 60 1225 60Z"
              />
              <path
                className="erkAboutHex erkAboutHex--lead"
                d="M1300 450 1225 580 1075 580 1000 450 1075 320 1225 320Z"
              />
              <path
                className="erkAboutHex erkAboutHex--mid"
                d="M1525 580 1450 710 1300 710 1225 580 1300 450 1450 450Z"
              />
              <path
                className="erkAboutHex erkAboutHex--mid"
                d="M1525 320 1450 450 1300 450 1225 320 1300 190 1450 190Z"
              />
            </g>

            <g className="erkAboutHexDrift erkAboutHexDrift--slow">
              <path
                className="erkAboutHexDots"
                d="M985 210 933 301 828 301 775 210 828 119 933 119Z"
              />
            </g>

            <g className="erkAboutFlow">
              <path d="M880 301V450H1000" />
            </g>
            <g className="erkAboutFlow erkAboutFlow--wave">
              <path d="M812 800C960 730 1050 776 1170 706" />
              <path className="erkAboutFlow--delayed" d="M846 852C1000 786 1090 826 1215 754" />
            </g>

            <g className="erkAboutNodes">
              <circle
                className="erkAboutOrbitNode erkAboutOrbitNode--solid"
                cx="1300"
                cy="450"
                r="7"
              />
              <circle className="erkAboutOrbitNode" cx="1225" cy="320" r="5" />
              <circle className="erkAboutOrbitNode" cx="1225" cy="580" r="5" />
              <circle className="erkAboutOrbitNode" cx="1525" cy="320" r="4.5" />
              <circle className="erkAboutOrbitNode" cx="1525" cy="580" r="4.5" />
              <circle
                className="erkAboutOrbitNode erkAboutOrbitNode--solid"
                cx="880"
                cy="210"
                r="5.5"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
