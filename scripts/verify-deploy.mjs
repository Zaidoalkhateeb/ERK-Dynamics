// Checks that everything in `dist/` is actually reachable on the live site.
//
// A static export is only as good as the upload. If a directory lands with the
// wrong permissions the host answers 403 for every file beneath it, the page
// still renders from its HTML, and only the interactive parts silently die —
// which looks exactly like "it works locally but not live".
//
// Every request carries a cache-buster because a CDN will keep serving the
// previous deploy's files long after the origin stopped serving them, which
// hides the failure from a casual look in the browser.
//
//   node scripts/verify-deploy.mjs https://www.erkdynamics.com

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const base = (process.argv[2] || "https://www.erkdynamics.com").replace(/\/$/, "");
const root = path.join(path.resolve(import.meta.dirname, ".."), "dist");
const CONCURRENCY = 8;

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) found.push(full);
  }
  return found;
}

const pages = await htmlFiles(root);
if (!pages.length) throw new Error("dist/ has no HTML — run `npm run dist` first.");

// Root-relative URLs only: anything on another host is not ours to verify.
const urls = new Set();
for (const page of pages) {
  const route =
    "/" +
    path
      .relative(root, page)
      .split(path.sep)
      .join("/")
      .replace(/(^|\/)index\.html$/, "$1");
  urls.add(route);
  const html = await readFile(page, "utf8");
  for (const [, url] of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)) {
    // A #anchor is the same document; keeping it would both double-count the page
    // and swallow the cache-buster, since everything after # never reaches the server.
    const withoutFragment = url.split("#")[0];
    if (withoutFragment && !url.startsWith("//")) urls.add(withoutFragment);
  }
}

const targets = [...urls].sort();
console.log(`Checking ${targets.length} URLs against ${base} …\n`);

const failures = [];
const queue = targets.slice();

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const target = queue.shift();
      const probe = `${base}${target}${target.includes("?") ? "&" : "?"}__verify=${Date.now()}`;
      try {
        const response = await fetch(probe, {
          redirect: "follow",
          cache: "no-store",
          signal: AbortSignal.timeout(15_000),
        });
        if (!response.ok) failures.push({ target, detail: `HTTP ${response.status}` });
        await response.body?.cancel();
      } catch (error) {
        failures.push({ target, detail: error.message });
      }
    }
  }),
);

if (!failures.length) {
  console.log(`All ${targets.length} URLs served correctly.`);
  process.exit(0);
}

console.error(`${failures.length} of ${targets.length} URLs are not being served:\n`);
for (const { target, detail } of failures.sort((a, b) => a.target.localeCompare(b.target))) {
  console.error(`  ${detail.padEnd(10)} ${target}`);
}

// Files failing together under one directory means that directory, not the build.
const directories = new Set(
  failures.map(({ target }) => target.slice(0, target.lastIndexOf("/") + 1)),
);
console.error(`\nAffected directories: ${[...directories].join(", ")}`);
console.error("A whole directory failing usually means its permissions or ownership on the host,");
console.error("not a bad build — compare against the same paths in dist/.");
process.exit(1);
