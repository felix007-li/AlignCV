```ts
import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // public pages...
  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'resume', loadComponent: () => import('./pages/resume/resume-list.component').then(m => m.ResumeListComponent) },
      { path: 'cover-letter', loadComponent: () => import('./pages/cover/cover-list.component').then(m => m.CoverListComponent) },
      { path: 'resume/new', loadComponent: () => import('./pages/template-picker/resume-template-picker.component').then(m => m.ResumeTemplatePickerComponent) },
      { path: 'cover-letter/new', loadComponent: () => import('./pages/template-picker/cover-template-picker.component').then(m => m.CoverTemplatePickerComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'home' }
    ]
  },
  { path: 'signin', loadComponent: () => import('./pages/auth/signin.component').then(m => m.SigninComponent) }
];
```