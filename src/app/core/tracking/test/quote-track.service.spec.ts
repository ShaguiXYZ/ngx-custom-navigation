/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of, Subscription } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from '../../components/constants';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../constants';
import { AppContextData } from '../../models';
import { NX_RECAPTCHA_TOKEN } from '../../services';
import { TrackInfo } from '../quote-track.model';
import { QuoteTrackService } from '../quote-track.service';
import { _window } from '../window-tracker.model';

describe('QuoteTrackService', () => {
  let service: QuoteTrackService;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let subscription: jasmine.SpyObj<Subscription>;

  beforeEach(() => {
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    const routerSpy = jasmine.createSpyObj('Router', [], { events: of(new NavigationEnd(1, '/test', '/test')) });
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    const mockConfig = {
      errorPageId: 'error',
      manifest: {
        tracks: {}
      }
    };

    breakpointObserverSpy.observe.and.returnValue({
      subscribe: jasmine
        .createSpy('subscribe')
        .and.callFake((callback: any) => callback({ matches: true, breakpoints: { HandsetPortrait: true } }))
    });

    contextDataServiceSpy.get.and.callFake((contextDataKey: string): any => {
      if (contextDataKey === QUOTE_APP_CONTEXT_DATA) {
        return {
          configuration: { steppers: {} },
          navigation: { lastPage: { pageId: 'test' }, viewedPages: ['page1', 'page2'] }
        } as AppContextData;
      } else if (contextDataKey === QUOTE_CONTEXT_DATA) {
        return {};
      }

      return null;
    });

    TestBed.configureTestingModule({
      providers: [
        QuoteTrackService,
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: Subscription, useValue: subscriptionSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    });

    service = TestBed.inject(QuoteTrackService);
    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    subscription = TestBed.inject(Subscription) as jasmine.SpyObj<Subscription>;
    subscription.unsubscribe.and.stub();

    breakpointObserver.observe.and.returnValue(of({ matches: true } as BreakpointState));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isMobile based on BreakpointObserver', () => {
    Breakpoints.HandsetPortrait = 'HandsetPortrait';
    breakpointObserver.observe.and.returnValue(of({ matches: true, breakpoints: { HandsetPortrait: true } }));

    service = TestBed.inject(QuoteTrackService);

    service['isMobile'] = false;
    breakpointObserver.observe(Breakpoints.HandsetPortrait).subscribe((state: BreakpointState) => {
      service['isMobile'] = state.matches;
    });

    expect(service['isMobile']).toBeTrue();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    (service as any).subscription$ = [subscription];

    service.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should track view with correct data', done => {
    const trackFnSpy = spyOn(service as any, 'trackFn').and.returnValue(1);

    spyOn(window, 'requestIdleCallback').and.callFake((callback: IdleRequestCallback) => {
      callback({ timeRemaining: () => 50, didTimeout: false });
      return 1; // Return a number to match the expected type
    });

    service.trackView('test').then(() => {
      expect(_window.digitalData?.['infoPag']).toEqual(
        jasmine.objectContaining({
          page: 'test',
          URL: `${window.location.protocol}//${window.location.host}/test`,
          user_type: 'web'
        })
      );
      expect(trackFnSpy).toHaveBeenCalledWith('view');
      done();
    });
  });

  it('should track event with correct data', done => {
    const appContextData = {
      configuration: { name: 'test', steppers: {} },
      navigation: { viewedPages: ['page1', 'page2'] },
      settings: {}
    } as AppContextData;
    contextDataService.get.and.returnValue(appContextData);

    const trackInfo: TrackInfo = { brand: 'test' };
    const trackFnSpy = spyOn(service as any, 'trackFn').and.returnValue(1);

    spyOn(window, 'requestIdleCallback').and.callFake((callback: IdleRequestCallback) => {
      callback({ timeRemaining: () => 50, didTimeout: false });
      return 1; // Return a number to match the expected type
    });

    service
      .trackEvent('click', trackInfo)
      .then(() => {
        expect(trackFnSpy).toHaveBeenCalledWith(
          'click',
          jasmine.objectContaining({
            category: `tarificador ${appContextData.configuration.name}`
          })
        );
        done();
      })
      .catch(error => {
        fail(error);
        done();
      });
  });

  it('last stepper should be added to trackInfo', done => {
    const appContextData = {
      configuration: { name: 'test', steppers: { stepper1: { key: 'stepper1' } } },
      navigation: { lastPage: { pageId: 'test', stepper: { key: 'stepper1' } }, viewedPages: ['page1', 'page2'] },
      settings: {}
    } as unknown as AppContextData;
    contextDataService.get.and.returnValue(appContextData);

    const trackInfo: TrackInfo = { brand: 'test' };
    const trackFnSpy = spyOn(service as any, 'trackFn').and.returnValue(1);

    spyOn(window, 'requestIdleCallback').and.callFake((callback: IdleRequestCallback) => {
      callback({ timeRemaining: () => 50, didTimeout: false });
      return 1; // Return a number to match the expected type
    });

    service
      .trackEvent('click', trackInfo)
      .then(() => {
        expect(trackFnSpy).toHaveBeenCalledWith(
          'click',
          jasmine.objectContaining({
            category: `tarificador ${appContextData.configuration.name}`,
            page: appContextData.navigation.lastPage?.pageId
          })
        );
        done();
      })
      .catch(error => {
        fail(error);
        done();
      });
  });

  it('should not add stepper to trackInfo if stepper is not found', done => {
    const appContextData = {
      configuration: { name: 'test', steppers: {} },
      navigation: { lastPage: { pageId: 'test', stepper: { key: 'stepper1' } }, viewedPages: ['page1', 'page2'] },
      settings: {}
    } as unknown as AppContextData;
    contextDataService.get.and.returnValue(appContextData);

    const trackInfo: TrackInfo = { brand: 'test' };
    const trackFnSpy = spyOn(service as any, 'trackFn').and.returnValue(1);

    spyOn(window, 'requestIdleCallback').and.callFake((callback: IdleRequestCallback) => {
      callback({ timeRemaining: () => 50, didTimeout: false });
      return 1; // Return a number to match the expected type
    });

    service
      .trackEvent('click', trackInfo)
      .then(() => {
        expect(trackFnSpy).toHaveBeenCalledWith(
          'click',
          jasmine.objectContaining({
            category: `tarificador ${appContextData.configuration.name}`,
            page: appContextData.navigation.lastPage?.pageId
          })
        );
        done();
      })
      .catch(error => {
        fail(error);
        done();
      });
  });
});
