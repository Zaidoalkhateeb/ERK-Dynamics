// Wait until the dev server has actually rebuilt the stylesheet and it contains the
// expected token, so screenshots never race the recompile.
const token = process.argv[2];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const html = await (await fetch('http://localhost:3111/')).text();
      const href = (html.match(/href="([^"]+\.css[^"]*)"/) || [])[1];
      if (href) {
        const css = await (await fetch(new URL(href, 'http://localhost:3111/'))).text();
        if (css.includes(token)) { console.log('css ready:', token); process.exit(0); }
      }
    } catch {}
    await wait(1000);
  }
  console.log('TIMEOUT waiting for', token); process.exit(1);
})();
