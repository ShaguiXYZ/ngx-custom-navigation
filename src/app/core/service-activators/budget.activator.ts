import { IndexedData, UniqueIds } from '@shagui/ng-shagui/core';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { BudgetError } from '../errors';
import { AppContextData, Budget, QuoteModel, StoredData, StoredDataKey } from '../models';
import { ActivatorServices } from './quote-activator.model';

export class BudgetActivator {
  public static storeBudget =
    (services: ActivatorServices): (() => Promise<boolean>) =>
    async (): Promise<boolean> => {
      const quote = services.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      const budget: Budget = {
        context: services.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA),
        quote
      };

      const storedDataKey: StoredDataKey = {
        passKey: UniqueIds.random(16),
        key: `QUOTE_${moment().format('YYYYMMDD')}_${UniqueIds.random(6).toUpperCase()}`
      };

      const cipher = BudgetActivator.encryptQuote(storedDataKey.passKey, budget);
      const storedData: StoredData = { name: storedDataKey.key, cipher };

      localStorage.setItem(storedDataKey.key, btoa(JSON.stringify(storedData)));

      quote.signature = { ...quote.signature, budget: btoa(JSON.stringify(storedDataKey)) };
      services.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, quote);

      await Promise.resolve();
      return true;
    };

  public static retrieveBudget =
    (services: ActivatorServices): (() => Promise<boolean>) =>
    async (): Promise<boolean> => {
      const { signature } = services.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
      const budget = signature?.budget;

      if (!budget) {
        throw new BudgetError('Budget not found');
      }

      const storedDataKey = JSON.parse(atob(budget)) as StoredDataKey;

      console.log('storedDataKey', storedDataKey);

      const storedData = BudgetActivator.retrieveAllStorageBudgets().find(({ index }) => index === storedDataKey.key)?.data;

      if (!storedData) {
        throw new BudgetError('Budget not found');
      }

      const storedDataModel = JSON.parse(atob(storedData)) as StoredData;
      console.log('storedData', storedDataModel);
      const decrypted = BudgetActivator.decryptQuote<Budget>(storedDataKey.passKey, storedDataModel.cipher);

      services.contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, decrypted.context);
      services.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, decrypted.quote);

      return Promise.resolve(true);
    };

  private static retrieveAllStorageBudgets = (): IndexedData[] => {
    const quoteRegExp = /QUOTE_\d{8}_\w{6}/;
    const entries = Object.entries(localStorage).filter(([key]) => quoteRegExp.test(key));

    return entries
      .map(([key, value]) => ({
        index: key,
        data: value
      }))
      .map(({ index, data }) => {
        const storedData = JSON.parse(atob(data)) as StoredData;

        return {
          index,
          data: storedData.name
        };
      });
  };

  private static encryptQuote = <T = unknown>(passKey: string, quote: T): string =>
    CryptoJS.AES.encrypt(JSON.stringify(quote), passKey).toString();

  private static decryptQuote = <T = unknown>(passKey: string, encryptedContext: string): T => {
    const bytes = CryptoJS.AES.decrypt(encryptedContext, passKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedString) as T;
  };
}
