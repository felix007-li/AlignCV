var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { State, Selector, Action } from '@ngxs/store';
export class SetTemplate {
    static { this.type = '[Ui] SetTemplate'; }
    constructor(key) {
        this.key = key;
    }
}
export class SetFont {
    static { this.type = '[Ui] SetFont'; }
    constructor(font) {
        this.font = font;
    }
}
export class SetFontSize {
    static { this.type = '[Ui] SetFontSize'; }
    constructor(size) {
        this.size = size;
    }
}
export class SetLineHeight {
    static { this.type = '[Ui] SetLineHeight'; }
    constructor(h) {
        this.h = h;
    }
}
export class SetPalette {
    static { this.type = '[Ui] SetPalette'; }
    constructor(k) {
        this.k = k;
    }
}
const defaults = { template: 'sans', font: 'Arial, sans-serif', fontSize: 14, lineHeight: 1.25, palette: 'blue' };
let UiState = class UiState {
    static cssClass(s) { const t = s.template === 'serif' ? 'token-serif' : s.template === 'mono' ? 'token-mono' : 'token-sans'; const p = `palette-${s.palette}`; document.documentElement.style.setProperty('--font-size', s.fontSize + 'px'); document.documentElement.style.setProperty('--line-height', String(s.lineHeight)); document.documentElement.style.setProperty('--font-family', s.font); return `${t} ${p}`; }
    setTemplate(ctx, { key }) { ctx.patchState({ template: key }); }
    setFont(ctx, { font }) { ctx.patchState({ font }); }
    setSize(ctx, { size }) { ctx.patchState({ fontSize: size }); }
    setLH(ctx, { h }) { ctx.patchState({ lineHeight: h }); }
    setPal(ctx, { k }) { ctx.patchState({ palette: k }); }
};
__decorate([
    Action(SetTemplate)
], UiState.prototype, "setTemplate", null);
__decorate([
    Action(SetFont)
], UiState.prototype, "setFont", null);
__decorate([
    Action(SetFontSize)
], UiState.prototype, "setSize", null);
__decorate([
    Action(SetLineHeight)
], UiState.prototype, "setLH", null);
__decorate([
    Action(SetPalette)
], UiState.prototype, "setPal", null);
__decorate([
    Selector()
], UiState, "cssClass", null);
UiState = __decorate([
    State({ name: 'ui', defaults })
], UiState);
export { UiState };
//# sourceMappingURL=ui.state.js.map