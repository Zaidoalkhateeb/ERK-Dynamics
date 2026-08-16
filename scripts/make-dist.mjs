// Turns Next's static export (`out/`) into the deployable `dist/` + `dist.zip`.
//
// The static host will not serve directories whose name starts with an underscore,
// so `_next` is renamed and every reference to `/_next/` is rewritten.
//
// The archive is written by scripts/zip.mjs rather than PowerShell's Compress-Archive,
// which stamps mode 0 on the directory entries it emits. Extracted on the host those
// became unreadable directories, so the server returned 403 for every file beneath them
// and the site lost all of its JavaScript while still serving its HTML.
//
// Verify a deploy with `npm run verify` before calling it done.
// Run after `npm run build`:  node scripts/make-dist.mjs

import { cp, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { writeZip } from "./zip.mjs";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "out");
const dist = path.join(root, "dist");
const zip = path.join(root, "dist.zip");

// Where `_next` is published. Change this if the host ever serves it as 403 again.
const ASSET_DIR = "site-assets";

// Only these carry URLs into the shipped bundle; binaries must never be touched.
const REWRITABLE = new Set([".html", ".js", ".txt", ".css", ".json", ".xml", ".map"]);
const CHUNK_CSS = new RegExp(`/${ASSET_DIR}/static/chunks/[^"'\\s]+\\.css`, "g");

async function findFiles(dir, extension) {
  const matches = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) matches.push(...await findFiles(full, extension));
    else if (path.extname(entry.name) === extension) matches.push(full);
  }
  return matches;
}

// Next asks for a route's prefetch payload with the segment path flattened into dots
// (/about/__next.about.__PAGE__.txt), but the export writes it as nested directories
// (/about/__next.about/__PAGE__.txt). Every prefetch therefore 404s on a plain file
// host and navigation falls back to reloading the whole page. Copying each payload to
// the name Next actually requests makes the prefetches resolve.
async function addFlatSegmentPayloads(dir) {
  let copied = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (!entry.name.startsWith("__next.")) {
      copied += await addFlatSegmentPayloads(full);
      continue;
    }
    for (const payload of await findFiles(full, ".txt")) {
      const flattened = path.relative(dir, payload).split(path.sep).join(".");
      await cp(payload, path.join(dir, flattened));
      copied += 1;
    }
  }
  return copied;
}

async function rewrite(dir, cssHref) {
  let rewritten = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewritten += await rewrite(full, cssHref);
      continue;
    }
    if (!REWRITABLE.has(path.extname(entry.name))) continue;
    const source = await readFile(full, "utf8");
    let output = source.replaceAll("/_next/", `/${ASSET_DIR}/`).replace(CHUNK_CSS, cssHref);
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
await rename(path.join(dist, "_next"), path.join(dist, ASSET_DIR));

const cssFiles = await findFiles(path.join(dist, ASSET_DIR), ".css");
if (cssFiles.length !== 1) {
  throw new Error(`Expected one generated stylesheet, found ${cssFiles.length}.`);
}
// The stylesheet keeps a fixed path, but hosts serve it with a long max-age, so a
// build that reuses `style.css` stays invisible behind CDN and browser caches.
// Hashing the contents into the name makes every changed build a fresh URL.
const cssBytes = await readFile(cssFiles[0]);
const cssHash = createHash("sha256").update(cssBytes).digest("hex").slice(0, 8);
const cssName = `style.${cssHash}.css`;
await cp(cssFiles[0], path.join(dist, cssName));

const rewritten = await rewrite(dist, `/${cssName}`);
// After the rewrite, so the copies carry the corrected asset URLs too.
const flattened = await addFlatSegmentPayloads(dist);
console.log(`dist/ built — rewrote /_next/ in ${rewritten} files, stylesheet: ${cssName}`);
console.log(`assets published under /${ASSET_DIR}/, ${flattened} prefetch payloads flattened`);

// Entries must sit at the archive root (no dist/ prefix) for the host's uploader,
// and must use forward slashes, which is what the ZIP format requires.
async function collectFiles(dir, prefix = "") {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(full, `${prefix}${entry.name}/`));
    else files.push({ name: `${prefix}${entry.name}`, path: full });
  }
  return files;
}

const entries = await writeZip(await collectFiles(dist), zip);

const zipStat = await stat(zip).catch(() => null);
if (!zipStat) throw new Error("No dist.zip was produced.");
console.log(`dist.zip written — ${entries} files, ${(zipStat.size / 1024 / 1024).toFixed(1)} MB`);
