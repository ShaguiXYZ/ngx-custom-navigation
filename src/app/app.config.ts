import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NX_CONTEX_CONFIG } from '@shagui/ng-shagui/core';
import { environment } from 'src/environments/environment';
import { routes } from './app.routes';
import { NX_WORKFLOW_TOKEN } from './core/components/models';
import { APP_NAME, SCHEDULER_PERIOD } from './core/constants';
import { GlobalErrorHandler } from './core/errors';
import { NX_LANGUAGE_CONFIG } from './core/models';
import { NX_RECAPTCHA_TOKEN, SettingsService } from './core/services';
import { VEHICLE_WORKFLOW_TOKEN } from './library/library-manifest';
import { nxLanguageConfig, TRANSLATE_MODULE_CONFIG, urls } from './shared/config';
import { httpErrorInterceptor, mockInterceptor, recaptchaInterceptor } from './shared/interceptors';

const appInitializer = (): Promise<void> => {
  const settings = inject(SettingsService);

  return settings.loadSettings();
};

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(TranslateModule.forRoot(TRANSLATE_MODULE_CONFIG)),
    provideAppInitializer(appInitializer),
    provideAnimations(),
    provideHttpClient(withInterceptors([httpErrorInterceptor, mockInterceptor, recaptchaInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: NX_WORKFLOW_TOKEN, useExisting: VEHICLE_WORKFLOW_TOKEN },
    {
      provide: NX_CONTEX_CONFIG,
      useValue: {
        appName: APP_NAME.toUpperCase(),
        urls,
        debug: !environment.production,
        loadingOnNav: environment.loadingOnNav,
        cache: { schedulerPeriod: SCHEDULER_PERIOD }
      }
    },
    { provide: NX_LANGUAGE_CONFIG, useValue: nxLanguageConfig },
    { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: environment.recaptcha.siteKey } },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
