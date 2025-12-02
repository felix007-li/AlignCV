var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
let SectionEditorComponent = class SectionEditorComponent {
    constructor() {
        this.title = '';
    }
};
__decorate([
    Input()
], SectionEditorComponent.prototype, "title", void 0);
SectionEditorComponent = __decorate([
    Component({
        standalone: true,
        selector: 'app-section-editor',
        imports: [CommonModule],
        template: `<div class="border rounded p-3 text-sm text-gray-500">Section editor placeholder ({{ title }})</div>`
    })
], SectionEditorComponent);
export { SectionEditorComponent };
//# sourceMappingURL=section-editor.component.js.map