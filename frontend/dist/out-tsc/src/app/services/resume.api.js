var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
let ResumeApi = class ResumeApi {
    getResume(id) { return of({ id, title: 'Demo', locale: 'en-CA', blocks: [{ id: 'summary', type: 'summary', data: { text: 'Summary here' } }, { id: 'experience', type: 'experience', data: { text: '• Migrated reports to Angular\n• Cut render time by 35%\n• Automated regression suite' } }] }); }
    saveResume(resume) { return of({ ...resume, updatedAt: new Date().toISOString() }); }
};
ResumeApi = __decorate([
    Injectable({ providedIn: 'root' })
], ResumeApi);
export { ResumeApi };
//# sourceMappingURL=resume.api.js.map