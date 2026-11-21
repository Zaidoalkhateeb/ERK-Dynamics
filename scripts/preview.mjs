import path from "node:path";
import { stat } from "node:fs/promises";
import { createStaticServer } from "./lib/static-server.mjs";

const root = path.resolve(import.meta.dirname, "..", process.argv[2] || "dist");
const port = Number(process.env.PORT || 4319);
if (!(await stat(root).catch(() => null))?.isDirectory())
  throw new Error("Build first with npm run dist.");
const server = createStaticServer(root);
server.listen(port, "127.0.0.1", () =>
  console.log(`Preview: http://127.0.0.1:${port} (PHP mail disabled)`),
);
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close());
