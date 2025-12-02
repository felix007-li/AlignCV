var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
let AuthService = class AuthService {
    loginWithToken(token) {
        // Persist token (replace with real auth logic)
        localStorage.setItem('auth_token', token);
    }
};
AuthService = __decorate([
    Injectable({ providedIn: 'root' })
], AuthService);
export { AuthService };
let SigninComponent = class SigninComponent {
    constructor() {
        this.router = inject(Router);
        this.auth = inject(AuthService);
    }
    devLogin() {
        this.auth.loginWithToken('dev-token');
        this.router.navigateByUrl('/app/home');
    }
};
SigninComponent = __decorate([
    Component({
        standalone: true,
        selector: 'aligncv-signin',
        imports: [CommonModule],
        template: `
  <div class="signin">
    <h1>Sign in</h1>
    <button (click)="devLogin()">Dev login</button>
  </div>`,
        styles: [`.signin{ padding:40px; }`]
    })
], SigninComponent);
export { SigninComponent };
//# sourceMappingURL=signin.component.js.map