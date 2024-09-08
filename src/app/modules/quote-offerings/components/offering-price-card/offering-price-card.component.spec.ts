import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RoutingServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { QuoteOfferingPriceCardComponent } from './offering-price-card.component';

describe('QuoteOfferingPriceCardComponent', () => {
  let component: QuoteOfferingPriceCardComponent;
  let fixture: ComponentFixture<QuoteOfferingPriceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteOfferingPriceCardComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteOfferingPriceCardComponent);
    component = fixture.componentInstance;
    component.price = {
      modalityId: 1,
      modalityDescription: 'Terceros-basico',
      modalityFullDescription: 'Terceros básico Robo + Incendio',
      paymentType: '€',
      paymentTypeDescription: 'EUR',
      contractable: '',
      totalPremiumAmount: '822,06',
      fee: '',
      receiptData: {
        firstReceiptAmount: 822.06,
        followingReceiptAmount: 0
      },
      coverageList: [
        {
          code: 1,
          texto: 'COVERTURA-1',
          description: 'Lunas + Robo + Incendio',
          isContracted: 'OK',
          value: 0,
          options: [],
          subcoverages: []
        },
        {
          code: 2,
          texto: 'COVERTURA-2',
          description: 'Daños por granizo o lluvia',
          isContracted: 'OK',
          value: 0,
          options: [],
          subcoverages: []
        },
        {
          code: 3,
          texto: 'COVERTURA-3',
          description: 'Daños por colisión con animales cinegéticos',
          isContracted: 'OK',
          value: 0,
          options: [],
          subcoverages: []
        }
      ],
      configurableCoverageList: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
