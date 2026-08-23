const sharp = require('sharp');
// The route arcs are the only strongly teal pixels inside the hero's right half; their
// bounding box pins down exactly where the map sits and how large it is drawn.
async function bbox(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1, n = 0;
  for (let y = 120; y < 760; y++) {
    for (let x = 520; x < 1380; x++) {
      const i = (y * info.width + x) * ch;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (b > r + 55 && g > r + 35 && r < 110 && b > 110) {
        n++;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  return { file: file.split('/').pop(), minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY, n };
}
(async () => { for (const f of process.argv.slice(2)) console.log(await bbox(f)); })();
