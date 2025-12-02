var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { State, Action, Selector } from '@ngxs/store';
import { LoadResume, ReplaceResume, UpdateExperienceText } from './resume.actions';
import { tap } from 'rxjs/operators';
let ResumeState = class ResumeState {
    constructor(api) {
        this.api = api;
    }
    static entity(s) { return s.entity; }
    load(ctx, { id }) { return this.api.getResume(id).pipe(tap(entity => ctx.patchState({ entity }))); }
    replace(ctx, { value }) { ctx.patchState({ entity: value }); }
    setExp(ctx, { text }) { const cur = ctx.getState().entity; if (!cur)
        return; const next = JSON.parse(JSON.stringify(cur)); const exp = (next.blocks || []).find((b) => b.type === 'experience'); if (exp)
        exp.data.text = text; ctx.patchState({ entity: next }); }
};
__decorate([
    Action(LoadResume)
], ResumeState.prototype, "load", null);
__decorate([
    Action(ReplaceResume)
], ResumeState.prototype, "replace", null);
__decorate([
    Action(UpdateExperienceText)
], ResumeState.prototype, "setExp", null);
__decorate([
    Selector()
], ResumeState, "entity", null);
ResumeState = __decorate([
    State({ name: 'resume', defaults: { entity: null } }),
    Injectable()
], ResumeState);
export { ResumeState };
//# sourceMappingURL=resume.state.js.map