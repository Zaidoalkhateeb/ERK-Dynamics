import { createHash } from "node:crypto";

/** Hash the exact final inline scripts after export rewrites. Rebuild after any HTML change. */
export function securityHeaders(pages) {
  const hashes = new Set();
  for (const html of pages) {
    for (const [, attributes, script] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!/\bsrc\s*=/i.test(attributes) && script.trim())
        hashes.add(`'sha256-${createHash("sha256").update(script).digest("base64")}'`);
    }
  }
  return {
    "Content-Security-Policy": [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      `script-src 'self' ${[...hashes].sort().join(" ")}`,
      "script-src-attr 'none'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src https://www.google.com https://maps.google.com",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join("; "),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Strict-Transport-Security": "max-age=31536000",
  };
}

export function apacheRules(origin, headers) {
  const hostname = new URL(origin).hostname.replaceAll(".", "\\.");
  return `# Generated for this build. See docs/DEPLOYMENT.md before installing.
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule (^|/)\\.(?!well-known(?:/|$)) - [F,L]
  RewriteCond %{HTTP_HOST} !^${hostname}$ [NC]
  RewriteRule ^ ${origin}%{REQUEST_URI} [R=308,L,NE]
  # Forwarded protocol is valid only behind a trusted proxy (Cloudflare Full/Strict).
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !^https$ [NC]
  RewriteRule ^ ${origin}%{REQUEST_URI} [R=308,L,NE]
</IfModule>
<FilesMatch "(?i)(^\\.|\\.(?:env|ini|log|sql|bak|map)$|^(?:package(?:-lock)?\\.json|README\\.md|AGENTS\\.md)$)">
  Require all denied
</FilesMatch>
<IfModule mod_headers.c>
${Object.entries(headers)
  .map(([name, value]) => `  Header always set ${name} "${value}"`)
  .join("\n")}
  <FilesMatch "^(?:robots\\.txt|sitemap\\.xml)$">
    Header set Cache-Control "public, max-age=3600, must-revalidate"
  </FilesMatch>
  <Files "send.php">
    Header always set X-Robots-Tag "noindex, nofollow"
    Header always set Cache-Control "no-store"
  </Files>
</IfModule>
`;
}
