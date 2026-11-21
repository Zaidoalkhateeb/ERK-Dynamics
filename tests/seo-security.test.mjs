import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { canonicalOrigin, canonicalPath } from "../src/lib/site-url.ts";
import { serializeJsonLd } from "../src/lib/json-ld.ts";
import { securityHeaders, apacheRules } from "../scripts/lib/security-headers.mjs";

test("structured data preserves content without allowing script termination", () => {
  const data = {
    name: '</script><script>alert("unsafe")</script>',
    description: "Türkçe & English",
  };
  const serialized = serializeJsonLd(data);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), data);
});

test("canonical configuration rejects unsafe origins and ambiguous paths", () => {
  assert.equal(canonicalOrigin("https://www.erkdynamics.com/"), "https://www.erkdynamics.com");
  for (const input of [
    "http://example.com",
    "https://example.com/sub/",
    "https://user:pass@example.com",
    "https://example.com?x=1",
    "https://example.com:8443",
    "javascript:alert(1)",
  ])
    assert.throws(() => canonicalOrigin(input));
  assert.equal(canonicalPath("/contact"), "/contact/");
  assert.equal(canonicalPath("/"), "/");
  for (const input of ["//example.com", "/contact?x=1", "/contact#form", "relative"])
    assert.throws(() => canonicalPath(input));
});

test("CSP authorizes exact inline scripts and excludes arbitrary inline execution", () => {
  const script = 'self.__next_f.push([1,"test"]);';
  const hash = createHash("sha256").update(script).digest("base64");
  const headers = securityHeaders([`<script>${script}</script><script src="/app.js"></script>`]);
  const policy = headers["Content-Security-Policy"];
  assert.ok(policy.includes(`'sha256-${hash}'`));
  assert.doesNotMatch(policy.match(/script-src [^;]+/)[0], /unsafe-inline|unsafe-eval/);
  assert.match(policy, /frame-ancestors 'none'/);
  assert.match(policy, /form-action 'self'/);
  assert.match(apacheRules("https://www.erkdynamics.com", headers), /R=308/);
  assert.match(apacheRules("https://www.erkdynamics.com", headers), /Require all denied/);
  assert.ok(
    !securityHeaders([`<script>${script} </script>`])["Content-Security-Policy"].includes(
      `'sha256-${hash}'`,
    ),
  );
});
