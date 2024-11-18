import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of, Subscription } from 'rxjs';
import { TrackInfo } from '../quote-track.model';
import { QuoteTrackService } from '../quote-track.service';

describe('QuoteTrackService', () => {
  let service: QuoteTrackService;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let router: jasmine.SpyObj<Router>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let subscription: jasmine.SpyObj<Subscription>;

  beforeEach(() => {
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    const routerSpy = jasmine.createSpyObj('Router', [], { events: of(new NavigationEnd(1, '/test', '/test')) });
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);

    breakpointObserverSpy.observe.and.returnValue({
      subscribe: jasmine
        .createSpy('subscribe')
        .and.callFake((callback: any) => callback({ matches: true, breakpoints: { HandsetPortrait: true } }))
    });

    TestBed.configureTestingModule({
      providers: [
        QuoteTrackService,
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: Subscription, useValue: subscriptionSpy }
      ]
    });

    service = TestBed.inject(QuoteTrackService);
    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    subscription = TestBed.inject(Subscription) as jasmine.SpyObj<Subscription>;
    subscription.unsubscribe.and.stub();

    breakpointObserver.observe.and.returnValue(of({ matches: true } as BreakpointState));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should set isMobile based on BreakpointObserver', () => {
    const breakpointState = { matches: true, breakpoints: { HandsetPortrait: true } } as BreakpointState;
    breakpointObserver.observe.and.returnValue(of(breakpointState));

    service = TestBed.inject(QuoteTrackService);

    expect(service['isMobile']).toBeTrue();
  });

  it('should track page view on NavigationEnd', () => {
    const navigationEnd = new NavigationEnd(1, '/test', '/test');
    spyOn(router.events, 'subscribe').and.callFake((callback: any) => callback(navigationEnd));

    service = TestBed.inject(QuoteTrackService);

    const fullUrl = `${window.location.protocol}//${window.location.host}/test`;

    expect(service['infoPage']?.URL).toBe(fullUrl);
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    (service as any).subscription$ = [subscription];

    service.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should track event with correct data', async () => {
    const appContextData = { navigation: { viewedPages: ['page1', 'page2'] } };
    contextDataService.get.and.returnValue(appContextData);

    const trackInfo: TrackInfo = { brand: 'test' };
    const trackFnSpy = spyOn(service as any, 'trackFn').and.returnValue(1);

    const result = await service.trackEvent('click', trackInfo);

    expect(trackFnSpy).toHaveBeenCalledWith(
      'click',
      jasmine.objectContaining({
        category: 'tarificador',
        step_number: '2'
      })
    );
  });
});
