import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const subsetFont = require('subset-font');
const fontkit = require('fontkit');

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(
  root,
  'node_modules/@fontsource/lxgw-wenkai/files/lxgw-wenkai-latin-500-normal.woff2',
);
const outDir = path.join(root, 'src/generated/fonts');
const cssPath = path.join(root, 'src/generated/wenkai.css');
const stampPath = path.join(root, 'src/generated/stamp');
const chunkSize = 180;
const stamp = `${fs.statSync(source).size}:${chunkSize}`;

if (fs.existsSync(stampPath) && fs.readFileSync(stampPath, 'utf8') === stamp && fs.existsSync(cssPath)) {
  console.log('LXGW WenKai subsets are up to date');
  process.exit(0);
}

const buf = fs.readFileSync(source);
const font = fontkit.create(buf);
const codepoints = font.characterSet.filter((cp) => cp > 0xff);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

function unicodeRange(points) {
  const parts = [];
  let start = points[0];
  let prev = points[0];
  for (let i = 1; i <= points.length; i++) {
    const cp = points[i];
    if (cp === prev + 1) {
      prev = cp;
      continue;
    }
    parts.push(start === prev ? `U+${start.toString(16)}` : `U+${start.toString(16)}-${prev.toString(16)}`);
    start = prev = cp;
  }
  return parts.join(',');
}

const chunks = [];
for (let i = 0; i < codepoints.length; i += chunkSize) chunks.push(codepoints.slice(i, i + chunkSize));

const css = ['/* LXGW WenKai regular, unicode-range subsets, font-display: swap. */'];
let cursor = 0;
const workers = 4;

async function runChunk(index) {
  const points = chunks[index];
  const subset = await subsetFont(buf, String.fromCodePoint(...points), { targetFormat: 'woff2' });
  const file = `wenkai-${index}.woff2`;
  fs.writeFileSync(path.join(outDir, file), subset);
  return `@font-face {
  font-family: "LXGW WenKai";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("./fonts/${file}") format("woff2");
  unicode-range: ${unicodeRange(points)};
}`;
}

const rules = new Array(chunks.length);
while (cursor < chunks.length) {
  const batch = [];
  for (let n = 0; n < workers && cursor < chunks.length; n++, cursor++) {
    const index = cursor;
    batch.push(runChunk(index).then((rule) => { rules[index] = rule; }));
  }
  await Promise.all(batch);
  console.log(`subsets ${Math.min(cursor, chunks.length)}/${chunks.length}`);
}

fs.writeFileSync(cssPath, `${css.concat(rules).join('\n\n')}\n`);
fs.writeFileSync(stampPath, stamp);
console.log(`wrote ${chunks.length} subsets`);
