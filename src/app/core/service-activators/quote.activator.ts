import { deepCopy, JsonUtils } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, QuoteControlModel, TrackPoints } from '../models';
import { ActivatorServices, ServiceActivatorFn } from './quote-activator.model';

export class QuoteActivator {
  public static quotePatch: ServiceActivatorFn =
    ({ contextDataService }: ActivatorServices) =>
    async (params: unknown): Promise<boolean> => {
      const quote = contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA);

      contextDataService.set(QUOTE_CONTEXT_DATA, JsonUtils.patch(quote, params));

      return true;
    };

  public static quoteTrack: ServiceActivatorFn =
    ({ contextDataService }: ActivatorServices) =>
    async (): Promise<boolean> => {
      const contextData = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
      const { lastPage, track = TrackPoints.init() } = contextData.navigation;

      if (!lastPage?.pageId) {
        return false;
      }

      const quote = deepCopy(contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA));

      track.page = { ...track.page, [lastPage.pageId]: { data: quote } };
      contextData.navigation.track = track;

      contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, contextData);

      return true;
    };
}
