var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
let CoverListComponent = class CoverListComponent {
    constructor() {
        this.items = Array.from({ length: 4 }).map((_, i) => ({ id: i + 1, title: `Cover Letter ${i + 1}`, updated: '2d ago' }));
    }
};
CoverListComponent = __decorate([
    Component({
        standalone: true,
        selector: 'aligncv-cover-list',
        imports: [CommonModule],
        templateUrl: './cover-list.component.html',
        styleUrls: ['./cover-list.component.scss']
    })
], CoverListComponent);
export { CoverListComponent };
//# sourceMappingURL=cover-list.component.js.map