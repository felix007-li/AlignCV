import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { provideI18n } from './transloco.config';

import { ResumeState } from './state/resume.state';
import { ResumeNewState } from './state/resume-new.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    ...provideI18n(),
    importProvidersFrom(
      HttpClientModule,
      NgxsModule.forRoot([ResumeState, ResumeNewState], { developmentMode: isDevMode() }),
      NgxsLoggerPluginModule.forRoot({ disabled: !isDevMode() })
    )
  ]
};