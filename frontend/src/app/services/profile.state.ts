import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ReplaceProfile, PatchProfile } from './profile.actions';
import { Profile } from '../models/profile';
export interface ProfileStateModel { entity: Profile; }
const defaults: Profile = { name:'', headline:'', email:'', phone:'', location:{}, links:[] };
@State<ProfileStateModel>({ name:'profile', defaults:{ entity: defaults } })
@Injectable() export class ProfileState {
  @Selector() static entity(s:ProfileStateModel){ return s.entity; }
  @Action(ReplaceProfile) replace(ctx:StateContext<ProfileStateModel>, { value }:ReplaceProfile){ ctx.patchState({ entity: { ...ctx.getState().entity, ...value } }); }
  @Action(PatchProfile) patch(ctx:StateContext<ProfileStateModel>, { changes }:PatchProfile){ ctx.patchState({ entity: { ...ctx.getState().entity, ...changes } }); }
}