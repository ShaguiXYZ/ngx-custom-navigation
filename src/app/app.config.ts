import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideMissingTranslationHandler, provideTranslateService } from '@ngx-translate/core';
import { NX_CONTEX_CONFIG } from '@shagui/ng-shagui/core';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { NX_WORKFLOW_TOKEN } from './core/components/models';
import { APP_NAME, SCHEDULER_PERIOD } from './core/constants';
import { GlobalErrorHandler } from './core/errors';
import { NX_LANGUAGE_CONFIG } from './core/models';
import { NX_RECAPTCHA_TOKEN, SettingsService } from './core/services';
import { VEHICLE_WORKFLOW_TOKEN } from './library/library-manifest';
import { CustomMissingTranslationHandler, createTranslateLoader, nxLanguageConfig, urls } from './shared/config';
import { httpErrorInterceptor, mockInterceptor, recaptchaInterceptor } from './shared/interceptors';

const appInitializer = (): Promise<void> => {
  const settings = inject(SettingsService);

  return settings.loadSettings();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideTranslateService({
      loader: createTranslateLoader(),
      missingTranslationHandler: provideMissingTranslationHandler(CustomMissingTranslationHandler)
    }),
    provideAppInitializer(appInitializer),
    provideHttpClient(withXhr(), withInterceptors([httpErrorInterceptor, mockInterceptor, recaptchaInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: NX_WORKFLOW_TOKEN, useExisting: VEHICLE_WORKFLOW_TOKEN },
    {
      provide: NX_CONTEX_CONFIG,
      useValue: {
        appName: APP_NAME.toUpperCase(),
        urls,
        debug: !environment.production,
        cache: { schedulerPeriod: SCHEDULER_PERIOD }
      }
    },
    { provide: NX_LANGUAGE_CONFIG, useValue: nxLanguageConfig },
    { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: environment.recaptcha.siteKey } },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
