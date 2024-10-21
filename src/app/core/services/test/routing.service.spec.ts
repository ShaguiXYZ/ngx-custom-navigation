/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from '../../constants';
import { ContextDataServiceMock } from '../../mock/services';
import { AppContextData } from '../../models';
import { RoutingService } from '../routing.service';

describe('RoutingService', () => {
  let service: RoutingService;
  let router: jasmine.SpyObj<Router>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let mockAppContextData: AppContextData;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoutingService,
        { provide: Router, useValue: routerSpy },
        { provide: ContextDataService, useClass: ContextDataServiceMock }
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

    const result = await service.nextStep();

    expect(result).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['route3'], { skipLocationChange: true });
  });

  it('should navigate to the previous step', async () => {
    router.navigate.and.returnValue(Promise.resolve(true));

    const result = await service.previousStep();

    expect(result).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['route1'], { skipLocationChange: true });
  });

  it('should not navigate to the previous step if there is only one viewed page', async () => {
    service['appContextData'].navigation.viewedPages = ['page1'];

    const result = await service.previousStep();

    expect(result).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to a specific page', async () => {
    router.navigate.and.returnValue(Promise.resolve(true));

    const result = await service.goToPage('page2');

    expect(result).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['route2'], { skipLocationChange: true });
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const unsubscribeSpy = spyOn(service['subscrition$'][0], 'unsubscribe');

    service.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
