var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
let ExperienceFormComponent = class ExperienceFormComponent {
    constructor() {
        this.model = { title: '', employer: '', city: '', startMonth: '', startYear: '', endMonth: '', endYear: '', present: true, description: '' };
        this.modelChange = new EventEmitter();
    }
};
__decorate([
    Input()
], ExperienceFormComponent.prototype, "model", void 0);
__decorate([
    Output()
], ExperienceFormComponent.prototype, "modelChange", void 0);
ExperienceFormComponent = __decorate([
    Component({
        standalone: true,
        selector: 'aligncv-experience-form',
        imports: [CommonModule],
        templateUrl: './experience-form.component.html',
        styleUrls: ['./experience-form.component.scss']
    })
], ExperienceFormComponent);
export { ExperienceFormComponent };
//# sourceMappingURL=experience-form.component.js.map