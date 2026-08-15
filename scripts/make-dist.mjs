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
const CHUNK_CSS = /\/assets\/static\/chunks\/[^"'\s]+\.css/g;

async function findFiles(dir, extension) {
  const matches = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) matches.push(...await findFiles(full, extension));
    else if (path.extname(entry.name) === extension) matches.push(full);
  }
  return matches;
}

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
    let output = source.replaceAll("/_next/", "/assets/").replace(CHUNK_CSS, "/style.css");
    if (path.extname(entry.name) === ".html") {
      // React adds this optional hint to script preloads, but Firefox flags it as unsupported.
      output = output.replace(/\sfetchpriority=(["'])(?:high|low|auto)\1/gi, "");
    }
    if (output === source) continue;
    await writeFile(full, output);
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

const cssFiles = await findFiles(path.join(dist, "assets"), ".css");
if (cssFiles.length !== 1) {
  throw new Error(`Expected one generated stylesheet, found ${cssFiles.length}.`);
}
await cp(cssFiles[0], path.join(dist, "style.css"));

const rewritten = await rewrite(dist);
console.log(`dist/ built — rewrote /_next/ in ${rewritten} files`);

// Entries must sit at the archive root (no dist/ prefix) for the host's uploader.
await promisify(execFile)("powershell", [
  "-NoProfile",
  "-Command",
  `Compress-Archive -Path '${dist}${path.sep}*' -DestinationPath '${zip}' -CompressionLevel Optimal -Force`,
]);

const zipStat = await stat(zip).catch(() => null);
if (!zipStat) throw new Error("Compress-Archive produced no dist.zip — run the command manually.");
const { size } = zipStat;
console.log(`dist.zip written — ${(size / 1024 / 1024).toFixed(1)} MB`);
