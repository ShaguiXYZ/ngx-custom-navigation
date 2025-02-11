import { inject, Injectable } from '@angular/core';
import { ContextDataService, deepCopy } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from '../components/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import {
  AppContextData,
  Breakingchange,
  CommercialExceptionsModel,
  Configuration,
  JourneyInfo,
  QuoteControlModel,
  QuoteSettingsModel,
  VersionInfo
} from '../models';
import { JourneyService, QUOTE_JOURNEY_DISALED } from './journey.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly workFlowToken = inject(NX_WORKFLOW_TOKEN);
  private readonly contextDataService = inject(ContextDataService);
  private readonly journeyService = inject(JourneyService);

  public async loadSettings(): Promise<void> {
    const settings = await this.journeyService.quoteSettings();
    const journeyId = settings.commercialExceptions.enableWorkFlow ? `${settings.office}` : QUOTE_JOURNEY_DISALED;
    const info = await this.journeyService.clientJourney(journeyId);
    const context = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const breakingChange = this.breakingChange(context, info.versions ?? []);

    if (context?.configuration.name !== info.name || breakingChange !== 'none') {
      console.group('SettingsService');
      await this.loadJourney(info, settings, breakingChange);
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
    },
    breakingChange: Breakingchange
  ): Promise<void> => {
    const remoteConfiguration = await this.journeyService.fetchConfiguration(info);
    const actualContext = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const workflowChange = actualContext?.configuration?.hash !== remoteConfiguration.hash;
    const [quote, contextData] = workflowChange
      ? [this.quoteByBreakingchange(breakingChange), this.contextByBreakingchange(breakingChange, settings, remoteConfiguration)]
      : [this.contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA), actualContext];
    const versionUpdated = contextData.configuration.version.last
      ? VersionInfo.compare({ value: contextData.configuration.version.last }, { value: remoteConfiguration.version.actual }) > 0
      : true;

    if (versionUpdated) {
      console.warn('There is a new version of the workflow.', contextData.configuration.version.actual, remoteConfiguration.version.actual);
      contextData.configuration.version.last = remoteConfiguration.version.actual;
      contextData.settings.commercialExceptions.captchaVerified = settings.commercialExceptions.captchaVerified;
    }

    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, contextData, { persistent: true });
    this.contextDataService.set(QUOTE_CONTEXT_DATA, quote, { persistent: true, referenced: true });

    console.log('Quote configuration', QUOTE_APP_CONTEXT_DATA, contextData);
    console.log('Quote data', QUOTE_CONTEXT_DATA, quote);
  };

  private breakingChange(contextData: AppContextData, versions: VersionInfo[]): Breakingchange {
    const contextConfiguration = contextData?.configuration;

    return contextConfiguration?.version.actual
      ? VersionInfo.breakingChange([{ value: contextConfiguration.version.actual }], versions)
      : 'all';
  }

  private quoteByBreakingchange(breakingChange: Breakingchange): QuoteControlModel {
    return breakingChange === 'all'
      ? this.workFlowToken.initialize()
      : deepCopy(this.contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA));
  }

  private contextByBreakingchange(
    breakingChange: Breakingchange,
    settings: Partial<QuoteSettingsModel>,
    configuration: Configuration<QuoteControlModel>
  ): AppContextData {
    const context = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    return breakingChange === 'workflow'
      ? { ...AppContextData.init(settings, configuration), navigation: context.navigation }
      : AppContextData.init(settings, configuration);
  }
}
