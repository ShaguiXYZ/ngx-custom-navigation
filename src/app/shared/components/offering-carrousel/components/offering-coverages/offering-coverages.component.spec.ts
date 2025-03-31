/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NX_MODAL_DATA } from '@aposin/ng-aquila/modal';
import { NxTabsModule } from '@aposin/ng-aquila/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteOfferingCoveragesComponent } from './offering-coverages.component';
import { of } from 'rxjs';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';

describe('QuoteOfferingCoveragesComponent', () => {
  let component: QuoteOfferingCoveragesComponent;
  let fixture: ComponentFixture<QuoteOfferingCoveragesComponent>;

  beforeEach(async () => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setDefaultLang', 'use', 'instant']);
    const mockLanguageConfig = {
      current: 'en',
      languages: ['en', 'fr']
    };

    translateServiceSpy.use.and.returnValue(of('en'));

    contextDataServiceSpy.get.and.callFake((contextDataKey: string): any => {
      if (contextDataKey === QUOTE_APP_CONTEXT_DATA) {
        return { navigation: { lastPage: 'page' }, configuration: { literals: {} } };
      } else if (contextDataKey === QUOTE_CONTEXT_DATA) {
        return {
          offering: {
            price: {},
            prices: [
              { modalityId: 1, totalPremiumAmount: 100 },
              { modalityId: 2, totalPremiumAmount: 200 }
            ]
          }
        } as QuoteModel;
      }

      return null;
    });

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        QuoteOfferingCoveragesComponent,
        CommonModule,
        HeaderTitleComponent,
        NxAccordionModule,
        NxButtonModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxHeadlineModule,
        NxInputModule,
        NxTabsModule,
        ReactiveFormsModule,
        QuoteLiteralDirective
      ],
      providers: [
        { provide: NX_MODAL_DATA, useValue: { selectedPriceIndex: 0 } },
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
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

  it('should initialize prices on init', () => {
    component.ngOnInit();
    expect(component.prices.length).toBe(2);
    expect(component.prices[0].totalPremiumAmount).toBe(100);
    expect(component.prices[1].totalPremiumAmount).toBe(200);
  });

  it('should have default selectedPriceIndex as 0', () => {
    expect(component.selectedPriceIndex).toBe(0);
  });

  it('should update selectedPriceIndex when input changes', () => {
    component.selectedPriceIndex = 1;
    fixture.detectChanges();
    expect(component.selectedPriceIndex).toBe(1);
  });
});
