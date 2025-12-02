var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { State, Selector, Action } from '@ngxs/store';
export class OpenCheckout {
    static { this.type = '[Checkout] Open'; }
    constructor(plan, currency) {
        this.plan = plan;
        this.currency = currency;
    }
}
export class SetCheckoutUrl {
    static { this.type = '[Checkout] SetUrl'; }
    constructor(url) {
        this.url = url;
    }
}
let CheckoutState = class CheckoutState {
    static url(s) { return s.url; }
    async open(ctx, { plan, currency }) { ctx.patchState({ lastPlan: plan, currency }); const res = await fetch('/api/checkout/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan, currency }) }); const data = await res.json(); if (data?.url) {
        ctx.patchState({ url: data.url });
        window.location.href = data.url;
    } }
    set(ctx, { url }) { ctx.patchState({ url }); }
};
__decorate([
    Action(OpenCheckout)
], CheckoutState.prototype, "open", null);
__decorate([
    Action(SetCheckoutUrl)
], CheckoutState.prototype, "set", null);
__decorate([
    Selector()
], CheckoutState, "url", null);
CheckoutState = __decorate([
    State({ name: 'checkout', defaults: {} })
], CheckoutState);
export { CheckoutState };
//# sourceMappingURL=checkout.state.js.map