import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ResumeState } from '../core/state/resume.state';
import { UpdateExperienceText } from '../core/state/resume.actions';
import { JDState } from '../core/state/jd.state';
import { AnalyzeJD } from '../core/state/jd.actions';
import { AiSuggestService, SuggestFilters } from '../core/services/ai-suggest.service';
import { JdApi } from '../core/services/jd.api';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LangSwitcherComponent } from './lang-switcher.component';

function splitBullets(text: string): string[]{ return (text||'').split(/\r?\n/).map(s=>s.replace(/^•\s?/, '').trim()).filter(Boolean); }
function joinBullets(items: string[]): string{ return items.map(i => '• '+i).join('\n'); }

@Component({ selector:'jd-suggest-advanced', standalone:true, imports:[NgIf, NgFor, FormsModule, LangSwitcherComponent], template:`
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
export class JdSuggestAdvancedComponent implements OnInit {
  bullets: string[] = [];
  suggestions: Record<number, string[]> = {};
  loading: Record<number, boolean> = {};
  filters: SuggestFilters = { requireNumber: true, requireVerb: true, wordMin: 10, wordMax: 22, star: false, injectMissingKeywords: true };
  jd$ = this.store.select(JDState.result);
  constructor(private store: Store, private ai: AiSuggestService, private jdApi: JdApi) {}
  ngOnInit(){ const resume = this.store.selectSnapshot(ResumeState.entity) as any; const exp = (resume?.blocks||[]).find((b:any)=>b.type==='experience'); this.bullets = splitBullets(exp?.data?.text || ''); const jdText = this.bullets.join(' '); this.store.dispatch(new AnalyzeJD(jdText)); (window as any).dataLayer=(window as any).dataLayer||[]; (window as any).dataLayer.push({ event:'ai_suggest_open', ab:'variant-A' }); }
  async gen(i:number){ this.loading[i]=true; try{ const r:any = this.store.selectSnapshot(JDState.result)||{ keywords:[], missing_keywords:[] }; const suggestions = await this.ai.suggest({ text:this.bullets[i], keywords:r.keywords, missing:r.missing_keywords, filters:this.filters }); this.suggestions[i]=suggestions; } finally { this.loading[i]=false; } }
  async batch(){ for (let i=0;i<this.bullets.length;i++){ await this.gen(i); } (window as any).dataLayer.push({ event:'ai_suggest_bulk_generate', lines:this.bullets.length }); }
  apply(i:number, s:string){ this.bullets[i]=s; const joined = this.bullets.map(x=>'• '+x).join('\n'); this.store.dispatch(new UpdateExperienceText(joined)); (window as any).dataLayer.push({ event:'ai_suggest_apply', line:i+1 }); }
  onFilterChange(){ (window as any).dataLayer.push({ event:'ai_suggest_filter_change', filters:this.filters }); }
}
