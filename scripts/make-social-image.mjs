import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const directory = path.resolve(import.meta.dirname, "../public/seo");
await mkdir(directory, { recursive: true });
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#0d303c"/>
<g fill="none" stroke="#247280" stroke-width="2" opacity=".65"><circle cx="1140" cy="100" r="330"/><circle cx="1140" cy="100" r="250"/><circle cx="1140" cy="100" r="170"/><path d="M790 0v630M0 490h1200"/></g>
<rect x="70" y="76" width="58" height="5" fill="#45cbce"/>
<g font-family="Arial, Helvetica, sans-serif" fill="#fff">
<text x="70" y="174" font-size="66" font-weight="700" letter-spacing="1">ERK DYNAMICS</text>
<text x="70" y="290" font-size="44">Industrial technology.</text>
<text x="70" y="350" font-size="44">Local expertise in Türkiye.</text>
<text x="70" y="440" font-size="25" fill="#b4d6dc">Exoskeletons · LiDAR · Power solutions</text>
<text x="70" y="558" font-size="23" fill="#72d8df">erkdynamics.com</text>
</g></svg>`;
await sharp(Buffer.from(svg)).png().toFile(path.join(directory, "erk-dynamics.png"));
console.log("Generated 1200 × 630 brand sharing image.");
