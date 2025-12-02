var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { State, Action, Selector } from '@ngxs/store';
import { LoginEmail, LoadMe, Logout } from './auth.actions';
import { tap } from 'rxjs/operators';
let AuthState = class AuthState {
    constructor(api) {
        this.api = api;
    }
    static user(s) { return s.user; }
    login(ctx, { email }) { ctx.patchState({ loading: true, email }); return this.api.loginEmail(email).pipe(tap(() => ctx.patchState({ loading: false }))); }
    me(ctx) { return this.api.me().pipe(tap(user => ctx.patchState({ user }))); }
    logout(ctx) { ctx.setState({ loading: false }); }
};
__decorate([
    Action(LoginEmail)
], AuthState.prototype, "login", null);
__decorate([
    Action(LoadMe)
], AuthState.prototype, "me", null);
__decorate([
    Action(Logout)
], AuthState.prototype, "logout", null);
__decorate([
    Selector()
], AuthState, "user", null);
AuthState = __decorate([
    State({ name: 'auth', defaults: { loading: false } }),
    Injectable()
], AuthState);
export { AuthState };
//# sourceMappingURL=auth.state.js.map