import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

const dir = await mkdtemp(path.join(tmpdir(), "erk-php-tests-"));
const handler = path.resolve(import.meta.dirname, "../public/send.php").replaceAll("\\", "/");
const router = path.join(dir, "router.php");
await writeFile(
  router,
  `<?php function mail($to, $subject, $body, $headers) { return true; } require '${handler.replaceAll("'", "\\'")}';`,
);
const reservation = createServer();
await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
const port = reservation.address().port;
await new Promise((resolve) => reservation.close(resolve));
const child = spawn(
  process.env.PHP_BINARY || "php",
  ["-n", "-d", "disable_functions=mail", "-S", `127.0.0.1:${port}`, router],
  { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] },
);
let startupError;
child.on("error", (error) => {
  startupError = error;
});
child.stderr.resume();
const url = `http://127.0.0.1:${port}/send.php`;
const valid = {
  name: "Test",
  email: "test@example.com",
  company: "Example",
  country: "Türkiye",
  interest: "Request a quotation",
};
const cases = [
  { name: "JSON request accepted", body: JSON.stringify(valid), status: 200 },
  { name: "Malformed JSON rejected", body: "{", status: 400 },
  { name: "JSON list rejected", body: "[]", status: 400 },
  { name: "JSON null rejected", body: "null", status: 400 },
  {
    name: "Nested JSON value rejected",
    body: JSON.stringify({ ...valid, company: { name: "Example" } }),
    status: 422,
  },
  {
    name: "Oversized JSON rejected",
    body: JSON.stringify({ ...valid, message: "x".repeat(66000) }),
    status: 413,
  },
  {
    name: "Oversized chunked JSON rejected without Content-Length",
    body: JSON.stringify({ ...valid, message: "x".repeat(66000) }),
    chunked: true,
    status: 413,
  },
  {
    name: "Null browser origin rejected",
    body: JSON.stringify(valid),
    origin: "null",
    status: 403,
  },
  {
    name: "Form encoding accepted",
    body: new URLSearchParams(valid),
    contentType: "application/x-www-form-urlencoded",
    status: 200,
  },
];
try {
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    if (startupError) throw startupError;
    try {
      if ((await fetch(url)).status === 405) {
        ready = true;
        break;
      }
    } catch {
      /* Server is starting. */
    }
    await delay(50);
  }
  assert.ok(ready, "PHP test server did not start");
  for (const item of cases) {
    const headers = { "Content-Type": item.contentType || "application/json" };
    if (item.origin) headers.Origin = item.origin;
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: item.chunked
        ? (async function* () {
            yield item.body;
          })()
        : item.body,
      ...(item.chunked ? { duplex: "half" } : {}),
    });
    assert.equal(response.status, item.status, item.name);
    assert.match(response.headers.get("content-type"), /application\/json/);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
    assert.equal((await response.json()).ok, item.status === 200 ? true : undefined, item.name);
    console.log(`ok ${item.name}`);
  }
  console.log(`${cases.length} HTTP/PHP checks passed; real mail was disabled.`);
} finally {
  if (child.exitCode === null && !startupError) {
    const exited = once(child, "exit");
    child.kill();
    await exited;
  }
  await rm(dir, { recursive: true, force: true });
}
