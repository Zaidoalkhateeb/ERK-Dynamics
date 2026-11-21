import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { inspectHtml, seoIssues } from "./lib/seo-audit.mjs";

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
const titles = new Set();
const descriptions = new Set();
const canonicalUrls = new Set();
let origin;
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
      const page = inspectHtml(source);
      if (canonical) {
        origin ||= new URL(canonical[1]).origin;
        const expected = origin + route;
        failures.push(
          ...seoIssues(page, expected, route === "/").map((issue) => `${route}: ${issue}`),
        );
        canonicalUrls.add(expected);
        if (titles.has(page.title)) failures.push(`${route}: duplicate title`);
        if (descriptions.has(page.meta.description))
          failures.push(`${route}: duplicate description`);
        titles.add(page.title);
        descriptions.add(page.meta.description);
        for (const key of ["og:image", "twitter:image"]) {
          const url = new URL(page.meta[key], origin);
          if (url.origin !== origin) failures.push(`${route}: inconsistent social image origin`);
          else references.add(url.pathname);
        }
      }
    } else if (!/name="robots" content="[^"]*noindex/.test(source)) {
      failures.push(`${file}: error page must be noindex`);
    }
    for (const [, url] of source.matchAll(/(?:src|href)="(\/[^"#]*)/g))
      references.add(url.replaceAll("&amp;", "&"));
  } else {
    for (const [, url] of source.matchAll(/url\(["']?(\/[^"')]+)["']?\)/g)) references.add(url);
  }
}
const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
if (
  sitemapUrls.length !== new Set(sitemapUrls).size ||
  sitemapUrls.length !== canonicalUrls.size ||
  sitemapUrls.some((url) => !canonicalUrls.has(url))
)
  failures.push("Sitemap does not exactly match published canonical routes");
const robots = await readFile(path.join(root, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`) || /Disallow:\s*\/\s*$/m.test(robots))
  failures.push("Incorrect crawler rules or sitemap origin");
const hostConfig = await readFile(path.join(root, ".htaccess"), "utf8");
if (!hostConfig.includes("Content-Security-Policy") || !hostConfig.includes("R=308"))
  failures.push("Missing security/redirect host configuration");
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
  `Export verified: ${pages} HTML pages, ${canonicalUrls.size} SEO-complete routes, ${references.size} local references, matching sitemap and security configuration.`,
);
