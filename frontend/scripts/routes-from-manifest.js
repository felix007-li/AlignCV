#!/usr/bin/env node
// Usage:
//   node scripts/routes-from-manifest.js --app=resume-suite --manifest=./resume-suite/src/assets/content/manifest.json --out=routes.txt --extra="/,/pricing,/editor/demo"
// If --manifest is omitted, it will attempt to scan ./src/assets/content recursively.
const fs = require('fs');
const path = require('path');

function arg(name, defVal) {
  const m = process.argv.find(a => a.startsWith(`--${name}=`));
  return m ? m.split('=').slice(1).join('=') : defVal;
}

const app = arg('app', 'resume-suite');
let manifestPath = arg('manifest', `./${app}/src/assets/content/manifest.json`);
const outFile = arg('out', 'routes.txt');
const extra = (arg('extra', '/,/pricing,/editor/demo') || '').split(',').map(s => s.trim()).filter(Boolean);

function dedupe(arr){ return Array.from(new Set(arr)); }

function fromManifest(manifestFile){
  const raw = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
  const items = raw.items || [];
  const out = [];
  for (const it of items) {
    const kind = (it.kind || '').toLowerCase().includes('example') ? 'examples' : 'templates';
    const locale = it.locale, city = it.city, role = it.role;
    const industry = it.industry, level = it.level;
    if (locale && city && role) {
      out.push(`/${kind}/${locale}/${city}/${role}`);
      if (industry && level) out.push(`/${kind}/${locale}/${city}/${role}/${industry}/${level}`);
    } else if (it.path) {
      // fallback from path
      const seg = it.path.replace(/\.json$/,'').split('/');
      if (seg.length >= 5) out.push(`/${seg.join('/')}`);
    }
  }
  return dedupe(out);
}

function scanDir(baseDir){
  const out = [];
  const base = path.resolve(baseDir);
  function walk(dir){
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const stat = fs.statSync(p);
      if (stat.isDirectory()){ walk(p); continue; }
      if (!name.endsWith('.json')) continue;
      const rel = path.relative(base, p).replace(/\\/g,'/').replace(/\.json$/,'');
      out.push('/'+rel);
    }
  }
  walk(base);
  return dedupe(out);
}

let routes = [];
if (fs.existsSync(manifestPath)) {
  routes = fromManifest(manifestPath);
} else {
  const contentDir = `./${app}/src/assets/content`;
  if (fs.existsSync(contentDir)) routes = scanDir(contentDir);
}

routes = dedupe(extra.concat(routes)).sort();

fs.writeFileSync(outFile, routes.join('\n'), 'utf-8');
console.log(`[prerender-helper] wrote ${routes.length} routes → ${outFile}`);
