var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
let PriceClient = class PriceClient {
    constructor() {
        this.cache = new Map();
    }
    async get(lang) {
        if (this.cache.has(lang))
            return this.cache.get(lang);
        try {
            const r = await fetch('/api/prices?lang=' + encodeURIComponent(lang));
            if (r.ok) {
                const data = await r.json();
                this.cache.set(lang, data);
                return data;
            }
        }
        catch { }
        const fallback = {
            student: { amount: 1.99, currency: 'USD', priceId: 'price_student_199_usd' },
            public: { amount: 2.99, currency: 'USD', priceId: 'price_public_299_usd' },
            monthly: { amount: 7.99, currency: 'USD', priceId: 'price_monthly_799_usd' },
        };
        this.cache.set(lang, fallback);
        return fallback;
    }
    format(curr, amount) {
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: curr }).format(amount);
        }
        catch {
            return `${amount} ${curr}`;
        }
    }
};
PriceClient = __decorate([
    Injectable({ providedIn: 'root' })
], PriceClient);
export { PriceClient };
//# sourceMappingURL=price.client.js.map