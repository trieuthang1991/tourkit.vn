// Assemble a self-contained production bundle in ./dist from the Next.js
// standalone build. Next does NOT copy public/, .next/static or the runtime
// content/ folder into the standalone output, so we do it here.
//
// Usage:
//   npm run bundle           # build + assemble ./dist
//   npm run bundle -- --no-build   # assemble from an existing build
//
// Deploy: copy the whole ./dist folder to the server, then run:
//   node server.js           (listens on PORT, default 3000)

import { execSync } from "node:child_process";
import { existsSync, rmSync, mkdirSync, cpSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const standalone = join(root, ".next", "standalone");
const skipBuild = process.argv.includes("--no-build");

function log(msg) {
  console.log(`\x1b[36m▸\x1b[0m ${msg}`);
}

function copy(from, to, label) {
  const src = join(root, from);
  if (!existsSync(src)) {
    console.warn(`\x1b[33m! skipped ${label}: ${from} not found\x1b[0m`);
    return;
  }
  cpSync(src, join(dist, to), { recursive: true });
  log(`copied ${label}`);
}

// 1. Build (standalone) unless skipped
if (!skipBuild) {
  log("building (next build)…");
  execSync("npm run build", { cwd: root, stdio: "inherit" });
}

if (!existsSync(join(standalone, "server.js"))) {
  console.error(
    '\x1b[31m✗ .next/standalone/server.js not found.\x1b[0m\n' +
      '  Make sure next.config.ts has  output: "standalone"  and run a build first.'
  );
  process.exit(1);
}

// 2. Fresh dist/
log("clearing ./dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// 3. Standalone server + traced node_modules
copy(".next/standalone", ".", "standalone server");

// 4. Static assets + public/ + runtime content (not included by standalone)
copy(".next/static", ".next/static", "static assets");
copy("public", "public", "public/ assets");
copy("content", "content", "content/ (editable JSON)");

// 4b. IIS config (HttpPlatformHandler) at the bundle root
copy("deploy/web.config", "web.config", "web.config (IIS/HttpPlatformHandler)");

// 5. Convenience start scripts on the server
writeFileSync(
  join(dist, "start.cmd"),
  "@echo off\r\nset PORT=3000\r\nset HOSTNAME=0.0.0.0\r\nnode server.js\r\n"
);
writeFileSync(
  join(dist, "start.sh"),
  '#!/usr/bin/env bash\nexport PORT="${PORT:-3000}"\nexport HOSTNAME="${HOSTNAME:-0.0.0.0}"\nexec node server.js\n'
);
writeFileSync(
  join(dist, "README.txt"),
  [
    "Tourkit — production bundle",
    "",
    "Run (standalone):  node server.js   (or ./start.sh  /  start.cmd)",
    "Port:  set PORT env var (default 3000), e.g.  PORT=8080 node server.js",
    "",
    "IIS:  point the site's physical path here. web.config launches server.js",
    "via HttpPlatformHandler (install that module first). Full guide + fixes:",
    "see deploy/DEPLOY-IIS.md in the source repo. Edit web.config: set",
    "processPath (node.exe) and ADMIN_PASSWORD before iisreset.",
    "",
    "The content/ folder holds the editable site data (site.json, home.json,",
    "posts.json, projects.json, about.json) and receives leads at content/leads.json.",
    "Keep it writable and back it up — edits from /admin are saved there.",
    "",
    "Node 24+ required. No `npm install` needed: dependencies are bundled.",
  ].join("\n")
);
log("wrote start.cmd, start.sh, README.txt");

// 6. Report size
function dirSizeMB(p) {
  let total = 0;
  const stack = [p];
  while (stack.length) {
    const d = stack.pop();
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, e.name);
      if (e.isDirectory()) stack.push(full);
      else total += statSync(full).size;
    }
  }
  return (total / 1024 / 1024).toFixed(1);
}

console.log(`\n\x1b[32m✓ Bundle ready:\x1b[0m ${dist}  (${dirSizeMB(dist)} MB)`);
console.log("  Copy this folder to the server and run:  node server.js\n");
