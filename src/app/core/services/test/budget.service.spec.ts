/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { BudgetService } from '../budget.service';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { BudgetError } from '../../errors';
import { AppContextData, BudgetModel, QuoteModel } from '../../models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../constants';

describe('BudgetService', () => {
  let service: BudgetService;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);

    TestBed.configureTestingModule({
      providers: [BudgetService, { provide: ContextDataService, useValue: contextDataServiceSpy }]
    });

    service = TestBed.inject(BudgetService);
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store budget and return cyphered stored data', () => {
    const appContextData: AppContextData = { configuration: {}, navigation: {} } as AppContextData;
    const quoteModel: QuoteModel = {} as QuoteModel;

    contextDataService.get.and.callFake((key: string): any => {
      if (key === QUOTE_APP_CONTEXT_DATA) return appContextData;
      if (key === QUOTE_CONTEXT_DATA) return quoteModel;
      return null;
    });

    const cypheredStoredData = service.storeBugdet();
    expect(cypheredStoredData).toBeTruthy();
  });

  it('should retrieve budget', () => {
    const budgetModel: BudgetModel = { context: {}, quote: {} } as BudgetModel;
    const storedData = { passKey: 'testPassKey', key: 'QUOTE_20230101_ABCDEF' };
    const encryptedBudget = service['encryptQuote'](storedData.passKey, budgetModel);

    localStorage.setItem(storedData.key, encryptedBudget);
    const cypheredStoredData = btoa(JSON.stringify(storedData));

    const retrievedBudget = service.retrieveBudget(cypheredStoredData);
    expect(retrievedBudget).toEqual(budgetModel);
  });

  it('should throw error if budget not found', () => {
    const storedData = { passKey: 'testPassKey', key: 'QUOTE_20230101_ABCDEF' };
    const cypheredStoredData = btoa(JSON.stringify(storedData));

    expect(() => service.retrieveBudget(cypheredStoredData)).toThrowError(BudgetError, 'Budget not found');
  });

  it('should retrieve all storage budgets', () => {
    const budgetModel: BudgetModel = { context: {}, quote: {} } as BudgetModel;
    const storedData1 = { passKey: 'testPassKey1', key: 'QUOTE_20230101_ABCDEF' };
    const storedData2 = { passKey: 'testPassKey2', key: 'QUOTE_20230102_GHIJKL' };

    localStorage.setItem(storedData1.key, service['encryptQuote'](storedData1.passKey, budgetModel));
    localStorage.setItem(storedData2.key, service['encryptQuote'](storedData2.passKey, budgetModel));

    const allBudgets = service.retrieveAllStorageBudgets();

    expect(allBudgets.length).toBe(2);
  });
});
