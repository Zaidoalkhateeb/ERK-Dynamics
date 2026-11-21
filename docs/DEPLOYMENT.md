# Deployment and email configuration

## Build for the existing host

```sh
npm ci
npm run check
npm run test:php
npm run dist
```

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` before building when using a different canonical domain. This public value is embedded in the generated pages, sitemap, and robots file. It contains no credentials.

`out/` is the standard Next.js export. `dist/` is prepared for the existing hosting configuration, which previously rejected underscore-prefixed directories. Packaging renames `_next` to `site-assets`, rewrites references, flattens route prefetch payloads, and gives stylesheets content-hashed filenames.

`dist.zip` contains files at its archive root with Unix-readable permissions. Upload and extract it into the website's document root. Keep a copy of the previous deployment before replacing it. Do not upload the source repository, `node_modules`, `.git`, or `.env` files.

The host must serve route folders through `index.html`, return the exported 404 page for missing routes, and execute `.php` files. Check that JavaScript and CSS use the correct MIME types. Deploying on a static-only service requires a separate form backend.

## Mail handler

Both forms POST to `/send.php`. The handler validates required fields and email addresses, limits request sizes, ignores honeypot spam, and sends a plain-text email through PHP `mail()`.

| PHP environment variable | Default                                               |
| ------------------------ | ----------------------------------------------------- |
| `ERK_MAIL_TO`            | `info@erkdynamics.com`                                |
| `ERK_MAIL_FROM`          | `no-reply@erkdynamics.com`                            |
| `ERK_ALLOWED_ORIGINS`    | `https://www.erkdynamics.com,https://erkdynamics.com` |

Set these in the PHP/FastCGI hosting configuration, or change the documented defaults at the top of `public/send.php` and rebuild. Next.js `.env.local` does **not** configure PHP. Use a sender on a domain authorized by the host's mail system.

Configure PHP to log errors instead of displaying them in JSON responses. Configure mail transport and sender-domain authentication with the hosting provider. Apply request rate limits at the host or proxy; the honeypot alone does not stop all spam.

The endpoint does not upload attachments, create CRM records, send visitor confirmations, or store submissions in a database. A success response means that the local mail service accepted the message; it does not prove it arrived in the inbox.

## Verification

```sh
npm run preview
npm run smoke
npm run verify -- https://www.erkdynamics.com
```

Stop the preview server before running the smoke test locally; both use port 4319 by default. Set `CHROME_PATH` for an unusual browser installation. Set `PHP_BINARY` to the PHP executable path if it is not on PATH.

The preview server is bound to localhost and deliberately refuses PHP requests, so it cannot expose PHP source or send test messages. The PHP tests use a fake mail function and can run without a configured mail service.

After deployment, manually check the contact and partnership forms using agreed test details. Confirm the message arrives at the intended inbox and the reply-to address is correct. Check desktop and mobile navigation, product switching, category links, industry details, the globe, and a missing URL.

## HTTPS, canonical redirects and security headers

The build includes `.htaccess` in `dist.zip` and writes build-specific JSON/Nginx header configuration to `deploy/generated/`. Review these for the actual server before replacing existing rules. The Apache file requires Apache 2.4, permitted overrides, mod_rewrite and mod_headers. A Nginx front end may serve static files without reaching Apache, so check the public response rather than assuming the file is applied.

On the existing Nginx HTTPS virtual host, include the generated security-header configuration. Merge it with existing headers: a nested `location` containing its own `add_header` directives can override inherited headers. Keep the existing document root and PHP-FPM settings. Configure the HTTP and alternate-host server blocks to return a permanent 308 redirect to `https://www.erkdynamics.com$request_uri`. Serve real directories and files, and return HTTP 404 using the exported `/404.html` for missing routes. Block dotfiles, backups and source files, and disable directory listing. Do not copy a guessed PHP socket or replace the full virtual host from an example.

Use Cloudflare Full (strict) TLS. The Apache fallback uses X-Forwarded-Proto only to support a trusted proxy; restrict origin access and configure proxy trust correctly. Apply canonical redirects at Cloudflare if origin rules cannot cover both hostnames. Purge stale HTML, sitemap and robots caches after deployment. Remove any ten-year edge cache rule for robots.txt; its generated origin cache lifetime is one hour.

`PREVIEW_SECURITY=1` enables generated security headers in the Node preview. It tests CSP behavior but does not execute server configuration. Do not enable an untested CSP on a different build or on HTML rewritten by Cloudflare. Check the contact map, globe, product switching and browser console before accepting deployment.

Configure rate limits for `POST /send.php`, trusted client-IP handling and PHP request-size/time limits. The origin allowlist prevents browser cross-site form requests; it does not stop scripted bots. No real mail is sent by automated tests. Both contact and partner inbox-delivery tests remain mandatory.

After deploying, run `npm run audit:site -- https://www.erkdynamics.com` and follow [SEO.md](SEO.md) for Search Console setup. A local build cannot submit a sitemap or prove indexing.

## Updating dependencies

The lockfile records the tested dependency versions. Use `npm ci` for reproducible installation. Review framework upgrades separately, read the bundled Next.js documentation, and run the complete validation sequence after updating the lockfile.
