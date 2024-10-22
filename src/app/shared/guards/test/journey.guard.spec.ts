import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { QuoteModel } from '../../models';
import { journeyGuard } from '../journey.guard';

describe('JourneyGuard', () => {
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set']);
    const routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {}
          }
        }
      ]
    });

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should navigate to the next page if nextPage is not defined', () => {
    const mockContext: AppContextData = {
      navigation: {
        nextPage: undefined,
        viewedPages: ['page1'],
        lastPage: undefined
      },
      configuration: {
        homePageId: 'home',
        pageMap: {
          page1: { pageId: 'page1', route: 'page1' }
        }
      }
    };

    contextDataService.get.and.returnValue(mockContext);

    const activatedRoute = TestBed.inject(ActivatedRoute);
    const result = TestBed.runInInjectionContext(() => {
      return journeyGuard(activatedRoute.snapshot, {} as RouterStateSnapshot);
    });

    expect(contextDataService.set).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA, mockContext);
    expect(router.parseUrl).toHaveBeenCalledWith('page1');
    expect(result).toBe(router.parseUrl('page1'));
  });

  it('should update viewedPages and navigate to the next page', () => {
    const mockContext: AppContextData = {
      navigation: {
        nextPage: { pageId: 'page2', route: 'page2' },
        viewedPages: ['page1'],
        lastPage: undefined
      },
      configuration: {
        homePageId: 'home',
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

  it('should reset quote context data if navigating to home page', () => {
    const mockContext: AppContextData = {
      navigation: {
        nextPage: { pageId: 'home', route: 'home' },
        viewedPages: ['page1'],
        lastPage: undefined
      },
      configuration: {
        homePageId: 'home',
        pageMap: {
          page1: { pageId: 'page1', route: 'page1' },
          home: { pageId: 'home', route: 'home' }
        }
      }
    };

    contextDataService.get.and.returnValue(mockContext);

    const activatedRoute = TestBed.inject(ActivatedRoute);
    TestBed.runInInjectionContext(() => {
      return journeyGuard(activatedRoute.snapshot, {} as RouterStateSnapshot);
    });

    expect(contextDataService.set).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, QuoteModel.init());
  });
});
