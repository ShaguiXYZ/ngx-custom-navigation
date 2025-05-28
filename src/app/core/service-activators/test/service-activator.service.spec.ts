/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subject } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from '../../components/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../constants';
import { ConditionEvaluation } from '../../lib';
import { AppContextData, QuoteControlModel } from '../../models';
import { LiteralsService, NX_RECAPTCHA_TOKEN } from '../../services';
import { EntryPoint, ServiceActivatorType } from '../quote-activator.model';
import { ServiceActivatorService } from '../service-activator.service';

describe('ServiceActivatorService', () => {
  let service: ServiceActivatorService;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    const literalsService = jasmine.createSpyObj('LiteralsService', ['transformLiteral', 'onLanguageChange']);
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);
    const languageSubject = new Subject<any>();
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const mockConfig = {
      errorPageId: 'error',
      manifest: {}
    };

    literalsService.onLanguageChange.and.returnValue(languageSubject.asObservable());

    TestBed.configureTestingModule({
      providers: [
        ServiceActivatorService,
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: LiteralsService, useValue: literalsService },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'test-site-key' } }
      ]
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

    await service.activateEntryPoint('SomeEntryPoint' as EntryPoint);

    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA);
  });

  it('should activate service if conditions are met', async () => {
    const mockEntryPoint = {
      entryPoint: 'SomeEntryPoint',
      conditions: [],
      activator: 'someActivator',
      params: {}
    };
    contextDataService.get.and.callFake((key: string): any => {
      if (key === QUOTE_APP_CONTEXT_DATA) {
        return { navigation: { lastPage: { configuration: { serviceActivators: [mockEntryPoint] } } } } as unknown as AppContextData;
      }
      if (key === QUOTE_CONTEXT_DATA) {
        return {} as QuoteControlModel;
      }
    });

    spyOn(ConditionEvaluation, 'checkConditions').and.returnValue(true);
    spyOn(service as any, 'runActivator').and.returnValue(Promise.resolve());

    await service.activateEntryPoint('SomeEntryPoint' as EntryPoint);

    expect(ConditionEvaluation.checkConditions).toHaveBeenCalled();
    expect(service['runActivator']).toHaveBeenCalledWith('someActivator' as ServiceActivatorType, {});
  });

  it('should not activate service if conditions are not met', async () => {
    const mockEntryPoint = {
      entryPoint: 'SomeEntryPoint',
      conditions: [],
      activator: 'someActivator',
      params: {}
    };
    contextDataService.get.and.callFake((key: string): any => {
      if (key === QUOTE_APP_CONTEXT_DATA) {
        return { navigation: { lastPage: { configuration: { serviceActivators: [mockEntryPoint] } } } } as unknown as AppContextData;
      }
      if (key === QUOTE_CONTEXT_DATA) {
        return {} as QuoteControlModel;
      }
    });

    spyOn(ConditionEvaluation, 'checkConditions').and.returnValue(false);
    spyOn(service as any, 'runActivator');

    await service.activateEntryPoint('SomeEntryPoint' as EntryPoint);

    expect(ConditionEvaluation.checkConditions).toHaveBeenCalled();
    expect(service['runActivator']).not.toHaveBeenCalled();
  });
});
