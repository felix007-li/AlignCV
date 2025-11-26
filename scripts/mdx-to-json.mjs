#!/usr/bin/env node
import fs from 'fs'; import path from 'path';
const args=process.argv.slice(2); const opt=(k,d)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d;}
const inDir=opt('--in','content'), outDir=opt('--out','dist-mdx/json'), routesOut=opt('--routes-out','dist-mdx/prerender/routes.txt');
fs.mkdirSync(outDir,{recursive:true}); fs.mkdirSync(path.dirname(routesOut),{recursive:true});
function fm(s){const m=s.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/); if(!m) return {meta:{},body:s}; const meta={}; for(const line of m[1].split(/\n/)){const mm=line.match(/^([\w_]+):\s*(.*)$/); if(mm){meta[mm[1]]=mm[2].replace(/^"|"$/g,'');}} return {meta, body:m[2]};}
const routes=new Set();
function walk(d){ if(!fs.existsSync(d)) return; for(const n of fs.readdirSync(d)){const p=path.join(d,n); const st=fs.statSync(p); if(st.isDirectory()) walk(p); else if(n.endsWith('.mdx')){ const rel=path.relative(inDir,p); const raw=fs.readFileSync(p,'utf8'); const {meta,body}=fm(raw); const out=path.join(outDir, rel.replace(/\.mdx$/,'.json')); fs.mkdirSync(path.dirname(out),{recursive:true}); fs.writeFileSync(out, JSON.stringify({meta,body},null,2),'utf8'); const r=meta.seo_route||meta.route; if(r) routes.add(r); console.log('[mdx->json]', rel);} } }
walk(inDir); fs.writeFileSync(routesOut, Array.from(routes).sort().join('\n'),'utf8'); console.log('[routes]', routes.size);
