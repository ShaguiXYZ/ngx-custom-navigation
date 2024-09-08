import { BreakpointObserver } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import {
  ContextDataServiceMock,
  HttpServiceMock,
  MockBreakpointObserver,
  RoutingServiceMock,
  TranslateServiceMock
} from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { QuoteFooterComponent } from './quote-footer.component';

describe('QuoteFooterComponent', () => {
  let component: QuoteFooterComponent;
  let fixture: ComponentFixture<QuoteFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteFooterComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: BreakpointObserver, useClass: TranslateServiceMock },
        { provide: BreakpointObserver, useClass: MockBreakpointObserver }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
