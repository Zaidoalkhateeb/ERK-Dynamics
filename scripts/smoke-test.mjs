// Loads every page of the built site in a real browser and fails on anything broken.
//
// `npm run verify` checks that files are reachable on the host; this checks that the
// pages actually work — that React hydrates (without it every button, tab and scroll
// animation is dead while the page still looks fine), that nothing 404s, and that no
// script throws. Run it on `dist/` before publishing and on the live URL after.
//
//   npm run smoke                          # serves dist/ locally and tests it
//   npm run smoke https://www.erkdynamics.com
//
// Needs Chrome or Edge; set CHROME_PATH if it lives somewhere unusual.

import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { mkdtemp, readdir, rm, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";

const dist = path.join(path.resolve(import.meta.dirname, ".."), "dist");
const target = process.argv[2]?.replace(/\/$/, "");
const PORT = 4319;
const DEVTOOLS = 9333;

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2", ".ttf": "font/ttf", ".txt": "text/plain",
  ".xml": "application/xml", ".ico": "image/x-icon",
};

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

async function routesFromDist(dir, prefix = "") {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "index.html") found.push(prefix + "/");
    // `__next.*` holds prefetch payloads, `404` is not a real route.
    else if (entry.isDirectory() && !entry.name.startsWith("__next.") && !entry.name.startsWith("404")) {
      found.push(...await routesFromDist(path.join(dir, entry.name), `${prefix}/${entry.name}`));
    }
  }
  return found;
}

if (!(await stat(dist).catch(() => null))) throw new Error("dist/ is missing — run `npm run dist` first.");
const routes = (await routesFromDist(dist)).sort();

// Serve dist/ ourselves unless we were pointed at a deployed URL.
let server;
const base = target || `http://127.0.0.1:${PORT}`;
if (!target) {
  server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(dist, url);
    if (url.endsWith("/")) file = path.join(file, "index.html");
    stat(file).then(
      (info) => {
        if (info.isDirectory()) file = path.join(file, "index.html");
        res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
        createReadStream(file).pipe(res);
      },
      () => { res.writeHead(404); res.end("not found"); },
    );
  });
  await new Promise((done) => server.listen(PORT, done));
}

let chromePath;
for (const candidate of CHROME_CANDIDATES) {
  if (await stat(candidate).catch(() => null)) { chromePath = candidate; break; }
}
if (!chromePath) throw new Error(`No browser found. Set CHROME_PATH. Tried:\n  ${CHROME_CANDIDATES.join("\n  ")}`);

const profile = await mkdtemp(path.join(tmpdir(), "erk-smoke-"));
const chrome = spawn(chromePath, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  `--remote-debugging-port=${DEVTOOLS}`, `--user-data-dir=${profile}`, "--window-size=1600,1000", "about:blank",
], { stdio: "ignore" });

const shutDown = async () => {
  chrome.kill("SIGKILL");
  server?.close();
  await rm(profile, { recursive: true, force: true }).catch(() => {});
};

// The debugging port takes a moment to accept connections.
let tab;
for (let attempt = 0; attempt < 40 && !tab; attempt++) {
  await new Promise((r) => setTimeout(r, 250));
  tab = await fetch(`http://127.0.0.1:${DEVTOOLS}/json/new?about:blank`, { method: "PUT" }).then((r) => r.json()).catch(() => null);
}
if (!tab) { await shutDown(); throw new Error("Browser never opened its debugging port."); }

const ws = new WebSocket(tab.webSocketDebuggerUrl);
let messageId = 0;
const pending = new Map();
let broken = [];

ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
    return;
  }
  const { method, params } = message;
  if (method === "Runtime.exceptionThrown") {
    broken.push("threw: " + String(params.exceptionDetails.exception?.description || params.exceptionDetails.text).split("\n")[0]);
  } else if (method === "Runtime.consoleAPICalled" && params.type === "error") {
    broken.push("console.error: " + params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 160));
  } else if (method === "Network.responseReceived" && params.response.status >= 400) {
    if (!params.response.url.includes("favicon")) broken.push(`${params.response.status} ${params.response.url.replace(base, "")}`);
  } else if (method === "Network.loadingFailed" && params.type === "Script") {
    broken.push("script failed to load: " + params.errorText);
  }
});

await new Promise((r) => ws.addEventListener("open", r));
const send = (method, params = {}) =>
  new Promise((res) => { const id = ++messageId; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })); });

await send("Runtime.enable");
await send("Page.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });

console.log(`Testing ${routes.length} pages on ${base}\n`);
const failures = [];

for (const route of routes) {
  broken = [];
  await send("Page.navigate", { url: base + route });
  await new Promise((r) => setTimeout(r, 3500));

  // React only attaches its internal keys to real DOM nodes once hydration has run.
  const evaluate = await send("Runtime.evaluate", {
    expression: `(() => { const node = document.querySelector('main a, main button, header a, nav a');
      return !!node && !!Object.keys(node).some(k => k.startsWith('__react')); })()`,
    returnByValue: true,
  });
  const hydrated = evaluate.result?.result?.value === true;
  if (!hydrated) broken.unshift("did not hydrate — interactive elements will not respond");

  if (broken.length) failures.push({ route, broken: [...broken] });
  console.log(`${broken.length ? "FAIL" : "ok  "}  ${route}${broken.length ? "\n        " + broken.join("\n        ") : ""}`);
}

await shutDown();

if (!failures.length) {
  console.log(`\nAll ${routes.length} pages loaded and hydrated cleanly.`);
  process.exit(0);
}
console.error(`\n${failures.length} of ${routes.length} pages have problems.`);
process.exit(1);
