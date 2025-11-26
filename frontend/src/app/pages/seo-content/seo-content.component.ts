/**
 * SEO Content Page Component
 * Renders MDX content for SEO pages
 * Route: /l/:locale/:kind/:slug
 * Example: /l/en/templates/software-engineer
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { MdxContentService, type MdxContent } from '../../services/mdx-content.service';
import { marked } from 'marked';

@Component({
  selector: 'app-seo-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="seo-content-page">
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading content...</p>
      </div>

      <div *ngIf="error" class="error-container">
        <h1>Content Not Found</h1>
        <p>{{ error }}</p>
        <button (click)="goHome()" class="btn-primary">Go to Home</button>
      </div>

      <article *ngIf="content && !loading" class="content-container">
        <header class="content-header">
          <h1>{{ content.meta.title }}</h1>
          <p *ngIf="content.meta.description" class="description">
            {{ content.meta.description }}
          </p>
          <div class="meta-info">
            <span class="locale">{{ content.meta.locale }}</span>
            <span *ngIf="content.meta.category" class="category">
              {{ content.meta.category }}
            </span>
            <span *ngIf="content.meta.level" class="level">
              {{ content.meta.level }}
            </span>
          </div>
        </header>

        <div class="content-body" [innerHTML]="renderedContent"></div>

        <footer class="content-footer">
          <button
            *ngIf="content.meta.route"
            (click)="navigateToCTA()"
            class="btn-cta">
            Create Resume with This Template
          </button>
        </footer>
      </article>
    </div>
  `,
  styles: [`
    .seo-content-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .loading-container, .error-container {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container h1 {
      color: #e74c3c;
      margin-bottom: 1rem;
    }

    .content-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 3rem;
    }

    .content-header {
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 2rem;
      margin-bottom: 2rem;
    }

    .content-header h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .description {
      font-size: 1.25rem;
      color: #7f8c8d;
      margin-bottom: 1rem;
    }

    .meta-info {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .meta-info span {
      padding: 0.5rem 1rem;
      background: #ecf0f1;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .locale { background: #3498db; color: white; }
    .category { background: #2ecc71; color: white; }
    .level { background: #e67e22; color: white; }

    .content-body {
      line-height: 1.8;
      color: #34495e;
    }

    .content-body :deep(h2) {
      font-size: 2rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    .content-body :deep(h3) {
      font-size: 1.5rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: #34495e;
    }

    .content-body :deep(ul), .content-body :deep(ol) {
      margin: 1rem 0;
      padding-left: 2rem;
    }

    .content-body :deep(li) {
      margin: 0.5rem 0;
    }

    .content-body :deep(strong) {
      font-weight: 600;
      color: #2c3e50;
    }

    .content-body :deep(code) {
      background: #ecf0f1;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    .content-footer {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid #ecf0f1;
      text-align: center;
    }

    .btn-primary, .btn-cta {
      padding: 1rem 2rem;
      font-size: 1.125rem;
      font-weight: 600;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .btn-cta {
      background: #2ecc71;
      color: white;
    }

    .btn-cta:hover {
      background: #27ae60;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
    }
  `]
})
export class SeoContentComponent implements OnInit, OnDestroy {
  content: MdxContent | null = null;
  renderedContent: string = '';
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mdxService: MdxContentService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.loadContent(params);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadContent(params: any): void {
    this.loading = true;
    this.error = null;

    const { locale, kind, slug } = params;

    this.mdxService
      .loadContentByParams(locale, kind, slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (content) => {
          if (content) {
            this.content = content;
            this.renderedContent = this.convertMarkdownToHtml(content.body);
            this.updateSEOTags(content);
          } else {
            this.error = `Content not found for route: /l/${locale}/${kind}/${slug}`;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load content. Please try again later.';
          this.loading = false;
          console.error('Content loading error:', err);
        }
      });
  }

  private convertMarkdownToHtml(markdown: string): string {
    // Configure marked for security and features
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert \n to <br>
      // Removed unsupported 'mangle' option (marked handles email obfuscation differently in recent versions)
    });

    // Parse Markdown to HTML using marked library
    return marked.parse(markdown) as string;
  }

  private updateSEOTags(content: MdxContent): void {
    // Update page title
    this.titleService.setTitle(content.meta.title);

    // Update meta tags
    this.metaService.updateTag({
      name: 'description',
      content: content.meta.description
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: content.meta.title
    });

    this.metaService.updateTag({
      property: 'og:description',
      content: content.meta.description
    });

    this.metaService.updateTag({
      property: 'og:type',
      content: 'article'
    });

    this.metaService.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image'
    });

    this.metaService.updateTag({
      name: 'twitter:title',
      content: content.meta.title
    });

    this.metaService.updateTag({
      name: 'twitter:description',
      content: content.meta.description
    });

    // Add canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.href);
    }
  }

  navigateToCTA(): void {
    if (this.content?.meta.route) {
      this.router.navigateByUrl(this.content.meta.route);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
