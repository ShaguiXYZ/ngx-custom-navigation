/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { journeyGuard } from '../journey.guard';

describe('JourneyGuard', () => {
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set']);
    const routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);
    const mockConfig = {
      manifest: {}
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {}
          }
        },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    });

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
  });

  it('should update viewedPages and navigate to the next page', () => {
    const mockContext = {
      settings: {},
      navigation: {
        nextPage: { pageId: 'page2', route: 'page2' },
        viewedPages: ['page1'],
        lastPage: undefined
      },
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          page1: { pageId: 'page1', route: 'page1' },
          page2: { pageId: 'page2', route: 'page2' }
        }
      }
    };

    contextDataService.get.and.returnValue(mockContext);

    const activatedRoute = TestBed.inject(ActivatedRoute);
    const result = TestBed.runInInjectionContext(() => {
      return journeyGuard(activatedRoute.snapshot, {} as RouterStateSnapshot);
    });

    expect(mockContext.navigation.viewedPages).toEqual(['page1', 'page2']);
    expect(contextDataService.set).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA, mockContext);
    expect(result).toBeTrue();
  });

  it('should handle navigation to error page correctly', () => {
    const mockContext = {
      settings: {},
      navigation: {
        nextPage: { pageId: 'error', route: 'error' },
        viewedPages: ['page1'],
        lastPage: undefined
      },
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          page1: { pageId: 'page1', route: 'page1' },
          error: { pageId: 'error', route: 'error' }
        }
      }
    };

    contextDataService.get.and.returnValue(mockContext);

    const activatedRoute = TestBed.inject(ActivatedRoute);
    const result = TestBed.runInInjectionContext(() => {
      return journeyGuard(activatedRoute.snapshot, {} as RouterStateSnapshot);
    });

    expect(mockContext.navigation.lastPage as any).toEqual(mockContext.configuration.pageMap.error);
    expect(contextDataService.set).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA, mockContext);
    expect(result).toBeTrue();
  });

  it('should update track data when navigating between steppers', () => {
    const mockContext = {
      settings: {},
      navigation: {
        nextPage: { pageId: 'page2', route: 'page2', stepper: { key: 'step2' } },
        viewedPages: ['page1'],
        lastPage: { pageId: 'page1', route: 'page1', stepper: { key: 'step1' } }
      },
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          page1: { pageId: 'page1', route: 'page1' },
          page2: { pageId: 'page2', route: 'page2' }
        },
        steppers: {
          step1: { stateInfo: true },
          step2: { stateInfo: true }
        }
      }
    };

    contextDataService.get.and.returnValues(mockContext, {});

    const activatedRoute = TestBed.inject(ActivatedRoute);
    const result = TestBed.runInInjectionContext(() => {
      return journeyGuard(activatedRoute.snapshot, {} as RouterStateSnapshot);
    });

    expect(contextDataService.set).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA, mockContext);
    expect(result).toBeTrue();
  });
});
