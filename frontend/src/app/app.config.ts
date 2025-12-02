import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { APP_ROUTES } from './app.routes';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { provideI18n } from './transloco.config';

import { ResumeState } from './state/resume.state';
import { ResumeNewState } from './state/resume-new.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    ...provideI18n(),
    importProvidersFrom(
      HttpClientModule,
      NgxsModule.forRoot([ResumeState, ResumeNewState], { developmentMode: isDevMode() }),
      NgxsLoggerPluginModule.forRoot({ disabled: !isDevMode() })
    )
  ]
};
