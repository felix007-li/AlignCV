var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
let ImportApi = class ImportApi {
    async fromPdf(file) { const fd = new FormData(); fd.append('file', file); const r = await fetch('/api/import/pdf', { method: 'POST', body: fd }); return r.json(); }
    async fromDocx(file) { const fd = new FormData(); fd.append('file', file); const r = await fetch('/api/import/docx', { method: 'POST', body: fd }); return r.json(); }
    async fromLinkedInJson(file) { const fd = new FormData(); fd.append('file', file); const r = await fetch('/api/import/linkedin', { method: 'POST', body: fd }); return r.json(); }
};
ImportApi = __decorate([
    Injectable({ providedIn: 'root' })
], ImportApi);
export { ImportApi };
//# sourceMappingURL=import.api.js.map