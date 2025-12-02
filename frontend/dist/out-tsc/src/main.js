import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { AuthState } from './app/state/auth.state';
import { ResumeState } from './app/state/resume.state';
import { ResumeNewState } from './app/state/resume-new.state';
import { JdState } from './app/state/jd.state';
import { CheckoutState } from './app/state/checkout.state';
import { UiState } from './app/state/ui.state';
bootstrapApplication(AppComponent, { providers: [provideRouter(APP_ROUTES, withEnabledBlockingInitialNavigation()), provideAnimations(), importProvidersFrom(NgxsModule.forRoot([AuthState, ResumeState, ResumeNewState, JdState, CheckoutState, UiState]))] }).catch(err => console.error(err));
//# sourceMappingURL=main.js.map