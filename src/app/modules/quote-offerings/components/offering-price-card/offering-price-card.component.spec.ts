import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { OfferingPriceModel } from 'src/app/shared/models';
import { QuoteOfferingPriceCardComponent } from './offering-price-card.component';

describe('QuoteOfferingPriceCardComponent', () => {
  let component: QuoteOfferingPriceCardComponent;
  let fixture: ComponentFixture<QuoteOfferingPriceCardComponent>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [QuoteOfferingPriceCardComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteOfferingPriceCardComponent);
    component = fixture.componentInstance;
    component.price = { totalPremiumAmount: '123.45' } as OfferingPriceModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set price and split price segments correctly', () => {
    const price: OfferingPriceModel = { totalPremiumAmount: '123.45' } as OfferingPriceModel;
    component.price = price;

    expect(component.price).toEqual(price);
    expect(component.priceInteger).toBe('123');
    expect(component.priceDecimal).toBe('45');
  });

  it('should emit uiShowCoverages event when showCoverages is called', () => {
    spyOn(component.uiShowCoverages, 'emit');

    const price: OfferingPriceModel = { totalPremiumAmount: '123.45' } as OfferingPriceModel;
    component.price = price;
    component.showCoverages();

    expect(component.uiShowCoverages.emit).toHaveBeenCalledWith(price);
  });

  it('should emit uiContactUs event when contactUs is called', () => {
    spyOn(component.uiContactUs, 'emit');

    const price: OfferingPriceModel = { totalPremiumAmount: '123.45' } as OfferingPriceModel;
    component.price = price;
    component.contactUs();

    expect(component.uiContactUs.emit).toHaveBeenCalledWith(price);
  });

  it('should emit uiCallNow event when callNow is called', () => {
    spyOn(component.uiCallNow, 'emit');

    const price: OfferingPriceModel = { totalPremiumAmount: '123.45' } as OfferingPriceModel;
    component.price = price;
    component.callNow();

    expect(component.uiCallNow.emit).toHaveBeenCalledWith(price);
  });

  it('should have a footerConfig with showNext set to true and nextFn bound to callNow', () => {
    expect(component.footerConfig.showNext).toBeTrue();
    // resolve error Expected Function to be Function.
    expect(typeof component.footerConfig.nextFn).toBe('function');
    expect(component.footerConfig.nextFn?.name).toBe('bound callNow');
  });

  it('should return the current date when now is accessed', () => {
    const now = new Date();

    expect(component.now.getFullYear()).toBe(now.getFullYear());
    expect(component.now.getMonth()).toBe(now.getMonth());
    expect(component.now.getDate()).toBe(now.getDate());
  });
});
