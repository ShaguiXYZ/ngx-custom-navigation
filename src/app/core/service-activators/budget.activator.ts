import { IndexedData, UniqueIds } from '@shagui/ng-shagui/core';
import moment from 'moment';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { BudgetError } from '../errors';
import { BudgetUtils } from '../lib';
import { AppContextData, Budget, QuoteControlModel, StoredDataKey } from '../models';
import { ActivatorServices } from './quote-activator.model';

export class BudgetActivator {
  public static storeBudget =
    (services: ActivatorServices): (() => Promise<boolean>) =>
    async (): Promise<boolean> => {
      const quote = services.contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA);
      const budget: Budget = {
        context: services.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA),
        quote
      };
      const storedDataKey: StoredDataKey = {
        passKey: UniqueIds.random(16),
        key: `QUOTE_${moment().format('YYYYMMDD')}_${UniqueIds.random(6).toUpperCase()}`
      };
      const cipher = BudgetUtils.encrypt(storedDataKey.passKey, budget);

      localStorage.setItem(storedDataKey.key, cipher);

      quote.signature = { ...quote.signature, budget: btoa(JSON.stringify(storedDataKey)) };

      await Promise.resolve();
      return true;
    };

  public static retrieveBudget =
    (services: ActivatorServices): (() => Promise<boolean>) =>
    async (params?: { budget?: string }): Promise<boolean> => {
      const { signature } = services.contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA);
      const budget = params?.budget ?? signature?.budget;

      if (!budget) {
        throw new BudgetError('Budget not found');
      }

      const storedDataKey = JSON.parse(atob(budget)) as StoredDataKey;
      const cipher = BudgetActivator.retrieveAll().find(({ index }) => index === storedDataKey.key)?.data;

      if (!cipher) {
        throw new BudgetError('Budget not found');
      }

      const decrypted = BudgetUtils.decrypt<Budget>(storedDataKey.passKey, cipher);

      services.contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, decrypted.context);
      services.contextDataService.set<QuoteControlModel>(QUOTE_CONTEXT_DATA, {
        ...decrypted.quote
      });

      return Promise.resolve(true);
    };

  private static retrieveAll = (): IndexedData<string>[] => {
    const quoteRegExp = /QUOTE_\d{8}_\w{6}/;
    const entries = Object.entries<string>(localStorage).filter(([key]) => quoteRegExp.test(key));

    return entries.map(([index, data]) => ({
      index,
      data
    }));
  };
}
