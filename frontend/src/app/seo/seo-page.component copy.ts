// src/app/seo/seo-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SafeMarkdownService } from '../services/safe-markdown.service';

@Component({
  selector: 'aligncv-seo-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './seo-page.component.html'
})
export class SeoPageComponent {
  fm = signal<any>({}); html = signal<any>(''); loading = signal<boolean>(true); error = signal<string>('');
  private route = inject(ActivatedRoute); private http = inject(HttpClient); private safeMd = inject(SafeMarkdownService);
  async ngOnInit(){
    const p = this.route.snapshot.paramMap;
    const locale = p.get('locale'); const kind = p.get('kind'); const sub = p.get('sub'); const slug = p.get('slug');
    if (!locale || !kind || !sub || !slug) { this.error.set('Invalid params'); this.loading.set(false); return; }
    const path = `content/${locale}/${kind}/${sub}/${slug}.mdx`;
    try {
      const src = await this.http.get(path, { responseType: 'text' }).toPromise();
      if (!src) throw new Error('Empty content');
      const fmMatch = src.match(/^---\\s*([\\s\\S]*?)\\s*---\\s*/);
      let body = src; const data: any = {};
      if (fmMatch) {
        body = src.slice(fmMatch[0].length);
        fmMatch[1].split(/\\r?\\n/).forEach(line => {
          const m = line.match(/^(\\w+):\\s*(.*)$/); if (!m) return;
          const k = m[1].trim(); let v = m[2].trim();
          if ((v.startsWith('\"')&&v.endsWith('\"'))||(v.startsWith(\"'\")&&v.endsWith(\"'\"))) v = v.slice(1,-1);
          data[k] = v;
        });
      }
      this.fm.set(data); this.html.set(this.safeMd.render(body));
    } catch (e:any){ this.error.set(e?.message||'Failed to load'); } finally { this.loading.set(false); }
  }
}
