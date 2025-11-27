import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Template, TemplateMetadata, TemplateTokens } from '../models/template.model';
import { TEMPLATE_TOKENS } from '../models/template-tokens.data';

// Curated 15 templates (12 original + 3 CVWizard-inspired)
const TEMPLATE_METADATA: TemplateMetadata[] = [
  { id: 'jr-modern', label: 'Modern', origin: 'jsonresume-theme-modern (MIT)', source_url: '', style_tags: ['modern', 'simple', 'clean'], industry_tags: ['software', 'product', 'general'] },
  { id: 'jr-elegant', label: 'Elegant', origin: 'jsonresume-theme-elegant', source_url: '', style_tags: ['card', 'responsive', 'elegant'], industry_tags: ['product', 'design', 'marketing'] },
  { id: 'jr-even', label: 'Even', origin: 'jsonresume-theme-even (MIT)', source_url: '', style_tags: ['flat', 'single-color', 'clean'], industry_tags: ['software', 'general'] },
  { id: 'jr-compact', label: 'Compact', origin: 'jsonresume-theme-compact', source_url: '', style_tags: ['compact', 'single-page', 'minimal'], industry_tags: ['student', 'software'] },
  { id: 'jr-timeline', label: 'Timeline', origin: 'jsonresume-theme-timeline-fixed', source_url: '', style_tags: ['timeline', 'sections'], industry_tags: ['project', 'consulting'] },
  { id: 'jr-dev-ats', label: 'Developer ATS', origin: 'jsonresume-theme-dev-ats', source_url: '', style_tags: ['ATS', 'developer', 'optimized'], industry_tags: ['software', 'data', 'engineering'] },
  { id: 'lt-awesomecv', label: 'Awesome CV', origin: 'Awesome-CV (LPPL 1.3c)', source_url: '', style_tags: ['two-column', 'accent-left', 'professional'], industry_tags: ['general', 'engineering', 'software'] },
  { id: 'lt-altacv', label: 'AltaCV', origin: 'AltaCV (LPPL 1.3c)', source_url: '', style_tags: ['two-column', 'pill-headings', 'creative'], industry_tags: ['software', 'design'] },
  { id: 'lt-moderncv', label: 'ModernCV', origin: 'moderncv (LPPL 1.3c)', source_url: '', style_tags: ['classic', 'header-block', 'professional'], industry_tags: ['general', 'academia', 'engineering'] },
  { id: 'lt-friggeri', label: 'Friggeri', origin: 'Friggeri CV (MIT/CC-BY variants)', source_url: '', style_tags: ['two-column', 'color-sections', 'creative'], industry_tags: ['research', 'data', 'academia'] },
  { id: 'lt-deedy', label: 'Deedy', origin: 'Deedy Resume (mixed licenses)', source_url: '', style_tags: ['two-column', 'high-contrast', 'bold'], industry_tags: ['software', 'student', 'tech'] },
  { id: 'lt-twenty', label: 'Twenty Seconds', origin: 'Twenty Seconds CV (MIT/LPPL variants)', source_url: '', style_tags: ['one-page', 'timeline', 'visual'], industry_tags: ['marketing', 'product', 'design'] },
  { id: 'cw-classic', label: 'Classic', origin: 'CVWizard-inspired', source_url: '', style_tags: ['traditional', 'two-column', 'gray'], industry_tags: ['general', 'professional'] },
  { id: 'cw-horizontal', label: 'Horizontal', origin: 'CVWizard-inspired', source_url: '', style_tags: ['horizontal-bars', 'modern', 'blue'], industry_tags: ['general', 'creative'] },
  { id: 'cw-vertical', label: 'Vertical', origin: 'CVWizard-inspired', source_url: '', style_tags: ['vertical-bar', 'modern', 'gradient'], industry_tags: ['general', 'creative'] }
];

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor() {}

  /**
   * Get all templates (using hardcoded data to avoid HttpClient dependency)
   */
  getAllTemplates(): Observable<Template[]> {
    const templates = TEMPLATE_METADATA.map(meta => this.createTemplate(meta));
    return of(templates);
  }

  /**
   * Get a specific template by ID
   */
  getTemplateById(id: string): Observable<Template | undefined> {
    return this.getAllTemplates().pipe(
      map(templates => templates.find(t => t.metadata.id === id))
    );
  }

  /**
   * Get templates filtered by industry tag
   */
  getTemplatesByIndustry(industry: string): Observable<Template[]> {
    return this.getAllTemplates().pipe(
      map(templates =>
        templates.filter(t =>
          t.metadata.industry_tags.includes(industry)
        )
      )
    );
  }

  /**
   * Get templates filtered by style tag
   */
  getTemplatesByStyle(style: string): Observable<Template[]> {
    return this.getAllTemplates().pipe(
      map(templates =>
        templates.filter(t =>
          t.metadata.style_tags.includes(style)
        )
      )
    );
  }

  /**
   * Get paginated templates
   */
  getTemplatesPaginated(page: number = 0, pageSize: number = 10): Observable<{
    templates: Template[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    return this.getAllTemplates().pipe(
      map(allTemplates => {
        const start = page * pageSize;
        const end = start + pageSize;
        const templates = allTemplates.slice(start, end);
        const totalPages = Math.ceil(allTemplates.length / pageSize);

        return {
          templates,
          total: allTemplates.length,
          page,
          pageSize,
          totalPages
        };
      })
    );
  }

  /**
   * Create a Template object by combining metadata with tokens
   */
  private createTemplate(metadata: TemplateMetadata): Template {
    const tokens = TEMPLATE_TOKENS[metadata.id] || this.getDefaultTokens();

    return {
      metadata,
      tokens,
      thumbnailUrl: `/assets/templates/thumbnails/${metadata.id}.svg`
    };
  }

  /**
   * Provide default tokens for templates without specific styling
   */
  private getDefaultTokens(): TemplateTokens {
    return {
      fontFamily: 'Arial, sans-serif',
      fontSize: { body: 11, heading: 14, small: 9 },
      lineHeight: 1.4,
      palette: {
        primary: '#2c3e50',
        text: '#2c3e50',
        muted: '#7f8c8d',
        bg: '#ffffff',
        border: '#ecf0f1'
      },
      layout: {
        columns: 1,
        sidebar: null,
        sidebarWidth: null,
        headerAlign: 'left',
        sectionHeadingStyle: 'caps',
        bulletStyle: 'dot'
      },
      spacing: { section: 16, item: 8 },
      letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    };
  }
}
