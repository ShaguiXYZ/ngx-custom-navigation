/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { BudgetService } from '../budget.service';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { BudgetError } from '../../errors';
import { AppContextData, Budget, QuoteModel } from '../../models';
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
    localStorage.clear();
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

    const cypheredStoredData = service.storeBudget();
    expect(cypheredStoredData).toBeTruthy();
  });

  it('should retrieve budget', () => {
    const budgetModel: Budget = { context: {}, quote: {} } as Budget;
    const storedKey = { passKey: 'testPassKey1', key: 'QUOTE_20230101_ABCDEF' };
    const cipher = service['encryptQuote'](storedKey.passKey, budgetModel);
    const storedData = btoa(JSON.stringify({ name: 'name1', cipher: cipher }));

    localStorage.setItem(storedKey.key, storedData);

    const retrievedBudget = service.retrieveBudget(btoa(JSON.stringify(storedKey)));

    expect(retrievedBudget).toEqual(budgetModel);
  });

  it('should throw error if budget not found', () => {
    const storedData = { passKey: 'testPassKey', key: 'QUOTE_20230101_ABCDEF' };
    const cypheredStoredData = btoa(JSON.stringify(storedData));

    expect(() => service.retrieveBudget(cypheredStoredData)).toThrowError(BudgetError, 'Budget not found');
  });

  it('should retrieve all storage budgets', () => {
    const budgetModel: Budget = { context: {}, quote: {} } as Budget;
    const storedKey1 = { passKey: 'testPassKey1', key: 'QUOTE_20230101_ABCDEF' };
    const storedKey2 = { passKey: 'testPassKey2', key: 'QUOTE_20230102_GHIJKL' };

    const cipher1 = service['encryptQuote'](storedKey1.passKey, budgetModel);
    const cipher2 = service['encryptQuote'](storedKey2.passKey, budgetModel);

    const storedData1 = btoa(JSON.stringify({ name: 'name1', cipher: cipher1 }));
    const storedData2 = btoa(JSON.stringify({ name: 'name2', cipher: cipher2 }));

    localStorage.setItem(storedKey1.key, storedData1);
    localStorage.setItem(storedKey2.key, storedData2);

    const allBudgets = service.retrieveAllStorageBudgets();

    expect(allBudgets.length).toBe(2);
  });
});
