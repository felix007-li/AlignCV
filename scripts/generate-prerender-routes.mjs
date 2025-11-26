#!/usr/bin/env node
import fs from 'fs'; import path from 'path';
const args=process.argv.slice(2); const opt=(k,d)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d;}
const inDir=opt('--in','dist-mdx/json'); const outFile=opt('--out','dist-mdx/prerender/routes.txt');
const routes=new Set(); function walk(d){ if(!fs.existsSync(d)) return; for(const n of fs.readdirSync(d)){const p=path.join(d,n); const st=fs.statSync(p); if(st.isDirectory()) walk(p); else if(n.endsWith('.json')){ const o=JSON.parse(fs.readFileSync(p,'utf8')); const r=o?.meta?.seo_route||o?.meta?.route; if(r) routes.add(r);} } } walk(inDir); fs.mkdirSync(path.dirname(outFile),{recursive:true}); fs.writeFileSync(outFile, Array.from(routes).sort().join('\n'), 'utf8'); console.log('[generate routes]', routes.size);
