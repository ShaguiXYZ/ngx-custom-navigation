import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../constants';
import { BudgetError } from '../../errors';
import { AppContextData, QuoteModel, StoredDataKey } from '../../models';
import { BudgetActivator } from '../budget.activator';
import { ActivatorServices } from '../quote-activator.model';

describe('BudgetActivator', () => {
  let services: ActivatorServices;

  beforeEach(() => {
    services = {
      contextDataService: jasmine.createSpyObj('contextDataService', ['get', 'set'])
    };
  });

  describe('storeBudget', () => {
    it('should store budget in localStorage and update quote signature', async () => {
      const quote: QuoteModel = { signature: {} } as QuoteModel;
      const appContextData: AppContextData = {} as AppContextData;

      (services.contextDataService.get as jasmine.Spy).and.callFake((key: string) => {
        if (key === QUOTE_CONTEXT_DATA) return quote;
        if (key === QUOTE_APP_CONTEXT_DATA) return appContextData;
        return null;
      });

      spyOn(localStorage, 'setItem');
      const result = await BudgetActivator.storeBudget(services)();

      expect(result).toBeTrue();
      expect(localStorage.setItem).toHaveBeenCalled();
      expect(services.contextDataService.set).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, jasmine.any(Object));
    });
  });

  describe('retrieveBudget', () => {
    it('should retrieve budget from localStorage and update context data', async () => {
      const storedDataKey: StoredDataKey = { passKey: 'testPassKey', key: 'testKey' };
      const budgetKey = btoa(JSON.stringify(storedDataKey));
      const quote: QuoteModel = { signature: { budget: budgetKey } } as QuoteModel;
      const cipher = BudgetActivator['encryptQuote'](storedDataKey.passKey, { context: {}, quote });
      const storedData = btoa(JSON.stringify({ name: 'testName', cipher }));

      spyOn(BudgetActivator as any, 'retrieveAllStorageBudgets').and.returnValue([{ index: 'testKey', data: storedData }]);

      (services.contextDataService.get as jasmine.Spy).and.returnValue(quote);

      const result = await BudgetActivator.retrieveBudget(services)();

      expect(result).toBeTrue();
      expect(services.contextDataService.set).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA, jasmine.any(Object));
      expect(services.contextDataService.set).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, jasmine.any(Object));
    });

    it('should throw BudgetError if budget is not found', async () => {
      const quote: QuoteModel = { signature: {} } as QuoteModel;

      (services.contextDataService.get as jasmine.Spy).and.returnValue(quote);

      await expectAsync(BudgetActivator.retrieveBudget(services)()).toBeRejectedWithError(BudgetError);
    });
  });
});
