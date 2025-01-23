import { firstValueFrom, of } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from '../../core/constants';
import { BlackListModel, BlackListResponse, BlackListType } from '../../core/models';
import { ActivatorServices } from '../../core/service-activators/quote-activator.model';
import { QuoteModel } from '../models';

export class BlackListActivator {
  public static checkIdentificationNumberBlackList =
    (services: ActivatorServices): (() => Promise<BlackListResponse>) =>
    async (params?: { percentBlacklisted?: number; percentIsClient?: number }): Promise<BlackListResponse> => {
      const quote = services.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      const blackList = await BlackListActivator.isBlackListed('IDENTIFICATION_NUMBER', quote.personalData.identificationNumber, params);

      quote.blackList = { ...quote.blackList, identificationNumber: blackList.value };

      return blackList.value;
    };

  public static checkPlateBlackList =
    (services: ActivatorServices): (() => Promise<BlackListResponse>) =>
    async (params?: { percentBlacklisted?: number; percentIsClient?: number }): Promise<BlackListResponse> => {
      const quote = services.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      const blackList = await BlackListActivator.isBlackListed('PLATE_NUMBER', quote.vehicle.plateNumber, params);

      quote.blackList = { ...quote.blackList, plateNumber: blackList.value };

      return blackList.value;
    };

  public static checkPhoneBlackList =
    (services: ActivatorServices): (() => Promise<BlackListResponse>) =>
    async (params?: { percentBlacklisted?: number; percentIsClient?: number }): Promise<BlackListResponse> => {
      const quote = services.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      const blackList = await BlackListActivator.isBlackListed('PHONE_NUMBER', quote.personalData.phoneNumber, params);

      quote.blackList = { ...quote.blackList, phoneNumber: blackList.value };

      return blackList.value;
    };

  public static checkEmailBlackList =
    (services: ActivatorServices): (() => Promise<BlackListResponse>) =>
    async (params?: { percentBlacklisted?: number; percentIsClient?: number }): Promise<BlackListResponse> => {
      const quote = services.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      const blackList = await BlackListActivator.isBlackListed('EMAIL', quote.personalData.email, params);

      quote.blackList = { ...quote.blackList, email: blackList.value };

      return blackList.value;
    };

  private static isBlackListed(
    type: BlackListType,
    value?: string,
    params?: { percentBlacklisted?: number; percentIsClient?: number; percentHasDebt?: number }
  ): Promise<BlackListModel> {
    const _params = { percentBlacklisted: 0.8, percentIsClient: 0.8, percentHasDebt: 0.8, ...params };
    const response: BlackListResponse = !value
      ? { blacklisted: false, isClient: false }
      : {
          blacklisted: BlackListActivator.ramdomBoolean(_params.percentBlacklisted),
          isClient: BlackListActivator.ramdomBoolean(_params.percentIsClient),
          hasDebt: BlackListActivator.ramdomBoolean(_params.percentHasDebt)
        };

    return firstValueFrom(of({ type, value: response }));
  }

  private static ramdomBoolean = (percent = 0.8): boolean => Math.random() >= percent;
}
