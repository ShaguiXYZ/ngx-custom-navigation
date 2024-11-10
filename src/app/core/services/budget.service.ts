import { inject, Injectable } from '@angular/core';
import { ContextDataService, IndexedData, UniqueIds } from '@shagui/ng-shagui/core';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { BudgetError } from '../errors';
import { AppContextData, Budget, QuoteModel, StoredData, StoredDataKey } from '../models';

@Injectable()
export class BudgetService {
  private readonly contextDataService = inject(ContextDataService);

  public storeBudget(name?: string): string {
    const budget: Budget = {
      context: this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA),
      quote: this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA)
    };

    const storedDataKey: StoredDataKey = {
      passKey: UniqueIds.random(16),
      key: `QUOTE_${moment().format('YYYYMMDD')}_${UniqueIds.random(6).toUpperCase()}`
    };

    const cipher = this.encryptQuote(storedDataKey.passKey, budget);
    const storedData: StoredData = { name: name ?? storedDataKey.key, cipher };

    localStorage.setItem(storedDataKey.key, btoa(JSON.stringify(storedData)));

    return btoa(JSON.stringify(storedDataKey));
  }

  public retrieveBudget(key: string): Budget {
    const storedDataKey = JSON.parse(atob(key)) as StoredDataKey;
    const storedData = localStorage.getItem(storedDataKey.key);

    if (!storedData) {
      throw new BudgetError('Budget not found');
    }

    const storedDataModel = JSON.parse(atob(storedData)) as StoredData;
    const decrypted = this.decryptQuote<Budget>(storedDataKey.passKey, storedDataModel.cipher);

    return decrypted;
  }

  public retrieveAllStorageBudgets(): IndexedData[] {
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
  }

  private encryptQuote = <T = unknown>(passKey: string, quote: T): string =>
    CryptoJS.AES.encrypt(JSON.stringify(quote), passKey).toString();

  private decryptQuote = <T = unknown>(passKey: string, encryptedContext: string): T => {
    const bytes = CryptoJS.AES.decrypt(encryptedContext, passKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedString) as T;
  };
}
