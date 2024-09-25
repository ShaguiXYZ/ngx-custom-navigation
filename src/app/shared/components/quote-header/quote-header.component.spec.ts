import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, HttpServiceMock, RoutingServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { QuoteHeaderComponent } from './quote-header.component';

describe('QuoteHeaderComponent', () => {
  let component: QuoteHeaderComponent;
  let fixture: ComponentFixture<QuoteHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteHeaderComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
