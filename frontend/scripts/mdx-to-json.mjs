#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import footnote from 'markdown-it-footnote';
import mila from 'markdown-it-link-attributes';
import hljs from 'highlight.js';
import createDOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';
const args = process.argv.slice(2);
function arg(n,d){ const i=args.indexOf(n); return i===-1?d:(args[i+1]??d); }
const IN = arg('--in','content'); const OUT = arg('--out','dist-mdx/json');
const md = new MarkdownIt({ html:false, linkify:true, typographer:true,
  highlight:(str,lang)=>{ if(lang&&hljs.getLanguage(lang)){ try{return '<pre class=\"hljs\"><code>'+hljs.highlight(str,{language:lang,ignoreIllegals:true}).value+'</code></pre>'; }catch(_){}} return '<pre class=\"hljs\"><code>'+MarkdownIt().utils.escapeHtml(str)+'</code></pre>'; }
}).use(anchor).use(footnote).use(mila,{attrs:{target:'_blank',rel:'noopener'}});
const window = (new JSDOM('<!DOCTYPE html>')).window; const DOMPurify = createDOMPurify(window);
async function ensure(p){ await fs.mkdir(p,{recursive:true}); }
function group(p){ const parts=p.split(path.sep); const i=parts.indexOf('content'); return { locale: parts[i+1]||'unknown', kind: parts[i+2]||'misc' }; }
const files = await fg([`${IN}/**/*.mdx`],{dot:false});
const buckets = new Map();
for (const f of files){
  const raw = await fs.readFile(f,'utf8'); const {content,data}=matter(raw);
  const htmlUnsafe = md.render(content);
  const html = DOMPurify.sanitize(htmlUnsafe,{ALLOWED_URI_REGEXP:/^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i});
  const {locale,kind} = group(f); const key = `${locale}/${kind}`;
  const item = { seo_route: data.seo_route||null, editor_route: data.route||null, templateId: data.templateId||null, frontmatter: data, html };
  if(!buckets.has(key)) buckets.set(key,[]); buckets.get(key).push(item);
}
for (const [key, arr] of buckets){
  const [locale, kind] = key.split('/'); const outDir = path.join(OUT, locale); await ensure(outDir);
  const outFile = path.join(outDir, `${kind}.json`); await fs.writeFile(outFile, JSON.stringify(arr,null,2),'utf8');
  console.log('Wrote', outFile, arr.length);
}
