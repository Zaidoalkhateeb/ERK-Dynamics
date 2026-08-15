// Turns Next's static export (`out/`) into the deployable `dist/` + `dist.zip`.
//
// The static host will not serve directories whose name starts with an underscore,
// so `_next` is renamed to `assets` and every reference to `/_next/` is rewritten.
// Run after `npm run build`:  node scripts/make-dist.mjs

import { createWriteStream } from "node:fs";
import { cp, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "out");
const dist = path.join(root, "dist");
const zip = path.join(root, "dist.zip");

// Only these carry URLs into the shipped bundle; binaries must never be touched.
const REWRITABLE = new Set([".html", ".js", ".txt", ".css", ".json", ".xml", ".map"]);

async function rewrite(dir) {
  let rewritten = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewritten += await rewrite(full);
      continue;
    }
    if (!REWRITABLE.has(path.extname(entry.name))) continue;
    const source = await readFile(full, "utf8");
    if (!source.includes("/_next/")) continue;
    await writeFile(full, source.replaceAll("/_next/", "/assets/"));
    rewritten += 1;
  }
  return rewritten;
}

if (!(await stat(out).catch(() => null))) {
  throw new Error("out/ is missing — run `npm run build` first.");
}

await rm(dist, { recursive: true, force: true });
await rm(zip, { force: true });
await cp(out, dist, { recursive: true });
await rename(path.join(dist, "_next"), path.join(dist, "assets"));

const rewritten = await rewrite(dist);
console.log(`dist/ built — rewrote /_next/ in ${rewritten} files`);

// Entries must sit at the archive root (no dist/ prefix) for the host's uploader.
await promisify(execFile)("powershell", [
  "-NoProfile",
  "-Command",
  `Compress-Archive -Path '${dist}\\*' -DestinationPath '${zip}' -CompressionLevel Optimal`,
]);

const { size } = await stat(zip);
console.log(`dist.zip written — ${(size / 1024 / 1024).toFixed(1)} MB`);
