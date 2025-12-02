var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
let ResumeListComponent = class ResumeListComponent {
    constructor() {
        this.items = Array.from({ length: 6 }).map((_, i) => ({ id: i + 1, title: `Resume ${i + 1}`, updated: '3d ago' }));
    }
};
ResumeListComponent = __decorate([
    Component({
        standalone: true,
        selector: 'aligncv-resume-list',
        imports: [CommonModule],
        templateUrl: './resume-list.component.html',
        styleUrls: ['./resume-list.component.scss']
    })
], ResumeListComponent);
export { ResumeListComponent };
//# sourceMappingURL=resume-list.component.js.map