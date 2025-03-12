import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ActivatorServices, ServiceActivatorFn } from 'src/app/core/service-activators';
import { QuoteModel } from '../models';
import { AppContextData, TrackPoints } from 'src/app/core/models';

export class QuoteActivator {
  public static quoteReset: ServiceActivatorFn =
    ({ contextDataService }: ActivatorServices) =>
    (): Promise<boolean> => {
      const quote = QuoteModel.init();

      const appContextData = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
      appContextData.navigation.track = TrackPoints.init<QuoteModel>();

      contextDataService.set(QUOTE_CONTEXT_DATA, quote);
      contextDataService.set(QUOTE_APP_CONTEXT_DATA, appContextData);

      return Promise.resolve(true);
    };
}
