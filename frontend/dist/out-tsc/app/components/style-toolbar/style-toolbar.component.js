var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
let StyleToolbarComponent = class StyleToolbarComponent {
    constructor() {
        this.styleChange = new EventEmitter();
    }
    notify() { this.styleChange.emit({}); }
};
__decorate([
    Output()
], StyleToolbarComponent.prototype, "styleChange", void 0);
StyleToolbarComponent = __decorate([
    Component({
        standalone: true,
        selector: 'app-style-toolbar',
        imports: [CommonModule],
        template: `<div class="border rounded p-3 text-sm text-gray-500">Style toolbar placeholder <button class="ml-2 px-2 py-1 border" (click)="notify()">Update</button></div>`
    })
], StyleToolbarComponent);
export { StyleToolbarComponent };
//# sourceMappingURL=style-toolbar.component.js.map