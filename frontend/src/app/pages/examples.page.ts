import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ExampleContent {
  title: string;
  locale: string;
  role: string;
  kind: string;
  html: string;
}

@Component({
  selector: 'app-examples-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Resume Examples</h1>
              <p class="mt-2 text-gray-600">Browse {{ examples.length }} professional resume examples</p>
            </div>
            <button
              (click)="goBack()"
              class="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      <!-- Examples Grid -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            *ngFor="let example of examples"
            class="example-card group cursor-pointer"
            (click)="viewExample(example)"
          >
            <!-- Preview Card -->
            <div class="preview-container">
              <div class="preview-content" [innerHTML]="example.html | slice:0:200"></div>
              <div class="overlay">
                <button class="view-button">
                  View Example →
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="card-content">
              <h3 class="example-title">{{ example.title }}</h3>
              <div class="example-meta">
                <span class="meta-badge locale">{{ example.locale }}</span>
                <span class="meta-badge role">{{ getRoleDisplay(example.role) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p class="mt-4 text-gray-600">Loading examples...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && examples.length === 0" class="text-center py-12">
          <p class="text-gray-600">No examples found</p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .example-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .example-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .preview-container {
      position: relative;
      width: 100%;
      aspect-ratio: 210 / 297;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .preview-content {
      padding: 1.5rem;
      font-size: 0.625rem;
      color: #4b5563;
      overflow: hidden;
      height: 100%;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 2rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .example-card:hover .overlay {
      opacity: 1;
    }

    .view-button {
      padding: 0.75rem 1.5rem;
      background: white;
      color: #059669;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .view-button:hover {
      background: #059669;
      color: white;
      transform: translateY(-2px);
    }

    .card-content {
      padding: 1.5rem;
    }

    .example-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.75rem;
    }

    .example-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .meta-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .meta-badge.locale {
      background: #dbeafe;
      color: #1e40af;
    }

    .meta-badge.role {
      background: #dcfce7;
      color: #15803d;
    }

    @media (max-width: 768px) {
      .example-card {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class ExamplesPage implements OnInit {
  examples: ExampleContent[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadExamples();
  }

  loadExamples() {
    // Load from manifest
    this.http.get<any>('/assets/content/manifest.json').subscribe(manifest => {
      const examplePaths = manifest.items
        .filter((item: any) => item.kind === 'examples')
        .map((item: any) => item.path);

      // Load first 30 examples (10 per locale for 3 columns × 3 rows per locale)
      const loadPromises = examplePaths.slice(0, 30).map((path: string) =>
        this.http.get<ExampleContent>(`/assets/content/${path}`).toPromise()
      );

      Promise.all(loadPromises).then(examples => {
        this.examples = examples.filter((ex): ex is ExampleContent => ex !== undefined);
        this.loading = false;
      });
    });
  }

  viewExample(example: ExampleContent) {
    // Navigate to editor with example pre-loaded
    this.router.navigate(['/app/resume/new/editor'], {
      queryParams: { example: example.role, locale: example.locale }
    });

    // Analytics
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'example_browse_select',
      role: example.role,
      locale: example.locale,
      source: 'examples_page'
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getRoleDisplay(role: string): string {
    return role
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
