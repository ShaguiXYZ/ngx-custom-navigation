import { JsonUtils } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from '../constants';
import { QuoteControlModel } from '../models';
import { ActivatorServices, ServiceActivatorFn } from './quote-activator.model';

export class QuoteActivator {
  public static quotePatch: ServiceActivatorFn =
    ({ contextDataService }: ActivatorServices) =>
    async (params: unknown): Promise<boolean> => {
      const quote = contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA);

      contextDataService.set(QUOTE_CONTEXT_DATA, JsonUtils.patch(quote, params));

      return true;
    };
}
