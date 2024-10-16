import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteHeaderComponent } from './quote-header.component';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { RoutingService } from 'src/app/core/services';
import { of } from 'rxjs';
import { AppContextData, Page } from 'src/app/core/models';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { TranslateService } from '@ngx-translate/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';

describe('QuoteHeaderComponent', () => {
  let component: QuoteHeaderComponent;
  let fixture: ComponentFixture<QuoteHeaderComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['previousStep']);

    await TestBed.configureTestingModule({
      imports: [QuoteHeaderComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy },
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

    expect(component.showBackButton).toBe(true);
  });

  it('should unsubscribe on destroy', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription$'] = [subscriptionSpy];

    component.ngOnDestroy();

    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should call previousStep on return', () => {
    component.return();

    expect(routingService.previousStep).toHaveBeenCalled();
  });

  it('should set showBackButton to true if lastPage is undefined', () => {
    const mockData: AppContextData = {
      navigation: {
        lastPage: undefined
      }
    } as AppContextData;

    contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, mockData);

    component.ngOnInit();

    expect(component.showBackButton).toBe(true);
  });

  it('should set showBackButton to true if showBack is not defined in lastPage', () => {
    const mockData: AppContextData = {
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

    expect(component.showBackButton).toBe(true);
  });
});
