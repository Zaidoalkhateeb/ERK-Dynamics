import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
};

/** Local preview only. Never expose PHP source or accept form submissions. */
export function createStaticServer(directory, { headers = {} } = {}) {
  const root = path.resolve(directory);
  return createServer(async (req, res) => {
    try {
      for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
      const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      const filePath = path.resolve(root, "." + pathname);
      if (
        (filePath !== root && !filePath.startsWith(root + path.sep)) ||
        pathname.split("/").some((part) => part.startsWith("."))
      ) {
        res.writeHead(403).end("Forbidden");
        return;
      }
      if (
        !["GET", "HEAD"].includes(req.method) ||
        path.extname(filePath).toLowerCase() === ".php"
      ) {
        res
          .writeHead(501, { "Content-Type": "application/json" })
          .end(JSON.stringify({ error: "PHP mail is available only on the PHP host." }));
        return;
      }
      let file = filePath;
      let info = await stat(file);
      if (info.isDirectory()) {
        file = path.join(file, "index.html");
        info = await stat(file);
      }
      if (!info.isFile()) throw new Error("Not a file");
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
        "Content-Length": info.size,
      });
      if (req.method === "HEAD") res.end();
      else
        createReadStream(file)
          .on("error", () => res.destroy())
          .pipe(res);
    } catch (error) {
      if (!res.headersSent) res.writeHead(error instanceof URIError ? 400 : 404);
      res.end("Not found");
    }
  });
}
