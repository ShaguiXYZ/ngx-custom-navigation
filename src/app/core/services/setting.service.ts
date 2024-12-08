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

    this.translateService.setDefaultLang('es-ES');

    if (!settings.commercialExceptions.enableWorkFlow) {
      return this.disableWorkFlow(settings);
    }

    return this.loadContext(settings);
  }

  private quoteSettings = (): Promise<QuoteSettingsModel> =>
    firstValueFrom(this.httpService.get<QuoteSettingsModel>(`${environment.baseUrl}/settings`).pipe(map(res => res as QuoteSettingsModel)));

  private disableWorkFlow = async (settings: QuoteSettingsModel): Promise<void> => {
    const configuration = await this.journeyService.fetchConfiguration('not-journey');

    if (configuration) {
      const viewedPages: string[] = [];

      this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, AppContextData.init(settings, configuration, viewedPages), {
        persistent: true
      });

      const quoteData = QuoteModel.init();
      this.contextDataService.set(QUOTE_CONTEXT_DATA, quoteData, { persistent: true });
    }
  };

  private loadContext = async (settings: QuoteSettingsModel): Promise<void> => {
    console.group('SettingsService');
    const configuration = await this.journeyService.fetchConfiguration(settings.journey);

    if (!configuration) {
      const quote = { ...QuoteModel.init(), ...this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA) };
      this.contextDataService.set(QUOTE_CONTEXT_DATA, quote, { persistent: true, referenced: true });

      console.log('Quote data', QUOTE_CONTEXT_DATA, quote);
      console.groupEnd();

      return;
    }

    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, AppContextData.init(settings, configuration, []), {
      persistent: true
    });

    this.contextDataService.set(QUOTE_CONTEXT_DATA, QuoteModel.init(), { persistent: true, referenced: true });

    console.log('Quote data init', QUOTE_CONTEXT_DATA, QuoteModel.init());
    console.log('Quote configuration', QUOTE_APP_CONTEXT_DATA, configuration);
    console.groupEnd();
  };
}
