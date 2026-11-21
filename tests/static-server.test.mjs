import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createStaticServer } from "../scripts/lib/static-server.mjs";

test("preview serves pages without exposing PHP source or delivering forms", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "erk-preview-"));
  const server = createStaticServer(dir);
  try {
    await writeFile(path.join(dir, "index.html"), "<h1>Preview</h1>");
    await writeFile(path.join(dir, "send.php"), "<?php echo 'private implementation';");
    await writeFile(path.join(dir, ".htaccess"), "private server configuration");
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    assert.match(await (await fetch(base)).text(), /Preview/);
    assert.equal((await fetch(`${base}/missing`)).status, 404);
    assert.equal((await fetch(`${base}/%ZZ`)).status, 400);
    assert.equal((await fetch(`${base}/.htaccess`)).status, 403);
    for (const method of ["GET", "POST"]) {
      const response = await fetch(`${base}/send.php`, { method });
      assert.equal(response.status, 501);
      assert.equal((await response.json()).ok, undefined);
    }
    assert.equal((await fetch(`${base}/..%5C..%5Csecret`)).status, 403);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(dir, { recursive: true, force: true });
  }
});
