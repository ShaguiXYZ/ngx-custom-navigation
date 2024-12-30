/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NxDialogService, NxModalModule } from '@aposin/ng-aquila/modal';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subject } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { NX_RECAPTCHA_TOKEN } from 'src/app/core/services';
import { RoutingService } from 'src/app/core/services/routing.service';
import { OfferingPriceModel, QuoteModel } from 'src/app/library/models';
import { OfferingsService } from 'src/app/library/services/offerings.service';
import { QuoteOfferingCoveragesComponent } from 'src/app/shared/components';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { QuoteOfferingsComponent } from './quote-offerings.component';

describe('QuoteOfferingsComponent', () => {
  let component: QuoteOfferingsComponent;
  let fixture: ComponentFixture<QuoteOfferingsComponent>;
  let offeringsService: jasmine.SpyObj<OfferingsService>;
  let routingService: jasmine.SpyObj<RoutingService>;
  let dialogService: jasmine.SpyObj<NxDialogService>;

  beforeEach(async () => {
    const contextDataSubject = new Subject<any>();
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set', 'onDataChange']);
    const offeringsServiceSpy = jasmine.createSpyObj('OfferingsService', ['pricing']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const dialogServiceSpy = jasmine.createSpyObj('NxDialogService', ['open']);
    const rendererSpy = jasmine.createSpyObj('Renderer2', ['listen', 'setStyle']);
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);

    dialogServiceSpy.open.and.returnValue({});

    contextDataServiceSpy.get.and.callFake((contextDataKey: string): any => {
      if (contextDataKey === QUOTE_APP_CONTEXT_DATA) {
        return {
          configuration: { literals: {} },
          navigation: { lastPage: { pageId: 'page1' }, viewedPages: ['page1', 'page2'] }
        } as AppContextData;
      } else if (contextDataKey === QUOTE_CONTEXT_DATA) {
        return {
          offering: { price: { totalPremiumAmount: '100' }, prices: [{ totalPremiumAmount: '100' }, { totalPremiumAmount: '200' }] }
        };
      }

      return null;
    });

    contextDataServiceSpy.onDataChange.and.returnValue(contextDataSubject.asObservable());

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteOfferingsComponent, CommonModule, BrowserAnimationsModule, NxModalModule],
      providers: [
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: OfferingsService, useValue: offeringsServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: NxDialogService, useValue: dialogServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: Renderer2, useValue: rendererSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } }
      ]
    }).compileComponents();

    offeringsService = TestBed.inject(OfferingsService) as jasmine.SpyObj<OfferingsService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    dialogService = TestBed.inject(NxDialogService) as jasmine.SpyObj<NxDialogService>;
    fixture = TestBed.createComponent(QuoteOfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch offering prices on init', async () => {
    const prices = [{ totalPremiumAmount: '100' }, { totalPremiumAmount: '200' }] as OfferingPriceModel[];

    offeringsService.pricing.and.returnValue(Promise.resolve({ prices }));

    await component.ngOnInit();

    expect(component.prices).toEqual(prices);
  });

  it('should handle error when fetching offering prices', async () => {
    component['_contextData'] = { offering: {} } as QuoteModel;
    offeringsService.pricing.and.returnValue(Promise.reject());

    try {
      await component.ngOnInit();
    } catch (e) {
      expect(e).toEqual(new Error('Error fetching offering prices'));
    }
  });

  it('should select steper and update selectedPriceIndex', () => {
    component['_contextData'] = { offering: { prices: [{ totalPremiumAmount: '100' }, { totalPremiumAmount: '200' }] } } as QuoteModel;
    component.prices = [{ totalPremiumAmount: '100' }, { totalPremiumAmount: '200' }] as OfferingPriceModel[];

    component.selectSteper(1);

    expect(component.selectedPriceIndex).toBe(1);
    // expect(renderer.setStyle).toHaveBeenCalledWith(component['track'].nativeElement, 'transition', 'transform 0.5s ease-out');
  });

  it('should call next and select next steper', () => {
    component['_contextData'] = { offering: {} } as QuoteModel;
    component.prices = [{ totalPremiumAmount: '100' }, { totalPremiumAmount: '200' }] as OfferingPriceModel[];
    component.selectedPriceIndex = 0;
    component.next();

    expect(component.selectedPriceIndex).toBe(1);
  });

  it('should call previous and select previous steper', () => {
    component['_contextData'] = { offering: {} } as QuoteModel;
    component.prices = [{ totalPremiumAmount: '100' }, { totalPremiumAmount: '200' }] as OfferingPriceModel[];
    component.selectedPriceIndex = 1;
    component.previous();

    expect(component.selectedPriceIndex).toBe(0);
  });

  xit('should show coverages and open dialog', () => {
    component.prices = [{ totalPremiumAmount: '100' }, { totalPremiumAmount: '200' }] as OfferingPriceModel[];
    component.showCoverages(1);

    expect(component.selectedPriceIndex).toBe(1);
    expect(dialogService.open).toHaveBeenCalledWith(QuoteOfferingCoveragesComponent, {
      maxWidth: '98%',
      showCloseIcon: true,
      data: { selectedPriceIndex: 1 }
    });
  });

  it('should call contactUs and navigate to next route', () => {
    component['_contextData'] = { offering: {} } as QuoteModel;
    const price = { totalPremiumAmount: '100' } as OfferingPriceModel;
    component.contactUs(price);

    expect(component['_contextData'].offering.price).toEqual(price);
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should handle swipe start', () => {
    const event = { changedTouches: [{ clientX: 100, clientY: 200 }] } as unknown as TouchEvent;
    component['swipeStart'](event);

    expect(component['swipeCoord']).toEqual([100, 200]);
    expect(component['swipeTime']).toBeDefined();
  });

  it('should handle swipe end and select next steper', () => {
    component['_contextData'] = { offering: {} } as QuoteModel;
    component.prices = [{ totalPremiumAmount: '100' }, { totalPremiumAmount: '200' }] as OfferingPriceModel[];
    component.selectedPriceIndex = 0;
    component['swipeCoord'] = [100, 200];
    component['swipeTime'] = new Date().getTime() - 1000;

    const event = { changedTouches: [{ clientX: 50, clientY: 200 }] } as unknown as TouchEvent;
    component['swipeEnd'](event);

    expect(component.selectedPriceIndex).toBe(1);
  });
});
