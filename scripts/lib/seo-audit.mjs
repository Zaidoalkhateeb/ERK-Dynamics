const decode = (value = "") =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

export function inspectHtml(html) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
  const meta = {};
  const canonicals = [];
  for (const tag of head.matchAll(/<(?:meta|link)\b[^>]*>/gi)) {
    const attrs = Object.fromEntries(
      [...tag[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [
        key.toLowerCase(),
        decode(value),
      ]),
    );
    if (attrs.rel === "canonical") canonicals.push(attrs.href);
    if (attrs.name || attrs.property) meta[attrs.name || attrs.property] = attrs.content;
  }
  const schemas = [];
  for (const [, json] of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    const data = JSON.parse(json);
    schemas.push(...(data["@graph"] || [data]));
  }
  return {
    title: decode(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1]),
    meta,
    canonicals,
    schemas,
  };
}

export function seoIssues(page, canonical, home = false) {
  const issues = [];
  if (!page.title || page.title.length < 15 || !page.title.includes("ERK Dynamics"))
    issues.push("missing/descriptive brand title");
  if (!page.meta.description || page.meta.description.length < 70)
    issues.push("missing/descriptive meta description");
  if (page.canonicals.length !== 1 || page.canonicals[0] !== canonical)
    issues.push("incorrect canonical URL");
  if (/noindex|nofollow/i.test(`${page.meta.robots || ""} ${page.meta.googlebot || ""}`))
    issues.push("published page blocks indexing/following");
  for (const key of [
    "og:title",
    "og:description",
    "og:image",
    "og:image:alt",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ])
    if (!page.meta[key]) issues.push(`missing ${key}`);
  if (page.meta["og:url"] !== canonical) issues.push("incorrect og:url");
  if (page.meta["og:title"] !== page.title || page.meta["twitter:title"] !== page.title)
    issues.push("inconsistent search/social titles");
  if (page.meta["twitter:card"] !== "summary_large_image")
    issues.push("missing large-image sharing card");
  for (const type of ["Organization", home ? "WebSite" : "BreadcrumbList"])
    if (!page.schemas.some((schema) => schema["@type"] === type))
      issues.push(`missing ${type} schema`);
  const product = page.schemas.find((schema) => schema["@type"] === "Product");
  if (
    canonical.includes("/products/") &&
    (!product?.image?.length || product.url !== canonical || !product.brand?.name)
  )
    issues.push("incomplete product schema");
  return issues;
}
