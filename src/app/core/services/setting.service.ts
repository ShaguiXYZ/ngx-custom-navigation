import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/library/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, CommercialExceptionsModel, JourneyInfo, QuoteControlModel, QuoteSettingsModel, VersionInfo } from '../models';
import { JourneyService, QUOTE_JOURNEY_DISALED } from './journey.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly translateService = inject(TranslateService);
  private readonly journeyService = inject(JourneyService);

  public async loadSettings(): Promise<void> {
    const settings = await this.journeyService.quoteSettings();
    const journeyId = settings.commercialExceptions.enableWorkFlow ? `${settings.office}` : QUOTE_JOURNEY_DISALED;
    const info = await this.journeyService.clientJourney(journeyId);
    const context = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    this.translateService.setDefaultLang('es-ES');

    if (context?.configuration.name !== info.name || this.journeyService.hasBreakingChange(info.versions ?? [])) {
      console.group('SettingsService');
      await this.loadJourney(info, settings);
      console.groupEnd();
    } else {
      context.settings.commercialExceptions = {
        ...context.settings.commercialExceptions,
        enableTracking: settings.commercialExceptions.enableTracking,
        enableWorkFlow: settings.commercialExceptions.enableWorkFlow
      };
      this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, context, { persistent: true });
    }
  }

  private loadJourney = async (
    info: JourneyInfo,
    settings: Partial<QuoteSettingsModel> & {
      commercialExceptions: CommercialExceptionsModel;
    }
  ): Promise<void> => {
    const configuration = await this.journeyService.fetchConfiguration(info.name, info.versions ?? []);
    const actualConfiguration = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const configurationChange = actualConfiguration?.configuration?.hash !== configuration.hash;
    const [quote, contextData] =
      actualConfiguration?.configuration.name !== configuration.name || configurationChange
        ? [QuoteModel.init(), AppContextData.init(settings, configuration)]
        : [{ ...QuoteModel.init(), ...this.contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA) }, { ...actualConfiguration }];
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
