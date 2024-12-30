import { QUOTE_CONTEXT_DATA } from '../constants';
import { patch } from '../lib';
import { QuoteControlModel } from '../models';
import { ActivatorServices } from './quote-activator.model';

export class QuoteActivator {
  public static quotePatch =
    (services: ActivatorServices): ((params: unknown) => Promise<boolean>) =>
    async (params: unknown): Promise<boolean> => {
      const quote = services.contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA);

      services.contextDataService.set(QUOTE_CONTEXT_DATA, patch(quote, params));

      return Promise.resolve(true);
    };
}
