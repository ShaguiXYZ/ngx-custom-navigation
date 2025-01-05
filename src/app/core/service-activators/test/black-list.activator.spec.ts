/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuoteModel } from 'src/app/library/models';
import { BlackListActivator } from 'src/app/library/service-activators';
import { QUOTE_CONTEXT_DATA } from '../../constants';
import { ActivatorServices } from '../quote-activator.model';

describe('BlackListActivator', () => {
  let services: ActivatorServices;
  let quote: QuoteModel;

  beforeEach(() => {
    quote = { blackList: {} } as QuoteModel;
    services = {
      contextDataService: {
        get: jasmine.createSpy('get').and.returnValue(quote),
        set: jasmine.createSpy('set')
      }
    } as unknown as ActivatorServices;
  });

  it('should check identification number black list', async () => {
    spyOn(BlackListActivator as any, 'isBlackListed').and.returnValue(Promise.resolve({ type: 'IDENTIFICATION_NUMBER', value: true }));

    const result = await BlackListActivator.checkIdentificationNumberBlackList(services)();

    expect(result).toBeTrue();
    expect(services.contextDataService.get).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
  });

  it('should check plate number black list', async () => {
    spyOn(BlackListActivator as any, 'isBlackListed').and.returnValue(Promise.resolve({ type: 'PLATE_NUMBER', value: true }));

    const result = await BlackListActivator.checkPlateBlackList(services)();

    expect(result).toBeTrue();
    expect(services.contextDataService.get).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
  });

  it('should check phone number black list', async () => {
    spyOn(BlackListActivator as any, 'isBlackListed').and.returnValue(Promise.resolve({ type: 'PHONE_NUMBER', value: true }));

    const result = await BlackListActivator.checkPhoneBlackList(services)();

    expect(result).toBeTrue();
    expect(services.contextDataService.get).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
  });

  it('should check email black list', async () => {
    spyOn(BlackListActivator as any, 'isBlackListed').and.returnValue(Promise.resolve({ type: 'EMAIL', value: true }));

    const result = await BlackListActivator.checkEmailBlackList(services)();

    expect(result).toBeTrue();
    expect(services.contextDataService.get).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
  });
});
