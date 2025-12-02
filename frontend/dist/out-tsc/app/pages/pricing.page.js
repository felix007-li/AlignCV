var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { OpenCheckout } from '../state/checkout.state';
let PricingPage = class PricingPage {
    constructor(store) {
        this.store = store;
    }
    open(plan, currency) { this.store.dispatch(new OpenCheckout(plan, currency)); }
};
PricingPage = __decorate([
    Component({ standalone: true, selector: 'pricing-page', template: `<h2 class='text-2xl font-bold mb-4'>Pricing</h2><div class='grid md:grid-cols-3 gap-4'><div class='border rounded p-4'><h3 class='font-semibold mb-2'>Student One-time</h3><div class='text-3xl font-bold mb-2'>$1.99</div><p class='text-sm text-gray-600 mb-3'>Single download</p><button class='px-3 py-1 rounded bg-black text-white' (click)='open("pass14","USD")'>Choose</button></div><div class='border rounded p-4'><h3 class='font-semibold mb-2'>Pass 14 days</h3><div class='text-3xl font-bold mb-2'>$0.99</div><p class='text-sm text-gray-600 mb-3'>Unlimited edits for 14 days</p><button class='px-3 py-1 rounded bg-black text-white' (click)='open("pass14","USD")'>Choose</button></div><div class='border rounded p-4'><h3 class='font-semibold mb-2'>Monthly</h3><div class='text-3xl font-bold mb-2'>$2.99</div><p class='text-sm text-gray-600 mb-3'>Unlimited access</p><button class='px-3 py-1 rounded bg-black text-white' (click)='open("monthly","USD")'>Choose</button></div></div>` })
], PricingPage);
export { PricingPage };
//# sourceMappingURL=pricing.page.js.map