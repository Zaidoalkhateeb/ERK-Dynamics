# ERK Dynamics

Corporate website presenting industrial exoskeletons, LiDAR and power solutions for businesses in Türkiye. This repository contains the maintainable source, assets, build tools and client handoff documentation.

**Production origin:** <https://www.erkdynamics.com>

**Architecture:** Next.js static export with a separate PHP enquiry endpoint. No Next.js server runs in production.

## Project guides

| Task                                             | Guide                                            |
| ------------------------------------------------ | ------------------------------------------------ |
| Edit pages, products, styles and contact details | [Architecture and editing](docs/ARCHITECTURE.md) |
| Publish the website and configure email          | [Deployment](docs/DEPLOYMENT.md)                 |
| Inspect indexing and search appearance           | [SEO and search visibility](docs/SEO.md)         |
| Review security findings and host requirements   | [Security review](docs/SECURITY.md)              |
| Transfer the project to the client               | [Handoff checklist](docs/HANDOFF.md)             |

## Features and scope

- Home, products/services, industries, partners, about, contact and partnership pages.
- Four published Auxivo product pages: OmniSuit, LiftSuit, DeltaSuit and CarrySuit.
- Responsive navigation, product and industry selection, and a WebGL globe.
- Contact and partnership forms posting to `/send.php`.
- Static HTML with unique titles, descriptions, canonicals, social metadata and JSON-LD.
- Sitemap, crawler rules, build verification and generated host configuration.

There is no CMS, customer account system, checkout, CRM, database, connected analytics service, Turkish translation, attachment delivery or automatic visitor confirmation email. Existing analytics browser events have no connected reporting service. Outbound LiDAR and power-supply links can lead to Think Metric.

## Requirements and technology

- **Node.js 24+** and npm; `.nvmrc` specifies Node 24. The lockfile records the tested dependency tree.
- **PHP 8.1+** for the form endpoint and PHP tests. Use a currently supported PHP version in production.
- A production host serving static files and executing PHP, with configured mail transport.
- Chrome or Edge for the optional existing browser smoke-test command.

The site uses Next.js 16, React 19, TypeScript and CSS. ESLint and Prettier enforce source consistency. The globe uses `globe.gl`; Sharp and the geographic data packages are build tools.

## Local development

```sh
npm ci
cp .env.example .env.local
npm run dev
```

In PowerShell, use `Copy-Item .env.example .env.local` for the copy step. Visit <http://localhost:3000>. Use `npm ci` after cloning or changing the lockfile. Use `npm install` only when intentionally updating dependencies.

Next.js development mode does not execute PHP. The static preview deliberately refuses PHP requests, so it cannot send messages or expose PHP source. Test real email delivery on the PHP host with agreed test details.

### Configuration

| Variable                   | Where to set it                  | Purpose/default                                                                                         |
| -------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Build environment / `.env.local` | Canonical HTTPS origin; defaults to `https://www.erkdynamics.com`. No path, port, credentials or query. |
| `GOOGLE_SITE_VERIFICATION` | Build environment / `.env.local` | Optional Search Console HTML ownership token; leave blank until supplied by the owner.                  |
| `BING_SITE_VERIFICATION`   | Build environment / `.env.local` | Optional Bing Webmaster Tools HTML ownership token.                                                     |
| `ERK_MAIL_TO`              | PHP host environment             | Recipient inbox; defaults to `info@erkdynamics.com`.                                                    |
| `ERK_MAIL_FROM`            | PHP host environment             | Authorized sender; defaults to `no-reply@erkdynamics.com`.                                              |
| `ERK_ALLOWED_ORIGINS`      | PHP host environment             | Comma-separated permitted browser origins; defaults to the HTTPS www and non-www production origins.    |
| `PHP_BINARY`               | Local shell / CI                 | PHP executable when `php` is not on PATH.                                                               |
| `CHROME_PATH`              | Local shell                      | Browser executable override for the optional smoke test.                                                |
| `PORT`                     | Local shell                      | Static preview port; defaults to `4319`.                                                                |
| `PREVIEW_SECURITY=1`       | Local shell                      | Preview generated security headers, excluding HTTPS-only settings on localhost.                         |

Rebuild after changing build-time variables. Next.js `.env.local` does **not** configure PHP. Ownership tokens are public verification values, not API keys. Never put private credentials in `public/`, a `NEXT_PUBLIC_*` variable or this README.

## Source structure

```text
src/
  app/                Route entry points, metadata, sitemap and robots
  components/         UI grouped by page and responsibility
    forms/            Form fields and partnership enquiry UI
    layout/           Header, footer, logo and contact rail
    maps/             Globe, map and generated geographic data
    seo/              Server-rendered structured data
  content/            Editable company, products, page text and SEO copy
  hooks/              Shared interaction behavior
  lib/                Form submission, canonical URLs and metadata
  styles/             Ordered CSS sections; globals.css is the entry point
public/               Images, fonts, social image and send.php
scripts/              Build, export, preview, audit and asset generation
tests/                JavaScript regression tests
docs/                 Architecture, deployment, SEO, security and handoff
deploy/generated/     Build-specific host configuration (ignored)
out/                  Standard Next.js export (ignored)
dist/                 Host-ready export including .htaccess (ignored)
dist.zip              Deployable ZIP (ignored)
```

### Common maintenance tasks

| Change                                 | Source                                                        |
| -------------------------------------- | ------------------------------------------------------------- |
| Company identity and contact details   | `src/content/site.ts`                                         |
| Search titles and descriptions         | `src/content/seo.ts`                                          |
| Product records and publication status | `src/content/products.ts`                                     |
| Product photography                    | `src/content/product-media.ts`                                |
| Homepage cards and imagery             | `src/content/home.ts`                                         |
| Partner, industry and company text     | Corresponding module in `src/content/`                        |
| Layout and interactions                | Corresponding folder in `src/components/`                     |
| CSS                                    | Relevant file in `src/styles/`                                |
| Branded social image                   | `scripts/make-social-image.mjs`, then `npm run assets:social` |

Preserve the CSS import order: later sections intentionally override earlier rules. When adding a product, update its content, media and portfolio entries together and supply a concise SEO description. Published routes and sitemap entries are generated from the product collection. Do not invent prices, reviews, certifications, ratings or availability. See [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Commands

| Command                                             | Purpose                                                                |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                                       | Start development server.                                              |
| `npm run check`                                     | Lint, TypeScript, JavaScript tests and formatting checks.              |
| `npm run test:php`                                  | Test PHP validation and transport failures with real mail disabled.    |
| `npm run build`                                     | Standard Next.js static export to `out/`.                              |
| `npm run dist`                                      | Build, prepare host paths/config, package and validate the export.     |
| `npm run preview` / `npm start`                     | Serve `dist/` at localhost:4319 without PHP.                           |
| `npm run smoke`                                     | Optional headless Chrome/Edge hydration check; stop the preview first. |
| `npm run verify -- https://www.erkdynamics.com`     | Verify deployed pages and referenced assets.                           |
| `npm run audit:site -- https://www.erkdynamics.com` | Read-only live SEO, redirect, crawler-file and header audit.           |
| `npm audit`                                         | Check all dependencies against current advisories.                     |
| `npm run format`                                    | Apply formatting.                                                      |
| `npm run assets:social`                             | Regenerate branded share image.                                        |
| `npm run assets:map`                                | Regenerate SVG geographic data.                                        |
| `npm run assets:thumbnails`                         | Regenerate homepage product thumbnails.                                |

## Validate before handoff or deployment

```sh
npm ci
npm run check
npm run test:php
npm audit
npm run dist
npm run preview
```

CI runs source checks, PHP checks and the production export. A local pass does not mean a GitHub Actions run occurred. The export verifier checks route metadata, canonical consistency, JSON-LD, social images, sitemap coverage and local assets. Browser checks should cover desktop/phone navigation, product and industry switching, forms and globe rendering.

## Deploy and verify

1. Confirm the production origin, company details and content; run the checks above.
2. Review `.htaccess` and `deploy/generated/` for the actual host. Generated files do not prove the live server is configured.
3. Back up the existing site. Upload **the contents of `dist.zip`** into the public web root. Include `.htaccess` on Apache and make sure the uploader shows hidden files.
4. On Nginx, install the generated security-header include and configure canonical redirects, HTTPS, real 404 responses and PHP execution in the existing virtual host. Nginx ignores `.htaccess`.
5. Configure PHP mail, permitted origins and host/edge request rate limits; test both forms and actual inbox arrival.
6. Purge stale Cloudflare HTML, robots and sitemap caches. Check edge rules that override origin headers or redirects.
7. Run the `verify` and `audit:site` commands against production, then complete the Search Console steps in [SEO.md](docs/SEO.md).

The package retains the existing host workaround: `_next` becomes `site-assets`, stylesheets receive content-hashed names, and route prefetch payloads are flattened. Do not rename those files manually. CSP hashes are tied to the exact packaged HTML; rebuild after any HTML change. Retest or disable Cloudflare transformations that rewrite HTML/JavaScript.

Do not deploy source code, `.git`, `.env`, `node_modules`, credentials or development logs. Give the client the source repository/package separately for maintenance. Full deployment, rollback and mail instructions are in [DEPLOYMENT.md](docs/DEPLOYMENT.md).

## SEO and security

Every published page has its own title, description, canonical, Open Graph/Twitter data and JSON-LD. The homepage identifies the business and website. Inner pages have breadcrumbs; product pages include actual product images and descriptions. The sitemap contains published routes only. The site is English-language and does not claim an unimplemented Turkish version through `hreflang`.

Search engines choose displayed snippets and rankings. After deploying, the owner must verify Search Console, submit the sitemap, and inspect indexing and canonical selection. Metadata does not guarantee an indexing date, image, logo, rich result or ranking. See the [SEO audit and launch procedure](docs/SEO.md).

The PHP handler restricts methods/content types, rejects cross-site browser requests, validates fields and email, limits payloads, rejects attachments, ignores honeypot spam and constructs mail headers on the server. Submissions are not stored. Success means the local mail transport accepted the message, not confirmed inbox arrival.

Generated response headers protect the site only when applied by the host/edge. TLS, rate limits, proxy trust, mail authentication, account access and backups remain deployment responsibilities. [SECURITY.md](docs/SECURITY.md) describes the review, fixed issues and remaining acceptance checks.

## Troubleshooting

| Symptom                                  | First checks                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Forms fail locally                       | Expected: Next.js and static preview do not execute PHP.                                                |
| Forms fail on the host                   | Check PHP logs, allowed origins, sender and mail transport. Keep diagnostics out of public responses.   |
| Broken styling/interactions after upload | Verify complete assets, MIME types, permissions, CSP errors and Cloudflare transformations.             |
| Redirect loop                            | Check Cloudflare Full (strict) TLS and trusted proxy handling.                                          |
| Old title or missing search pages        | Confirm the new build is live; inspect canonicals, robots and Search Console before requesting recrawl. |
| Incorrect social preview                 | Check the absolute image URL, deployment and platform cache/debugger.                                   |
| PHP CLI not found                        | Install PHP or set `PHP_BINARY`.                                                                        |
| Different dependencies across machines   | Use the supported Node version and `npm ci`; commit intentional lockfile updates.                       |

## Ownership and client handoff

The repository does not grant a new open-source license or establish rights to supplied photographs, partner logos, globe textures or Helvetica fonts. Confirm the client's usage and transfer permissions. Transfer domain, hosting, Cloudflare, GitHub, company inbox and search-console access through their account ownership processes; do not place passwords in documentation.

Record the accepted source revision, build/deployment dates, rollback location and responsible client contact. Include [HANDOFF.md](docs/HANDOFF.md) with the source and deployment packages.
