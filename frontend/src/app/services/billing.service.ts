import { Injectable } from '@angular/core';
export type Plan = 'pass_14d'|'monthly';
export interface CheckoutConfig { plan: Plan; currency?: 'USD'|'CAD'; email?: string; }
@Injectable({ providedIn: 'root' })
export class BillingService {
  async checkout(cfg: CheckoutConfig){
    const params = new URLSearchParams({ plan: cfg.plan, currency: cfg.currency || 'USD' });
    window.location.href = '/api/stripe/checkout?'+params.toString();
  }
}
