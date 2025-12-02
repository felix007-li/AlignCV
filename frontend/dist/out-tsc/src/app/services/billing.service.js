var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
let BillingService = class BillingService {
    async checkout(cfg) {
        const params = new URLSearchParams({ plan: cfg.plan, currency: cfg.currency || 'USD' });
        window.location.href = '/api/stripe/checkout?' + params.toString();
    }
};
BillingService = __decorate([
    Injectable({ providedIn: 'root' })
], BillingService);
export { BillingService };
//# sourceMappingURL=billing.service.js.map