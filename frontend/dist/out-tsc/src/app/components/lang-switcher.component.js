var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
let LangSwitcherComponent = class LangSwitcherComponent {
    constructor() {
        this.langs = ['en-CA', 'en-US', 'fr-CA', 'fr-FR', 'es-419', 'es-MX', 'es-AR', 'es-CL', 'pt-BR'];
        this.active = localStorage.getItem('lang') || 'en-CA';
    }
    onChange(e) { const lang = e.target.value; localStorage.setItem('lang', lang); location.reload(); }
};
LangSwitcherComponent = __decorate([
    Component({ selector: 'lang-switcher', standalone: true, imports: [NgFor], template: `
<div class="flex items-center gap-2 text-xs">
  <label class="text-gray-500">Language</label>
  <select class="border rounded px-2 py-1" [value]="active" (change)="onChange($event)">
    <option *ngFor="let l of langs" [value]="l">{{ l }}</option>
  </select>
</div>` })
], LangSwitcherComponent);
export { LangSwitcherComponent };
//# sourceMappingURL=lang-switcher.component.js.map