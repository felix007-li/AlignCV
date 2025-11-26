// src/app/seo/seo-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MdxLoaderService } from '../services/mdx-loader.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

@Component({ selector: 'aligncv-seo-page', standalone: true, imports: [CommonModule, RouterLink, HttpClientModule, SafeHtmlPipe], templateUrl: './seo-page.component.html' })
export class SeoPageComponent {
  fm = signal<any>({}); html = signal<string>(''); loading = signal<boolean>(true); error = signal<string>('');
  private route = inject(ActivatedRoute); private loader = inject(MdxLoaderService);
  async ngOnInit(){ const p=this.route.snapshot.paramMap; const locale=p.get('locale'); const kind=p.get('kind'); const sub=p.get('sub'); const slug=p.get('slug'); if(!locale||!kind||!sub||!slug){ this.error.set('Invalid route params'); this.loading.set(false); return; } const path=`content/${locale}/${kind}/${sub}/${slug}.mdx`; try { const {frontmatter, html}=await this.loader.load(path); this.fm.set(frontmatter??{}); this.html.set(html); } catch(e:any){ this.error.set(e?.message||'Failed to load content'); } finally { this.loading.set(false); } }
}
