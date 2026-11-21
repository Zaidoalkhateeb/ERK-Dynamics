import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

const binary = process.env.PHP_BINARY || "php";
const handler = path.resolve(import.meta.dirname, "../public/send.php").replaceAll("\\", "/");
const valid = {
  name: "Client",
  email: "client@example.com",
  company: "Example",
  country: "Türkiye",
  interest: "Request a quotation",
};
const cases = [
  { name: "GET is rejected", method: "GET", data: {}, status: 405 },
  { name: "Missing fields", data: {}, status: 422 },
  { name: "Invalid email", data: { ...valid, email: "bad" }, status: 422 },
  {
    name: "Header injection",
    data: { ...valid, email: "client@example.com\r\nBcc: stranger@example.com" },
    status: 422,
  },
  { name: "Nested field", data: { ...valid, name: ["unexpected"] }, status: 422 },
  { name: "Boolean field", data: { ...valid, company: true }, status: 422 },
  { name: "Null field", data: { ...valid, company: null }, status: 422 },
  {
    name: "Cross-site form rejected",
    data: valid,
    origin: "https://attacker.example",
    status: 403,
  },
  {
    name: "Origin suffix attack rejected",
    data: valid,
    origin: "https://www.erkdynamics.com.attacker.example",
    status: 403,
  },
  { name: "Fetch metadata rejected", data: valid, fetchSite: "cross-site", status: 403 },
  { name: "Unsupported body rejected", data: valid, contentType: "text/plain", status: 415 },
  { name: "File upload rejected", data: valid, files: true, status: 422 },
  { name: "Oversized message", data: { ...valid, message: "x".repeat(10001) }, status: 422 },
  { name: "Oversized body", data: valid, length: 65537, status: 413 },
  { name: "Honeypot", data: { website: "bot" }, status: 200, ok: true },
  { name: "Contact accepted by mail service", data: valid, status: 200, mail: true, ok: true },
  {
    name: "Partnership requires region and organization",
    data: { ...valid, type: "partner" },
    status: 422,
  },
  {
    name: "Partner accepted by mail service",
    data: { ...valid, type: "partner", region: "Türkiye", organizationType: "Distributor" },
    status: 200,
    mail: true,
    ok: true,
  },
  { name: "Mail failure is reported", data: valid, status: 500, mail: false },
  {
    name: "Trusted origin accepted",
    data: valid,
    origin: "https://www.erkdynamics.com",
    status: 200,
    mail: true,
    ok: true,
  },
  { name: "Missing mail transport is handled", data: valid, status: 500, throws: true },
];
for (const item of cases) {
  const encoded = Buffer.from(JSON.stringify(item.data)).toString("base64");
  // Disable the real mail() function: these tests must never contact an inbox.
  const fakeMail = item.throws
    ? 'throw new RuntimeException("Mail transport unavailable");'
    : item.mail === undefined
      ? 'throw new RuntimeException("Unexpected mail call");'
      : `return ${item.mail ? "true" : "false"};`;
  const code = `function mail($to, $subject, $body, $headers) { ${fakeMail} }
    $_SERVER['REQUEST_METHOD'] = '${item.method || "POST"}';
    $_SERVER['CONTENT_LENGTH'] = ${item.length || 0};
    $_SERVER['HTTP_ORIGIN'] = '${item.origin || ""}';
    $_SERVER['HTTP_SEC_FETCH_SITE'] = '${item.fetchSite || "same-origin"}';
    $_SERVER['CONTENT_TYPE'] = '${item.contentType || "application/x-www-form-urlencoded"}';
    $_FILES = ${item.files ? "['attachment' => ['name' => 'test.txt']]" : "[]"};
    $_POST = json_decode(base64_decode('${encoded}'), true);
    register_shutdown_function(function () { fwrite(STDERR, (string) http_response_code()); });
    require '${handler}';`;
  const result = spawnSync(binary, ["-n", "-d", "disable_functions=mail", "-r", code], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.error)
    throw new Error(
      `PHP CLI is required. Install PHP 8.1+ or set PHP_BINARY. ${result.error.message}`,
    );
  assert.equal(result.status, 0, `${item.name}: ${result.stdout} ${result.stderr}`);
  assert.ok(result.stderr.trim().endsWith(String(item.status)), item.name);
  assert.equal(JSON.parse(result.stdout).ok, item.ok, item.name);
  console.log(`ok ${item.name}`);
}
console.log(`${cases.length} PHP handler checks passed; no email was sent.`);
