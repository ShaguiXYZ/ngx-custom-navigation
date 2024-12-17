import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  Injectable,
  provideZoneChangeDetection
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NxDatepickerIntl } from '@aposin/ng-aquila/datefield';
import { TranslateModule } from '@ngx-translate/core';
import { NX_CONTEX_CONFIG } from '@shagui/ng-shagui/core';
import { routes } from './app.routes';
import { APP_NAME, SCHEDULER_PERIOD } from './core/constants';
import { GlobalErrorHandler } from './core/errors';
import { httpErrorInterceptor, mockInterceptor, recaptchaInterceptor } from './core/interceptors';
import { LiteralsService, NX_RECAPTCHA_TOKEN, SettingsService } from './core/services';
import { TRANSLATE_MODULE_CONFIG, urls } from './shared/config';
import { environment } from 'src/environments/environment';

@Injectable()
class DatePikerIntl extends NxDatepickerIntl {
  private readonly literalsService = inject(LiteralsService);

  override switchToMonthViewLabel = this.literalsService.toString({
    value: 'Label.Datepicker.SwitchToMonthView',
    type: 'translate'
  });
  override switchToMultiYearViewLabel = this.literalsService.toString({
    value: 'Label.Datepicker.SwitchToMultiYearViewLabel',
    type: 'translate'
  });
}

const initSettings = (settings: SettingsService) => (): Promise<void> => settings.loadSettings();

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(TranslateModule.forRoot(TRANSLATE_MODULE_CONFIG)),
    provideAnimations(),
    provideHttpClient(withInterceptors([httpErrorInterceptor, mockInterceptor, recaptchaInterceptor])),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: APP_INITIALIZER,
      useFactory: initSettings,
      deps: [SettingsService],
      multi: true
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: NxDatepickerIntl, useClass: DatePikerIntl },
    {
      provide: NX_CONTEX_CONFIG,
      useValue: { appName: APP_NAME.toUpperCase(), urls, cache: { schedulerPeriod: SCHEDULER_PERIOD } }
    },
    { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: environment.recaptcha.siteKey } }
  ]
};
