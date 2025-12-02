var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { State, Action, Selector } from '@ngxs/store';
import { OpenPaywall, ClosePaywall, SetABVariant, DisableOnboarding, SetNoNags } from './ui.actions';
let UIState = class UIState {
    static paywallOpen(s) { return s.paywallOpen; }
    static ab(s) { return s.ab; }
    open(ctx) { ctx.patchState({ paywallOpen: true }); }
    close(ctx) { ctx.patchState({ paywallOpen: false }); }
    setAB(ctx, { key, value }) { const ab = { ...(ctx.getState().ab || {}), [key]: value }; ctx.patchState({ ab }); }
    off(ctx) { ctx.patchState({ onboarding: false }); }
    set(ctx, { on }) { ctx.patchState({ noNags: on }); localStorage.setItem('noNags', String(on)); }
};
__decorate([
    Action(OpenPaywall)
], UIState.prototype, "open", null);
__decorate([
    Action(ClosePaywall)
], UIState.prototype, "close", null);
__decorate([
    Action(SetABVariant)
], UIState.prototype, "setAB", null);
__decorate([
    Action(DisableOnboarding)
], UIState.prototype, "off", null);
__decorate([
    Action(SetNoNags)
], UIState.prototype, "set", null);
__decorate([
    Selector()
], UIState, "paywallOpen", null);
__decorate([
    Selector()
], UIState, "ab", null);
UIState = __decorate([
    State({ name: 'ui', defaults: { paywallOpen: false, ab: {}, onboarding: false, noNags: true } }),
    Injectable()
], UIState);
export { UIState };
//# sourceMappingURL=ui.state.js.map