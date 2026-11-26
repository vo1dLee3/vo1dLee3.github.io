import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

// Official 仓耳今楷02-W04 from https://www.tsanger.cn/product/33
// (https://www.tsanger.cn/download/仓耳今楷02-W04.ttf). Personal non-commercial use.
const require = createRequire(import.meta.url);
const subsetFont = require('subset-font');
const fontkit = require('fontkit');

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'fonts/TsangerJinKai02-W04.ttf');
const outDir = path.join(root, 'src/generated/fonts');
const cssPath = path.join(root, 'src/generated/cjk.css');
const stampPath = path.join(root, 'src/generated/stamp');
const chunkSize = 180;
const stamp = `tsanger-w04:${fs.statSync(source).size}:${chunkSize}`;

if (fs.existsSync(stampPath) && fs.readFileSync(stampPath, 'utf8') === stamp && fs.existsSync(cssPath)) {
  console.log('TsangerJinKai02 subsets are up to date');
  process.exit(0);
}

const buf = fs.readFileSync(source);
const font = fontkit.create(buf);
const codepoints = font.characterSet.filter((cp) => cp > 0xff);
fs.rmSync(path.join(root, 'src/generated'), { recursive: true, force: true });
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

const rules = new Array(chunks.length);
let cursor = 0;
const workers = 4;

async function runChunk(index) {
  const points = chunks[index];
  const subset = await subsetFont(buf, String.fromCodePoint(...points), { targetFormat: 'woff2' });
  const file = `tsanger-${index}.woff2`;
  fs.writeFileSync(path.join(outDir, file), subset);
  return `@font-face {
  font-family: "TsangerJinKai02";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("./fonts/${file}") format("woff2");
  unicode-range: ${unicodeRange(points)};
}`;
}

while (cursor < chunks.length) {
  const batch = [];
  for (let n = 0; n < workers && cursor < chunks.length; n++, cursor++) {
    const index = cursor;
    batch.push(runChunk(index).then((rule) => {
      rules[index] = rule;
    }));
  }
  await Promise.all(batch);
  console.log(`subsets ${Math.min(cursor, chunks.length)}/${chunks.length}`);
}

const css = `/* 仓耳今楷02-W04, unicode-range woff2 subsets, font-display: swap. */\n\n${rules.join('\n\n')}\n`;
fs.writeFileSync(cssPath, css);
fs.writeFileSync(stampPath, stamp);
console.log(`wrote ${chunks.length} subsets`);
