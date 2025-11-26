// src/app/services/mdx-loader.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

function parseFrontmatter(src: string){ const m = src.match(/^---\s*([\s\S]*?)\s*---\s*/); if(!m) return {data:{},content:src}; const yaml=m[1]; const content=src.slice(m[0].length); const data:any={}; yaml.split(/\r?\n/).forEach(l=>{ const mm=l.match(/^(\w+):\s*(.*)$/); if(!mm) return; let v=mm[2].trim(); if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))){ v=v.slice(1,-1);} data[mm[1].trim()]=v; }); return {data,content}; }
function mdToHtml(md:string){ md=md.replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>').replace(/^\s*-\s+(.+)$/gm,'<li>$1</li>').replace(/(<li>[\s\S]+?<\/li>)/g,'<ul>$1</ul>').replace(/^(?!<h\d|<ul|<li|<p|<hr)(.+)$/gm,'<p>$1</p>'); return md; }

@Injectable({ providedIn: 'root' })
export class MdxLoaderService {
  constructor(private http: HttpClient){}
  async load(path: string): Promise<{ frontmatter: any, html: string }>{ const src = await firstValueFrom(this.http.get(path, { responseType: 'text' })); const {data, content} = parseFrontmatter(src); return { frontmatter: data, html: mdToHtml(content) }; }
}
