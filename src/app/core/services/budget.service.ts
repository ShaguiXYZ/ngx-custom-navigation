import { inject, Injectable } from '@angular/core';
import { ContextDataService, UniqueIds } from '@shagui/ng-shagui/core';
import CryptoJS from 'crypto-js';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { BudgetError } from '../errors';
import { AppContextData, BudgetModel, QuoteModel, StoredData } from '../models';
import moment from 'moment';

@Injectable()
export class BudgetService {
  private readonly contextDataService = inject(ContextDataService);

  public storeBugdet(): string {
    const contextData: BudgetModel = {
      context: this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA),
      quote: this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA)
    };

    const storedData: StoredData = { passKey: UniqueIds.random(16), key: `QUOTE_${moment().format('YYYYMMDD')}_${UniqueIds.random(6)}` };

    const encrypted = this.encryptQuote(storedData.passKey, contextData);
    localStorage.setItem(storedData.key, encrypted);

    const cypheredStoredData = btoa(JSON.stringify(storedData));
    return cypheredStoredData;
  }

  public retrieveBudget(key: string): BudgetModel {
    const storedData = JSON.parse(atob(key)) as StoredData;

    const budget = localStorage.getItem(storedData.key);

    if (!budget) {
      throw new BudgetError('Budget not found');
    }

    const decrypted = this.decryptQuote<BudgetModel>(storedData.passKey, budget);

    localStorage.removeItem(storedData.key);

    return decrypted;
  }

  public retrieveAllStorageBudgets(): string[] {
    const quoteRegExp = /QUOTE_\d{8}_\w{6}/;
    const keys = Object.keys(localStorage).filter(key => quoteRegExp.test(key));

    console.log(keys);

    return keys.map(key => localStorage.getItem(key) as string);
  }

  private encryptQuote = <T = unknown>(passKey: string, quote: T): string =>
    CryptoJS.AES.encrypt(JSON.stringify(quote), passKey).toString();

  private decryptQuote = <T = unknown>(passKey: string, encryptedContext: string): T => {
    const bytes = CryptoJS.AES.decrypt(encryptedContext, passKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedString) as T;
  };
}
