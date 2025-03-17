/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { UniqueIds } from '@shagui/ng-shagui/core';
import dayjs from 'dayjs';
import { JOURNEY_SESSION_KEY, QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../constants';
import { BudgetError } from '../../errors';
import { BudgetUtils, StorageLib } from '../../lib';
import { AppContextData, QuoteControlModel } from '../../models';
import { BudgetActivator } from '../budget.activator';
import { ActivatorServices } from '../quote-activator.model';

describe('BudgetActivator', () => {
  let activatorServices: ActivatorServices;
  let contextDataServiceMock: any;

  beforeEach(() => {
    contextDataServiceMock = {
      get: jasmine.createSpy(),
      set: jasmine.createSpy()
    };

    activatorServices = {
      contextDataService: contextDataServiceMock
    };

    TestBed.configureTestingModule({});
  });

  describe('storeBudget', () => {
    it('should store budget and return true', () => {
      const quote: QuoteControlModel = { signature: {} } as QuoteControlModel;
      const appContextData: AppContextData = {} as AppContextData;
      const formated_date = dayjs().format('YYYYMMDD');
      contextDataServiceMock.get.and.callFake((key: string) => {
        if (key === QUOTE_CONTEXT_DATA) return quote;
        if (key === QUOTE_APP_CONTEXT_DATA) return appContextData;
        return undefined;
      });

      spyOn(UniqueIds, 'random').and.returnValue('randomKey');
      // spyOn(dayjs(), 'format').and.returnValue(formated_date);
      spyOn(BudgetUtils, 'encrypt').and.returnValue('encryptedBudget');
      spyOn(StorageLib, 'set');

      const result = BudgetActivator.storeBudget(activatorServices)();

      expect(result).toBeTrue();
      expect(StorageLib.set).toHaveBeenCalledWith(`${formated_date}_RANDOMKEY`, 'encryptedBudget', 'local');
      expect(quote.signature?.budget).toBe(btoa(JSON.stringify({ passKey: 'randomKey', key: `${formated_date}_RANDOMKEY` })));
    });
  });

  describe('retrieveBudget', () => {
    it('should retrieve budget and return true', () => {
      const quote: QuoteControlModel = {
        signature: { budget: btoa(JSON.stringify({ passKey: 'randomKey', key: '20230101_RANDOMKEY' })) }
      } as QuoteControlModel;
      const appContextData: AppContextData = { settings: { journey: 'journeyData' } } as AppContextData;
      contextDataServiceMock.get.and.callFake((key: string) => {
        if (key === QUOTE_CONTEXT_DATA) return quote;
        return undefined;
      });

      spyOn(BudgetActivator as any, 'retrieveAll').and.returnValue([{ index: '20230101_RANDOMKEY', data: 'encryptedBudget' }]);
      spyOn(BudgetUtils, 'decrypt').and.returnValue({ context: appContextData, quote });
      spyOn(StorageLib, 'set');

      const result = BudgetActivator.retrieveBudget(activatorServices)();

      expect(result).toBeTrue();
      expect(StorageLib.set).toHaveBeenCalledWith(JOURNEY_SESSION_KEY, 'journeyData');
      expect(contextDataServiceMock.set).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA, appContextData);
      expect(contextDataServiceMock.set).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, quote);
    });

    it('should throw BudgetError if budget is not found', () => {
      const quote: QuoteControlModel = { signature: {} } as QuoteControlModel;
      contextDataServiceMock.get.and.callFake((key: string) => {
        if (key === QUOTE_CONTEXT_DATA) return quote;
        return undefined;
      });

      expect(() => BudgetActivator.retrieveBudget(activatorServices)()).toThrowError(BudgetError, 'Budget not found');
    });

    it('should throw BudgetError if cipher is not found', () => {
      const quote: QuoteControlModel = {
        signature: { budget: btoa(JSON.stringify({ passKey: 'randomKey', key: '20230101_RANDOMKEY' })) }
      } as QuoteControlModel;
      contextDataServiceMock.get.and.callFake((key: string) => {
        if (key === QUOTE_CONTEXT_DATA) return quote;
        return undefined;
      });

      spyOn(BudgetActivator as any, 'retrieveAll').and.returnValue([]);

      expect(() => BudgetActivator.retrieveBudget(activatorServices)()).toThrowError(BudgetError, 'Budget not found');
    });
  });
});
