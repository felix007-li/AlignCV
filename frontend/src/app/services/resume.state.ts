import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { LoadResume, ReplaceResume, UpdateExperienceText } from './resume.actions';
import { Resume } from '../models/resume';
import { ResumeApi } from '../services/resume.api';
import { tap } from 'rxjs/operators';
export interface ResumeStateModel { entity: Resume | null; }
@State<ResumeStateModel>({ name:'resume', defaults:{ entity:null } })
@Injectable() export class ResumeState {
  constructor(private api:ResumeApi){}
  @Selector() static entity(s:ResumeStateModel){ return s.entity; }
  @Action(LoadResume) load(ctx:StateContext<ResumeStateModel>, { id }:LoadResume){ return this.api.getResume(id).pipe(tap(entity=>ctx.patchState({ entity }))); }
  @Action(ReplaceResume) replace(ctx:StateContext<ResumeStateModel>, { value }:ReplaceResume){ ctx.patchState({ entity:value }); }
  @Action(UpdateExperienceText) setExp(ctx:StateContext<ResumeStateModel>, { text }:UpdateExperienceText){ const cur=ctx.getState().entity; if(!cur) return; const next=JSON.parse(JSON.stringify(cur)); const exp=(next.blocks||[]).find((b:any)=>b.type==='experience'); if(exp) exp.data.text=text; ctx.patchState({ entity: next }); }
}