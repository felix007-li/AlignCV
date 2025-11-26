import { Component, OnInit, inject } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-preview-pane',
  imports: [CommonModule],
  template: `
    <div class="border border-gray-200 rounded-lg bg-white shadow-lg p-8 mx-auto"
         style="width: 21cm; min-height: 29.7cm; background: white;">

      <div class="resume-canvas">

        <!-- Header Section -->
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
          <div class="border-b-2 border-gray-300 mt-3"></div>
        </div>

        <!-- Profile Section -->
        <div *ngIf="profile.content" class="mb-6">
          <h2 class="text-xl font-semibold mb-2 uppercase tracking-wide text-gray-800">
            Profile
          </h2>
          <div class="text-gray-700 text-sm" [innerHTML]="formatContent(profile.content)"></div>
        </div>

        <!-- Experience Section -->
        <div *ngIf="experiences.length > 0" class="mb-6">
          <h2 class="text-xl font-semibold mb-3 uppercase tracking-wide text-gray-800">
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
          <h2 class="text-xl font-semibold mb-3 uppercase tracking-wide text-gray-800">
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

        <!-- Skills Section -->
        <div *ngIf="skills.length > 0" class="mb-6">
          <h2 class="text-xl font-semibold mb-2 uppercase tracking-wide text-gray-800">
            Skills
          </h2>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let skill of skills" class="text-sm text-gray-700">
              {{ skill.skillName }}<span *ngIf="skill.skillLevel" class="text-gray-500"> ({{ skill.skillLevel }})</span>
              <span class="text-gray-400">·</span>
            </span>
          </div>
        </div>

        <!-- Languages Section -->
        <div *ngIf="languages.length > 0" class="mb-6">
          <h2 class="text-xl font-semibold mb-2 uppercase tracking-wide text-gray-800">
            Languages
          </h2>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let lang of languages" class="text-sm text-gray-700">
              {{ lang.languageName }}<span *ngIf="lang.languageLevel" class="text-gray-500"> ({{ lang.languageLevel }})</span>
              <span class="text-gray-400">·</span>
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
          Created with AlignCV
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .resume-canvas {
      min-height: 27cm;
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

    @media print {
      .resume-canvas {
        width: 21cm;
        min-height: 29.7cm;
      }
    }
  `]
})
export class PreviewPaneComponent implements OnInit {
  private store = inject(Store);

  personalDetails: PersonalDetails = {};
  profile: ProfileSummary = { content: '' };
  experiences: ExperienceEntry[] = [];
  educations: EducationEntry[] = [];
  skills: SkillEntry[] = [];
  languages: LanguageEntry[] = [];

  ngOnInit() {
    // Subscribe to state
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