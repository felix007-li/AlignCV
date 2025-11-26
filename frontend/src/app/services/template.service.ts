import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Template, TemplateMetadata, TemplateTokens } from '../models/template.model';
import { TEMPLATE_TOKENS } from '../models/template-tokens.data';

// Hardcoded template metadata to avoid HttpClient dependency
const TEMPLATE_METADATA: TemplateMetadata[] = [
  { id: 'jr-even', label: 'Even (JR)', origin: 'jsonresume-theme-even', source_url: '', style_tags: ['flat', 'clean'], industry_tags: ['software'] },
  { id: 'jr-elegant', label: 'Elegant (JR)', origin: 'jsonresume-theme-elegant', source_url: '', style_tags: ['card'], industry_tags: ['design'] },
  { id: 'jr-flat', label: 'Flat (JR)', origin: 'jsonresume-theme-flat', source_url: '', style_tags: ['minimal'], industry_tags: ['software'] },
  { id: 'jr-paper', label: 'Paper (JR)', origin: 'jsonresume-theme-paper', source_url: '', style_tags: ['paper'], industry_tags: ['academia'] },
  { id: 'jr-paperpp', label: 'Paper++ (JR)', origin: 'jsonresume-theme-paper-plus-plus', source_url: '', style_tags: ['paper'], industry_tags: ['general'] },
  { id: 'jr-microdata', label: 'Microdata (JR)', origin: 'jsonresume-theme-microdata', source_url: '', style_tags: ['seo'], industry_tags: ['software'] },
  { id: 'jr-kendall', label: 'Kendall (JR)', origin: 'jsonresume-theme-kendall', source_url: '', style_tags: ['two-column'], industry_tags: ['data'] },
  { id: 'jr-classy', label: 'Classy (JR)', origin: 'jsonresume-theme-classy', source_url: '', style_tags: ['classic'], industry_tags: ['marketing'] },
  { id: 'jr-compact', label: 'Compact (JR)', origin: 'jsonresume-theme-compact', source_url: '', style_tags: ['compact'], industry_tags: ['student'] },
  { id: 'jr-modern', label: 'Modern (JR)', origin: 'jsonresume-theme-modern', source_url: '', style_tags: ['modern'], industry_tags: ['software'] },
  { id: 'jr-slick', label: 'Slick (JR)', origin: 'jsonresume-theme-slick', source_url: '', style_tags: ['slick'], industry_tags: ['design'] },
  { id: 'jr-timeline', label: 'Timeline (JR)', origin: 'jsonresume-theme-timeline', source_url: '', style_tags: ['timeline'], industry_tags: ['project'] },
  { id: 'jr-techlead', label: 'TechLead (JR)', origin: 'jsonresume-theme-techlead', source_url: '', style_tags: ['bold'], industry_tags: ['software'] },
  { id: 'jr-onepage', label: 'OnePage (JR)', origin: 'jsonresume-theme-onepage', source_url: '', style_tags: ['one-page'], industry_tags: ['student'] },
  { id: 'jr-standard', label: 'Standard (JR)', origin: 'jsonresume-theme-standard-resume', source_url: '', style_tags: ['standard'], industry_tags: ['general'] },
  { id: 'jr-hired', label: 'Hired (JR)', origin: 'jsonresume-theme-hired', source_url: '', style_tags: ['panel'], industry_tags: ['sales'] },
  { id: 'jr-cvstrap', label: 'CVStrap (JR)', origin: 'jsonresume-theme-cvstrap', source_url: '', style_tags: ['bootstrap'], industry_tags: ['general'] },
  { id: 'jr-tachyons', label: 'Tachyons (JR)', origin: 'jsonresume-theme-tachyons-clean', source_url: '', style_tags: ['clean'], industry_tags: ['software'] },
  { id: 'jr-stackoverflowed', label: 'StackOverflowed (JR)', origin: 'jsonresume-theme-stackoverflowed', source_url: '', style_tags: ['cards'], industry_tags: ['software'] },
  { id: 'jr-dev-ats', label: 'Dev ATS (JR)', origin: 'jsonresume-theme-dev-ats', source_url: '', style_tags: ['ATS'], industry_tags: ['software'] },
  { id: 'lt-awesomecv', label: 'Awesome‑CV (LX)', origin: 'Awesome-CV', source_url: '', style_tags: ['two-column'], industry_tags: ['engineering'] },
  { id: 'lt-altacv', label: 'AltaCV (LX)', origin: 'AltaCV', source_url: '', style_tags: ['two-column'], industry_tags: ['software'] },
  { id: 'lt-moderncv', label: 'moderncv (LX)', origin: 'moderncv', source_url: '', style_tags: ['classic'], industry_tags: ['academia'] },
  { id: 'lt-friggeri', label: 'Friggeri (LX)', origin: 'Friggeri CV', source_url: '', style_tags: ['two-column'], industry_tags: ['research'] },
  { id: 'lt-deedy', label: 'Deedy (LX)', origin: 'Deedy Resume', source_url: '', style_tags: ['two-column'], industry_tags: ['software'] },
  { id: 'lt-twenty', label: 'Twenty Seconds (LX)', origin: 'Twenty Seconds CV', source_url: '', style_tags: ['one-page'], industry_tags: ['marketing'] },
  { id: 'lt-altacv-dark', label: 'AltaCV Dark (LX)', origin: 'AltaCV fork', source_url: '', style_tags: ['dark-mode'], industry_tags: ['design'] },
  { id: 'lt-moderncv-casual', label: 'moderncv Casual (LX)', origin: 'moderncv', source_url: '', style_tags: ['casual'], industry_tags: ['general'] },
  { id: 'lt-friggeri-boosted', label: 'Friggeri Boosted (LX)', origin: 'Friggeri forks', source_url: '', style_tags: ['palette'], industry_tags: ['data'] },
  { id: 'lt-awesomecv-letter', label: 'Awesome‑CV Letter (LX)', origin: 'Awesome-CV letter', source_url: '', style_tags: ['letter'], industry_tags: ['general'] }
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
