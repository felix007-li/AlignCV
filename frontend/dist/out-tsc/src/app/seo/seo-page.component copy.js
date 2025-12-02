var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// src/app/seo/seo-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SafeMarkdownService } from '../services/safe-markdown.service';
let SeoPageComponent = class SeoPageComponent {
    constructor() {
        this.fm = signal({});
        this.html = signal('');
        this.loading = signal(true);
        this.error = signal('');
        this.route = inject(ActivatedRoute);
        this.http = inject(HttpClient);
        this.safeMd = inject(SafeMarkdownService);
    }
    async ngOnInit() {
        const p = this.route.snapshot.paramMap;
        const locale = p.get('locale');
        const kind = p.get('kind');
        const sub = p.get('sub');
        const slug = p.get('slug');
        if (!locale || !kind || !sub || !slug) {
            this.error.set('Invalid params');
            this.loading.set(false);
            return;
        }
        const path = `content/${locale}/${kind}/${sub}/${slug}.mdx`;
        try {
            const src = await this.http.get(path, { responseType: 'text' }).toPromise();
            if (!src)
                throw new Error('Empty content');
            const fmMatch = src.match(/^---\\s*([\\s\\S]*?)\\s*---\\s*/);
            let body = src;
            const data = {};
            if (fmMatch) {
                body = src.slice(fmMatch[0].length);
                fmMatch[1].split(/\\r?\\n/).forEach(line => {
                    const m = line.match(/^(\\w+):\\s*(.*)$/);
                    if (!m)
                        return;
                    const k = m[1].trim();
                    let v = m[2].trim();
                    if ((v.startsWith('\"') && v.endsWith('\"')) || (v.startsWith("'\")&&v.endsWith(\"'\"))) v = v.slice(1,-1);, data[k] = v)))
                        ;
                });
            }
            this.fm.set(data);
            this.html.set(this.safeMd.render(body));
        }
        catch (e) {
            this.error.set(e?.message || 'Failed to load');
        }
        finally {
            this.loading.set(false);
        }
    }
};
SeoPageComponent = __decorate([
    Component({
        selector: 'aligncv-seo-page',
        standalone: true,
        imports: [CommonModule, RouterLink, HttpClientModule],
        templateUrl: './seo-page.component.html'
    })
], SeoPageComponent);
export { SeoPageComponent };
//# sourceMappingURL=seo-page.component%20copy.js.map