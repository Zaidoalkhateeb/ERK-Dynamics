# ERK Dynamics

Corporate website for ERK Dynamics, built with Next.js, React, and TypeScript. It exports static pages for the existing Apache/PHP hosting setup. The contact and partnership forms submit to `public/send.php`.

## Requirements

- Node.js 24 or newer and npm.
- PHP 8.1 or newer for the mail endpoint and its tests. Use a supported PHP release on the host.
- Chrome or Edge for the optional browser smoke test.

## Start locally

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On Windows, use `Copy-Item .env.example .env.local` instead of `cp`. Open [localhost:3000](http://localhost:3000).

Next.js development mode does not execute PHP. Use the deployed PHP environment to test real mail delivery. The form will show an error if its endpoint cannot confirm acceptance; local previews never send email.

## Validate and build

```sh
npm run check
npm run test:php
npm run dist
npm run preview
```

`npm run check` runs lint, TypeScript, unit tests, and formatting checks. `npm run dist` builds the site, prepares the existing host's asset paths, checks local links and canonical URLs, and produces `dist/` and `dist.zip`. Preview is at [localhost:4319](http://localhost:4319).

| Command                                         | Purpose                                                         |
| ----------------------------------------------- | --------------------------------------------------------------- |
| `npm run dev`                                   | Development server with live updates                            |
| `npm run build`                                 | Standard Next.js static export to `out/`                        |
| `npm run dist`                                  | Deployable export and ZIP for the existing host                 |
| `npm run preview`                               | Serve `dist/` locally; PHP is deliberately disabled             |
| `npm run check`                                 | Run source quality checks and unit tests                        |
| `npm run test:php`                              | Validate the PHP handler using a fake mail function             |
| `npm run smoke`                                 | Load exported pages in headless Chrome/Edge and check hydration |
| `npm run verify -- https://www.erkdynamics.com` | Check deployed pages and referenced assets                      |
| `npm run format`                                | Apply the shared formatter                                      |
| `npm run assets:map`                            | Regenerate the SVG map data                                     |
| `npm run assets:thumbnails`                     | Regenerate homepage product thumbnails                          |

## Project guide

- [Architecture and editing guide](docs/ARCHITECTURE.md)
- [Deployment and email configuration](docs/DEPLOYMENT.md)
- [Client handoff checklist](docs/HANDOFF.md)

The source package and the deployable ZIP serve different purposes. Give the client the source repository for maintenance; upload only the contents of `dist/` to the web root.
