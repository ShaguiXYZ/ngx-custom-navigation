/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from '../../components/models';
import { QUOTE_APP_CONTEXT_DATA } from '../../constants';
import { AppContextData } from '../../models';
import { ContextDataServiceStub } from '../../stub';
import { RoutingService } from '../routing.service';
import { NX_RECAPTCHA_TOKEN } from '../recaptcha.service';
import { Subject } from 'rxjs';
import { LiteralsService } from '../literals.service';

describe('RoutingService', () => {
  let service: RoutingService;
  let router: jasmine.SpyObj<Router>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let mockAppContextData: AppContextData;

  beforeEach(() => {
    const literalsService = jasmine.createSpyObj('LiteralsService', ['transformLiteral', 'onLanguageChange']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const languageSubject = new Subject<any>();
    const mockConfig = {
      errorPageId: 'error',
      manifest: {}
    };

    literalsService.onLanguageChange.and.returnValue(languageSubject.asObservable());

    TestBed.configureTestingModule({
      providers: [
        RoutingService,
        { provide: Router, useValue: routerSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: LiteralsService, useValue: literalsService },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'test-site-key' } }
      ]
    });

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    service = TestBed.inject(RoutingService);

    mockAppContextData = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    service['appContextData'] = mockAppContextData;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to the next step', async () => {
    spyOn(service as any, 'getNextRoute').and.returnValue(mockAppContextData.configuration.pageMap['page3']);
    router.navigate.and.returnValue(Promise.resolve(true));

    const result = await service.next();

    expect(result).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['dispatcher', 'page3'], { skipLocationChange: true });
  });

  it('should navigate to the previous step', async () => {
    router.navigate.and.returnValue(Promise.resolve(true));

    const result = await service.previous();

    expect(result).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['dispatcher', 'page1'], { skipLocationChange: true });
  });

  it('should navigate to the first page of a specific step', async () => {
    router.navigate.and.returnValue(Promise.resolve(true));

    const result = await service.goToStep({ key: 'step2', pages: ['page2'] });

    expect(result).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['dispatcher', 'page2'], { skipLocationChange: true });
  });

  it('should not navigate to the previous step if there is only one viewed page', async () => {
    service['appContextData'].navigation.viewedPages = ['page1'];

    const result = await service.previous();

    expect(result).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to a specific page', async () => {
    router.navigate.and.returnValue(Promise.resolve(true));

    const result = await service.goToPage('page2');

    expect(result).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['dispatcher', 'page2'], { skipLocationChange: true });
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const unsubscribeSpy = spyOn(service['subscrition$'][0], 'unsubscribe');

    service.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
