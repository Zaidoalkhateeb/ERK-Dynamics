// Read-only public HTTP checks; no form submission or private account access.
import { inspectHtml, seoIssues } from "./lib/seo-audit.mjs";
const origin = new URL(process.argv[2] || "https://www.erkdynamics.com").origin;
if (!origin.startsWith("https://")) throw new Error("Audit the canonical HTTPS origin.");
const records = [];
for (const route of [
  "/",
  "/about/",
  "/contact/",
  "/products-services/",
  "/products/auxivo-omnisuit/",
  "/products/auxivo-liftsuit/",
  "/products/auxivo-deltasuit/",
  "/products/auxivo-carrysuit/",
  "/robots.txt",
  "/sitemap.xml",
  "/audit-nonexistent-route/",
  "/send.php",
]) {
  const url = origin + route;
  try {
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
    const body = await response.text();
    const headers = Object.fromEntries(
      [
        "content-type",
        "location",
        "x-robots-tag",
        "content-security-policy",
        "strict-transport-security",
        "x-content-type-options",
        "referrer-policy",
        "x-frame-options",
        "cache-control",
      ].map((key) => [key, response.headers.get(key)]),
    );
    const issues = [];
    if (
      route === "/audit-nonexistent-route/"
        ? response.status !== 404
        : route === "/send.php"
          ? response.status !== 405
          : response.status !== 200
    )
      issues.push(`Unexpected HTTP ${response.status}`);
    if (response.status === 200 && headers["content-type"]?.includes("text/html")) {
      const page = inspectHtml(body);
      issues.push(...seoIssues(page, url, route === "/"));
      for (const name of [
        "content-security-policy",
        "strict-transport-security",
        "x-content-type-options",
        "referrer-policy",
        "x-frame-options",
      ])
        if (!headers[name]) issues.push(`Missing ${name}`);
      if (/noindex/i.test(headers["x-robots-tag"] || ""))
        issues.push("HTTP header blocks indexing");
      records.push({
        url,
        status: response.status,
        title: page.title,
        canonical: page.canonicals,
        issues,
        headers,
      });
    } else {
      if (
        route === "/robots.txt" &&
        (!body.includes(`${origin}/sitemap.xml`) ||
          /Disallow:\s*\/\s*$/m.test(body.split(/# END Cloudflare Managed Content/i).at(-1)))
      )
        issues.push("Check crawler rules/sitemap declaration");
      if (route === "/sitemap.xml" && !body.includes(`<loc>${origin}/</loc>`))
        issues.push("Sitemap missing canonical homepage");
      records.push({ url, status: response.status, issues, headers });
    }
  } catch (error) {
    records.push({ url, issues: [error.message] });
  }
}
const host = new URL(origin).hostname;
const alternate = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
for (const url of [`http://${host}/`, `http://${alternate}/`, `https://${alternate}/`]) {
  try {
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
    const location = response.headers.get("location");
    records.push({
      url,
      status: response.status,
      location,
      issues:
        [301, 308].includes(response.status) && location === `${origin}/`
          ? []
          : ["Expected permanent redirect to canonical HTTPS homepage"],
    });
    await response.body?.cancel();
  } catch (error) {
    records.push({ url, issues: [error.message] });
  }
}
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), origin, records }, null, 2));
if (records.some((record) => record.issues.length)) process.exitCode = 1;
