/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { OfferingPriceModel, QuoteModel, QuoteOfferingModel } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { OfferingsService } from 'src/app/core/services/offerings.service';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { QuoteOfferingsComponent } from './quote-offerings.component';

describe('QuoteOfferingsComponent', () => {
  let component: QuoteOfferingsComponent;
  let fixture: ComponentFixture<QuoteOfferingsComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let offeringsService: jasmine.SpyObj<OfferingsService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const offeringsServiceSpy = jasmine.createSpyObj('OfferingsService', ['pricing']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteOfferingsComponent],
      providers: [
        QuoteLiteralPipe,
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: OfferingsService, useValue: offeringsServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy }
      ]
    }).compileComponents();

    TestBed.overrideComponent(QuoteOfferingsComponent, {
      set: {
        providers: [{ provide: OfferingsService, useValue: offeringsServiceSpy }]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteOfferingsComponent);
    component = fixture.componentInstance;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    offeringsService = TestBed.inject(OfferingsService) as jasmine.SpyObj<OfferingsService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['inner'] = new ElementRef(document.createElement('div'));
    component['track'] = new ElementRef(document.createElement('div'));

    // add child nodes to track element
    for (let i = 0; i < 3; i++) {
      component['track'].nativeElement.appendChild(document.createElement('div'));
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize context data and prices on init', async () => {
    const mockQuote: QuoteModel = { offering: { price: { modalityId: '1' } } } as unknown as QuoteModel;
    const mockOffering: QuoteOfferingModel = {
      prices: [
        { modalityId: '1', totalPremiumAmount: '10.1' },
        { modalityId: '2', totalPremiumAmount: '20.1' }
      ]
    } as unknown as QuoteOfferingModel;

    component['contextData'] = mockQuote;

    contextDataService.get.and.callFake((contextDataKey: string): any => {
      if (contextDataKey === QUOTE_APP_CONTEXT_DATA) {
        return { navigation: { lastPage: 'page' }, configuration: { literals: {} } };
      } else if (contextDataKey === QUOTE_CONTEXT_DATA) {
        return mockQuote;
      }

      return null;
    });

    offeringsService.pricing.and.returnValue(Promise.resolve(mockOffering));

    await component.ngOnInit();

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component['contextData']).toEqual(mockQuote);
      expect(component.prices).toEqual(mockOffering.prices);
    });
  });

  it('should handle swipe start', () => {
    const touchEvent = new TouchEvent('touchstart', {
      changedTouches: [new Touch({ identifier: 0, target: component['inner'].nativeElement, clientX: 100, clientY: 100 })]
    });

    component.swipeStart(touchEvent);

    expect(component['swipeCoord']).toEqual([100, 100]);
    expect(component['swipeTime']).toBeDefined();
  });

  it('should handle swipe end and change selected price index', () => {
    component.prices = [{ modalityId: '1' }, { modalityId: '2' }] as unknown as OfferingPriceModel[];
    component.selectedPriceIndex = 0;
    component['swipeCoord'] = [100, 100];
    component['swipeTime'] = new Date().getTime() - 500;

    const touchEvent = new TouchEvent('touchend', {
      changedTouches: [new Touch({ identifier: 0, target: component['inner'].nativeElement, clientX: 50, clientY: 100 })]
    });

    spyOn(component, 'selectSteper');

    component.swipeEnd(touchEvent);

    expect(component.selectSteper).toHaveBeenCalledWith(1);
  });

  it('should select steper and update context data', () => {
    const mockPrices: OfferingPriceModel[] = [{ modalityId: '1' }, { modalityId: '2' }] as unknown as OfferingPriceModel[];
    component.prices = mockPrices;
    component['contextData'] = { offering: { price: {} } } as QuoteModel;

    component.selectSteper(1);

    expect(component.selectedPriceIndex).toBe(1);
    expect(component['contextData'].offering.price).toEqual(mockPrices[1]);
  });

  it('should call routing service next step on contact us', () => {
    const mockPrice: OfferingPriceModel = { modalityId: '1' } as unknown as OfferingPriceModel;
    component['contextData'] = { offering: { price: {} } } as QuoteModel;

    component.contactUs(mockPrice);

    expect(component['contextData'].offering.price).toEqual(mockPrice);
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should set the scroll position of the track to the selected price index', () => {
    component.prices = [{ modalityId: '1' }, { modalityId: '2' }, { modalityId: '3' }] as unknown as OfferingPriceModel[];
    component.selectedPriceIndex = 1;

    component['inner'].nativeElement = {
      clientWidth: 300
    } as any;
    component['track'].nativeElement = {
      childNodes: [{ clientWidth: 100 }, { clientWidth: 100 }, { clientWidth: 100 }, { clientWidth: 100 }] as any,
      style: {}
    } as any;

    component['selectCarrouselCard']();

    expect(component['track'].nativeElement.style.transform).toBe('translateX(0px)');
  });
});
