var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
let PersonalDetailsFormComponent = class PersonalDetailsFormComponent {
    constructor() {
        this.modelChange = new EventEmitter();
    }
};
__decorate([
    Input()
], PersonalDetailsFormComponent.prototype, "model", void 0);
__decorate([
    Output()
], PersonalDetailsFormComponent.prototype, "modelChange", void 0);
PersonalDetailsFormComponent = __decorate([
    Component({
        standalone: true,
        selector: 'aligncv-personal-details-form',
        imports: [CommonModule],
        templateUrl: './personal-details-form.component.html',
        styleUrls: ['./personal-details-form.component.scss']
    })
], PersonalDetailsFormComponent);
export { PersonalDetailsFormComponent };
//# sourceMappingURL=personal-details-form.component.js.map