import { firstValueFrom, of } from 'rxjs';
import { BlackListModel, BlackListType, QuoteModel } from '../models';
import { ActivatorServices } from './quote-activator.model';
import { QUOTE_CONTEXT_DATA } from '../constants';

export class BlackListActivator {
  public static checkIdentificationNumberBlackList =
    (services: ActivatorServices): (() => Promise<boolean>) =>
    async (params: { percent: number } = { percent: 0.8 }): Promise<boolean> => {
      const blackList = await this.isBlackListed('IDENTIFICATION_NUMBER', params.percent);

      const quote = services.contextDataService!.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      quote.blackList = { ...quote.blackList, identificationNumber: blackList.value };
      services.contextDataService!.set<QuoteModel>(QUOTE_CONTEXT_DATA, quote);

      return blackList.value;
    };

  public static checkPlateBlackList =
    (services: ActivatorServices): (() => Promise<boolean>) =>
    async (params: { percent: number } = { percent: 0.8 }): Promise<boolean> => {
      const blackList = await this.isBlackListed('PLATE_NUMBER', params.percent);

      const quote = services.contextDataService!.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      quote.blackList = { ...quote.blackList, plateNumber: blackList.value };

      services.contextDataService!.set<QuoteModel>(QUOTE_CONTEXT_DATA, quote);

      return blackList.value;
    };

  public static checkPhoneBlackList =
    (services: ActivatorServices): (() => Promise<boolean>) =>
    async (params: { percent: number } = { percent: 0.8 }): Promise<boolean> => {
      const blackList = await this.isBlackListed('PHONE_NUMBER', params.percent);

      const quote = services.contextDataService!.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      quote.blackList = { ...quote.blackList, phoneNumber: blackList.value };
      services.contextDataService!.set<QuoteModel>(QUOTE_CONTEXT_DATA, quote);

      return blackList.value;
    };

  public static checkEmailBlackList =
    (services: ActivatorServices): (() => Promise<boolean>) =>
    async (params: { percent: number } = { percent: 0.8 }): Promise<boolean> => {
      const blackList = await this.isBlackListed('EMAIL', params.percent);

      const quote = services.contextDataService!.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      quote.blackList = { ...quote.blackList, email: blackList.value };
      services.contextDataService!.set<QuoteModel>(QUOTE_CONTEXT_DATA, quote);

      return blackList.value;
    };

  private static isBlackListed(type: BlackListType, percent = 0.8): Promise<BlackListModel> {
    return firstValueFrom(of({ type, value: this.ramdomBoolean(percent) }));
  }

  private static ramdomBoolean = (percent = 0.8): boolean => Math.random() >= percent;
}
