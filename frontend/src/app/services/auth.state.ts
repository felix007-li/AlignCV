import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { LoginEmail, LoadMe, Logout } from './auth.actions';
import { AuthApi } from '../services/auth.api';
import { tap } from 'rxjs/operators';
export interface AuthStateModel { email?:string; token?:string; user?:any; loading:boolean; }
@State<AuthStateModel>({ name:'auth', defaults:{ loading:false } })
@Injectable() export class AuthState {
  constructor(private api:AuthApi){}
  @Selector() static user(s:AuthStateModel){ return s.user; }
  @Action(LoginEmail) login(ctx:StateContext<AuthStateModel>, { email }:LoginEmail){ ctx.patchState({ loading:true, email }); return this.api.loginEmail(email).pipe(tap(()=>ctx.patchState({ loading:false }))); }
  @Action(LoadMe) me(ctx:StateContext<AuthStateModel>){ return this.api.me().pipe(tap(user=>ctx.patchState({ user }))); }
  @Action(Logout) logout(ctx:StateContext<AuthStateModel>){ ctx.setState({ loading:false }); }
}