# SEO audit and search launch guide

## Findings from 21 November 2026

Read-only HTTP requests and public searches were used. Search Console, Cloudflare configuration, analytics and Google-specific index coverage were not accessible. Search results are evidence of some public discovery, not a complete index or a ranking report.

| Observed on the existing live deployment                                           | Why it matters                                                              | Prepared correction                                                                                    |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `/about/` used the homepage canonical and generic `ERK Dynamics` title             | Incorrect canonical signals can consolidate an inner page into the homepage | Each published route has its own canonical and descriptive title                                       |
| HTTP/HTTPS and www/non-www homepages all returned 200                              | Multiple copies remain accessible, including insecure HTTP                  | Generated permanent redirects to `https://www.erkdynamics.com/`; host/Cloudflare installation required |
| Homepage had no organization or website JSON-LD                                    | Business identity and preferred site name were not explicitly described     | Organization, WebSite, page and breadcrumb schemas                                                     |
| Social metadata reused a generic slogan and LiftSuit image                         | Shared links lacked page-specific context                                   | Branded default card, product-specific images and matching titles/descriptions                         |
| Sitemap used URLs without the exported trailing slash and one build-wide timestamp | Sitemap/canonical consistency can be improved                               | Exact published canonical paths; no invented modification dates                                        |
| robots.txt advertised a roughly ten-year cache lifetime                            | Crawler-rule changes may remain stale                                       | Generated one-hour cache rule plus edge-cache purge instructions                                       |
| Several company pages appeared in public search results                            | The site is not wholly undiscoverable                                       | Inspect real Google coverage and queries in Search Console after deployment                            |

Searches included `"ERK Dynamics"`, `"ERK Dynamics" exoskeleton Turkey`, `"ERK Dynamics" Auxivo`, and `"erkdynamics.com"`. The broad phrase also returned scientific material about ERK signalling. The new titles connect the business name with industrial technology and Türkiye. The official LinkedIn profile returned by search links to this domain; the shared profile link was corrected to `https://www.linkedin.com/company/erkdynamics/`.

These code changes have to be deployed before they affect the live site. They do not establish why every individual user failed to find it, and they cannot guarantee ranking changes.

## Metadata maintained in source

- `src/content/seo.ts`: human-written page titles, summaries and product descriptions.
- `src/content/site.ts`: canonical origin, company identity, contacts and LinkedIn profile.
- `src/lib/metadata.ts`: consistent title, description, canonical, Open Graph and Twitter fields.
- `src/components/seo/StructuredData.tsx`: escaped, server-rendered JSON-LD.
- `src/app/sitemap.ts` and `robots.ts`: crawl discovery for published routes.
- `public/seo/erk-dynamics.png`: 1200 × 630 default sharing image; generated from a maintained script.

Organization data uses the visible company name, contact details and Istanbul/Türkiye location. It omits unverified street addresses, legal identifiers, opening hours, awards and reviews. Product markup describes real products and their existing images. Because these are quote-only pages with no public price or reviews, it intentionally contains no fabricated Offer, rating or review. Product-rich-result eligibility is therefore limited; semantic Product markup does not promise a price/rating snippet.

The site is English-language. Do not add `tr` hreflang or Turkish metadata on English pages to imply a translation exists. A future Turkish version should have approved, useful Turkish content, separate URLs, reciprocal language annotations and its own sitemap entries.

## Required launch sequence

1. Deploy the validated `dist/` build and host rules. Keep `https://www.erkdynamics.com` as the canonical origin unless a deliberate domain migration is planned.
2. Confirm HTTP and non-www requests permanently redirect to the same HTTPS www path, retaining query strings. Missing URLs must return HTTP 404, not a successful homepage.
3. Purge old Cloudflare HTML, sitemap and robots caches. Confirm Googlebot and Bingbot can load pages and assets without a challenge. Existing blocks on training crawlers are not a reason to disable the site's security features.
4. Open [Google Search Console](https://search.google.com/search-console). Prefer a domain property for `erkdynamics.com`, verified through the DNS TXT record supplied by Google. This covers HTTP/HTTPS and subdomains. A URL-prefix property can instead use the optional `GOOGLE_SITE_VERIFICATION` build token; it needs a rebuild and deployment.
5. Submit `https://www.erkdynamics.com/sitemap.xml`. Verify the submission succeeds.
6. Inspect the homepage, products/services page and each product URL using URL Inspection. Check the live fetch, indexability, user-declared canonical and Google-selected canonical. Request indexing after correcting any reported issue.
7. Inspect Page Indexing, Manual Actions and Security Issues. Resolve the actual explanations shown there instead of inferring them from a `site:` search.
8. Validate deployed structured data using Google's [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/). Expect no price/rating product enhancement until legitimate qualifying content exists.
9. If Bing discovery matters, verify [Bing Webmaster Tools](https://www.bing.com/webmasters/) and submit the same sitemap; the optional `BING_SITE_VERIFICATION` token supports HTML verification.
10. Review Search Console query/page performance over the following weeks for branded and relevant product searches. Record impressions, clicks, indexing and canonical selection. Do not promise an immediate first-page position.

Public search cannot reveal whether a private Search Console property has been verified. A public DNS TXT lookup during this review found no Google or Bing verification token; that does not rule out other verification methods or an existing account property. Account ownership, DNS changes and indexing submissions are not completed by writing metadata.

## Ongoing maintenance

Keep each page's title and description accurate and distinct. Prefer useful content addressing the actual application, product and market. Keep external company profiles consistent with the canonical URL and business name. Add genuine manufacturer documentation and approved specifications when available. Do not add keyword-stuffed hidden text, fake ratings, fabricated prices, unsupported translation links or irrelevant FAQ markup.

Run `npm run dist` after content changes; the export verifier rejects missing or duplicated metadata, canonical mismatches, missing social images, missing schemas and sitemap mismatches. Run `npm run audit:site -- https://www.erkdynamics.com` after deployment. The audit is read-only and returns nonzero when issues remain.

Google can rewrite displayed titles and descriptions based on the query and page content. Open Graph images mainly control supported social/link previews; their presence does not force an image in Google Search. Re-crawling may take days to weeks, and a crawl request does not guarantee inclusion.

## Primary references

- [Google: canonical URL consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: descriptive title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Google: organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google: product snippet requirements](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Google: requesting a recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
