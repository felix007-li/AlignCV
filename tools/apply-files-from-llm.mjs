#!/usr/bin/env node
import fs from 'fs'; import path from 'path';
const input = await new Promise(r=>{let s='';process.stdin.setEncoding('utf8');process.stdin.on('data',c=>s+=c);process.stdin.on('end',()=>r(s));});
const idx = input.indexOf('FILES:');
if (idx<0){ console.error('[apply-files] No FILES block'); process.exit(2); }
let body = input.slice(idx+6);
const notes = body.indexOf('NOTES:'); if (notes>=0) body = body.slice(0,notes);
const re = /\s*([\w@./\\-]+)\n```[\w-]*\n([\s\S]*?)\n```/gm;
let m, files=[];
while((m=re.exec(body))!==null){ files.push({p:m[1].trim(), c:m[2]}); }
for(const f of files){ const abs=path.resolve(process.cwd(), f.p); fs.mkdirSync(path.dirname(abs),{recursive:true}); fs.writeFileSync(abs, f.c, 'utf8'); console.log('[write]', f.p); }
console.log('[apply-files] wrote', files.length);
