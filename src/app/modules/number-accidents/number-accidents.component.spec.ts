/* eslint-disable @typescript-eslint/no-explicit-any */
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { mockQuoteData } from 'src/app/core/mock/models/quote-data.mock';
import { ContextDataServiceMock, RoutingServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { NumberAccidentsComponent } from './number-accidents.component';
describe('NumberAccidentsComponent', () => {
  let component: any;
  let fixture: ComponentFixture<NumberAccidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberAccidentsComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NumberAccidentsComponent);
    component = fixture.componentInstance;
    component.contextData = mockQuoteData;
    fixture.detectChanges();
  });
  beforeEach(() => {
    component.contextData = { ...mockQuoteData };
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Should create test', () => {
    expect(component).toBeDefined();
  });
  it('should call selectAccidents', () => {
    component.selectAccidents();
  });
});
