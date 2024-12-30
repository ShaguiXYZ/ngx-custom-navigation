/* eslint-disable @typescript-eslint/no-explicit-any */
import { QUOTE_CONTEXT_DATA } from '../../constants';
import { QuoteControlModel } from '../../models';
import { ActivatorServices } from '../quote-activator.model';
import { QuoteActivator } from '../quote.activator';

describe('QuoteActivator', () => {
  let services: ActivatorServices;
  let quote: QuoteControlModel;

  beforeEach(() => {
    quote = { id: 1, text: 'Test quote' } as any;
    services = {
      contextDataService: {
        get: jasmine.createSpy('get').and.returnValue(quote),
        set: jasmine.createSpy('set')
      }
    } as unknown as ActivatorServices;
  });

  it('should patch the quote and return true', async () => {
    const params = { text: 'Updated quote' };
    const result = await QuoteActivator.quotePatch(services)(params);

    expect(services.contextDataService.get).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
    expect(services.contextDataService.set).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, { ...quote, ...params });
    expect(result).toBe(true);
  });

  it('should handle empty params and return true', async () => {
    const params = {};
    const result = await QuoteActivator.quotePatch(services)(params);

    expect(services.contextDataService.get).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
    expect(services.contextDataService.set).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, { ...quote, ...params });
    expect(result).toBe(true);
  });

  it('should handle null params and return true', async () => {
    const params = {};
    const result = await QuoteActivator.quotePatch(services)(params);

    expect(services.contextDataService.get).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
    expect(services.contextDataService.set).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, { ...quote, ...params });
    expect(result).toBe(true);
  });
});
