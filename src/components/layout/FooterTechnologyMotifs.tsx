export function FooterTechnologyMotifs() {
  return (
    <div className="footer-tech-motifs" aria-hidden="true">
      <svg className="footer-tech-motif footer-tech-motif--wearable" viewBox="0 0 220 260">
        <g className="footer-object-orbits">
          <circle cx="110" cy="132" r="92" />
          <circle cx="110" cy="132" r="70" />
          <circle cx="110" cy="132" r="48" />
        </g>
        <g className="footer-wearable-frame">
          <circle cx="110" cy="38" r="18" />
          <path d="M110 57v82M110 76 76 104M110 76l34 28M110 139l-31 86M110 139l33 86" />
          <path d="M89 77 76 146l20 11M131 77l13 69-20 11" />
        </g>
        <g className="footer-wearable-energy">
          <path d="M94 68 81 116l15 41M126 68l18 48-20 41M97 143l-18 82M123 143l20 82" />
        </g>
        <g className="footer-wearable-joints">
          <circle cx="81" cy="116" r="5" />
          <circle cx="96" cy="157" r="5" />
          <circle cx="144" cy="116" r="5" />
          <circle cx="124" cy="157" r="5" />
        </g>
      </svg>

      <svg className="footer-tech-motif footer-tech-motif--lidar" viewBox="0 0 260 230">
        <g className="footer-lidar-rings">
          <circle cx="126" cy="112" r="88" />
          <circle cx="126" cy="112" r="64" />
          <circle cx="126" cy="112" r="40" />
        </g>
        <g className="footer-lidar-unit">
          <path d="m78 108 14-25h55l14 25-14 25H92Z" />
          <path d="M104 133h43v25h-43Z" />
          <path d="m110 158-9 27h49l-9-27Z" />
          <circle cx="126" cy="108" r="13" />
          <path d="M113 108h26M126 95v26" />
        </g>
        <g className="footer-lidar-scan">
          <path d="M126 108 214 44M126 108l105-13M126 108l99 42" />
          <circle cx="214" cy="44" r="6" />
          <circle cx="225" cy="150" r="4" />
        </g>
      </svg>

      <svg className="footer-tech-motif footer-tech-motif--shared" viewBox="0 0 320 220">
        <path className="footer-shared-wire" d="M38 108h52M230 108h52" />
        <circle className="footer-shared-ring footer-shared-ring--left" cx="128" cy="108" r="58" />
        <circle className="footer-shared-ring footer-shared-ring--right" cx="192" cy="108" r="58" />
        <g className="footer-shared-core">
          <rect x="144" y="92" width="32" height="32" rx="4" transform="rotate(45 160 108)" />
          <circle cx="160" cy="108" r="6" />
        </g>
        <g className="footer-shared-points">
          <circle cx="32" cy="108" r="6" />
          <circle cx="288" cy="108" r="6" />
          <circle cx="80" cy="108" r="4" />
          <circle cx="240" cy="108" r="4" />
        </g>
        <text className="footer-shared-label" x="32" y="148" textAnchor="middle">
          GLOBAL
        </text>
        <text className="footer-shared-label" x="288" y="148" textAnchor="middle">
          LOCAL
        </text>
        <text
          className="footer-shared-label footer-shared-label--core"
          x="160"
          y="194"
          textAnchor="middle"
        >
          SHARED VALUE
        </text>
      </svg>
    </div>
  );
}
