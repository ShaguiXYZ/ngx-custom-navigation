import { firstValueFrom, of } from 'rxjs';
import { BlackListModel, BlackListResponse, BlackListType, QuoteModel } from '../models';
import { ActivatorServices } from './quote-activator.model';
import { QUOTE_CONTEXT_DATA } from '../constants';

export class BlackListActivator {
  public static checkIdentificationNumberBlackList =
    (services: ActivatorServices): (() => Promise<BlackListResponse>) =>
    async (params?: { percentBlacklisted?: number; percentIsClient?: number }): Promise<BlackListResponse> => {
      const blackList = await BlackListActivator.isBlackListed('IDENTIFICATION_NUMBER', params);

      const quote = services.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      quote.blackList = { ...quote.blackList, identificationNumber: blackList.value };
      services.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, quote);

      return blackList.value;
    };

  public static checkPlateBlackList =
    (services: ActivatorServices): (() => Promise<BlackListResponse>) =>
    async (params?: { percentBlacklisted?: number; percentIsClient?: number }): Promise<BlackListResponse> => {
      const blackList = await BlackListActivator.isBlackListed('PLATE_NUMBER', params);

      const quote = services.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      quote.blackList = { ...quote.blackList, plateNumber: blackList.value };
      services.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, quote);

      return blackList.value;
    };

  public static checkPhoneBlackList =
    (services: ActivatorServices): (() => Promise<BlackListResponse>) =>
    async (params?: { percentBlacklisted?: number; percentIsClient?: number }): Promise<BlackListResponse> => {
      const blackList = await BlackListActivator.isBlackListed('PHONE_NUMBER', params);

      const quote = services.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      quote.blackList = { ...quote.blackList, phoneNumber: blackList.value };
      services.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, quote);

      return blackList.value;
    };

  public static checkEmailBlackList =
    (services: ActivatorServices): (() => Promise<BlackListResponse>) =>
    async (params?: { percentBlacklisted?: number; percentIsClient?: number }): Promise<BlackListResponse> => {
      const blackList = await BlackListActivator.isBlackListed('EMAIL', params);

      const quote = services.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      quote.blackList = { ...quote.blackList, email: blackList.value };
      services.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, quote);

      return blackList.value;
    };

  private static isBlackListed(
    type: BlackListType,
    params?: { percentBlacklisted?: number; percentIsClient?: number }
  ): Promise<BlackListModel> {
    const _params = { percentBlacklisted: 0.8, percentIsClient: 0.8, ...params };
    const response: BlackListResponse = {
      blacklisted: BlackListActivator.ramdomBoolean(_params.percentBlacklisted),
      isClient: BlackListActivator.ramdomBoolean(_params.percentIsClient)
    };

    console.log(`blackList ${type}`, { response, _params });

    return firstValueFrom(of({ type, value: response }));
  }

  private static ramdomBoolean = (percent = 0.8): boolean => Math.random() >= percent;
}
