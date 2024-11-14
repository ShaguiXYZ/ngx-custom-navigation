import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxTabsModule } from '@aposin/ng-aquila/tabs';
import { QuoteOfferingCoveragesComponent } from './quote-offering-coverages.component';
import { OfferingPriceModel } from 'src/app/core/models';
import { QuoteLiteralDirective } from '../../directives';
import { HeaderTitleComponent } from '../header-title';
import { TranslateService } from '@ngx-translate/core';

xdescribe('QuoteOfferingCoveragesComponent', () => {
  let component: QuoteOfferingCoveragesComponent;
  let fixture: ComponentFixture<QuoteOfferingCoveragesComponent>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        QuoteOfferingCoveragesComponent,
        CommonModule,
        HeaderTitleComponent,
        NxAccordionModule,
        NxHeadlineModule,
        NxTabsModule,
        QuoteLiteralDirective
      ],
      providers: [{ provide: TranslateService, useValue: translateServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteOfferingCoveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default selectedPriceIndex as 0', () => {
    expect(component.selectedPriceIndex).toBe(0);
  });

  it('should have empty prices array by default', () => {
    expect(component.prices).toEqual([]);
  });

  it('should render header title component', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('header-title')).toBeTruthy();
  });

  it('should update selectedPriceIndex when input changes', () => {
    component.selectedPriceIndex = 2;
    fixture.detectChanges();
    expect(component.selectedPriceIndex).toBe(2);
  });

  it('should update prices when input changes', () => {
    const prices: OfferingPriceModel[] = [
      { modalityId: 1, totalPremiumAmount: '100' },
      { modalityId: 2, totalPremiumAmount: '200' }
    ] as OfferingPriceModel[];
    component.prices = prices;
    fixture.detectChanges();
    expect(component.prices).toEqual(prices);
  });
});
