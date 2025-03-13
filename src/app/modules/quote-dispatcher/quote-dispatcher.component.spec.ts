import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { CommercialExceptionsModel, JourneyInfo, NX_LANGUAGE_CONFIG, QuoteSettingsModel } from 'src/app/core/models';
import { BudgetActivator } from 'src/app/core/service-activators/budget.activator';
import { JourneyService, NX_RECAPTCHA_TOKEN, RoutingService, SettingsService } from 'src/app/core/services';
import { QuoteTrackService } from 'src/app/core/tracking';
import { QuoteDispatcherComponent } from './quote-dispatcher.component';

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
    const settingsService = jasmine.createSpyObj('SettingsService', ['loadSettings']);
    const trackServiceSpy = jasmine.createSpyObj('QuoteTrackService', ['trackView']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setDefaultLang', 'use', 'instant']);
    const mockWorkflowConfig = {
      errorPageId: 'error',
      manifest: {}
    };
    const mockLanguageConfig = {
      current: 'en',
      languages: ['en', 'fr']
    };

    translateServiceSpy.use.and.returnValue(of('en'));

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    mockContextDataService = jasmine.createSpyObj('ContextDataService', ['get', 'set']);
    mockRoutingService = jasmine.createSpyObj('RoutingService', ['someMethod']);
    mockHttpService = jasmine.createSpyObj('HttpService', ['get']);
    mockJourneyService = jasmine.createSpyObj('JourneyService', [
      'journeySettings',
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
        { provide: QuoteTrackService, useValue: trackServiceSpy },
        { provide: SettingsService, useValue: settingsService },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteDispatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detectar cambios
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call BudgetActivator if stored param exists', async () => {
    const mockContext = {
      settings: {
        commercialExceptions: {}
      },
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          home: {
            pageId: 'home',
            route: 'home-route'
          }
        },
        version: { actual: 'v1.0.0', last: '1.0.0' }
      },
      navigation: {
        viewedPages: []
      }
    };

    const mockCommercialExceptions = {} as unknown as CommercialExceptionsModel;

    mockContextDataService.get.and.returnValue(mockContext);
    mockActivatedRoute.snapshot.params = { stored: 'some-budget' };
    mockJourneyService.quoteSettings.and.returnValue(
      Promise.resolve({ commercialExceptions: mockCommercialExceptions } as QuoteSettingsModel)
    );
    mockJourneyService.journeySettings.and.returnValue(Promise.resolve({} as JourneyInfo));

    spyOn(BudgetActivator, 'retrieveBudget').and.returnValue(async () => true);

    await component.ngOnInit();

    expect(BudgetActivator.retrieveBudget).toHaveBeenCalledWith({ contextDataService: mockContextDataService });
  });

  it('should call trackService if dispatcher param exists', async () => {
    const mockContext = {
      settings: {
        commercialExceptions: {}
      },
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          home: {
            pageId: 'home',
            route: 'home-route'
          }
        },
        version: { actual: 'v1.0.0', last: '1.0.0' }
      },
      navigation: {
        viewedPages: []
      }
    };

    mockContextDataService.get.and.returnValue(mockContext);

    mockActivatedRoute.snapshot.params = { dispatcher: 'some-dispatcher' };

    await component.ngOnInit();

    expect(mockJourneyService.quoteSettings).not.toHaveBeenCalled();
  });

  it('should call loader if dispatcher param exists', async () => {
    const mockContext = {
      settings: {
        commercialExceptions: {}
      },
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          home: {
            pageId: 'home',
            route: 'home-route'
          }
        },
        version: { actual: 'v1.0.0', last: '1.0.0' }
      },
      navigation: {
        viewedPages: []
      }
    };

    const mockCommercialExceptions = {} as unknown as CommercialExceptionsModel;

    mockContextDataService.get.and.returnValue(mockContext);
    mockActivatedRoute.snapshot.params = { dispatcher: 'some-dispatcher' };
    mockJourneyService.quoteSettings.and.returnValue(
      Promise.resolve({ commercialExceptions: mockCommercialExceptions } as QuoteSettingsModel)
    );
    mockJourneyService.journeySettings.and.returnValue(Promise.resolve({} as JourneyInfo));

    spyOn(component as never, 'loader').and.callThrough();

    await component.ngOnInit();

    expect(component['loader']).toHaveBeenCalled();
  });

  it('should call resetContext if homePageId exists', async () => {
    const mockContext = {
      settings: {
        commercialExceptions: {}
      },
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          home: {
            pageId: 'home',
            route: 'home-route'
          }
        },
        version: { actual: 'v1.0.0', last: '1.0.0' }
      },
      navigation: {
        viewedPages: ['home']
      }
    };

    const mockCommercialExceptions = {} as unknown as CommercialExceptionsModel;

    mockContextDataService.get.and.returnValue(mockContext);
    mockJourneyService.quoteSettings.and.returnValue(
      Promise.resolve({ commercialExceptions: mockCommercialExceptions } as QuoteSettingsModel)
    );
    mockJourneyService.journeySettings.and.returnValue(Promise.resolve({} as JourneyInfo));

    spyOn(component as never, 'resetContext').and.callThrough();

    await component.ngOnInit();

    expect(component['resetContext']).toHaveBeenCalled();
  });
});
