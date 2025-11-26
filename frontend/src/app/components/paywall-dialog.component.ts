import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClosePaywall } from '../core/state/ui.actions';
import { PriceClient } from '../core/services/price.client';
import { CheckoutApi } from '../core/services/checkout.api';

type Variant = 'A'|'B'|'C';
@Component({
  selector:'paywall-dialog',
  standalone:true,
  template:`
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
export class PaywallDialogComponent {
  @Input() open=false;
  @Input() variant: Variant = 'A';
  pm: any = { student:{amount:1.99,currency:'USD',priceId:'price_student_199_usd'}, public:{amount:2.99,currency:'USD',priceId:'price_public_299_usd'}, monthly:{amount:7.99,currency:'USD',priceId:'price_monthly_799_usd'} };

  get headline(){ return this.variant==='A' ? 'One‑time Student — $1.99' : this.variant==='B' ? 'Download your ATS‑ready résumé' : 'Best value for students'; }
  get subcopy(){ return this.variant==='A' ? 'Instant PDF/DOCX, verified student price.' : this.variant==='B' ? 'No subscription. Works with major ATS.' : 'Limited‑time $1.99 for students.'; }
  get studentLabel(){ return this.variant==='C' ? 'Student Special' : 'Student — One‑time'; }
  get publicLabel(){ return this.variant==='B' ? 'Public — Single download' : 'Public — One‑time'; }
  get monthlyLabel(){ return this.variant==='A' ? 'Monthly — Unlimited' : 'Monthly Access'; }
  get noRenew(){ return 'No auto‑renewal'; }

  constructor(private store: Store, private prices: PriceClient, private checkout: CheckoutApi){}

  async ngOnInit(){
    try {
      const lang = (localStorage.getItem('lang') || 'en-CA') as any;
      this.pm = await this.prices.get(lang);
    } catch {}
    (window as any).dataLayer=(window as any).dataLayer||[];
    (window as any).dataLayer.push({ event:'paywall_impression', variant: this.variant });
  }

  close(){ this.store.dispatch(new ClosePaywall()); }

  async buy(priceId: string, event: string){
    (window as any).dataLayer.push({ event: 'paywall_cta_click', variant: this.variant, button: event });
    const lang = (localStorage.getItem('lang') || 'en-CA') as any;
    const { url } = await this.checkout.createSession({ type: event.includes('monthly') ? 'subscription' : 'one_time', priceId, lang });
    if (url) location.href = url;
  }
}