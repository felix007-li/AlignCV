```ts
import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';

export const routes: Routes = [
  // public pages ...
  {
    path: 'app',
    component: AppShellComponent,
    children: [
      { path: 'home', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'resume', loadComponent: () => import('./pages/resume/resume-list.component').then(m => m.ResumeListComponent) },
      { path: 'cover-letter', loadComponent: () => import('./pages/cover/cover-list.component').then(m => m.CoverListComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'home' }
    ]
  }
];
```