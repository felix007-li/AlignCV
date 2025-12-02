var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// src/app/pipes/safe-html.pipe.ts
import { Pipe } from '@angular/core';
let SafeHtmlPipe = class SafeHtmlPipe {
    constructor(s) {
        this.s = s;
    }
    transform(v) { return this.s.bypassSecurityTrustHtml(v); }
};
SafeHtmlPipe = __decorate([
    Pipe({ name: 'safeHtml', standalone: true })
], SafeHtmlPipe);
export { SafeHtmlPipe };
//# sourceMappingURL=safe-html.pipe.js.map