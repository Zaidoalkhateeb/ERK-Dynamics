# ERK Dynamics

Production-oriented bilingual corporate and commerce-ready website for ERK Dynamics, built with Next.js App Router, React, and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use `npm run build` for production verification and `npm start` after building.

## Environment

Copy `.env.example` to `.env.local`. `NEXT_PUBLIC_SITE_URL` controls canonical and sitemap URLs. `FORM_WEBHOOK_URL` is server-only and receives validated form JSON. Without it, submissions use a development-safe server log fallback. Never expose CMS, email, or commerce secrets with a `NEXT_PUBLIC_` prefix.

## Content and CMS

Seed content lives in `content/site.ts` and `content/products.ts`. These typed structures are the local CMS adapter and can be replaced with Sanity, Contentful, or Strapi queries without changing page components. The portable field map is in `docs/CMS_MODEL.md`.

For production, create bilingual CMS documents with language and translation-reference fields, fetch published content in server components, map records to the `Product` type, keep drafts out of route generation, and configure authenticated preview queries.

## Add Product 03

Update the draft entry in `content/products.ts` (or its CMS record), supply approved copy and media, and change `status` from `draft` to `published`. Do not publish before approved assets, specifications, rights, and commercial wording are recorded.

## Quote, contact, and ecommerce modes

Each product has `ctaMode: quote | ecommerce | contact`. Quote and contact are implemented. Before using ecommerce, connect Shopify Storefront API, add a server-side cart adapter, inventory checks, tax and shipping presentation, checkout handoff, order confirmation, and approved legal policies. Never render an out-of-stock variant as purchasable.

## Turkish translations

Language state, persistence, document `lang`, selector, and dictionary are in `components/LanguageContext.tsx`. Navigation and the homepage demonstrate the architecture. In the CMS, store English and Turkish as linked documents and serve the selected language; do not publish machine translation without approval.

## Hero and product media

The motion-first experience uses provisional product photography retrieved from Auxivo’s official LiftSuit and OmniSuit product pages and optimized locally as WebP files in `public/media`. ERK must confirm reuse rights and approved partnership wording before launch. Replace any unapproved file without changing the motion components by retaining the existing filenames, or update the media maps in `components/HomePage.tsx` and `components/ProductExperience.tsx`.

## Motion

Motion uses transforms and opacity with a global `prefers-reduced-motion` fallback in `app/globals.css`. Remove the orbit animation or set animation to `none` to disable advanced motion. Native scrolling and ordinary product-switch buttons remain available.

## Forms

`/api/forms` validates required fields and email, includes a honeypot, and can forward server-side to `FORM_WEBHOOK_URL`. Before launch, connect the approved email/CRM service, add rate limiting and Turnstile/hCaptcha, verify delivery, and document retention. Form content is never sent to analytics.

## Analytics

UI events are dispatched as `erk:analytics` browser events. Attach a consent-aware listener only after `erk-consent` equals `all`. Never include personal or form data.

## Deployment

Deploy to Vercel or another Next.js-capable host. Configure environment values, run `npm run build`, verify form delivery, set the production domain, and retest canonical URLs, sitemap, robots, cookies, and errors.

See `docs/OUTSTANDING_CONTENT.md` for unavailable assets and approvals. Legal pages are draft frameworks and require qualified Turkish counsel.
