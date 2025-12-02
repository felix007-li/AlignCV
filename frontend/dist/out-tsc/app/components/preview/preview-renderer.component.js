var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
let PreviewRendererComponent = class PreviewRendererComponent {
    constructor() {
        this.items = [];
    }
};
__decorate([
    Input()
], PreviewRendererComponent.prototype, "items", void 0);
PreviewRendererComponent = __decorate([
    Component({
        standalone: true,
        selector: 'app-preview-renderer',
        imports: [CommonModule],
        template: `<div class="border rounded p-3 text-sm text-gray-500">Preview renderer placeholder ({{ items?.length || 0 }} items)</div>`
    })
], PreviewRendererComponent);
export { PreviewRendererComponent };
//# sourceMappingURL=preview-renderer.component.js.map