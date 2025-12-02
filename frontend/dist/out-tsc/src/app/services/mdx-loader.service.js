var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// src/app/services/mdx-loader.service.ts
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
function parseFrontmatter(src) { const m = src.match(/^---\s*([\s\S]*?)\s*---\s*/); if (!m)
    return { data: {}, content: src }; const yaml = m[1]; const content = src.slice(m[0].length); const data = {}; yaml.split(/\r?\n/).forEach(l => { const mm = l.match(/^(\w+):\s*(.*)$/); if (!mm)
    return; let v = mm[2].trim(); if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
} data[mm[1].trim()] = v; }); return { data, content }; }
function mdToHtml(md) { md = md.replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>').replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>').replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>').replace(/^(?!<h\d|<ul|<li|<p|<hr)(.+)$/gm, '<p>$1</p>'); return md; }
let MdxLoaderService = class MdxLoaderService {
    constructor(http) {
        this.http = http;
    }
    async load(path) { const src = await firstValueFrom(this.http.get(path, { responseType: 'text' })); const { data, content } = parseFrontmatter(src); return { frontmatter: data, html: mdToHtml(content) }; }
};
MdxLoaderService = __decorate([
    Injectable({ providedIn: 'root' })
], MdxLoaderService);
export { MdxLoaderService };
//# sourceMappingURL=mdx-loader.service.js.map