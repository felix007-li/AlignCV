import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateService } from '../services/template.service';
import { Template } from '../models/template.model';

@Component({
  selector: 'app-templates-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-screen-2xl w-full mx-auto px-6 lg:px-10 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Resume Templates</h1>
              <p class="mt-2 text-gray-600">Choose from {{ templates.length }} professional templates</p>
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

      <!-- Templates Grid -->
      <main class="max-w-screen-2xl w-full mx-auto px-6 lg:px-10 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div
            *ngFor="let template of templates"
            class="template-card group cursor-pointer"
            (click)="useTemplate(template)"
          >
            <!-- Thumbnail -->
            <div class="thumbnail-container">
              <img
                [src]="template.thumbnailUrl"
                [alt]="template.metadata.label"
                class="thumbnail-image"
                (error)="onImageError($event)"
              />
              <div class="overlay">
                <button class="use-button">
                  Use Template →
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="card-content">
              <h3 class="template-title">{{ template.metadata.label }}</h3>
              <p class="template-origin">{{ template.metadata.origin }}</p>

              <!-- Tags -->
              <div class="tags-container">
                <span
                  *ngFor="let tag of template.metadata.style_tags.slice(0, 3)"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Industry Tags -->
              <div class="industry-tags">
                <span
                  *ngFor="let industry of template.metadata.industry_tags.slice(0, 2)"
                  class="industry-tag"
                >
                  {{ industry }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading templates...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && templates.length === 0" class="text-center py-12">
          <p class="text-gray-600">No templates found</p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .template-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .template-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .thumbnail-container {
      position: relative;
      width: 100%;
      aspect-ratio: 210 / 297;
      background: #f8f9fa;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px; /* avoid template edges being cropped */
    }

    .thumbnail-image {
      width: 100%;
      height: 100%;
      object-fit: contain; /* keep sidebar within frame */
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      transition: transform 0.3s ease;
    }

    .template-card:hover .thumbnail-image {
      transform: scale(1.05);
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

    .template-card:hover .overlay {
      opacity: 1;
    }

    .use-button {
      padding: 0.75rem 1.5rem;
      background: white;
      color: #1e40af;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .use-button:hover {
      background: #2563eb;
      color: white;
      transform: translateY(-2px);
    }

    .card-content {
      padding: 1.5rem;
    }

    .template-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .template-origin {
      font-size: 0.75rem;
      color: #6b7280;
      margin-bottom: 1rem;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      background: #eff6ff;
      color: #1e40af;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .industry-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .industry-tag {
      padding: 0.25rem 0.75rem;
      background: #f0fdf4;
      color: #15803d;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .template-card {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class TemplatesPage implements OnInit {
  templates: Template[] = [];
  loading = true;

  constructor(
    private templateService: TemplateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTemplates();
  }

  loadTemplates() {
    this.templateService.getAllTemplates().subscribe(templates => {
      this.templates = templates;
      this.loading = false;
    });
  }

  useTemplate(template: Template) {
    // Navigate to editor with template pre-selected
    // You can pass template ID as query param or store in state
    this.router.navigate(['/app/resume/new/editor'], {
      queryParams: { templateId: template.metadata.id }
    });

    // Analytics
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'template_browse_select',
      template_id: template.metadata.id,
      template_label: template.metadata.label,
      source: 'templates_page'
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="210" height="297"><rect width="210" height="297" fill="%23f5f5f5"/><text x="50%" y="50%" text-anchor="middle" fill="%23999" font-size="14">Template Preview</text></svg>';
  }
}
