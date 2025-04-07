/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_LANGUAGE_CONFIG, OfferingPriceModel } from 'src/app/core/models';
import { ServiceActivatorService } from 'src/app/core/service-activators';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { OfferingsService } from 'src/app/library/services/offerings.service';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { QuoteOfferingsComponent } from './quote-offerings.component';

describe('QuoteOfferingsComponent', () => {
  let component: QuoteOfferingsComponent;
  let fixture: ComponentFixture<QuoteOfferingsComponent>;
  let offeringsServiceSpy: jasmine.SpyObj<OfferingsService>;
  let routingServiceSpy: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const httpServiceSpy = jasmine.createSpyObj('HttpService', ['get']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setDefaultLang', 'use', 'instant']);
    const serviceActivatorService = jasmine.createSpyObj('ServiceActivatorService', ['activateEntryPoint']);
    const mockWorkflowConfig = {
      errorPageId: 'error',
      manifest: {}
    };
    const mockLanguageConfig = {
      current: 'en',
      languages: ['en', 'fr']
    };

    offeringsServiceSpy = jasmine.createSpyObj('OfferingsService', ['pricing']);
    routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteOfferingsComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: OfferingsService, useValue: offeringsServiceSpy },
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: ServiceActivatorService, useValue: serviceActivatorService },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteOfferingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should fetch offering prices on init', async () => {
    const mockPrices = [{ modalityId: 1, totalPremiumAmount: 100 }] as OfferingPriceModel[];
    component['_contextData'] = { offering: { priceIndex: 2 }, signature: {} } as any;
    offeringsServiceSpy.pricing.and.returnValue(Promise.resolve({ prices: mockPrices }));

    await component.ngOnInit();

    expect(component.prices).toEqual(mockPrices);
    expect(offeringsServiceSpy.pricing).toHaveBeenCalled();
  });

  it('should handle error when fetching offering prices', async () => {
    offeringsServiceSpy.pricing.and.returnValue(Promise.reject());

    await expectAsync(component.ngOnInit()).toBeRejectedWithError('Error fetching offering prices');
  });

  it('should set selected price index', () => {
    component['_contextData'] = { offering: { priceIndex: 2 } } as any;

    expect(component.selectedPriceIndex).toBe(2);
  });

  it('should update offering price on callNow', () => {
    const mockPrice = { modalityId: 1, totalPremiumAmount: 100 } as OfferingPriceModel;
    component['_contextData'] = { offering: { price: {} } } as any;

    component.callNow(mockPrice);

    expect(component['_contextData'].offering.price).toEqual(mockPrice);
  });

  it('should update offering price and navigate on contactUs', () => {
    const mockPrice = { modalityId: 1, totalPremiumAmount: 100 } as OfferingPriceModel;
    component['_contextData'] = { offering: { price: {} } } as any;

    component.contactUs(mockPrice);

    expect(component['_contextData'].offering.price).toEqual(mockPrice);
    expect(routingServiceSpy.next).toHaveBeenCalled();
  });
});
