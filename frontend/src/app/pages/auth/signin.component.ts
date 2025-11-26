import { Component, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loginWithToken(token: string) {
    // Persist token (replace with real auth logic)
    localStorage.setItem('auth_token', token);
  }
}

@Component({
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
export class SigninComponent {
  private router = inject(Router);
  private auth: AuthService = inject(AuthService);
  devLogin(){
    this.auth.loginWithToken('dev-token');
    this.router.navigateByUrl('/app/home');
  }
}
