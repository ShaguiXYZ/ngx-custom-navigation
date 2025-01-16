/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subject } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { LanguageService, NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteLiteralPipe } from '../../pipes';
import { QuoteHeaderComponent } from './quote-header.component';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';

describe('QuoteHeaderComponent', () => {
  let component: QuoteHeaderComponent;
  let fixture: ComponentFixture<QuoteHeaderComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const languageServiceSubject = new Subject<any>();
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['previous']);
    const languageServiceSpy = jasmine.createSpyObj('LanguageService', ['asObservable', 'languages', 'current', 'i18n']);
    const mockWorkflowConfig = {
      errorPageId: 'error',
      manifest: {}
    };
    const mockLanguageConfig = {
      current: 'en',
      languages: ['en', 'fr']
    };

    languageServiceSpy.asObservable.and.returnValue(languageServiceSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [QuoteHeaderComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteHeaderComponent);
    component = fixture.componentInstance;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe on destroy', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.verified = true;
    component['subscription$'] = [subscriptionSpy];

    component.ngOnDestroy();

    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should call previous on return', () => {
    component.return();

    expect(routingService.previous).toHaveBeenCalled();
  });

  describe('verified component', () => {
    beforeEach(async () => {
      component.verified = true;
      fixture.detectChanges();
    });

    it('should set showBackButton based on context data', () => {
      const mockData: AppContextData = {
        configuration: {
          title: 'test'
        },
        navigation: {
          lastPage: {
            pageId: 'show-back',
            configuration: {
              data: {
                headerConfig: {
                  showBack: true
                }
              }
            }
          }
        }
      } as unknown as AppContextData;

      contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, mockData);

      component.ngOnInit();

      expect(component.config.showBack).toBe(true);
    });

    it('should set showBackButton to true if lastPage is undefined', () => {
      const mockData: AppContextData = {
        configuration: {
          title: 'test'
        },
        navigation: {
          lastPage: undefined
        }
      } as AppContextData;

      contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, mockData);

      component.ngOnInit();

      expect(component.config.showBack).toBe(true);
    });

    it('should set showBackButton to true if showBack is not defined in lastPage', () => {
      const mockData: AppContextData = {
        configuration: {
          title: 'test'
        },
        navigation: {
          lastPage: {
            configuration: {
              data: {}
            }
          }
        }
      } as AppContextData;

      contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, mockData);

      component.ngOnInit();

      expect(component.config.showBack).toBe(true);
    });
  });

  describe('unverified component', () => {
    beforeEach(async () => {
      component.verified = false;
      fixture.detectChanges();
    });

    it('should set showBackButton to false if not verified', () => {
      const mockData: AppContextData = {
        configuration: {
          title: 'test'
        },
        navigation: {
          lastPage: {
            pageId: 'show-back',
            configuration: {
              data: {
                headerConfig: {
                  showBack: true
                }
              }
            }
          }
        }
      } as unknown as AppContextData;

      contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, mockData);

      component.ngOnInit();

      expect(component.config.showBack).toBeUndefined();
    });

    it('should set showBackButton to false if not verified and lastPage is undefined', () => {
      const mockData: AppContextData = {
        configuration: {
          title: 'test'
        },
        navigation: {
          lastPage: undefined
        }
      } as AppContextData;

      contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, mockData);

      component.ngOnInit();

      expect(component.config.showBack).toBeUndefined();
    });

    it('should set showBackButton to false if not verified and showBack is not defined in lastPage', () => {
      const mockData: AppContextData = {
        configuration: {
          title: 'test'
        },
        navigation: {
          lastPage: {
            configuration: {
              data: {}
            }
          }
        }
      } as AppContextData;

      contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, mockData);

      component.ngOnInit();

      expect(component.config.showBack).toBeUndefined();
    });
  });
});
