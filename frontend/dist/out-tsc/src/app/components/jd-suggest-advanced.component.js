var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { ResumeState } from '../core/state/resume.state';
import { UpdateExperienceText } from '../core/state/resume.actions';
import { JDState } from '../core/state/jd.state';
import { AnalyzeJD } from '../core/state/jd.actions';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LangSwitcherComponent } from './lang-switcher.component';
function splitBullets(text) { return (text || '').split(/\r?\n/).map(s => s.replace(/^•\s?/, '').trim()).filter(Boolean); }
function joinBullets(items) { return items.map(i => '• ' + i).join('\n'); }
let JdSuggestAdvancedComponent = class JdSuggestAdvancedComponent {
    constructor(store, ai, jdApi) {
        this.store = store;
        this.ai = ai;
        this.jdApi = jdApi;
        this.bullets = [];
        this.suggestions = {};
        this.loading = {};
        this.filters = { requireNumber: true, requireVerb: true, wordMin: 10, wordMax: 22, star: false, injectMissingKeywords: true };
        this.jd$ = this.store.select(JDState.result);
    }
    ngOnInit() { const resume = this.store.selectSnapshot(ResumeState.entity); const exp = (resume?.blocks || []).find((b) => b.type === 'experience'); this.bullets = splitBullets(exp?.data?.text || ''); const jdText = this.bullets.join(' '); this.store.dispatch(new AnalyzeJD(jdText)); window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'ai_suggest_open', ab: 'variant-A' }); }
    async gen(i) { this.loading[i] = true; try {
        const r = this.store.selectSnapshot(JDState.result) || { keywords: [], missing_keywords: [] };
        const suggestions = await this.ai.suggest({ text: this.bullets[i], keywords: r.keywords, missing: r.missing_keywords, filters: this.filters });
        this.suggestions[i] = suggestions;
    }
    finally {
        this.loading[i] = false;
    } }
    async batch() { for (let i = 0; i < this.bullets.length; i++) {
        await this.gen(i);
    } window.dataLayer.push({ event: 'ai_suggest_bulk_generate', lines: this.bullets.length }); }
    apply(i, s) { this.bullets[i] = s; const joined = this.bullets.map(x => '• ' + x).join('\n'); this.store.dispatch(new UpdateExperienceText(joined)); window.dataLayer.push({ event: 'ai_suggest_apply', line: i + 1 }); }
    onFilterChange() { window.dataLayer.push({ event: 'ai_suggest_filter_change', filters: this.filters }); }
};
JdSuggestAdvancedComponent = __decorate([
    Component({ selector: 'jd-suggest-advanced', standalone: true, imports: [NgIf, NgFor, FormsModule, LangSwitcherComponent], template: `
<div class="border rounded-xl p-4 space-y-3">
  <div class="flex items-center justify-between">
    <div class="font-semibold">AI Suggestions</div>
    <lang-switcher></lang-switcher>
  </div>

  <div class="grid grid-cols-2 gap-2 text-xs">
    <label class="flex items-center gap-2"><input type="checkbox" [(ngModel)]="filters.requireNumber" (change)="onFilterChange()"> Require number</label>
    <label class="flex items-center gap-2"><input type="checkbox" [(ngModel)]="filters.requireVerb" (change)="onFilterChange()"> Strong verb</label>
    <label class="flex items-center gap-2"><input type="checkbox" [(ngModel)]="filters.star" (change)="onFilterChange()"> STAR</label>
    <label class="flex items-center gap-2"><input type="checkbox" [(ngModel)]="filters.injectMissingKeywords" (change)="onFilterChange()"> Inject missing</label>
    <div>Words: <input class="border rounded px-1 w-14" type="number" [(ngModel)]="filters.wordMin" (change)="onFilterChange()">–<input class="border rounded px-1 w-14" type="number" [(ngModel)]="filters.wordMax" (change)="onFilterChange()"></div>
    <button class="justify-self-end px-2 py-1 border rounded" (click)="batch()">Batch generate</button>
  </div>

  <div class="text-xs text-gray-500" *ngIf="(jd$ | async) as r">
    Missing keywords: <span class="font-medium">{{ r?.missing_keywords?.join(', ') || '—' }}</span>
  </div>

  <div *ngFor="let line of bullets; let i = index" class="border rounded-lg p-3">
    <div class="text-xs text-gray-500 mb-1">Line {{ i+1 }}</div>
    <div class="text-sm mb-2">{{ line }}</div>

    <div class="flex items-center gap-2 mb-2">
      <button class="px-3 py-1 rounded border" (click)="gen(i)" [disabled]="loading[i]">Get AI ideas</button>
      <span class="text-xs text-gray-500" *ngIf="loading[i]">Generating…</span>
    </div>

    <ul class="space-y-2" *ngIf="suggestions[i]?.length">
      <li *ngFor="let s of suggestions[i]; let j = index" class="p-2 rounded bg-gray-50 flex items-start gap-2">
        <button class="text-xs px-2 py-1 rounded border" (click)="apply(i, s)">Use</button>
        <div class="text-sm">{{ s }}</div>
      </li>
    </ul>
  </div>
</div>` })
], JdSuggestAdvancedComponent);
export { JdSuggestAdvancedComponent };
//# sourceMappingURL=jd-suggest-advanced.component.js.map