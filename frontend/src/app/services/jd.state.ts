import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AnalyzeJD } from './jd.actions';
import { JdApi } from '../services/jd.api';
import { JdResult } from '../models/jd';
export interface JDStateModel { loading:boolean; result:JdResult|null; }
@State<JDStateModel>({ name:'jd', defaults:{ loading:false, result:null } })
@Injectable() export class JDState {
  constructor(private api:JdApi){}
  @Selector() static result(s:JDStateModel){ return s.result; }
  @Action(AnalyzeJD) async analyze(ctx:StateContext<JDStateModel>, { jd, lang }:AnalyzeJD){ ctx.patchState({ loading:true }); const result=await this.api.analyze(jd, lang); ctx.patchState({ result, loading:false }); }
}