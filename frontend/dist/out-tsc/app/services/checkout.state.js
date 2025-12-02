var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { State, Action, Selector } from '@ngxs/store';
import { PurchaseOneTime, Subscribe, SetCurrency } from './checkout.actions';
let CheckoutState = class CheckoutState {
    constructor(api) {
        this.api = api;
    }
    static pending(s) { return s.pending; }
    static lastUrl(s) { return s.lastSessionUrl; }
    setCurrency(ctx, { currency }) { ctx.patchState({ currency }); }
    async purchase(ctx, { priceId, lang }) { ctx.patchState({ pending: true }); try {
        const { url } = await this.api.createSession({ type: 'one_time', priceId, lang });
        ctx.patchState({ pending: false, lastSessionUrl: url });
    }
    catch {
        ctx.patchState({ pending: false });
    } }
    async subscribe(ctx, { planId, lang }) { ctx.patchState({ pending: true }); try {
        const { url } = await this.api.createSession({ type: 'subscription', priceId: planId, lang });
        ctx.patchState({ pending: false, lastSessionUrl: url });
    }
    catch {
        ctx.patchState({ pending: false });
    } }
};
__decorate([
    Action(SetCurrency)
], CheckoutState.prototype, "setCurrency", null);
__decorate([
    Action(PurchaseOneTime)
], CheckoutState.prototype, "purchase", null);
__decorate([
    Action(Subscribe)
], CheckoutState.prototype, "subscribe", null);
__decorate([
    Selector()
], CheckoutState, "pending", null);
__decorate([
    Selector()
], CheckoutState, "lastUrl", null);
CheckoutState = __decorate([
    State({ name: 'checkout', defaults: { pending: false, currency: 'USD', lastSessionUrl: null } }),
    Injectable()
], CheckoutState);
export { CheckoutState };
//# sourceMappingURL=checkout.state.js.map