/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { AppContextData, CommercialExceptionsModel, JourneyInfo, QuoteSettingsModel } from 'src/app/core/models';
import { BudgetActivator } from 'src/app/core/service-activators/budget.activator';
import { JourneyService, NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { QuoteDispatcherComponent } from './quote-dispatcher.component';
import { TranslateService } from '@ngx-translate/core';
import { QUOTE_WORKFLOW_TOKEN } from 'src/app/core/components/constants';

describe('QuoteDispatcherComponent', () => {
  let component: QuoteDispatcherComponent;
  let fixture: ComponentFixture<QuoteDispatcherComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockContextDataService: jasmine.SpyObj<ContextDataService>;
  let mockRoutingService: jasmine.SpyObj<RoutingService>;
  let mockHttpService: jasmine.SpyObj<HttpService>;
  let mockJourneyService: jasmine.SpyObj<JourneyService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setDefaultLang']);
    const mockConfig = {
      manifest: {},
      initializedModel: () => {},
      signModel: () => {}
    };
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    mockContextDataService = jasmine.createSpyObj('ContextDataService', ['get', 'set']);
    mockRoutingService = jasmine.createSpyObj('RoutingService', ['someMethod']);
    mockHttpService = jasmine.createSpyObj('HttpService', ['get']);
    mockJourneyService = jasmine.createSpyObj('JourneyService', [
      'clientJourney',
      'fetchConfiguration',
      'hasBreakingChange',
      'quoteSettings'
    ]);

    mockActivatedRoute.snapshot = {
      params: {},
      url: [],
      queryParams: {},
      fragment: '',
      data: {},
      outlet: 'primary',
      component: null,
      routeConfig: null,
      root: {} as ActivatedRouteSnapshot,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: jasmine.createSpyObj('ParamMap', ['get']),
      queryParamMap: jasmine.createSpyObj('ParamMap', ['get']),
      title: ''
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteDispatcherComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ContextDataService, useValue: mockContextDataService },
        { provide: RoutingService, useValue: mockRoutingService },
        { provide: JourneyService, useValue: mockJourneyService },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: HttpService, useValue: mockHttpService },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: QUOTE_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteDispatcherComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to workflow loader on init', async () => {
    const mockContext = {
      settings: {},
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          home: {
            pageId: 'home',
            component: 'home-compenent'
          }
        }
      },
      navigation: {
        viewedPages: []
      }
    };

    const mockCommercialExceptions = { enableWorkFlow: true } as unknown as CommercialExceptionsModel;

    mockContextDataService.get.and.returnValue(mockContext);
    mockJourneyService.quoteSettings.and.returnValue(
      Promise.resolve({ commercialExceptions: mockCommercialExceptions } as QuoteSettingsModel)
    );
    mockJourneyService.clientJourney.and.returnValue(Promise.resolve({} as JourneyInfo));

    await component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['workflow-loader'], { skipLocationChange: true });
  });

  it('should throw error if homePageId is not found', async () => {
    const mockContext: AppContextData = {
      configuration: {
        pageMap: {
          home: {
            pageId: 'home',
            component: 'home-route'
          }
        }
      },
      navigation: {
        viewedPages: []
      }
    } as unknown as AppContextData;

    mockContextDataService.get.and.returnValue(mockContext);

    await expectAsync(component.ngOnInit()).toBeRejectedWithError('Home page not found in configuration');
  });

  it('should call BudgetActivator if stored param exists', async () => {
    const mockContext = {
      settings: {
        commercialExceptions: { enableWorkFlow: true }
      },
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          home: {
            pageId: 'home',
            route: 'home-route'
          }
        }
      },
      navigation: {
        viewedPages: []
      }
    };

    const mockCommercialExceptions = { enableWorkFlow: true } as unknown as CommercialExceptionsModel;

    mockContextDataService.get.and.returnValue(mockContext);
    mockActivatedRoute.snapshot.params = { stored: 'some-budget' };
    mockJourneyService.quoteSettings.and.returnValue(
      Promise.resolve({ commercialExceptions: mockCommercialExceptions } as QuoteSettingsModel)
    );
    mockJourneyService.clientJourney.and.returnValue(Promise.resolve({} as JourneyInfo));

    spyOn(BudgetActivator, 'retrieveBudget').and.returnValue(async () => true);

    await component.ngOnInit();

    expect(BudgetActivator.retrieveBudget).toHaveBeenCalledWith({ contextDataService: mockContextDataService });
  });

  it('should navigate to dispatcher', async () => {
    const mockContext = {
      settings: {},
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          home: {
            pageId: 'home',
            route: 'home-route'
          },
          dispatcher: {
            pageId: 'dispatcher',
            route: 'dispatcher-route'
          }
        }
      },
      navigation: {
        viewedPages: []
      }
    };

    mockContextDataService.get.and.returnValue(mockContext);
    mockActivatedRoute.snapshot.params = { dispatcher: 'dispatcher' };

    await component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['dispatcher'], { skipLocationChange: true });
  });
});
