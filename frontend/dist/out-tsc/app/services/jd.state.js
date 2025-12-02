var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { State, Action, Selector } from '@ngxs/store';
import { AnalyzeJD } from './jd.actions';
let JDState = class JDState {
    constructor(api) {
        this.api = api;
    }
    static result(s) { return s.result; }
    async analyze(ctx, { jd, lang }) { ctx.patchState({ loading: true }); const result = await this.api.analyze(jd, lang); ctx.patchState({ result, loading: false }); }
};
__decorate([
    Action(AnalyzeJD)
], JDState.prototype, "analyze", null);
__decorate([
    Selector()
], JDState, "result", null);
JDState = __decorate([
    State({ name: 'jd', defaults: { loading: false, result: null } }),
    Injectable()
], JDState);
export { JDState };
//# sourceMappingURL=jd.state.js.map