var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Input } from '@angular/core';
import { ClosePaywall } from '../core/state/ui.actions';
let PaywallDialogComponent = class PaywallDialogComponent {
    get headline() { return this.variant === 'A' ? 'One‑time Student — $1.99' : this.variant === 'B' ? 'Download your ATS‑ready résumé' : 'Best value for students'; }
    get subcopy() { return this.variant === 'A' ? 'Instant PDF/DOCX, verified student price.' : this.variant === 'B' ? 'No subscription. Works with major ATS.' : 'Limited‑time $1.99 for students.'; }
    get studentLabel() { return this.variant === 'C' ? 'Student Special' : 'Student — One‑time'; }
    get publicLabel() { return this.variant === 'B' ? 'Public — Single download' : 'Public — One‑time'; }
    get monthlyLabel() { return this.variant === 'A' ? 'Monthly — Unlimited' : 'Monthly Access'; }
    get noRenew() { return 'No auto‑renewal'; }
    constructor(store, prices, checkout) {
        this.store = store;
        this.prices = prices;
        this.checkout = checkout;
        this.open = false;
        this.variant = 'A';
        this.pm = { student: { amount: 1.99, currency: 'USD', priceId: 'price_student_199_usd' }, public: { amount: 2.99, currency: 'USD', priceId: 'price_public_299_usd' }, monthly: { amount: 7.99, currency: 'USD', priceId: 'price_monthly_799_usd' } };
    }
    async ngOnInit() {
        try {
            const lang = (localStorage.getItem('lang') || 'en-CA');
            this.pm = await this.prices.get(lang);
        }
        catch { }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'paywall_impression', variant: this.variant });
    }
    close() { this.store.dispatch(new ClosePaywall()); }
    async buy(priceId, event) {
        window.dataLayer.push({ event: 'paywall_cta_click', variant: this.variant, button: event });
        const lang = (localStorage.getItem('lang') || 'en-CA');
        const { url } = await this.checkout.createSession({ type: event.includes('monthly') ? 'subscription' : 'one_time', priceId, lang });
        if (url)
            location.href = url;
    }
};
__decorate([
    Input()
], PaywallDialogComponent.prototype, "open", void 0);
__decorate([
    Input()
], PaywallDialogComponent.prototype, "variant", void 0);
PaywallDialogComponent = __decorate([
    Component({
        selector: 'paywall-dialog',
        standalone: true,
        template: `
<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" *ngIf="open">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4">
    <div class="flex items-center justify-between">
      <div class="text-lg font-bold">{{ headline }}</div>
      <button class="text-gray-500" (click)="close()">✕</button>
    </div>
    <div class="text-sm text-gray-600">{{ subcopy }}</div>

    <div class="grid grid-cols-1 gap-2">
      <button class="px-3 py-2 rounded-xl border text-left" (click)="buy(pm.student.priceId, 'student_click')">
        <div class="font-semibold">{{ studentLabel }}</div>
        <div class="text-xs text-gray-500">{{ pm.student.amount }} {{ pm.student.currency }} · {{ noRenew }}</div>
      </button>
      <button class="px-3 py-2 rounded-xl border text-left" (click)="buy(pm.public.priceId, 'public_click')">
        <div class="font-semibold">{{ publicLabel }}</div>
        <div class="text-xs text-gray-500">{{ pm.public.amount }} {{ pm.public.currency }} · {{ noRenew }}</div>
      </button>
      <button class="px-3 py-2 rounded-xl border text-left" (click)="buy(pm.monthly.priceId, 'monthly_click')">
        <div class="font-semibold">{{ monthlyLabel }}</div>
        <div class="text-xs text-gray-500">Cancel anytime</div>
      </button>
    </div>

    <div class="text-[11px] text-gray-400">Variant: {{ variant }}</div>
  </div>
</div>
  `
    })
], PaywallDialogComponent);
export { PaywallDialogComponent };
//# sourceMappingURL=paywall-dialog.component.js.map