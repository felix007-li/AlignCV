import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
@Component({ selector:'lang-switcher', standalone:true, imports:[NgFor], template:`
<div class="flex items-center gap-2 text-xs">
  <label class="text-gray-500">Language</label>
  <select class="border rounded px-2 py-1" [value]="active" (change)="onChange($event)">
    <option *ngFor="let l of langs" [value]="l">{{ l }}</option>
  </select>
</div>` })
export class LangSwitcherComponent {
  langs = ['en-CA','en-US','fr-CA','fr-FR','es-419','es-MX','es-AR','es-CL','pt-BR'];
  active = localStorage.getItem('lang') || 'en-CA';
  onChange(e:any){ const lang=e.target.value; localStorage.setItem('lang', lang); location.reload(); }
}