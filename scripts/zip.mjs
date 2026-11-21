// Minimal ZIP writer, used instead of PowerShell's Compress-Archive.
//
// Compress-Archive emits an explicit entry for any directory that holds no direct
// files, and stamps it with external attributes of 0. Unpacked on the Linux host that
// becomes a directory with mode 000, so the web server cannot read anything beneath it
// and answers 403 — which is what kept taking the site's JavaScript offline. It also
// writes backslashes as path separators, which the ZIP spec does not allow.
//
// This writes files only. Directories are created implicitly by the extractor, which
// gives them its normal 755, exactly like the folders that always worked.

import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { deflateRawSync } from "node:zlib";

const CRC_TABLE = Int32Array.from({ length: 256 }, (_, i) => {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buffer) {
  let crc = -1;
  for (let i = 0; i < buffer.length; i++) crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

const FILE_MODE = (0o100644 << 16) >>> 0; // regular file, rw-r--r--
const UTF8_FLAG = 0x0800;
const MADE_BY_UNIX = (3 << 8) | 20; // so the host honours the mode above
const DOS_DATE = 0x21; // 1980-01-01; content hashes handle freshness

/**
 * @param {{ name: string, path: string }[]} files  `name` uses forward slashes.
 * @param {string} destination
 */
export async function writeZip(files, destination) {
  const out = createWriteStream(destination);
  const write = (chunk) =>
    new Promise((resolve, reject) => {
      out.write(chunk, (error) => (error ? reject(error) : resolve()));
    });

  const directory = [];
  let offset = 0;

  for (const file of files) {
    const contents = await readFile(file.path);
    const deflated = deflateRawSync(contents, { level: 9 });
    // Storing beats deflating for data that is already compressed (JPEG, PNG, woff2).
    const stored = deflated.length >= contents.length;
    const body = stored ? contents : deflated;
    const name = Buffer.from(file.name, "utf8");

    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(UTF8_FLAG, 6);
    header.writeUInt16LE(stored ? 0 : 8, 8);
    header.writeUInt16LE(0, 10);
    header.writeUInt16LE(DOS_DATE, 12);
    header.writeUInt32LE(crc32(contents), 14);
    header.writeUInt32LE(body.length, 18);
    header.writeUInt32LE(contents.length, 22);
    header.writeUInt16LE(name.length, 26);
    header.writeUInt16LE(0, 28);

    await write(header);
    await write(name);
    await write(body);

    directory.push({
      name,
      offset,
      method: stored ? 0 : 8,
      crc: crc32(contents),
      compressed: body.length,
      size: contents.length,
    });
    offset += header.length + name.length + body.length;
  }

  const directoryStart = offset;
  for (const entry of directory) {
    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50, 0);
    header.writeUInt16LE(MADE_BY_UNIX, 4);
    header.writeUInt16LE(20, 6);
    header.writeUInt16LE(UTF8_FLAG, 8);
    header.writeUInt16LE(entry.method, 10);
    header.writeUInt16LE(0, 12);
    header.writeUInt16LE(DOS_DATE, 14);
    header.writeUInt32LE(entry.crc, 16);
    header.writeUInt32LE(entry.compressed, 20);
    header.writeUInt32LE(entry.size, 24);
    header.writeUInt16LE(entry.name.length, 28);
    header.writeUInt32LE(FILE_MODE, 38);
    header.writeUInt32LE(entry.offset, 42);

    await write(header);
    await write(entry.name);
    offset += header.length + entry.name.length;
  }

  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(directory.length, 8);
  end.writeUInt16LE(directory.length, 10);
  end.writeUInt32LE(offset - directoryStart, 12);
  end.writeUInt32LE(directoryStart, 16);
  await write(end);

  await new Promise((resolve, reject) => out.end((error) => (error ? reject(error) : resolve())));
  return directory.length;
}
