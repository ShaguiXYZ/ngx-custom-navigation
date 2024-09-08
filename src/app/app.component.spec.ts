/* eslint max-classes-per-file: 0 */
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { AppComponent } from './app.component';
import { ContextDataServiceMock, HttpServiceMock, TranslateServiceMock, VehicleServiceMock } from './core/mock/services';
import { VehicleService } from './core/services';
import { QuoteBreadcrumbComponent, QuoteFooterComponent, QuoteLoadingComponent } from './shared/components';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        provideHttpClientTesting(),
        RouterModule.forRoot([]),
        QuoteBreadcrumbComponent,
        QuoteFooterComponent,
        QuoteLoadingComponent
      ],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: VehicleService, useClass: VehicleServiceMock }
      ]
    }).compileComponents();
  }));

  xit('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
