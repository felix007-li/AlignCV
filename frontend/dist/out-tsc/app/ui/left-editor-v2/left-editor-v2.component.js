var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ResumeNewState, UpdatePersonalDetails, AddExperience, UpdateExperience, DeleteExperience, ToggleExperienceExpanded, AddEducation, AddSkill, DeleteSkill, ToggleSectionCollapsed } from '../../state/resume-new.state';
let LeftEditorV2Component = class LeftEditorV2Component {
    constructor() {
        this.store = inject(Store);
        this.personalDetails = {};
        this.profile = { content: '' };
        this.experiences = [];
        this.educations = [];
        this.skills = [];
        this.languages = [];
        this.courses = [];
        this.certificates = [];
        this.sectionsCollapsed = {
            experiences: false,
            educations: false,
            skills: false,
            languages: false,
            courses: false,
            certificates: false
        };
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.years = [];
    }
    ngOnInit() {
        // Generate years
        const currentYear = new Date().getFullYear();
        for (let year = currentYear + 10; year >= 1970; year--) {
            this.years.push(year);
        }
        // Subscribe to state
        this.store.select(ResumeNewState.personalDetails).subscribe(pd => this.personalDetails = pd);
        this.store.select(ResumeNewState.profile).subscribe(p => this.profile = p);
        this.store.select(ResumeNewState.experiences).subscribe(exp => this.experiences = exp);
        this.store.select(ResumeNewState.educations).subscribe(edu => this.educations = edu);
        this.store.select(ResumeNewState.skills).subscribe(s => this.skills = s);
        this.store.select(ResumeNewState.languages).subscribe(l => this.languages = l);
        this.store.select(ResumeNewState.courses).subscribe(c => this.courses = c);
        this.store.select(ResumeNewState.certificates).subscribe(cert => this.certificates = cert);
        this.store.select(ResumeNewState.sectionsCollapsed).subscribe(sc => this.sectionsCollapsed = sc);
    }
    updatePersonalDetails() {
        this.store.dispatch(new UpdatePersonalDetails(this.personalDetails));
    }
    toggleSection(section) {
        this.store.dispatch(new ToggleSectionCollapsed(section));
    }
    addNewExperience() {
        this.store.dispatch(new AddExperience());
    }
    addNewEducation() {
        this.store.dispatch(new AddEducation());
    }
    addNewSkill() {
        const skillName = prompt('Enter skill name:');
        if (skillName) {
            this.store.dispatch(new AddSkill({ skillName, skillLevel: 'Intermediate' }));
        }
    }
    deleteSkill(id) {
        this.store.dispatch(new DeleteSkill(id));
    }
    toggleExpEntry(id) {
        this.store.dispatch(new ToggleExperienceExpanded(id));
    }
    updateExp(id) {
        const exp = this.experiences.find(e => e.id === id);
        if (exp) {
            this.store.dispatch(new UpdateExperience(id, exp));
        }
    }
    deleteExp(id) {
        if (confirm('Delete this experience?')) {
            this.store.dispatch(new DeleteExperience(id));
        }
    }
    trackById(index, item) {
        return item.id;
    }
};
LeftEditorV2Component = __decorate([
    Component({
        standalone: true,
        selector: 'app-left-editor-v2',
        imports: [CommonModule, FormsModule],
        template: `
    <div class="space-y-4 p-4">
      <h2 class="text-2xl font-bold mb-6">Resume Builder (CVWizard Style)</h2>

      <!-- Personal Details Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold mb-4">Personal Details</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              [(ngModel)]="personalDetails.givenName"
              (ngModelChange)="updatePersonalDetails()"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              [(ngModel)]="personalDetails.familyName"
              (ngModelChange)="updatePersonalDetails()"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              [(ngModel)]="personalDetails.emailAddress"
              (ngModelChange)="updatePersonalDetails()"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              [(ngModel)]="personalDetails.phoneNumber"
              (ngModelChange)="updatePersonalDetails()"
            />
          </div>
        </div>
      </div>

      <!-- Experience Section (Collapsible with Entries) -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- Section Header -->
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          (click)="toggleSection('experiences')"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400">::</span>
            <h3 class="text-lg font-semibold">Employment</h3>
          </div>
          <div class="flex items-center gap-2">
            <button class="p-1 hover:bg-gray-200 rounded">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <svg
              class="w-5 h-5 transition-transform"
              [class.rotate-180]="!sectionsCollapsed.experiences"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>

        <!-- Experience Entries -->
        <div *ngIf="!sectionsCollapsed.experiences" class="p-4 pt-0 space-y-3">
          <div
            *ngFor="let exp of experiences; trackBy: trackById"
            class="border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <!-- Entry Card (Collapsed) -->
            <div
              *ngIf="!exp.expanded"
              class="flex items-center justify-between p-4 cursor-pointer"
              (click)="toggleExpEntry(exp.id)"
            >
              <div class="flex items-center gap-3">
                <span class="text-gray-400">::</span>
                <div>
                  <div class="font-semibold text-gray-900">{{ exp.position || 'Untitled Position' }}</div>
                  <div class="text-sm text-gray-600">{{ exp.employer || 'Company name' }}</div>
                </div>
              </div>
              <button class="p-2 hover:bg-gray-100 rounded-full">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <!-- Entry Form (Expanded) -->
            <div *ngIf="exp.expanded" class="p-4 space-y-3">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold">Experience Details</h4>
                <button
                  (click)="toggleExpEntry(exp.id)"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Collapse
                </button>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  [(ngModel)]="exp.position"
                  (ngModelChange)="updateExp(exp.id)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                <input
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  [(ngModel)]="exp.employer"
                  (ngModelChange)="updateExp(exp.id)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  [(ngModel)]="exp.city"
                  (ngModelChange)="updateExp(exp.id)"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div class="flex gap-2">
                    <select
                      class="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="exp.startMonth"
                      (ngModelChange)="updateExp(exp.id)"
                    >
                      <option value="">Month</option>
                      <option *ngFor="let month of months" [value]="month">{{ month }}</option>
                    </select>
                    <select
                      class="w-24 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="exp.startYear"
                      (ngModelChange)="updateExp(exp.id)"
                    >
                      <option value="">Year</option>
                      <option *ngFor="let year of years" [value]="year">{{ year }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                    <label class="inline-flex items-center ml-2">
                      <input
                        type="checkbox"
                        [(ngModel)]="exp.isPresent"
                        (ngModelChange)="updateExp(exp.id)"
                      />
                      <span class="ml-1 text-xs">Present</span>
                    </label>
                  </label>
                  <div class="flex gap-2">
                    <select
                      class="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="exp.endMonth"
                      [disabled]="exp.isPresent"
                      (ngModelChange)="updateExp(exp.id)"
                    >
                      <option value="">Month</option>
                      <option *ngFor="let month of months" [value]="month">{{ month }}</option>
                    </select>
                    <select
                      class="w-24 border border-gray-300 rounded-md px-2 py-2 text-sm"
                      [(ngModel)]="exp.endYear"
                      [disabled]="exp.isPresent"
                      (ngModelChange)="updateExp(exp.id)"
                    >
                      <option value="">Year</option>
                      <option *ngFor="let year of years" [value]="year">{{ year }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  class="w-full border border-gray-300 rounded-lg p-3 text-sm"
                  rows="4"
                  [(ngModel)]="exp.description"
                  (ngModelChange)="updateExp(exp.id)"
                  placeholder="Describe your responsibilities and achievements..."
                ></textarea>
              </div>

              <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
                <button
                  (click)="deleteExp(exp.id)"
                  class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
                <button
                  (click)="toggleExpEntry(exp.id)"
                  class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <!-- Add New Experience Button -->
          <button
            (click)="addNewExperience()"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Add Experience
          </button>
        </div>
      </div>

      <!-- Education Section (Similar structure) -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          (click)="toggleSection('educations')"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400">::</span>
            <h3 class="text-lg font-semibold">Education</h3>
          </div>
          <svg
            class="w-5 h-5 transition-transform"
            [class.rotate-180]="!sectionsCollapsed.educations"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <div *ngIf="!sectionsCollapsed.educations" class="p-4 pt-0 space-y-3">
          <div
            *ngFor="let edu of educations; trackBy: trackById"
            class="border border-gray-300 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold">{{ edu.degree || 'Degree' }}</div>
                <div class="text-sm text-gray-600">{{ edu.school || 'School' }}</div>
              </div>
              <button class="p-2 hover:bg-gray-100 rounded-full">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>

          <button
            (click)="addNewEducation()"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600"
          >
            + Add Education
          </button>
        </div>
      </div>

      <!-- Skills Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          (click)="toggleSection('skills')"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400">::</span>
            <h3 class="text-lg font-semibold">Skills</h3>
          </div>
          <svg
            class="w-5 h-5 transition-transform"
            [class.rotate-180]="!sectionsCollapsed.skills"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <div *ngIf="!sectionsCollapsed.skills" class="p-4 pt-0 space-y-2">
          <div
            *ngFor="let skill of skills; trackBy: trackById"
            class="flex items-center gap-2 p-2 border border-gray-200 rounded"
          >
            <span class="flex-1">{{ skill.skillName }}</span>
            <span class="text-sm text-gray-600">{{ skill.skillLevel }}</span>
            <button
              (click)="deleteSkill(skill.id)"
              class="p-1 hover:bg-red-50 rounded text-red-600"
            >
              ×
            </button>
          </div>

          <button
            (click)="addNewSkill()"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600"
          >
            + Add Skill
          </button>
        </div>
      </div>
    </div>
  `,
        styles: [`
    :host {
      display: block;
    }
  `]
    })
], LeftEditorV2Component);
export { LeftEditorV2Component };
//# sourceMappingURL=left-editor-v2.component.js.map