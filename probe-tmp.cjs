const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  let target;
  for (let i = 0; i < 30; i++) {
    try {
      const list = await (await fetch('http://localhost:9333/json')).json();
      target = list.find((t) => t.type === 'page' && t.url.includes('3111'));
      if (target) break;
    } catch {}
    await wait(1000);
  }
  if (!target) { console.log('no target'); process.exit(1); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  const expr = `(() => {
    const svg = document.querySelector('.home-route-map');
    const box = svg.getBoundingClientRect();
    const cs = getComputedStyle(svg);
    const parent = svg.parentElement;
    const pbox = parent.getBoundingClientRect();
    return JSON.stringify({
      svg: {x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height)},
      css: {width: cs.width, height: cs.height, position: cs.position, top: cs.top, left: cs.left, zIndex: cs.zIndex},
      parent: {tag: parent.className, x: Math.round(pbox.x), y: Math.round(pbox.y), w: Math.round(pbox.width), h: Math.round(pbox.height), position: getComputedStyle(parent).position}
    }, null, 1);
  })()`;
  ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
  const res = await new Promise((r) => (ws.onmessage = (m) => r(JSON.parse(m.data))));
  console.log(res.result?.result?.value || JSON.stringify(res));
  ws.close();
  process.exit(0);
})();
