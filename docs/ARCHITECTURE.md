# Architecture and editing guide

## Structure

```text
src/
  app/                 Routes, page metadata, icons, sitemap, and robots
  components/
    about/             About page
    contact/           Contact page
    forms/             Enquiry fields and partnership form
    home/              Homepage
    industries/        Industry selector and mobile details
    layout/            Header, navigation, footer, and contact rail
    maps/              Globe, shared SVG artwork, and generated map coordinates
    partners/          Partner artwork and reveal effects
    products/          Portfolio and product detail pages
    ui/                Shared contact icons
  content/             Company details and editable content collections
  hooks/               Shared browser interaction hooks
  lib/                 Form validation/submission and metadata helpers
  styles/              Ordered global style sections
public/                Images, fonts, globe textures, and the PHP mail endpoint
scripts/               Asset generation, packaging, preview, and validation
tests/                 Form and preview-server regression tests
docs/                  Maintenance, deployment, and handoff instructions
```

Routes live in `src/app`; `@/` resolves to `src/`. Keep browser-only logic inside client components or hooks. The site remains a static export: it has no running Next.js server, server actions, database, CMS, or checkout.

## Where to edit

| Change                                            | Location                                                   |
| ------------------------------------------------- | ---------------------------------------------------------- |
| Phone, email, social links, canonical site origin | `src/content/site.ts`                                      |
| Navigation labels and technology links            | `src/content/navigation.ts`                                |
| Published product details                         | `src/content/products.ts`                                  |
| Product photography and portfolio descriptions    | `src/content/product-media.ts`, `src/content/portfolio.ts` |
| Homepage cards, statistics, and partners          | `src/content/home.ts`                                      |
| Partner directory                                 | `src/content/partners.ts`                                  |
| Industry descriptions                             | `src/content/industries.ts`                                |
| Contact dropdowns and country list                | `src/content/contact.ts`                                   |
| Page introductions and section markup             | The matching feature in `src/components/`                  |
| Email recipient and sender                        | PHP host environment; see deployment guide                 |

Content modules are deliberately plain TypeScript. Changes are reviewed in Git and require a fresh build. There is no administrative content editor.

## Adding a product

1. Add the approved details to `src/content/products.ts`, including its publication status.
2. Add its hero, story, and final-section images to `src/content/product-media.ts`. Keep one story image for each feature.
3. Add the portfolio presentation in `src/content/portfolio.ts` and homepage image in `src/content/home.ts`.
4. Update product navigation if a new product should appear in the menu.
5. Add source images under `public/media/`; extend `scripts/make-home-thumbs.mjs` for its card thumbnail.
6. Run the quality checks and build. Only published products receive detail routes and sitemap entries.

## Styling

`src/styles/globals.css` is the single style entry. Its imports preserve the original cascade order, including responsive refinements. Avoid alphabetizing those imports: that can change the design.

Feature files hold the main rules, while `hero-layout.css`, `page-refinements.css`, and `responsive-refinements.css` contain shared adjustments applied after the base rules. The production build merges the imports. All existing selectors and layout values were preserved during the structural split.

For new isolated components, use CSS Modules when practical. When changing an existing global rule, inspect later overrides and check both desktop and mobile layouts.

## Generated assets

`src/components/maps/worldMap.data.ts` is generated, not hand-edited. Its source is `scripts/make-world-map.mjs`; run `npm run assets:map` after changing the geographic data. The generator keeps geographic libraries out of the browser bundle.

Product thumbnails are generated with Sharp. Commit generated images when changing them. `out/`, `dist/`, and `dist.zip` are build products and are excluded from Git.

## Checks

Lint and strict TypeScript checks catch unused variables and source issues. Unit tests cover form validation, server acknowledgement, network failures, and preview-server restrictions. PHP tests replace `mail()` with a fake function so they cannot send messages. The export checker verifies local HTML/CSS references and canonical routes.

The browser smoke test checks page loading and hydration. It does not prove form inbox delivery, visual correctness at every viewport, or accessibility conformance; verify the relevant interaction when changing it.
