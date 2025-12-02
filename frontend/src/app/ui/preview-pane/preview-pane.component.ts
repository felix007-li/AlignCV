import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
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
import { StyleSyncService, StyleState } from '../style-sync.service';

@Component({
  standalone: true,
  selector: 'app-preview-pane',
  imports: [CommonModule],
  template: `
    <!-- Preview wrapper with proper scaling -->
    <div
      class="preview-wrapper resume-preview"
      [ngClass]="uiClass"
      [ngStyle]="styleVars"
    >
      <ng-container *ngFor="let page of pages; let pageIndex = index">
        <div
          class="resume-paper"
          [ngClass]="{ 'page-2': pageIndex > 0 }"
          [attr.data-template]="getTemplateId()"
          [ngStyle]="getPaperStyles()"
        >
          <div
            class="resume-canvas"
            [attr.data-columns]="getLayoutColumns()"
            [attr.data-sidebar]="getSidebarPosition()"
            [ngStyle]="getCanvasStyles()"
          >
            <!-- Header Section (spans full width in two-column) -->
            <div *ngIf="page.showHeader" class="resume-header mb-6">
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
              <ng-container *ngIf="pageIndex === 0">
                <div class="mb-6">
                  <h2
                    class="text-xl font-semibold mb-2 uppercase tracking-wide"
                    [style.color]="currentPrimaryColor"
                    [style.border-bottom-color]="currentPrimaryColor"
                  >
                    <ng-container *ngIf="getTemplateId() === 'cw-vertical'; else contactTitle">
                      Personal details
                    </ng-container>
                    <ng-template #contactTitle>Contact</ng-template>
                  </h2>
                  <div class="text-sm text-gray-700 space-y-2 text-left">
                    <!-- Name (only for vertical template) -->
                    <div *ngIf="getTemplateId() === 'cw-vertical' && (personalDetails.givenName || personalDetails.familyName)" class="flex items-center gap-2">
                      <svg class="w-4 h-4 flex-shrink-0" [style.color]="'#ffffff'" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                      </svg>
                      <span class="font-medium">{{ personalDetails.givenName }} {{ personalDetails.familyName }}</span>
                    </div>

                    <!-- Email -->
                    <div *ngIf="personalDetails.emailAddress" class="flex items-center gap-2">
                      <svg class="w-4 h-4 flex-shrink-0" [style.color]="'#ffffff'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{{ personalDetails.emailAddress }}</span>
                    </div>

                    <!-- Phone -->
                    <div *ngIf="personalDetails.phoneNumber" class="flex items-center gap-2">
                      <svg class="w-4 h-4 flex-shrink-0" [style.color]="'#ffffff'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{{ personalDetails.phoneNumber }}</span>
                    </div>

                    <!-- Location/City -->
                    <div *ngIf="personalDetails.city" class="flex items-center gap-2">
                      <svg class="w-4 h-4 flex-shrink-0" [style.color]="'#ffffff'" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                      </svg>
                      <span>{{ personalDetails.city }}</span>
                    </div>

                    <!-- Website/Portfolio (if available) -->
                    <div *ngIf="personalDetails?.websiteUrl" class="flex items-center gap-2">
                      <svg class="w-4 h-4 flex-shrink-0" [style.color]="currentPrimaryColor" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
                      </svg>
                      <span class="break-all">{{ personalDetails?.websiteUrl }}</span>
                    </div>
                  </div>
                </div>
              </ng-container>

              <!-- Skills Section -->
              <div *ngIf="page.skills.length > 0" class="mb-6">
                <h2
                  class="text-xl font-semibold mb-2 uppercase tracking-wide"
                  [style.color]="currentPrimaryColor"
                  [style.border-bottom-color]="currentPrimaryColor"
                >
                  Skills
                </h2>
                <div class="space-y-1">
                  <div *ngFor="let skill of page.skills; trackBy: trackSkill" class="text-sm text-gray-700">
                    {{ skill.skillName }}<span *ngIf="skill.skillLevel" class="text-gray-500 text-xs"> ({{ skill.skillLevel }})</span>
                  </div>
                </div>
              </div>

              <!-- Languages Section -->
              <div *ngIf="page.languages.length > 0" class="mb-6">
                <h2
                  class="text-xl font-semibold mb-2 uppercase tracking-wide"
                  [style.color]="currentPrimaryColor"
                  [style.border-bottom-color]="currentPrimaryColor"
                >
                  Languages
                </h2>
                <div class="space-y-1">
                  <div *ngFor="let lang of page.languages; trackBy: trackLanguage" class="text-sm text-gray-700">
                    {{ lang.languageName }}<span *ngIf="lang.languageLevel" class="text-gray-500 text-xs"> ({{ lang.languageLevel }})</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Main Content: Profile, Experience, Education -->
            <div class="resume-main">
              <!-- Profile Section -->
              <div *ngIf="page.profile" class="mb-6">
                <h2
                  class="text-xl font-semibold mb-2 uppercase tracking-wide"
                  [style.color]="currentPrimaryColor"
                  [style.border-bottom-color]="currentPrimaryColor"
                >
                  Profile
                </h2>
                <div class="text-gray-700 text-sm" [innerHTML]="formatContent(page.profile)"></div>
              </div>

              <!-- Experience Section -->
              <div *ngIf="page.experiences.length > 0" class="mb-6">
                <h2
                  class="text-xl font-semibold mb-3 uppercase tracking-wide"
                  [style.color]="currentPrimaryColor"
                  [style.border-bottom-color]="currentPrimaryColor"
                >
                  Experience
                </h2>
                <div *ngFor="let exp of page.experiences; trackBy: trackExperience" class="mb-4">
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
              <div *ngIf="page.educations.length > 0" class="mb-6">
                <h2
                  class="text-xl font-semibold mb-3 uppercase tracking-wide"
                  [style.color]="currentPrimaryColor"
                  [style.border-bottom-color]="currentPrimaryColor"
                >
                  Education
                </h2>
                <div *ngFor="let edu of page.educations; trackBy: trackEducation" class="mb-3">
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

              <div *ngIf="page.showFooter" class="resume-footer text-xs text-gray-400 text-center">
                Created with AlignCV
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- Hidden measurement DOM for accurate pagination -->
      <div
        class="resume-paper measurement-paper"
        #pageSizeProbe
        [attr.data-template]="getTemplateId()"
        [ngStyle]="getPaperStyles()"
        aria-hidden="true"
      >
        <div
          class="resume-canvas"
          [attr.data-columns]="getLayoutColumns()"
          [attr.data-sidebar]="getSidebarPosition()"
          [ngStyle]="getCanvasStyles()"
        >
          <div #headerMeasure class="resume-header mb-6">
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

          <div class="resume-sidebar">
            <div #contactMeasure class="mb-6">
              <h2
                class="text-xl font-semibold mb-2 uppercase tracking-wide"
                [style.color]="currentPrimaryColor"
                [style.border-bottom-color]="currentPrimaryColor"
              >
                <ng-container *ngIf="getTemplateId() === 'cw-vertical'; else contactTitleMeasure">
                  Personal details
                </ng-container>
                <ng-template #contactTitleMeasure>Contact</ng-template>
              </h2>
              <div class="text-sm text-gray-700 space-y-2 text-left">
                <div *ngIf="getTemplateId() === 'cw-vertical' && (personalDetails.givenName || personalDetails.familyName)" class="flex items-center gap-2">
                  <svg class="w-4 h-4 flex-shrink-0" [style.color]="'#ffffff'" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  <span class="font-medium">{{ personalDetails.givenName }} {{ personalDetails.familyName }}</span>
                </div>

                <div *ngIf="personalDetails.emailAddress" class="flex items-center gap-2">
                  <svg class="w-4 h-4 flex-shrink-0" [style.color]="'#ffffff'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{{ personalDetails.emailAddress }}</span>
                </div>

                <div *ngIf="personalDetails.phoneNumber" class="flex items-center gap-2">
                  <svg class="w-4 h-4 flex-shrink-0" [style.color]="'#ffffff'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{{ personalDetails.phoneNumber }}</span>
                </div>

                <div *ngIf="personalDetails.city" class="flex items-center gap-2">
                  <svg class="w-4 h-4 flex-shrink-0" [style.color]="'#ffffff'" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ personalDetails.city }}</span>
                </div>

                <div *ngIf="personalDetails?.websiteUrl" class="flex items-center gap-2">
                  <svg class="w-4 h-4 flex-shrink-0" [style.color]="currentPrimaryColor" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
                  </svg>
                  <span class="break-all">{{ personalDetails?.websiteUrl }}</span>
                </div>
              </div>
            </div>

            <div *ngIf="skills.length > 0" class="mb-6">
              <h2
                class="text-xl font-semibold mb-2 uppercase tracking-wide"
                [style.color]="currentPrimaryColor"
                [style.border-bottom-color]="currentPrimaryColor"
              >
                Skills
              </h2>
              <div class="space-y-1">
                <div *ngFor="let skill of skills; trackBy: trackSkill" #skillMeasure class="text-sm text-gray-700">
                  {{ skill.skillName }}<span *ngIf="skill.skillLevel" class="text-gray-500 text-xs"> ({{ skill.skillLevel }})</span>
                </div>
              </div>
            </div>

            <div *ngIf="languages.length > 0" class="mb-6">
              <h2
                class="text-xl font-semibold mb-2 uppercase tracking-wide"
                [style.color]="currentPrimaryColor"
                [style.border-bottom-color]="currentPrimaryColor"
              >
                Languages
              </h2>
              <div class="space-y-1">
                <div *ngFor="let lang of languages; trackBy: trackLanguage" #languageMeasure class="text-sm text-gray-700">
                  {{ lang.languageName }}<span *ngIf="lang.languageLevel" class="text-gray-500 text-xs"> ({{ lang.languageLevel }})</span>
                </div>
              </div>
            </div>
          </div>

          <div class="resume-main">
            <div *ngIf="profile?.content" #profileMeasure class="mb-6">
              <h2
                class="text-xl font-semibold mb-2 uppercase tracking-wide"
                [style.color]="currentPrimaryColor"
                [style.border-bottom-color]="currentPrimaryColor"
              >
                Profile
              </h2>
              <div class="text-gray-700 text-sm" [innerHTML]="formatContent(profile.content)"></div>
            </div>

            <div *ngIf="experiences.length > 0" class="mb-6">
              <div *ngFor="let exp of experiences; trackBy: trackExperience" #experienceMeasure class="mb-4">
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

            <div *ngIf="educations.length > 0" class="mb-6">
              <div *ngFor="let edu of educations; trackBy: trackEducation" #educationMeasure class="mb-3">
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

            <div #footerMeasure class="resume-footer text-xs text-gray-400 text-center">
              Created with AlignCV
            </div>
          </div>
        </div>
      </div>

      <div
        class="resume-paper page-2 measurement-paper"
        #page2SizeProbe
        [attr.data-template]="getTemplateId()"
        [ngStyle]="getPaperStyles()"
        aria-hidden="true"
      ></div>
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

    .measurement-paper {
      position: absolute;
      left: -9999px;
      top: 0;
      visibility: hidden;
      pointer-events: none;
      margin: 0 !important;
    }

    /* Resume canvas - fill paper height for footer positioning */
    .resume-canvas {
      display: flex;
      flex-direction: column;
      height: 100%;
      flex: 1;
      box-sizing: border-box;
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
      grid-template-rows: auto 1fr;
      gap: 24px;
      align-items: stretch;
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
      text-align: left;
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
      text-align: left !important;
    }

    /* Force all nested items to align start (avoid accidental center alignment) */
    .resume-sidebar * {
      text-align: left !important;
    }

    .resume-sidebar .flex {
      justify-content: flex-start !important;
    }

    .resume-sidebar .text-gray-500 {
      color: rgba(255, 255, 255, 0.7) !important;
      text-align: left !important;
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
      height: 29.7cm; /* A4 height - fixed height for proper pagination */
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 1.6cm 1.4cm;
      margin: 0 auto 2rem; /* Bottom margin for spacing */
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden; /* Hide content that exceeds page height */
    }

    /* Main column fills height so footer can stick to bottom when content is short */
    .resume-main {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .resume-footer {
      margin-top: auto;
      padding-top: 16px;
      padding-bottom: 12px;
      text-align: center;
      border-top: 1px solid var(--color-primary, #3b82f6);
      color: rgba(55, 65, 81, 0.65);
      font-size: 0.85em;
    }

    /* Keep same padding/margins on continuation pages and hide heavy shadow */
    .resume-paper.page-2 {
      height: 29.7cm; /* Same A4 height for page 2 */
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      margin-top: 3rem; /* Clear visual separation between pages */
      margin-bottom: 2rem; /* Bottom margin for spacing */
      padding-top: 1.2cm;
      padding-bottom: 1.2cm;
      padding-left: 1.4cm;
      padding-right: 1.4cm;
      display: block; /* Ensure it's a separate block */
      overflow: hidden; /* Hide content that exceeds page height */
      page-break-before: always; /* Force page break for printing */
    }

    /* Second page: keep decorative elements for visual consistency */
    /* Note: we keep the red bar and gradient sidebar for vertical template on page 2 */

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

    /* Vertical template - reduce grid gap for more sidebar space */
    .resume-paper[data-template="cw-vertical"] .resume-canvas[data-columns="2"] {
      gap: 16px !important; /* Smaller gap for vertical template */
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
      padding-left: calc(18px + 0.75rem) !important; /* Add red bar width to left padding */
      padding-right: 0.75rem !important;
      margin-left: 0 !important; /* Remove margin to fix grid layout */
      margin-top: -1.6cm !important; /* Extend to top edge (match paper padding) */
      margin-bottom: -1.6cm !important; /* Extend to bottom edge (match paper padding) */
      padding-top: 1.6cm !important; /* Content padding (match paper padding) */
      padding-bottom: 1.6cm !important; /* Content padding (match paper padding) */
      /* Prevent text overflow */
      overflow: hidden;
      word-wrap: break-word;
      overflow-wrap: break-word;
      box-sizing: border-box !important; /* Ensure padding is included in width */
    }

    /* Vertical template - page 2 sidebar: adjust margins to match page-2 padding */
    .resume-paper.page-2[data-template="cw-vertical"] .resume-sidebar {
      margin-top: -1.2cm !important; /* Match page-2 padding-top */
      margin-bottom: -1.2cm !important; /* Match page-2 padding-bottom */
      padding-top: 1.2cm !important; /* Match page-2 padding-top */
      padding-bottom: 1.2cm !important; /* Match page-2 padding-bottom */
    }

    /* Vertical template - sidebar headings (dark red) */
    .resume-paper[data-template="cw-vertical"] .resume-sidebar h2 {
      color: var(--color-primary, #e74c3c) !important;
      border-bottom: 2px solid var(--color-primary, #e74c3c) !important;
      opacity: 1;
      word-break: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      width: 100%;
      max-width: 100%;
      font-size: 11px !important; /* Even smaller font to prevent overflow */
      letter-spacing: 0.01em !important; /* Minimal letter spacing */
      line-height: 1.2 !important; /* Tight line height for wrapped text */
      padding-right: 4px !important; /* Extra padding to prevent text touching edge */
    }

    /* Vertical template - sidebar text (dark) */
    .resume-paper[data-template="cw-vertical"] .resume-sidebar .text-sm,
    .resume-paper[data-template="cw-vertical"] .resume-sidebar .text-gray-700 {
      color: #2c3e50 !important;
      opacity: 1;
      word-break: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }

    .resume-paper[data-template="cw-vertical"] .resume-sidebar .text-gray-500 {
      color: #7f8c8d !important;
      opacity: 1;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    /* Vertical template - personal details container */
    .resume-paper[data-template="cw-vertical"] .resume-sidebar .space-y-2 > div {
      max-width: 100%;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    /* Vertical template - ensure long emails and URLs wrap properly */
    .resume-paper[data-template="cw-vertical"] .resume-sidebar span {
      word-break: break-word;
      overflow-wrap: break-word;
      display: inline-block;
      max-width: 100%;
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
export class PreviewPaneComponent implements OnInit, OnDestroy, AfterViewInit {
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  private styleSync = inject(StyleSyncService);
  // ensure subscription cleaned up if needed in future
  // (currently not unsubscribed because component lives for page lifetime)

  personalDetails: PersonalDetails = {};
  profile: ProfileSummary = { content: '' };
  experiences: ExperienceEntry[] = [];

  // Track whether we need second page
  showSecondPage = false;
  @ViewChild('pageSizeProbe') pageSizeProbe?: ElementRef<HTMLElement>;
  @ViewChild('page2SizeProbe') page2SizeProbe?: ElementRef<HTMLElement>;
  @ViewChild('headerMeasure') headerMeasure?: ElementRef<HTMLElement>;
  @ViewChild('contactMeasure') contactMeasure?: ElementRef<HTMLElement>;
  @ViewChild('profileMeasure') profileMeasure?: ElementRef<HTMLElement>;
  @ViewChildren('experienceMeasure') experienceMeasures?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('educationMeasure') educationMeasures?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('skillMeasure') skillMeasures?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('languageMeasure') languageMeasures?: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('footerMeasure') footerMeasure?: ElementRef<HTMLElement>;
  private paginationTimer?: number;

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
  updateShowSecondPage() {
    this.schedulePagination();
  }

  ngAfterViewInit() {
    this.schedulePagination();
  }

  private schedulePagination(allowRetry = true) {
    if (this.paginationTimer) {
      clearTimeout(this.paginationTimer);
    }

    if (typeof window === 'undefined') {
      this.buildPagesHeuristic();
      this.finalizePagination();
      return;
    }

    this.paginationTimer = window.setTimeout(() => {
      const built = this.buildPagesFromMeasurements();
      if (!built) {
        this.buildPagesHeuristic();
        this.finalizePagination();
        if (allowRetry) {
          this.schedulePagination(false);
        }
        return;
      }
      this.finalizePagination();
    }, 60);
  }

  private finalizePagination() {
    this.showSecondPage = this.pages.length > 1;
    this.cdr.detectChanges();
  }

  educations: EducationEntry[] = [];
  skills: SkillEntry[] = [];
  languages: LanguageEntry[] = [];
  styleVars: Record<string, string> = {};
  uiClass = '';
  private styleSyncSub?: Subscription;
  pages: Array<{
    profile?: string;
    experiences: ExperienceEntry[];
    educations: EducationEntry[];
    skills: SkillEntry[];
    languages: LanguageEntry[];
    showHeader: boolean;
    showFooter: boolean;
  }> = [];
  uiStateSub = this.store.select((state: any) => state.ui).subscribe(ui => {
    if (ui) {
      const primary = this.mapPaletteToColor(ui.palette);
      this.currentFontFamily = ui.font || this.currentFontFamily;
      this.currentFontSize = ui.fontSize || this.currentFontSize;
      this.currentLineHeight = ui.lineHeight || this.currentLineHeight;
      this.currentPrimaryColor = primary;

      this.styleVars = {
        '--font-family': this.currentFontFamily,
        '--font-size': `${this.currentFontSize}px`,
        '--font-size-body': `${this.currentFontSize}px`,
        '--line-height': String(this.currentLineHeight),
        '--color-primary': primary
      };

      document.documentElement.style.setProperty('--font-family', this.currentFontFamily);
      document.documentElement.style.setProperty('--font-size-body', `${this.currentFontSize}px`);
      document.documentElement.style.setProperty('--font-size', `${this.currentFontSize}px`);
      document.documentElement.style.setProperty('--line-height', String(this.currentLineHeight));
      document.documentElement.style.setProperty('--color-primary', primary);

      this.currentTextColor = this.currentTextColor || '#2c3e50';
      this.cdr.markForCheck();
    }
  });

  cssClassSub = this.store.select(UiState.cssClass).subscribe(cls => {
    this.uiClass = cls || '';
    this.cdr.markForCheck();
  });
  private mapPaletteToColor(palette: any): string {
    const paletteColors: any = {
      blue: '#2563eb',
      green: '#059669',
      rose: '#e11d48',
      purple: '#7c3aed',
      orange: '#ea580c',
      teal: '#0d9488',
      indigo: '#4f46e5',
      slate: '#475569'
    };
    return paletteColors[palette] || this.currentPrimaryColor || '#2563eb';
  }

  ngOnInit() {
    // Subscribe to resume state
    this.store.select(ResumeNewState.personalDetails).subscribe(pd => {
      this.personalDetails = pd;
      this.updateShowSecondPage();
    });
    this.store.select(ResumeNewState.profile).subscribe(p => {
      this.profile = p;
      this.updateShowSecondPage();
    });
    this.store.select(ResumeNewState.experiences).subscribe(exp => {
      this.experiences = exp;
      this.updateShowSecondPage();
    });
    this.store.select(ResumeNewState.educations).subscribe(edu => {
      this.educations = edu;
      this.updateShowSecondPage();
    });
    this.store.select(ResumeNewState.skills).subscribe(s => {
      this.skills = s;
      this.updateShowSecondPage();
    });
    this.store.select(ResumeNewState.languages).subscribe(l => {
      this.languages = l;
      this.updateShowSecondPage();
    });

    // Initialize styles from CSS variables
    this.updateStylesFromCssVars();
    this.updateShowSecondPage(); // Initial pagination pass

    // Subscribe to UI state to detect style changes
    this.store.select(UiState.cssClass).subscribe(() => {
      // Update styles when UI state changes
      setTimeout(() => {
        this.updateStylesFromCssVars();
        this.cdr.detectChanges();
        this.schedulePagination();
      }, 50);
    });

    // Also listen for direct CSS variable changes
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.updateStylesFromCssVars();
        this.cdr.markForCheck();
      }, 500);
    }

    // Listen to style sync service for live updates from style panel
    this.styleSyncSub = this.styleSync.stateChanges.subscribe((state: StyleState) => {
      this.currentFontFamily = state.font;
      this.currentFontSize = state.fontSize;
      this.currentLineHeight = state.lineHeight;
      this.currentPrimaryColor = state.colorPrimary;
      this.styleVars = {
        '--font-family': state.font,
        '--font-size': `${state.fontSize}px`,
        '--font-size-body': `${state.fontSize}px`,
        '--line-height': String(state.lineHeight),
        '--color-primary': state.colorPrimary
      };
      this.cdr.markForCheck();
      this.schedulePagination();
    });
  }

  ngOnDestroy() {
    this.styleSyncSub?.unsubscribe?.();
    if (this.paginationTimer) {
      clearTimeout(this.paginationTimer);
    }
  }

  private buildPagesFromMeasurements(): boolean {
    if (
      !this.pageSizeProbe ||
      !this.page2SizeProbe ||
      !this.experienceMeasures ||
      !this.educationMeasures ||
      !this.skillMeasures ||
      !this.languageMeasures
    ) {
      return false;
    }

    const experienceReady = this.experienceMeasures.length === this.experiences.length;
    const educationReady = this.educationMeasures.length === this.educations.length;
    const skillReady = this.skillMeasures.length === this.skills.length;
    const languageReady = this.languageMeasures.length === this.languages.length;

    if (!experienceReady || !educationReady || !skillReady || !languageReady) {
      return false;
    }

    const firstPageLimit = this.getPageContentHeight(true);
    const nextPageLimit = this.getPageContentHeight(false);

    const headerHeight = this.measureHeight(this.headerMeasure);
    const contactHeight = this.measureHeight(this.contactMeasure);
    const profileHeight = this.measureHeight(this.profileMeasure);
    const experienceHeights = this.measureList(this.experienceMeasures);
    const educationHeights = this.measureList(this.educationMeasures);
    const skillHeights = this.measureList(this.skillMeasures);
    const languageHeights = this.measureList(this.languageMeasures);

    const pages: Array<{
      profile?: string;
      experiences: ExperienceEntry[];
      educations: EducationEntry[];
      skills: SkillEntry[];
      languages: LanguageEntry[];
      showHeader: boolean;
      showFooter: boolean;
    }> = [];

    const footerHeight = this.footerHeight();
    let currentPage = this.emptyPage(true);
    let availableHeight = Math.max(0, firstPageLimit - headerHeight - footerHeight);
    let mainHeight = 0;
    let sidebarHeight = Math.min(contactHeight, availableHeight);

    const startNewPage = () => {
      currentPage.showFooter = true;
      pages.push(currentPage);
      currentPage = this.emptyPage(false);
      availableHeight = Math.max(0, nextPageLimit - footerHeight);
      mainHeight = 0;
      sidebarHeight = 0;
    };

    const addBlock = (height: number, column: 'main' | 'sidebar', cb: () => void): void => {
      const safeHeight = Math.max(0, Math.ceil(height));
      const currentColumnHeight = column === 'main' ? mainHeight : sidebarHeight;
      if (currentColumnHeight + safeHeight > availableHeight) {
        startNewPage();
        sidebarHeight = 0;
        addBlock(height, column, cb);
        return;
      }

      cb();
      if (column === 'main') {
        mainHeight += safeHeight;
      } else {
        sidebarHeight += safeHeight;
      }
    };

    if (this.profile?.content) {
      addBlock(profileHeight, 'main', () => { currentPage.profile = this.profile.content; });
    }

    this.skills.forEach((skill, idx) => {
      const h = skillHeights[idx] ?? 22;
      addBlock(h, 'sidebar', () => currentPage.skills.push(skill));
    });

    this.languages.forEach((lang, idx) => {
      const h = languageHeights[idx] ?? 20;
      addBlock(h, 'sidebar', () => currentPage.languages.push(lang));
    });

    this.experiences.forEach((exp, idx) => {
      const h = experienceHeights[idx] ?? this.estimateExperienceHeight(exp);
      addBlock(h, 'main', () => currentPage.experiences.push(exp));
    });

    this.educations.forEach((edu, idx) => {
      const h = educationHeights[idx] ?? this.estimateEducationHeight(edu);
      addBlock(h, 'main', () => currentPage.educations.push(edu));
    });

    currentPage.showFooter = true;
    pages.push(currentPage);
    this.pages = pages;
    return true;
  }

  private getPageContentHeight(isFirstPage: boolean) {
    const probe = isFirstPage ? this.pageSizeProbe : this.page2SizeProbe;
    if (probe?.nativeElement && typeof window !== 'undefined') {
      const el = probe.nativeElement;
      const styles = getComputedStyle(el);
      const paddingTop = parseFloat(styles.paddingTop) || 0;
      const paddingBottom = parseFloat(styles.paddingBottom) || 0;
      return Math.max(0, el.clientHeight - paddingTop - paddingBottom);
    }
    return isFirstPage ? 1000 : 1080;
  }

  private measureHeight(ref?: ElementRef<HTMLElement>): number {
    if (!ref?.nativeElement) return 0;
    const rect = ref.nativeElement.getBoundingClientRect();

    if (typeof window === 'undefined') {
      return Math.ceil(rect.height);
    }

    const styles = getComputedStyle(ref.nativeElement);
    const marginTop = parseFloat(styles.marginTop || '0') || 0;
    const marginBottom = parseFloat(styles.marginBottom || '0') || 0;

    return Math.ceil(rect.height + marginTop + marginBottom);
  }

  private measureList(list?: QueryList<ElementRef<HTMLElement>>): number[] {
    if (!list) return [];
    return list.toArray().map(el => this.measureHeight(el));
  }

  // Heuristic pagination approximating A4 height
  private buildPagesHeuristic() {
    // A4 at 29.7cm = 1122px at 96dpi
    // Available content height = 29.7cm - top padding (1.6cm) - bottom padding (1.6cm) = 26.5cm ≈ 1000px
    const pageLimit = 1000; // Available content height for first page
    const page2Limit = 1080; // Second page has less top padding (1.2cm), so more content height
    const footerHeight = this.footerHeight();
    const estimatedContact = this.estimateContactHeight();

    const pages: Array<{
      profile?: string;
      experiences: ExperienceEntry[];
      educations: EducationEntry[];
      skills: SkillEntry[];
      languages: LanguageEntry[];
      showHeader: boolean;
      showFooter: boolean;
    }> = [];

    const pushSkill = (skill: SkillEntry) => currentPage.skills.push(skill);
    const pushLanguage = (lang: LanguageEntry) => currentPage.languages.push(lang);
    let currentPage = this.emptyPage(true);
    let mainHeight = this.headerHeight();
    let sidebarHeight = estimatedContact;
    let isFirstPage = true;

    const addBlock = (height: number, column: 'main' | 'sidebar', cb: () => void) => {
      const limit = (isFirstPage ? pageLimit : page2Limit) - footerHeight;
      const targetHeight = column === 'sidebar' ? sidebarHeight : mainHeight;

      if (targetHeight + height > limit) {
        currentPage.showFooter = true;
        pages.push(currentPage);
        currentPage = this.emptyPage(false); // Next page has no header
        mainHeight = this.headerlessTopPadding();
        sidebarHeight = 0;
        isFirstPage = false;
      }
      cb();
      if (column === 'sidebar') {
        sidebarHeight += height;
      } else {
        mainHeight += height;
      }
    };

    // Profile
    if (this.profile?.content) {
      const h = this.estimateProfileHeight(this.profile.content);
      addBlock(h, 'main', () => { currentPage.profile = this.profile?.content || ''; });
    }

    // Skills
    this.skills.forEach((skill) => {
      const h = 22; // approx per skill line
      addBlock(h, 'sidebar', () => currentPage.skills.push(skill));
    });

    // Languages
    this.languages.forEach((lang) => {
      const h = 20; // approx per language line
      addBlock(h, 'sidebar', () => currentPage.languages.push(lang));
    });

    // Experiences
    this.experiences.forEach((exp) => {
      const h = this.estimateExperienceHeight(exp);
      addBlock(h, 'main', () => currentPage.experiences.push(exp));
    });

    // Education
    this.educations.forEach((edu) => {
      const h = this.estimateEducationHeight(edu);
      addBlock(h, 'main', () => currentPage.educations.push(edu));
    });

    currentPage.showFooter = true;
    pages.push(currentPage);
    this.pages = pages;
  }

  private emptyPage(showHeader: boolean): {
    profile: string;
    experiences: ExperienceEntry[];
    educations: EducationEntry[];
    skills: SkillEntry[];
    languages: LanguageEntry[];
    showHeader: boolean;
    showFooter: boolean;
  } {
    return {
      profile: '',
      experiences: [] as ExperienceEntry[],
      educations: [] as EducationEntry[],
      skills: [] as SkillEntry[],
      languages: [] as LanguageEntry[],
      showHeader,
      showFooter: false
    };
  }

  private headerHeight() {
    // Name + headline + contact info + border
    return 120; // Reduced from 180 to allow more content on first page
  }

  private headerlessTopPadding() {
    // Just top padding for page 2
    return 40; // Reduced from 80
  }

  private estimateContactHeight() {
    const hasContact =
      (this.personalDetails?.givenName || this.personalDetails?.familyName || this.personalDetails?.emailAddress || this.personalDetails?.phoneNumber || this.personalDetails?.city);
    return hasContact ? 180 : 0;
  }

  trackExperience(index: number, exp: ExperienceEntry) {
    return exp.id || index;
  }

  trackEducation(index: number, edu: EducationEntry) {
    return edu.id || index;
  }

  trackSkill(index: number, skill: SkillEntry) {
    return skill.id || index;
  }

  trackLanguage(index: number, lang: LanguageEntry) {
    return lang.id || index;
  }

  private estimateProfileHeight(text: string) {
    const lines = Math.max(1, Math.ceil(text.length / 80));
    return 60 + lines * 18;
  }

  private estimateExperienceHeight(exp: ExperienceEntry) {
    const base = 60; // Title + company + dates
    const descLen = (exp.description || '').length;
    // For two-column layout, main area is ~70% width, so more chars per line
    const charsPerLine = 120; // Increased from 90
    const descLines = Math.ceil(descLen / charsPerLine);
    const lineHeight = 16; // Reduced from 18
    return base + descLines * lineHeight;
  }

  private estimateEducationHeight(edu: EducationEntry) {
    const base = 60;
    const descLen = (edu.description || '').length;
    const descLines = Math.ceil(descLen / 90);
    return base + descLines * 16;
  }

  private footerHeight() {
    const measured = this.measureHeight(this.footerMeasure);
    if (measured) {
      return measured;
    }

    const fontPx = this.currentFontSize || 14;
    const line = fontPx * (this.currentLineHeight || 1.4);
    const paddingTop = 16;
    const paddingBottom = 12;
    const border = 1;

    return Math.ceil(line + paddingTop + paddingBottom + border);
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

    // If HTML is already present, return as-is
    if (/<\/?[a-z][\s\S]*>/i.test(content)) {
      return content;
    }

    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const lines = content.split(/\r?\n/);
    const html: string[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let lastLiIndex: number | null = null;

    const closeList = () => {
      if (listType) {
        html.push(`</${listType}>`);
        listType = null;
        lastLiIndex = null;
      }
    };

    const isBullet = (line: string): { type: 'ul' | 'ol'; text: string } | null => {
      const ulMatch = line.match(/^(?:[-*]|·)\s+(.*)/);
      if (ulMatch) return { type: 'ul', text: ulMatch[1] };
      const olMatch = line.match(/^(\d+[\.\)])\s+(.*)/);
      if (olMatch) return { type: 'ol', text: olMatch[2] };
      return null;
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        closeList();
        html.push('<br>');
        continue;
      }

      const bullet = isBullet(line);
      if (bullet) {
        if (listType !== bullet.type) {
          closeList();
          listType = bullet.type;
          html.push(`<${listType}>`);
        }
        html.push(`<li>${escapeHtml(bullet.text)}</li>`);
        lastLiIndex = html.length - 1;
        continue;
      }

      // Continuation line for current list item (no bullet)
      if (listType && lastLiIndex !== null) {
        html[lastLiIndex] = html[lastLiIndex].replace(/<\/li>$/, ' ' + escapeHtml(line) + '</li>');
        continue;
      }

      closeList();
      html.push(`<div>${escapeHtml(line)}</div>`);
    }

    closeList();
    return html.join('');
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
