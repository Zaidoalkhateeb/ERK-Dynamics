// Builds the small product photos used by the home page cards.
// The originals are 2-9 MB press shots; Next's image optimiser is off for the
// static export, so the home page needs pre-sized copies committed to /public.
// Run with: node scripts/make-home-thumbs.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "media", "home");

// Same shots the products page uses, so the card and the detail page agree.
const sources = [
  { from: "omnisuit-work.webp", to: "omnisuit-card.webp", position: "attention" },
  { from: "liftsuit-work.webp", to: "liftsuit-card.webp", position: "attention" },
  { from: "deltasuit-1.jpeg", to: "deltasuit-card.webp", position: "attention" },
  { from: "carrysuit-1.jpeg", to: "carrysuit-card.webp", position: "attention" },
];

const WIDTH = 720;
const HEIGHT = 540;

await mkdir(outDir, { recursive: true });

for (const { from, to, position } of sources) {
  const input = path.join(root, "public", "media", from);
  const output = path.join(outDir, to);
  const info = await sharp(input)
    .resize(WIDTH, HEIGHT, { fit: "cover", position })
    .webp({ quality: 74 })
    .toFile(output);
  console.log(`${from} -> media/home/${to}  ${(info.size / 1024).toFixed(0)} KB`);
}
