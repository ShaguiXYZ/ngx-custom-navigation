import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, RoutingServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { LocationService, RoutingService } from 'src/app/core/services';
import { QuoteOfferingsComponent } from './quote-offerings.component';

describe('QuoteOfferingsComponent', () => {
  let component: QuoteOfferingsComponent;
  let fixture: ComponentFixture<QuoteOfferingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteOfferingsComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        LocationService,
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteOfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
