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
import { HttpClientModule } from '@angular/common/http';
import { MdxLoaderService } from '../services/mdx-loader.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
let SeoPageComponent = class SeoPageComponent {
    constructor() {
        this.fm = signal({});
        this.html = signal('');
        this.loading = signal(true);
        this.error = signal('');
        this.route = inject(ActivatedRoute);
        this.loader = inject(MdxLoaderService);
    }
    async ngOnInit() { const p = this.route.snapshot.paramMap; const locale = p.get('locale'); const kind = p.get('kind'); const sub = p.get('sub'); const slug = p.get('slug'); if (!locale || !kind || !sub || !slug) {
        this.error.set('Invalid route params');
        this.loading.set(false);
        return;
    } const path = `content/${locale}/${kind}/${sub}/${slug}.mdx`; try {
        const { frontmatter, html } = await this.loader.load(path);
        this.fm.set(frontmatter ?? {});
        this.html.set(html);
    }
    catch (e) {
        this.error.set(e?.message || 'Failed to load content');
    }
    finally {
        this.loading.set(false);
    } }
};
SeoPageComponent = __decorate([
    Component({ selector: 'aligncv-seo-page', standalone: true, imports: [CommonModule, RouterLink, HttpClientModule, SafeHtmlPipe], templateUrl: './seo-page.component.html' })
], SeoPageComponent);
export { SeoPageComponent };
//# sourceMappingURL=seo-page.component.js.map