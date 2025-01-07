/* eslint-disable @typescript-eslint/no-explicit-any */
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ActivatorServices } from 'src/app/core/service-activators';
import { QuoteModel } from '../../models';
import { BlackListActivator } from '../black-list.activator';

describe('BlackListActivator', () => {
  let services: ActivatorServices;
  let quote: QuoteModel;

  beforeEach(() => {
    quote = { blackList: {}, personalData: {}, vehicle: {} } as QuoteModel;
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
