import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NX_CONTEX_CONFIG } from '@shagui/ng-shagui/core';
import { routes } from './app.routes';
import { APP_NAME, SCHEDULER_PERIOD } from './core/constants';
import { GlobalErrorHandler } from './core/errors';
import { httpErrorInterceptor, mockInterceptor } from './core/interceptors';
import { SettingsService } from './core/services';
import { AppUrls, TRANSLATE_MODULE_CONFIG, urls } from './shared/config';

const initSettings = (settings: SettingsService) => (): Promise<void> => settings.loadSettings();

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(TranslateModule.forRoot(TRANSLATE_MODULE_CONFIG)),
    provideAnimations(),
    provideHttpClient(withInterceptors([httpErrorInterceptor, mockInterceptor])),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: APP_INITIALIZER,
      useFactory: initSettings,
      deps: [SettingsService],
      multi: true
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: NX_CONTEX_CONFIG,
      useValue: { appName: APP_NAME.toUpperCase(), urls, home: AppUrls.onBoarding, cache: { schedulerPeriod: SCHEDULER_PERIOD } }
    }
  ]
};
