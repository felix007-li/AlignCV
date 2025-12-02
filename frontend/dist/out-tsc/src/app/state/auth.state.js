var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { State, Selector, Action } from '@ngxs/store';
export class SignIn {
    static { this.type = '[Auth] SignIn'; }
    constructor(email) {
        this.email = email;
    }
}
export class SignOut {
    static { this.type = '[Auth] SignOut'; }
}
let AuthState = class AuthState {
    static isAuthed(s) { return !!s.token; }
    signIn(ctx, { email }) { ctx.patchState({ userId: 'u1', email, token: 'dev-token' }); }
    signOut(ctx) { ctx.setState({}); }
};
__decorate([
    Action(SignIn)
], AuthState.prototype, "signIn", null);
__decorate([
    Action(SignOut)
], AuthState.prototype, "signOut", null);
__decorate([
    Selector()
], AuthState, "isAuthed", null);
AuthState = __decorate([
    State({ name: 'auth', defaults: {} })
], AuthState);
export { AuthState };
//# sourceMappingURL=auth.state.js.map