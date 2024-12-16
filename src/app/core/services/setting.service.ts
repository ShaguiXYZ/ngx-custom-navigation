import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, CommercialExceptionsModel, QuoteModel, QuoteSettingsModel, VersionInfo } from '../models';
import { JourneyService } from './journey.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly httpService = inject(HttpService);
  private readonly translateService = inject(TranslateService);
  private readonly journeyService = inject(JourneyService);

  public async loadSettings(): Promise<void> {
    console.group('SettingsService');
    const settings = await this.quoteSettings();
    const clientJourney = await this.journeyService.clientJourney(settings.office);
    const journeyName = !clientJourney || !settings.commercialExceptions.enableWorkFlow ? 'not-journey' : clientJourney;
    this.translateService.setDefaultLang('es-ES');

    return this.loadJourney(journeyName, settings).finally(() => console.groupEnd());
  }

  private quoteSettings = (): Promise<QuoteSettingsModel> =>
    firstValueFrom(this.httpService.get<QuoteSettingsModel>(`${environment.baseUrl}/settings`).pipe(map(res => res as QuoteSettingsModel)));

  private loadJourney = async (
    journey: string,
    settings: Partial<QuoteSettingsModel> & {
      commercialExceptions: CommercialExceptionsModel;
    }
  ): Promise<void> => {
    const { configuration, properties } = await this.journeyService.fetchConfiguration(journey);
    const actualConfiguration = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const [quote, contextData] =
      actualConfiguration?.configuration.name !== configuration.name || properties?.breakingchange
        ? [QuoteModel.init(), AppContextData.init(settings, configuration)]
        : [{ ...QuoteModel.init(), ...this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA) }, { ...actualConfiguration }];

    const versionUpdated = contextData.configuration.version.last
      ? VersionInfo.compare({ value: contextData.configuration.version.last }, { value: configuration.version.actual }) > 0
      : true;

    if (versionUpdated) {
      console.warn('There is a new version of the workflow.', contextData.configuration.version.actual, configuration.version.actual);
      contextData.configuration.version.last = configuration.version.actual;
      contextData.settings.commercialExceptions.captchaVerified = settings.commercialExceptions.captchaVerified;
    }

    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, contextData, {
      persistent: true
    });
    this.contextDataService.set(QUOTE_CONTEXT_DATA, quote, { persistent: true, referenced: true });

    console.log('Quote configuration', QUOTE_APP_CONTEXT_DATA, contextData);
    console.log('Quote data', QUOTE_CONTEXT_DATA, quote);
  };
}
