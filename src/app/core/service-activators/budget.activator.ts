import { IndexedData, UniqueIds } from '@shagui/ng-shagui/core';
import dayjs from 'dayjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { BudgetError } from '../errors';
import { BudgetUtils, StorageLib } from '../lib';
import { AppContextData, Budget, QuoteControlModel, StoredDataKey } from '../models';
import { ActivatorServices, ServiceActivatorFn } from './quote-activator.model';

export class BudgetActivator {
  public static storeBudget: ServiceActivatorFn =
    ({ contextDataService }: ActivatorServices): (() => Promise<boolean>) =>
    async (): Promise<boolean> => {
      const quote = contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA);
      const budget: Budget = {
        context: contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA),
        quote
      };
      const storedDataKey: StoredDataKey = {
        passKey: UniqueIds.random(256),
        key: `${dayjs().format('YYYYMMDD')}_${UniqueIds.random(6).toUpperCase()}`
      };
      const cipher = BudgetUtils.encrypt(storedDataKey.passKey, budget);

      StorageLib.set(storedDataKey.key, cipher, 'local');

      quote.signature = { ...quote.signature, budget: btoa(JSON.stringify(storedDataKey)) };

      await Promise.resolve();
      return true;
    };

  public static retrieveBudget: ServiceActivatorFn =
    ({ contextDataService }: ActivatorServices): (() => Promise<boolean>) =>
    async (params?: { budget?: string }): Promise<boolean> => {
      const { signature } = contextDataService.get<QuoteControlModel>(QUOTE_CONTEXT_DATA);
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

      contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, decrypted.context);
      contextDataService.set<QuoteControlModel>(QUOTE_CONTEXT_DATA, {
        ...decrypted.quote
      });

      return Promise.resolve(true);
    };

  private static retrieveAll = (): IndexedData<string>[] => {
    const quoteRegExp = /\d{8}_\w{6}/;
    const entries = Object.entries(StorageLib.clear(quoteRegExp, 'local'));

    return entries.map(([index, data]) => ({
      index,
      data
    }));
  };
}
