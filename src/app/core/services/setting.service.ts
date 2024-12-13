import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, QuoteModel, QuoteSettingsModel } from '../models';
import { JourneyService } from './journey.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly httpService = inject(HttpService);
  private readonly translateService = inject(TranslateService);
  private readonly journeyService = inject(JourneyService);

  public async loadSettings(): Promise<void> {
    const settings = await this.quoteSettings();
    const clientJourney = await this.journeyService.clientJourney(settings.office);

    this.translateService.setDefaultLang('es-ES');

    if (!clientJourney || !settings.commercialExceptions.enableWorkFlow) {
      return this.loadJourney('not-journey', settings);
    }

    return this.loadJourney(clientJourney, settings);
  }

  private quoteSettings = (): Promise<QuoteSettingsModel> =>
    firstValueFrom(this.httpService.get<QuoteSettingsModel>(`${environment.baseUrl}/settings`).pipe(map(res => res as QuoteSettingsModel)));

  private loadJourney = async (
    journey: string,
    settings: Partial<QuoteSettingsModel> & {
      commercialExceptions: {
        enableWorkFlow: boolean;
        enableTracking: boolean;
      };
    }
  ): Promise<void> => {
    console.group('SettingsService');
    const { configuration, properties } = await this.journeyService.fetchConfiguration(journey);
    const actualContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const [quote, contextData] =
      actualContextData?.configuration.name !== configuration.name || properties?.breakingchange
        ? [QuoteModel.init(), AppContextData.init(settings, configuration)]
        : [{ ...QuoteModel.init(), ...this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA) }, { ...actualContextData }];

    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, contextData, {
      persistent: true
    });
    this.contextDataService.set(QUOTE_CONTEXT_DATA, quote, { persistent: true, referenced: true });

    console.log('Quote configuration', QUOTE_APP_CONTEXT_DATA, contextData);
    console.log('Quote data', QUOTE_CONTEXT_DATA, quote);
    console.groupEnd();
  };
}
