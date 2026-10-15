import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../core/constants';
import { AppContextData, TrackPoints } from '../../core/models';
import { ActivatorFn, ActivatorServices, ServiceActivatorFn } from '../../core/service-activators';
import { QuoteModel } from '../models';

export class QuoteActivator {
  public static quoteReset: ServiceActivatorFn<unknown, boolean> =
    ({ contextDataService }: ActivatorServices): ActivatorFn<unknown, boolean> =>
    (): boolean => {
      const quote = QuoteModel.init();

      const appContextData = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
      appContextData.navigation.track = TrackPoints.init<QuoteModel>();

      contextDataService.set(QUOTE_CONTEXT_DATA, quote);
      contextDataService.set(QUOTE_APP_CONTEXT_DATA, appContextData);

      return true;
    };
}
