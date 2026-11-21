# Security review and operational requirements

Review date: **21 November 2026**. Scope: source code, dependencies, the PHP mail endpoint, exported assets, generated host policy and read-only public HTTP responses. No live form messages were sent. This is a code/deployment review, not a penetration-test certification or a guarantee that the host and accounts are secure.

## Findings and status

| Area                        | Evidence and change                                                                                                         | Status                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Dependencies                | Full `npm audit`, including development dependencies, reported zero known vulnerabilities with the current lockfile         | Passed at review time; repeat before deployment                                                  |
| Public HTTP                 | All HTTP/HTTPS and www/non-www homepage variants returned 200 without canonical redirects                                   | Redirect rules generated; live installation remains required                                     |
| Response headers            | Inspected live pages lacked CSP, HSTS, nosniff, frame restrictions and referrer policy                                      | Build-specific policies generated; host/edge must apply them                                     |
| Form input                  | Required fields, email/header controls, scalar strings, maximum sizes and supported content types are validated             | Implemented and regression-tested                                                                |
| Browser cross-site requests | Untrusted Origin values and cross-site Fetch Metadata are rejected against configured origins                               | Implemented; not authentication or complete bot protection                                       |
| Mail transport failures     | Exceptions and warnings could corrupt the JSON response or expose diagnostics                                               | Failures return a generic JSON error; diagnostics remain server-side                             |
| HTML/JSON-LD injection      | Editorial structured data must not terminate its script element                                                             | Less-than signs are escaped before serialization                                                 |
| Public artifacts            | Sources, credentials and development dependencies must not be exposed                                                       | Separate source/deployment packages, environment ignores and generated file restrictions         |
| Static preview              | PHP and hidden configuration files must not be served as source                                                             | Requests are refused; preview binds only to localhost                                            |
| Secrets                     | Pattern scan found no matching private-key, GitHub-token, AWS-access-key or Stripe-live-key signatures in maintained source | Limited pattern scan; does not prove all possible secrets absent or inspect all historic commits |
| Abuse/rate limits           | Anonymous forms can be targeted by direct scripted requests; origin headers can be forged outside browsers                  | Host/edge rate limiting still required                                                           |

## Generated security policy

`npm run dist` hashes the exact inline scripts in the final rewritten HTML and generates:

- `dist/.htaccess`: Apache HTTPS/canonical redirects, 404 handling, file restrictions, security headers and crawler-file caching.
- `deploy/generated/security-headers.json`: the generated header values, also used for local security preview.
- `deploy/generated/security-headers.nginx.conf`: an include for the existing Nginx HTTPS server block.

The CSP permits same-origin scripts plus only the hashes of the generated inline scripts. It does not permit arbitrary inline JavaScript or `unsafe-eval`. Inline styles remain allowed because the existing animation and rendering components use dynamic style attributes. Images can use local/data/blob sources; frames are restricted to the Google Maps origins used by the contact page. Workers can use same-origin/blob sources for rendering libraries. Object embedding and framing of the site are denied; forms and base URLs are restricted to the same origin.

HSTS is limited to the current host; it does not enroll other subdomains or request preload. TLS must work on each public host before applying HSTS. Header changes must be checked on actual responses because Nginx and Cloudflare can override or bypass Apache configuration.

Security hashes are build-specific. Do not edit exported HTML by hand, mix two builds, or enable edge transformations that rewrite inline scripts without rebuilding/retesting. Cloudflare Rocket Loader, injected third-party scripts and HTML rewriting may require a deliberate policy update. Do not broadly add `unsafe-inline`, `unsafe-eval` or `*` to hide errors.

## Host and account acceptance requirements

1. Use valid HTTPS and Cloudflare Full (strict), with canonical redirects enforced at the edge or origin. Verify no HTTP form flow remains.
2. Restrict direct origin access where appropriate. Trust forwarded client/protocol headers only from the actual reverse proxy. A request header supplied directly by an arbitrary client is not a trusted proxy signal.
3. Rate-limit `POST /send.php` at the edge/proxy. Start with a modest per-client threshold suited to genuine enquiry traffic, monitor false positives, and apply a challenge or temporary block for abuse. Use the proxy's correctly restored client IP, not arbitrary X-Forwarded-For values. No application rate limiter or CAPTCHA is claimed by this source.
4. Set small request/body and execution limits for `/send.php`; 64 KiB requests and no uploads match the handler. Keep PHP patched; use `display_errors=Off` and controlled error logs.
5. Configure a valid mail sender/recipient and the domain's mail transport/authentication. Restrict mailbox access. Validate actual inbox arrival and reply-to behavior.
6. Deploy only the `dist/` files. Prevent directory listing and access to dotfiles, backups, source maps, secrets and source repositories. On Nginx, reproduce the file restrictions explicitly; `.htaccess` is ignored.
7. Enable MFA and client ownership for domain, GitHub, hosting, Cloudflare and search-console accounts. Keep credentials outside code and use the provider's normal transfer process.
8. Retain tested backups and a rollback procedure. Re-run dependency audits and application checks when packages or infrastructure change.

## Testing

Run `npm run check`, `npm run test:php`, `npm audit`, and `npm run dist`. PHP tests disable the real `mail()` function. Use `PREVIEW_SECURITY=1 npm run preview` on POSIX shells, or `$env:PREVIEW_SECURITY='1'; npm run preview` in PowerShell, to test the generated CSP locally. HTTPS upgrade/HSTS settings are omitted from localhost preview; all script hashes and resource restrictions remain active.

After deployment, run `npm run audit:site -- https://www.erkdynamics.com` and inspect browser console errors while testing navigation, products, the globe and both forms. The Node preview does not execute Apache or Nginx configuration, so verify those rules on the real host or equivalent staging host.

Report suspected issues privately to the project owner through the agreed support channel. Include the affected URL/source revision and reproduction steps, but never email live secrets or real customer submissions in a public issue.

Reference: [OWASP HTTP Security Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).
