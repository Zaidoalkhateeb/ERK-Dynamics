import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "dist");
async function filesUnder(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(full)));
    else files.push(full);
  }
  return files;
}
const files = await filesUnder(root);
const failures = [];
let pages = 0;
const references = new Set();
for (const file of files.filter((file) => /\.(html|css)$/.test(file))) {
  const source = await readFile(file, "utf8");
  if (file.endsWith(".html")) {
    pages++;
    if (!source.includes("<h1")) failures.push(`${path.relative(root, file)} has no page heading`);
    if (source.includes("/_next/")) failures.push(`${file} still references /_next/`);
    if (!/[\\/]404(?:[\\/]|\.html)/.test(file) && !file.includes("_not-found")) {
      const route =
        "/" +
        path
          .relative(root, file)
          .split(path.sep)
          .join("/")
          .replace(/index\.html$/, "");
      const canonical = source.match(/<link rel="canonical" href="([^"]+)"/);
      if (!canonical || new URL(canonical[1]).pathname !== route)
        failures.push(`${route} has a missing or incorrect canonical URL`);
    }
    for (const [, url] of source.matchAll(/(?:src|href)="(\/[^"#]*)/g))
      references.add(url.replaceAll("&amp;", "&"));
  } else {
    for (const [, url] of source.matchAll(/url\(["']?(\/[^"')]+)["']?\)/g)) references.add(url);
  }
}
for (const reference of references) {
  if (reference.startsWith("//")) continue;
  const pathname = decodeURIComponent(reference.split(/[?#]/)[0]);
  const full = path.resolve(root, "." + pathname);
  if (full !== root && !full.startsWith(root + path.sep)) {
    failures.push(`Invalid path: ${reference}`);
    continue;
  }
  const info = await stat(full).catch(() => null);
  if (
    !info ||
    (info.isDirectory() && !(await stat(path.join(full, "index.html")).catch(() => null)))
  )
    failures.push(`Missing asset or route: ${reference}`);
}
if (failures.length) throw new Error(failures.join("\n"));
console.log(
  `Export verified: ${pages} HTML pages, ${references.size} local references, correct canonical URLs.`,
);
