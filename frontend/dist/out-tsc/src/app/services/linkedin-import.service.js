var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { ImportLinkedIn } from '../state/resume-editor.state';
let LinkedinImportService = class LinkedinImportService {
    constructor(store) {
        this.store = store;
    }
    async importFromPdf(file) {
        const profile = {
            name: 'Li Li', email: 'arley0012@hotmail.com', phone: '(438)928-3288', city: '',
            headline: 'Eight years experiences in web programming...',
            education: [{ school: 'University of Wuhan Technology, China', degree: 'Bachelor of Engineering, Electronic Engineering', end: 'Present' }],
            experiences: [{ title: 'Freelance Web Developer', company: 'Self-Employed', city: '', start: 'Jul 2024', end: 'Present', bullets: ['Developing Online Education Platform...', 'GitHub: https://github.com/...', 'Highlight: multi-role login...'] }]
        };
        this.store.dispatch(new ImportLinkedIn(profile));
    }
};
LinkedinImportService = __decorate([
    Injectable({ providedIn: 'root' })
], LinkedinImportService);
export { LinkedinImportService };
//# sourceMappingURL=linkedin-import.service.js.map