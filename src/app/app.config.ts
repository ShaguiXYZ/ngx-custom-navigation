import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  Injectable,
  OnDestroy,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { NxDatepickerIntl } from '@aposin/ng-aquila/datefield';
import { TranslateModule } from '@ngx-translate/core';
import { NX_CONTEX_CONFIG } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { routes } from './app.routes';
import { NX_WORKFLOW_TOKEN } from './core/components/models';
import { APP_NAME, SCHEDULER_PERIOD } from './core/constants';
import { GlobalErrorHandler } from './core/errors';
import { NX_LANGUAGE_CONFIG } from './core/models';
import { LiteralsService, NX_RECAPTCHA_TOKEN, SettingsService } from './core/services';
import { VEHICLE_WORKFLOW_TOKEN } from './library/library-manifest';
import { LanguageConfig, TRANSLATE_MODULE_CONFIG, urls } from './shared/config';
import { httpErrorInterceptor, mockInterceptor, recaptchaInterceptor } from './shared/interceptors';

@Injectable()
class DatePikerIntl extends NxDatepickerIntl implements OnDestroy {
  private readonly literalSubscription: Subscription = new Subscription();
  private readonly literalsService = inject(LiteralsService);

  constructor() {
    super();

    this.literalSubscription = this.literalsService.onLanguageChange().subscribe(() => {
      this.switchToMonthViewLabel = this.literalsService.toString({
        value: 'Label.Datepicker.SwitchToMonthView',
        type: 'translate'
      });

      this.switchToMultiYearViewLabel = this.literalsService.toString({
        value: 'Label.Datepicker.SwitchToMultiYearViewLabel',
        type: 'translate'
      });
    });
  }

  ngOnDestroy(): void {
    this.literalSubscription.unsubscribe();
  }

  override switchToMonthViewLabel = this.literalsService.toString({
    value: 'Label.Datepicker.SwitchToMonthView',
    type: 'translate'
  });
  override switchToMultiYearViewLabel = this.literalsService.toString({
    value: 'Label.Datepicker.SwitchToMultiYearViewLabel',
    type: 'translate'
  });
}

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
      useValue: { appName: APP_NAME.toUpperCase(), urls, cache: { schedulerPeriod: SCHEDULER_PERIOD } }
    },
    { provide: NX_LANGUAGE_CONFIG, useValue: LanguageConfig },
    { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: environment.recaptcha.siteKey } },
    { provide: NxDatepickerIntl, useClass: DatePikerIntl },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
