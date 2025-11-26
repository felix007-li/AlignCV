import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { OpenPaywall, ClosePaywall, SetABVariant, DisableOnboarding, SetNoNags } from './ui.actions';
export interface UIStateModel { paywallOpen:boolean; ab:Record<string,string>; onboarding:boolean; noNags:boolean; }
@State<UIStateModel>({ name:'ui', defaults:{ paywallOpen:false, ab:{}, onboarding:false, noNags:true } })
@Injectable() export class UIState {
  @Selector() static paywallOpen(s:UIStateModel){ return s.paywallOpen; }
  @Selector() static ab(s:UIStateModel){ return s.ab; }
  @Action(OpenPaywall) open(ctx:StateContext<UIStateModel>){ ctx.patchState({ paywallOpen:true }); }
  @Action(ClosePaywall) close(ctx:StateContext<UIStateModel>){ ctx.patchState({ paywallOpen:false }); }
  @Action(SetABVariant) setAB(ctx:StateContext<UIStateModel>, { key, value }:SetABVariant){ const ab={ ...(ctx.getState().ab||{}), [key]:value }; ctx.patchState({ ab }); }
  @Action(DisableOnboarding) off(ctx:StateContext<UIStateModel>){ ctx.patchState({ onboarding:false }); }
  @Action(SetNoNags) set(ctx:StateContext<UIStateModel>, { on }:SetNoNags){ ctx.patchState({ noNags:on }); localStorage.setItem('noNags', String(on)); }
}