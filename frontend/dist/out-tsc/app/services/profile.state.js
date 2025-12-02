var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { State, Action, Selector } from '@ngxs/store';
import { ReplaceProfile, PatchProfile } from './profile.actions';
const defaults = { name: '', headline: '', email: '', phone: '', location: {}, links: [] };
let ProfileState = class ProfileState {
    static entity(s) { return s.entity; }
    replace(ctx, { value }) { ctx.patchState({ entity: { ...ctx.getState().entity, ...value } }); }
    patch(ctx, { changes }) { ctx.patchState({ entity: { ...ctx.getState().entity, ...changes } }); }
};
__decorate([
    Action(ReplaceProfile)
], ProfileState.prototype, "replace", null);
__decorate([
    Action(PatchProfile)
], ProfileState.prototype, "patch", null);
__decorate([
    Selector()
], ProfileState, "entity", null);
ProfileState = __decorate([
    State({ name: 'profile', defaults: { entity: defaults } }),
    Injectable()
], ProfileState);
export { ProfileState };
//# sourceMappingURL=profile.state.js.map