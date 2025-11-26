import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PurchaseOneTime, Subscribe, SetCurrency } from './checkout.actions';
import { CheckoutApi } from '../services/checkout.api';
export interface CheckoutStateModel { pending:boolean; lastSessionUrl?:string|null; currency:string; }
@State<CheckoutStateModel>({ name:'checkout', defaults:{ pending:false, currency:'USD', lastSessionUrl:null } })
@Injectable() export class CheckoutState {
  constructor(private api:CheckoutApi){}
  @Selector() static pending(s:CheckoutStateModel){ return s.pending; }
  @Selector() static lastUrl(s:CheckoutStateModel){ return s.lastSessionUrl; }
  @Action(SetCurrency) setCurrency(ctx:StateContext<CheckoutStateModel>, { currency }:SetCurrency){ ctx.patchState({ currency }); }
  @Action(PurchaseOneTime) async purchase(ctx:StateContext<CheckoutStateModel>, { priceId, lang }:PurchaseOneTime){ ctx.patchState({ pending:true }); try { const { url } = await this.api.createSession({ type:'one_time', priceId, lang }); ctx.patchState({ pending:false, lastSessionUrl:url }); } catch { ctx.patchState({ pending:false }); } }
  @Action(Subscribe) async subscribe(ctx:StateContext<CheckoutStateModel>, { planId, lang }:Subscribe){ ctx.patchState({ pending:true }); try { const { url } = await this.api.createSession({ type:'subscription', priceId: planId, lang }); ctx.patchState({ pending:false, lastSessionUrl:url }); } catch { ctx.patchState({ pending:false }); } }
}