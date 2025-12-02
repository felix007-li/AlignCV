var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { ResumeState } from '../core/state/resume.state';
import { NgIf } from '@angular/common';
let ResumeEditorComponent = class ResumeEditorComponent {
    constructor(store) {
        this.store = store;
        this.resume$ = this.store.select(ResumeState.entity);
    }
};
ResumeEditorComponent = __decorate([
    Component({ selector: 'resume-editor', standalone: true, imports: [NgIf], template: `
<div class="space-y-4" *ngIf="resume$ | async as r">
  <h2 class="font-semibold">Resume JSON (demo)</h2>
  <pre class="text-xs bg-gray-50 p-3 rounded">{{ r | json }}</pre>
</div>` })
], ResumeEditorComponent);
export { ResumeEditorComponent };
//# sourceMappingURL=resume-editor.component.js.map