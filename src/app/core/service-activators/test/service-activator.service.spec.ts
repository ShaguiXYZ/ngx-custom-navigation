import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ServiceActivatorService } from '../service-activator.service';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../constants';
import { AppContextData, QuoteModel } from '../../models';
import { ConditionEvaluation } from '../../lib';
import { ActivatorFnType, EntryPoints } from '../quote-activator.model';

describe('ServiceActivatorService', () => {
  let service: ServiceActivatorService;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);

    TestBed.configureTestingModule({
      providers: [ServiceActivatorService, { provide: ContextDataService, useValue: contextDataServiceSpy }]
    });

    service = TestBed.inject(ServiceActivatorService);
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register activators on initialization', () => {
    expect(Object.keys(service['activators']).length).toBeGreaterThan(0);
  });

  it('should not activate service if lastPage is not present', async () => {
    contextDataService.get.and.returnValue({ navigation: {} } as AppContextData);

    await service.activateService('SomeEntryPoint' as EntryPoints);

    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA);
  });

  it('should activate service if conditions are met', async () => {
    const mockEntryPoint = {
      id: 'SomeEntryPoint',
      conditions: [],
      activator: 'someActivator',
      params: {}
    };
    contextDataService.get.and.callFake((key: string): any => {
      if (key === QUOTE_APP_CONTEXT_DATA) {
        return { navigation: { lastPage: { entryPoints: [mockEntryPoint] } } } as unknown as AppContextData;
      }
      if (key === QUOTE_CONTEXT_DATA) {
        return {} as QuoteModel;
      }
    });

    spyOn(ConditionEvaluation, 'checkConditions').and.returnValue(true);
    spyOn(service as any, 'runActivator').and.returnValue(Promise.resolve());

    await service.activateService('SomeEntryPoint' as EntryPoints);

    expect(ConditionEvaluation.checkConditions).toHaveBeenCalled();
    expect(service['runActivator']).toHaveBeenCalledWith('someActivator' as ActivatorFnType, {});
  });

  it('should not activate service if conditions are not met', async () => {
    const mockEntryPoint = {
      id: 'SomeEntryPoint',
      conditions: [],
      activator: 'someActivator',
      params: {}
    };
    contextDataService.get.and.callFake((key: string): any => {
      if (key === QUOTE_APP_CONTEXT_DATA) {
        return { navigation: { lastPage: { entryPoints: [mockEntryPoint] } } } as unknown as AppContextData;
      }
      if (key === QUOTE_CONTEXT_DATA) {
        return {} as QuoteModel;
      }
    });

    spyOn(ConditionEvaluation, 'checkConditions').and.returnValue(false);
    spyOn(service as any, 'runActivator');

    await service.activateService('SomeEntryPoint' as EntryPoints);

    expect(ConditionEvaluation.checkConditions).toHaveBeenCalled();
    expect(service['runActivator']).not.toHaveBeenCalled();
  });
});
