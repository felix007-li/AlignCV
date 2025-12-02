var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
let JdApi = class JdApi {
    analyze(jd, lang) { const q = lang ? `?lang=${lang}` : ''; return fetch('/api/jd/analyze' + q, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jd }) }).then(r => r.json()); }
};
JdApi = __decorate([
    Injectable({ providedIn: 'root' })
], JdApi);
export { JdApi };
//# sourceMappingURL=jd.api.js.map