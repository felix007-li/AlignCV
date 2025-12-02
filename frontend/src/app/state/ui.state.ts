import { State, Selector, Action, StateContext } from '@ngxs/store';

export type TemplateKey = 'sans' | 'serif' | 'mono';
export type PaletteKey = 'blue' | 'green' | 'rose' | 'purple' | 'orange' | 'teal' | 'indigo' | 'slate';

export interface UiModel {
  template: TemplateKey;
  font: string;
  fontSize: number;
  lineHeight: number;
  palette: PaletteKey;
}

export class SetTemplate { static readonly type = '[Ui] SetTemplate'; constructor(public key: TemplateKey) {} }
export class SetFont { static readonly type = '[Ui] SetFont'; constructor(public font: string) {} }
export class SetFontSize { static readonly type = '[Ui] SetFontSize'; constructor(public size: number) {} }
export class SetLineHeight { static readonly type = '[Ui] SetLineHeight'; constructor(public h: number) {} }
export class SetPalette { static readonly type = '[Ui] SetPalette'; constructor(public k: PaletteKey) {} }
export class SetEditorStyleGlobal { static readonly type = '[Ui] SetEditorStyleGlobal'; constructor(public patch: Partial<UiModel>) {} }

const defaults: UiModel = { template: 'sans', font: 'Arial, sans-serif', fontSize: 14, lineHeight: 1.25, palette: 'blue' };

@State<UiModel>({ name: 'ui', defaults })
export class UiState {
  @Selector() static cssClass(s: UiModel) {
    const t = s.template === 'serif' ? 'token-serif' : s.template === 'mono' ? 'token-mono' : 'token-sans';
    const p = `palette-${s.palette}`;
    document.documentElement.style.setProperty('--font-size', s.fontSize + 'px');
    document.documentElement.style.setProperty('--line-height', String(s.lineHeight));
    document.documentElement.style.setProperty('--font-family', s.font);
    return `${t} ${p}`;
  }

  @Selector() static editorStyle(s: UiModel) {
    return s;
  }

  @Action(SetTemplate) setTemplate(ctx: StateContext<UiModel>, { key }: SetTemplate) { ctx.patchState({ template: key }); }
  @Action(SetFont) setFont(ctx: StateContext<UiModel>, { font }: SetFont) { ctx.patchState({ font }); }
  @Action(SetFontSize) setSize(ctx: StateContext<UiModel>, { size }: SetFontSize) { ctx.patchState({ fontSize: size }); }
  @Action(SetLineHeight) setLH(ctx: StateContext<UiModel>, { h }: SetLineHeight) { ctx.patchState({ lineHeight: h }); }
  @Action(SetPalette) setPal(ctx: StateContext<UiModel>, { k }: SetPalette) { ctx.patchState({ palette: k }); }
  @Action(SetEditorStyleGlobal) setStyle(ctx: StateContext<UiModel>, { patch }: SetEditorStyleGlobal) { ctx.patchState(patch); }
}
