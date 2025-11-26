#!/usr/bin/env node
import fs from 'fs';
const pkgPath = new URL('../package.json', import.meta.url);
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const ver = pkg.version || '0.0.0';
const [ma,mi,pa] = ver.split('.').map(n=>parseInt(n,10)||0);
const next = `${ma}.${mi}.${pa+1}`;
pkg.version = next;
fs.writeFileSync(new URL('../package.json', import.meta.url), JSON.stringify(pkg,null,2));
console.log('bumped to', next);
