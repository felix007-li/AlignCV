import { Injectable } from '@angular/core';
export type Lang = 'en-CA'|'en-US'|'fr-CA'|'fr-FR'|'es-419'|'es-MX'|'es-AR'|'es-CL'|'pt-BR';
export interface Price { amount: number; currency: string; priceId: string; }
export interface PriceMap { student: Price; public: Price; monthly: Price; }
@Injectable({ providedIn: 'root' })
export class PriceClient {
  private cache = new Map<Lang, PriceMap>();
  async get(lang: Lang): Promise<PriceMap> {
    if (this.cache.has(lang)) return this.cache.get(lang)!;
    try {
      const r = await fetch('/api/prices?lang='+encodeURIComponent(lang));
      if (r.ok) {
        const data = await r.json();
        this.cache.set(lang, data as PriceMap);
        return data as PriceMap;
      }
    } catch {}
    const fallback: PriceMap = {
      student: { amount: 1.99, currency: 'USD', priceId: 'price_student_199_usd' },
      public:  { amount: 2.99, currency: 'USD', priceId: 'price_public_299_usd' },
      monthly: { amount: 7.99, currency: 'USD', priceId: 'price_monthly_799_usd' },
    };
    this.cache.set(lang, fallback);
    return fallback;
  }
  format(curr: string, amount: number) {
    try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: curr }).format(amount); }
    catch { return `${amount} ${curr}`; }
  }
}