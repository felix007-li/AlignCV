import { provideTransloco, TranslocoConfig, TRANSLOCO_CONFIG, TRANSLOCO_LOADER } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader  { getTranslation(lang: string) { return fetch(`/assets/i18n/${lang}.json`).then(r => r.json()); } }
export const provideI18n = () => [
  { provide: TRANSLOCO_CONFIG, useValue: { availableLangs: ['en-CA','en-US','fr-CA','fr-FR','es-419','es-MX','es-AR','es-CL','pt-BR'], defaultLang: (localStorage.getItem('lang') || 'en-CA'), reRenderOnLangChange: true } as TranslocoConfig },
  { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  provideTransloco()
];