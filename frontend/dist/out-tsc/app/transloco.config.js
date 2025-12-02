var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { provideTransloco, TRANSLOCO_CONFIG, TRANSLOCO_LOADER } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
let TranslocoHttpLoader = class TranslocoHttpLoader {
    getTranslation(lang) { return fetch(`/assets/i18n/${lang}.json`).then(r => r.json()); }
};
TranslocoHttpLoader = __decorate([
    Injectable({ providedIn: 'root' })
], TranslocoHttpLoader);
export { TranslocoHttpLoader };
export const provideI18n = () => [
    { provide: TRANSLOCO_CONFIG, useValue: { availableLangs: ['en-CA', 'en-US', 'fr-CA', 'fr-FR', 'es-419', 'es-MX', 'es-AR', 'es-CL', 'pt-BR'], defaultLang: (localStorage.getItem('lang') || 'en-CA'), reRenderOnLangChange: true } },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
    provideTransloco()
];
//# sourceMappingURL=transloco.config.js.map