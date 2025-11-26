import { Routes } from '@angular/router';
import { HomePage } from './pages/home.page';
import { PricingPage } from './pages/pricing.page';
import { FaqPage } from './pages/faq.page';
import { EditorPage } from './pages/editor.page';
import { EditorDemoPage } from './pages/editor-demo.page';
import { AppHomePage } from './pages/app-home.page';
import { SeoContentComponent } from './pages/seo-content/seo-content.component';
import { TemplatesPage } from './pages/templates.page';
import { ExamplesPage } from './pages/examples.page';

export const APP_ROUTES: Routes = [
  // Public pages
  { path: '', component: HomePage },
  { path: 'pricing', component: PricingPage },
  { path: 'faq', component: FaqPage },
  { path: 'demo', component: EditorDemoPage },

  // SEO content pages (MDX rendered)
  // Supports routes like:
  // /l/en/templates/software-engineer
  // /l/es-MX/examples/ingeniero-software
  // /l/pt-BR/templates/data-analyst
  {
    path: 'l/:locale/:kind/:slug',
    component: SeoContentComponent
  },

  // Legacy SEO routes (redirect to /l/...)
  {
    path: 'templates/:locale/:slug',
    redirectTo: 'l/:locale/templates/:slug',
    pathMatch: 'full'
  },

  // App routes
  { path: 'app/home', component: AppHomePage },
  { path: 'app/resume/:id/editor', component: EditorPage },
  { path: 'app/cover-letter/:id/editor', component: EditorPage },

  // Template and example browsing
  { path: 'templates', component: TemplatesPage },
  { path: 'examples', component: ExamplesPage },
  { path: 'resume/templates', component: TemplatesPage },
  { path: 'resume/examples', component: ExamplesPage },
  { path: 'cover-letter/templates', component: TemplatesPage },
  { path: 'cover-letter/examples', component: ExamplesPage },

  // Fallback
  { path: '**', redirectTo: '', pathMatch: 'full' }
];