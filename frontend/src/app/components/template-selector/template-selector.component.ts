import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateService } from '../../services/template.service';
import { Template } from '../../models/template.model';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-selector">
      <!-- Horizontal scrollable template list -->
      <div class="template-scroll-container" #scrollContainer>
        <div class="template-list">
          <div
            *ngFor="let template of allTemplates"
            class="template-card"
            [class.selected]="template.metadata.id === selectedTemplateId"
            (click)="selectTemplate(template)"
          >
            <div class="thumbnail-wrapper">
              <img
                [src]="template.thumbnailUrl"
                [alt]="template.metadata.label"
                class="thumbnail"
                (error)="onThumbnailError($event)"
              />
              <div class="overlay">
                <span class="check-icon" *ngIf="template.metadata.id === selectedTemplateId">✓</span>
              </div>
            </div>
            <div class="template-info">
              <h4 class="template-name">{{ template.metadata.label }}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Scrollbar indicator -->
      <div class="scrollbar-track">
        <div class="scrollbar-thumb" [style.width.%]="scrollPercentage"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .template-selector {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      width: 100%;
      max-width: 100%;
    }

    .template-scroll-container {
      overflow-x: auto;
      overflow-y: hidden;
      padding: 1.25rem 0.75rem;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE/Edge */
    }

    .template-scroll-container::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }

    .template-list {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(140px, 1fr);
      gap: 0.5rem;
      min-width: 100%;
      padding: 0 0.25rem;
    }

    .template-card {
      cursor: pointer;
      border: 3px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.2s ease;
      background: white;
      flex-shrink: 0;
      width: 150px;
    }

    .template-card:hover {
      border-color: #3b82f6;
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .template-card.selected {
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
    }

    .thumbnail-wrapper {
      position: relative;
      width: 100%;
      height: 190px;
      background: #f9fafb;
      overflow: hidden;
    }

    .thumbnail {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(46, 204, 113, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .template-card.selected .overlay {
      opacity: 1;
    }

    .check-icon {
      width: 40px;
      height: 40px;
      background: #2ecc71;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
    }

    .template-info {
      padding: 0.5rem;
      background: white;
    }

    .template-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tags {
      display: none;
    }

    .tag {
      display: none;
    }

    .scrollbar-track {
      height: 4px;
      background: #e5e7eb;
      margin: 0 1rem 1rem;
      border-radius: 2px;
      overflow: hidden;
    }

    .scrollbar-thumb {
      height: 100%;
      background: #9ca3af;
      border-radius: 2px;
      transition: width 0.1s ease;
    }
  `]
})
export class TemplateSelectorComponent implements OnInit, AfterViewInit {
  @Input() selectedTemplateId?: string;
  @Output() templateSelected = new EventEmitter<Template>();
  @ViewChild('scrollContainer') scrollContainer?: ElementRef;

  allTemplates: Template[] = [];
  scrollPercentage: number = 20; // Initial thumb width

  constructor(private templateService: TemplateService) {}

  ngOnInit() {
    this.templateService.getAllTemplates().subscribe(templates => {
      this.allTemplates = templates;
    });
  }

  ngAfterViewInit() {
    // Add scroll listener to update scrollbar
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.addEventListener('scroll', () => {
        this.updateScrollbar();
      });
    }
  }

  updateScrollbar() {
    if (!this.scrollContainer) return;

    const el = this.scrollContainer.nativeElement;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const scrollLeft = el.scrollLeft;

    if (scrollWidth > clientWidth) {
      // Calculate thumb width as percentage of visible area
      const thumbWidth = (clientWidth / scrollWidth) * 100;

      // Calculate thumb position based on scroll position
      const maxScroll = scrollWidth - clientWidth;
      const scrollPercentage = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;

      this.scrollPercentage = thumbWidth;

      // Update thumb position
      const thumbElement = document.querySelector('.scrollbar-thumb') as HTMLElement;
      if (thumbElement) {
        thumbElement.style.marginLeft = `${scrollPercentage}%`;
      }
    } else {
      this.scrollPercentage = 100;
    }
  }

  selectTemplate(template: Template) {
    this.selectedTemplateId = template.metadata.id;
    this.templateSelected.emit(template);

    // Analytics tracking
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'template_selected',
      template_id: template.metadata.id,
      template_label: template.metadata.label
    });
  }

  onThumbnailError(event: Event) {
    const img = event.target as HTMLImageElement;
    // Fallback to a placeholder or keep trying
    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="210" height="297"><rect width="210" height="297" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="%23999" font-size="16">Template</text></svg>';
  }
}
