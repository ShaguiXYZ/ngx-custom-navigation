import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteHeaderComponent } from './quote-header.component';

describe('QuoteHeaderComponent', () => {
  let component: QuoteHeaderComponent;
  let fixture: ComponentFixture<QuoteHeaderComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['previous']);

    await TestBed.configureTestingModule({
      imports: [QuoteHeaderComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy }
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
              showBack: true
            }
          }
        }
      }
    } as unknown as AppContextData;

    contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, mockData);

    component.ngOnInit();

    expect(component.config.showBack).toBe(true);
  });

  it('should unsubscribe on destroy', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription$'] = [subscriptionSpy];

    component.ngOnDestroy();

    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should call previous on return', () => {
    component.return();

    expect(routingService.previous).toHaveBeenCalled();
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
