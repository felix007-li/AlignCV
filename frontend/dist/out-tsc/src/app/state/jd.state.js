var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { State, Selector, Action } from '@ngxs/store';
export class JdDetectLanguage {
    static { this.type = '[JD] DetectLanguage'; }
    constructor(text) {
        this.text = text;
    }
}
export class JdExtractKeywords {
    static { this.type = '[JD] ExtractKeywords'; }
    constructor(text) {
        this.text = text;
    }
}
let JdState = class JdState {
    static lang(s) { return s.lang || 'en'; }
    static keywords(s) { return s.keywords; }
    detect(ctx, { text }) { const es = /(\bel|\bla|\bde|\bpara|\bcon)\b/i.test(text); const pt = /(\bde|\bpara|\bcom|\buma|\buns)\b/i.test(text); const fr = /(\ble|\bla|\bde|\bpour|\bavec)\b/i.test(text); const lang = es ? 'es' : pt ? 'pt' : fr ? 'fr' : 'en'; ctx.patchState({ lang }); }
    kw(ctx, { text }) { const words = Array.from(new Set(text.toLowerCase().match(/[a-z]{4,}/g) || [])).slice(0, 8); ctx.patchState({ keywords: words }); }
};
__decorate([
    Action(JdDetectLanguage)
], JdState.prototype, "detect", null);
__decorate([
    Action(JdExtractKeywords)
], JdState.prototype, "kw", null);
__decorate([
    Selector()
], JdState, "lang", null);
__decorate([
    Selector()
], JdState, "keywords", null);
JdState = __decorate([
    State({ name: 'jd', defaults: { keywords: [] } })
], JdState);
export { JdState };
//# sourceMappingURL=jd.state.js.map