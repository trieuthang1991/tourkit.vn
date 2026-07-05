// Downloads all homepage assets from tourkit.vn into public/images
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'images');
mkdirSync(OUT, { recursive: true });

const dump = JSON.parse(readFileSync(join(process.cwd(), 'docs/research/home-content-dump.json'), 'utf8'));

const urls = new Set();
for (const s of dump.sections) {
  (s.images || []).forEach(im => im.src && urls.add(im.src));
  (s.bgImages || []).forEach(b => b && urls.add(b));
  if (s.bgImg) { const m = s.bgImg.match(/url\(["']?([^"')]+)/); if (m) urls.add(m[1]); }
}
// extra known assets (favicon, patterns) already covered by dump

const list = [...urls].filter(u => /^https?:\/\//.test(u) && !u.endsWith('.pdf'));
console.log('Total assets to download:', list.length);

// map url -> local filename (flatten, keep basename, dedupe collisions by hashing path)
function localName(u) {
  const url = new URL(u);
  let base = decodeURIComponent(url.pathname.split('/').pop()) || 'file';
  base = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  return base;
}

const seen = new Map();
const manifest = {};
let ok = 0, fail = 0;

async function dl(u) {
  let name = localName(u);
  // handle name collisions
  if (seen.has(name) && seen.get(name) !== u) {
    const p = new URL(u).pathname.split('/').slice(-2, -1)[0] || 'x';
    name = p + '_' + name;
  }
  seen.set(name, u);
  const dest = join(OUT, name);
  manifest[u] = '/images/' + name;
  if (existsSync(dest)) { ok++; return; }
  try {
    const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://tourkit.vn/' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    ok++;
    process.stdout.write('.');
  } catch (e) {
    fail++;
    console.log('\nFAIL', u, e.message);
  }
}

// batched (5 at a time)
for (let i = 0; i < list.length; i += 5) {
  await Promise.all(list.slice(i, i + 5).map(dl));
}
writeFileSync(join(process.cwd(), 'docs/research/asset-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\nDone. ok=${ok} fail=${fail}. Manifest: docs/research/asset-manifest.json`);
