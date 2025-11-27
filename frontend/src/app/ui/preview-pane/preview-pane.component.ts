import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import {
  ResumeNewState,
  PersonalDetails,
  ProfileSummary,
  ExperienceEntry,
  EducationEntry,
  SkillEntry,
  LanguageEntry
} from '../../state/resume-new.state';
import { UiState } from '../../state/ui.state';

@Component({
  standalone: true,
  selector: 'app-preview-pane',
  imports: [CommonModule],
  template: `
    <!-- Preview wrapper with proper scaling -->
    <div class="preview-wrapper resume-preview">
      <div class="resume-paper"
           [attr.data-template]="getTemplateId()"
           [ngStyle]="getPaperStyles()">

        <div class="resume-canvas"
           [attr.data-columns]="getLayoutColumns()"
           [attr.data-sidebar]="getSidebarPosition()"
           [ngStyle]="getCanvasStyles()">

        <!-- Header Section (spans full width in two-column) -->
        <div class="resume-header mb-6">
          <h1 class="text-3xl font-bold mb-2 text-gray-900">
            {{ personalDetails.givenName }} {{ personalDetails.familyName }}
          </h1>
          <div *ngIf="personalDetails.useAsHeadline && personalDetails.desiredJobPosition" class="text-lg text-gray-700 mb-2">
            {{ personalDetails.desiredJobPosition }}
          </div>
          <div class="text-sm text-gray-600 space-x-2">
            <span *ngIf="personalDetails.emailAddress">{{ personalDetails.emailAddress }}</span>
            <span *ngIf="personalDetails.phoneNumber">· {{ personalDetails.phoneNumber }}</span>
            <span *ngIf="personalDetails.city">· {{ personalDetails.city }}</span>
          </div>
          <div class="border-b-2 mt-3" [style.border-color]="currentPrimaryColor"></div>
        </div>

        <!-- Sidebar: Skills, Languages, Contact (for two-column layouts) -->
        <div class="resume-sidebar">
          <!-- Personal Details in sidebar (for vertical template) -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2 uppercase tracking-wide"
                [style.color]="currentPrimaryColor"
                [style.border-bottom-color]="currentPrimaryColor">
              <ng-container *ngIf="getTemplateId() === 'cw-vertical'; else contactTitle">
                Personal details
              </ng-container>
              <ng-template #contactTitle>Contact</ng-template>
            </h2>
            <div class="text-sm text-gray-700 space-y-2">
              <!-- Name (only for vertical template) -->
              <div *ngIf="getTemplateId() === 'cw-vertical' && (personalDetails.givenName || personalDetails.familyName)" class="flex items-center gap-2">
                <svg class="w-4 h-4 flex-shrink-0" [style.color]="currentPrimaryColor" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
                <span class="font-medium">{{ personalDetails.givenName }} {{ personalDetails.familyName }}</span>
              </div>

              <!-- Email -->
              <div *ngIf="personalDetails.emailAddress" class="flex items-center gap-2">
                <svg class="w-4 h-4 flex-shrink-0" [style.color]="currentPrimaryColor" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <span>{{ personalDetails.emailAddress }}</span>
              </div>

              <!-- Phone -->
              <div *ngIf="personalDetails.phoneNumber" class="flex items-center gap-2">
                <svg class="w-4 h-4 flex-shrink-0" [style.color]="currentPrimaryColor" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span>{{ personalDetails.phoneNumber }}</span>
              </div>

              <!-- Location/City -->
              <div *ngIf="personalDetails.city" class="flex items-center gap-2">
                <svg class="w-4 h-4 flex-shrink-0" [style.color]="currentPrimaryColor" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span>{{ personalDetails.city }}</span>
              </div>

              <!-- Website/Portfolio (if available) -->
              <div *ngIf="personalDetails.websiteUrl" class="flex items-center gap-2">
                <svg class="w-4 h-4 flex-shrink-0" [style.color]="currentPrimaryColor" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/>
                </svg>
                <span class="break-all">{{ personalDetails.websiteUrl }}</span>
              </div>
            </div>
          </div>

          <!-- Skills Section -->
          <div *ngIf="skills.length > 0" class="mb-6">
            <h2 class="text-xl font-semibold mb-2 uppercase tracking-wide"
                [style.color]="currentPrimaryColor"
                [style.border-bottom-color]="currentPrimaryColor">
              Skills
            </h2>
            <div class="space-y-1">
              <div *ngFor="let skill of skills" class="text-sm text-gray-700">
                {{ skill.skillName }}<span *ngIf="skill.skillLevel" class="text-gray-500 text-xs"> ({{ skill.skillLevel }})</span>
              </div>
            </div>
          </div>

          <!-- Languages Section -->
          <div *ngIf="languages.length > 0" class="mb-6">
            <h2 class="text-xl font-semibold mb-2 uppercase tracking-wide"
                [style.color]="currentPrimaryColor"
                [style.border-bottom-color]="currentPrimaryColor">
              Languages
            </h2>
            <div class="space-y-1">
              <div *ngFor="let lang of languages" class="text-sm text-gray-700">
                {{ lang.languageName }}<span *ngIf="lang.languageLevel" class="text-gray-500 text-xs"> ({{ lang.languageLevel }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content: Profile, Experience, Education -->
        <div class="resume-main">
          <!-- Profile Section -->
          <div *ngIf="profile.content" class="mb-6">
            <h2 class="text-xl font-semibold mb-2 uppercase tracking-wide"
                [style.color]="currentPrimaryColor"
                [style.border-bottom-color]="currentPrimaryColor">
              Profile
            </h2>
            <div class="text-gray-700 text-sm" [innerHTML]="formatContent(profile.content)"></div>
          </div>

          <!-- Experience Section -->
          <div *ngIf="experiences.length > 0" class="mb-6">
            <h2 class="text-xl font-semibold mb-3 uppercase tracking-wide"
                [style.color]="currentPrimaryColor"
                [style.border-bottom-color]="currentPrimaryColor">
              Experience
            </h2>
            <div *ngFor="let exp of experiences" class="mb-4">
              <div class="flex justify-between items-baseline">
                <h3 class="text-base font-semibold text-gray-900">{{ exp.position || 'Position' }}</h3>
                <span class="text-sm text-gray-600">
                  {{ formatDate(exp.startMonth, exp.startYear) }} -
                  {{ exp.isPresent ? 'Present' : formatDate(exp.endMonth, exp.endYear) }}
                </span>
              </div>
              <div class="text-sm text-gray-600 mb-1">{{ exp.employer || 'Company' }}<span *ngIf="exp.city">, {{ exp.city }}</span></div>
              <div *ngIf="exp.description" class="text-sm text-gray-700" [innerHTML]="formatContent(exp.description)"></div>
            </div>
          </div>

          <!-- Education Section -->
          <div *ngIf="educations.length > 0" class="mb-6">
            <h2 class="text-xl font-semibold mb-3 uppercase tracking-wide"
                [style.color]="currentPrimaryColor"
                [style.border-bottom-color]="currentPrimaryColor">
              Education
            </h2>
            <div *ngFor="let edu of educations" class="mb-3">
              <div class="flex justify-between items-baseline">
                <h3 class="text-base font-semibold text-gray-900">{{ edu.degree || 'Degree' }}</h3>
                <span class="text-sm text-gray-600">
                  {{ formatDate(edu.startMonth, edu.startYear) }} -
                  {{ edu.isPresent ? 'Present' : formatDate(edu.endMonth, edu.endYear) }}
                </span>
              </div>
              <div class="text-sm text-gray-600">{{ edu.school || 'School' }}<span *ngIf="edu.city">, {{ edu.city }}</span></div>
              <div *ngIf="edu.description" class="text-sm text-gray-700 mt-1" [innerHTML]="formatContent(edu.description)"></div>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-8 pt-4 border-t text-xs text-gray-400 text-center" [style.border-color]="currentPrimaryColor">
            Created with AlignCV
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    /* Resume paper background */
    .resume-paper {
      background: var(--color-bg, white) !important;
    }

    /* Resume canvas - use inline styles, minimal CSS */
    .resume-canvas {
      min-height: 27cm;
    }

    /* Ensure all elements inherit font settings from canvas */
    .resume-canvas * {
      font-family: inherit !important;
      font-size: inherit !important;
      line-height: inherit !important;
    }

    /* Header styling with tokens */
    .resume-header {
      margin-bottom: var(--spacing-section, 16px) !important;
    }

    .resume-header h1 {
      font-size: 1.7em !important;
      font-weight: bold !important;
    }

    .resume-header .border-b-2 {
      border-color: var(--color-primary, #3b82f6) !important;
    }

    /* All borders use primary color */
    .border-t, .border-b, .border-l, .border-r,
    .border-b-2, .border-t-2 {
      border-color: var(--color-primary, #3b82f6) !important;
    }

    /* Section headings use primary color */
    h2, h2.text-xl {
      color: var(--color-primary, #1f2937) !important;
      font-size: 1.3em !important;
      font-weight: 600 !important;
      margin-bottom: var(--spacing-item, 8px) !important;
      padding-bottom: 0.3em;
      border-bottom: 2px solid var(--color-primary, #3b82f6) !important;
    }

    /* Experience/Education entries */
    .mb-4, .mb-3 {
      margin-bottom: var(--spacing-item, 8px) !important;
    }

    h3 {
      font-weight: 600 !important;
    }

    /* Remove any color overrides - let them inherit */
    .text-gray-600, .text-gray-700, .text-gray-500 {
      opacity: 0.8;
    }

    /* Template styles */
    :host ::ng-deep .token-sans {
      --font-default: 'Inter', sans-serif;
    }

    :host ::ng-deep .token-serif {
      --font-default: 'Georgia', serif;
    }

    :host ::ng-deep .token-mono {
      --font-default: 'Menlo', 'Monaco', monospace;
    }

    /* Palette styles */
    :host ::ng-deep .palette-blue {
      --color-accent: #2563eb;
    }

    :host ::ng-deep .palette-green {
      --color-accent: #059669;
    }

    :host ::ng-deep .palette-rose {
      --color-accent: #e11d48;
    }

    /* Quill HTML content styling */
    :host ::ng-deep p {
      margin-bottom: 0.5rem;
    }

    :host ::ng-deep strong {
      font-weight: 600;
    }

    :host ::ng-deep em {
      font-style: italic;
    }

    :host ::ng-deep u {
      text-decoration: underline;
    }

    :host ::ng-deep a {
      color: #2563eb;
      text-decoration: underline;
    }

    :host ::ng-deep ul,
    :host ::ng-deep ol {
      margin-left: 1.5rem;
      margin-bottom: 0.5rem;
    }

    :host ::ng-deep ul {
      list-style-type: disc;
    }

    :host ::ng-deep ol {
      list-style-type: decimal;
    }

    :host ::ng-deep li {
      margin-bottom: 0.25rem;
    }

    /* Quill alignment classes */
    :host ::ng-deep .ql-align-left {
      text-align: left;
    }

    :host ::ng-deep .ql-align-center {
      text-align: center;
    }

    :host ::ng-deep .ql-align-right {
      text-align: right;
    }

    :host ::ng-deep .ql-align-justify {
      text-align: justify;
    }

    /* Two-column layout support */
    .resume-canvas[data-columns="2"] {
      display: grid;
      grid-template-columns: var(--sidebar-width, 30%) 1fr;
      gap: 24px;
      align-items: start;
    }

    /* Header spans full width in two-column layout */
    .resume-canvas[data-columns="2"] .resume-header {
      grid-column: 1 / -1;
    }

    /* Left sidebar layout */
    .resume-canvas[data-columns="2"][data-sidebar="left"] .resume-sidebar {
      grid-column: 1;
      grid-row: 2;
    }

    .resume-canvas[data-columns="2"][data-sidebar="left"] .resume-main {
      grid-column: 2;
      grid-row: 2;
    }

    /* Right sidebar layout */
    .resume-canvas[data-columns="2"][data-sidebar="right"] .resume-sidebar {
      grid-column: 2;
      grid-row: 2;
    }

    .resume-canvas[data-columns="2"][data-sidebar="right"] .resume-main {
      grid-column: 1;
      grid-row: 2;
    }

    /* Hide sidebar in single-column layout */
    .resume-canvas[data-columns="1"] .resume-sidebar {
      display: none;
    }

    /* Sidebar styling with dark background */
    .resume-sidebar {
      background: var(--color-primary, transparent);
      padding: 24px;
      color: white;
      border-radius: 0 0 0 8px;
    }

    /* Sidebar headings */
    .resume-sidebar h2 {
      color: white !important;
      font-size: calc(var(--font-size-body, 14px) + 2px) !important;
      font-weight: 700 !important;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px !important;
      padding-bottom: 8px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    }

    /* Sidebar text */
    .resume-sidebar .text-sm,
    .resume-sidebar .text-gray-700 {
      color: rgba(255, 255, 255, 0.95) !important;
    }

    .resume-sidebar .text-gray-500 {
      color: rgba(255, 255, 255, 0.7) !important;
    }

    /* Preview wrapper - simple container */
    .preview-wrapper {
      display: block;
      width: 100%;
    }

    /* Resume paper - A4 paper effect */
    .resume-paper {
      width: 100%;
      max-width: 21cm;
      min-height: 29.7cm;
      background: white;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      padding: 2cm 1.5cm;
      margin: 0 auto;
      position: relative;
    }

    /* Horizontal template - top and bottom bars (taller) */
    .resume-paper[data-template="cw-horizontal"]::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: var(--color-primary, #3498db);
      z-index: 10;
    }

    .resume-paper[data-template="cw-horizontal"]::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: var(--color-primary, #3498db);
      z-index: 10;
    }

    .resume-paper[data-template="cw-horizontal"] {
      padding-top: 4cm;
      padding-bottom: 3cm;
    }

    /* Vertical template - left red bar decoration */
    .resume-paper[data-template="cw-vertical"]::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 18px;
      background: var(--color-primary, #e74c3c);
      z-index: 15;
    }

    /* Vertical template - gradient sidebar background */
    .resume-paper[data-template="cw-vertical"] .resume-sidebar {
      background: linear-gradient(to bottom,
        color-mix(in srgb, var(--color-primary, #e74c3c) 15%, transparent) 0%,
        color-mix(in srgb, var(--color-primary, #e74c3c) 8%, transparent) 50%,
        color-mix(in srgb, var(--color-primary, #e74c3c) 3%, transparent) 100%) !important;
      color: #2c3e50 !important;
      padding: 0 1.5rem !important; /* No top/bottom padding - gradient extends full height */
      margin-left: 18px;
      margin-top: -2cm !important; /* Extend to top edge */
      margin-bottom: -2cm !important; /* Extend to bottom edge */
      padding-top: 2cm !important; /* Content padding */
      padding-bottom: 2cm !important; /* Content padding */
    }

    /* Vertical template - sidebar headings (dark red) */
    .resume-paper[data-template="cw-vertical"] .resume-sidebar h2 {
      color: var(--color-primary, #e74c3c) !important;
      border-bottom: 2px solid var(--color-primary, #e74c3c) !important;
      opacity: 1;
    }

    /* Vertical template - sidebar text (dark) */
    .resume-paper[data-template="cw-vertical"] .resume-sidebar .text-sm,
    .resume-paper[data-template="cw-vertical"] .resume-sidebar .text-gray-700 {
      color: #2c3e50 !important;
      opacity: 1;
    }

    .resume-paper[data-template="cw-vertical"] .resume-sidebar .text-gray-500 {
      color: #7f8c8d !important;
      opacity: 1;
    }

    /* Vertical template - hide header (name already in sidebar) */
    .resume-paper[data-template="cw-vertical"] .resume-header {
      display: none;
    }

    @media print {
      .preview-wrapper {
        padding: 0;
        background: white;
      }

      .resume-paper {
        box-shadow: none;
        transform: scale(1);
        padding: 0;
        border-radius: 0;
      }

      .resume-canvas {
        width: 21cm;
        min-height: 29.7cm;
      }
    }
  `]
})
export class PreviewPaneComponent implements OnInit {
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);

  personalDetails: PersonalDetails = {};
  profile: ProfileSummary = { content: '' };
  experiences: ExperienceEntry[] = [];

  // Style properties that will trigger re-rendering
  currentFontFamily = 'Arial';
  currentFontSize = 14;
  currentLineHeight = 1.5;
  currentBgColor = 'white';
  currentTextColor = '#2c3e50';

  // Get layout configuration from CSS variables
  getLayoutColumns(): string {
    if (typeof window !== 'undefined') {
      const columns = getComputedStyle(document.documentElement).getPropertyValue('--layout-columns').trim();
      return columns || '1';
    }
    return '1';
  }

  getSidebarPosition(): string {
    if (typeof window !== 'undefined') {
      const position = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-position').trim();
      return position || 'none';
    }
    return 'none';
  }

  getTemplateId(): string {
    if (typeof window !== 'undefined') {
      const templateId = getComputedStyle(document.documentElement).getPropertyValue('--template-id').trim();
      return templateId || '';
    }
    return '';
  }

  getPaperStyles(): any {
    return {
      'background': this.currentBgColor
    };
  }

  getCanvasStyles(): any {
    return {
      'font-family': this.currentFontFamily,
      'font-size': this.currentFontSize + 'px',
      'line-height': this.currentLineHeight.toString(),
      'color': this.currentTextColor
    };
  }

  currentPrimaryColor = '#2563eb';

  updateStylesFromCssVars() {
    if (typeof window !== 'undefined') {
      const computedStyle = getComputedStyle(document.documentElement);
      this.currentFontFamily = computedStyle.getPropertyValue('--font-family').trim() || 'Arial';
      const fontSize = computedStyle.getPropertyValue('--font-size-body').trim();
      this.currentFontSize = fontSize ? parseInt(fontSize) : 14;
      const lineHeight = computedStyle.getPropertyValue('--line-height').trim();
      this.currentLineHeight = lineHeight ? parseFloat(lineHeight) : 1.5;
      this.currentBgColor = computedStyle.getPropertyValue('--color-bg').trim() || 'white';
      this.currentTextColor = computedStyle.getPropertyValue('--color-text').trim() || '#2c3e50';

      // Get primary color
      const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
      if (primaryColor) {
        this.currentPrimaryColor = primaryColor;
        console.log('Primary color updated:', primaryColor);
      }
    }
  }

  educations: EducationEntry[] = [];
  skills: SkillEntry[] = [];
  languages: LanguageEntry[] = [];

  ngOnInit() {
    // Subscribe to resume state
    this.store.select(ResumeNewState.personalDetails).subscribe(pd => this.personalDetails = pd);
    this.store.select(ResumeNewState.profile).subscribe(p => {
      this.profile = p;
    });
    this.store.select(ResumeNewState.experiences).subscribe(exp => {
      this.experiences = exp;
    });
    this.store.select(ResumeNewState.educations).subscribe(edu => {
      this.educations = edu;
    });
    this.store.select(ResumeNewState.skills).subscribe(s => this.skills = s);
    this.store.select(ResumeNewState.languages).subscribe(l => this.languages = l);

    // Initialize styles from CSS variables
    this.updateStylesFromCssVars();

    // Subscribe to UI state to detect style changes
    this.store.select(UiState.cssClass).subscribe(() => {
      // Update styles when UI state changes
      setTimeout(() => {
        this.updateStylesFromCssVars();
        this.cdr.detectChanges();
      }, 50);
    });

    // Also listen for direct CSS variable changes
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.updateStylesFromCssVars();
        this.cdr.markForCheck();
      }, 500);
    }
  }

  formatDate(month?: string, year?: string): string {
    if (!month && !year) return '';
    if (!month) return year || '';
    if (!year) return month;
    return `${month} ${year}`;
  }

  formatContent(content: string): string {
    if (!content) {
      return '';
    }

    // Quill returns HTML directly, so just return it as-is
    // Angular's [innerHTML] binding will render it safely
    return content;
  }

  /**
   * Parse markdown-style formatting in text
   */
  parseMarkdown(text: string): string {
    if (!text) return '';

    // Bold: **text** -> <strong>text</strong>
    text = text.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');

    // Italic: *text* (but not part of bold) -> <em>text</em>
    // Use negative lookbehind/lookahead to avoid matching ** patterns
    text = text.replace(/(?<!\*)\*(?!\*)([^\*]+)\*(?!\*)/g, '<em>$1</em>');

    // Underline: <u>text</u> is already HTML, keep as-is
    // But we need to ensure it's preserved (no escaping needed since we use innerHTML)

    // Links: [text](url) -> <a href="url">text</a>
    text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>');

    return text;
  }
}