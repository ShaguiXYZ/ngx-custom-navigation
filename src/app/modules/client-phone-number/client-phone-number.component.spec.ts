import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ContextDataServiceMock, RoutingServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { ClientPhoneNumberComponent } from './client-phone-number.component';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { TranslateService } from '@ngx-translate/core';

describe('ClientPhoneNumberComponent', () => {
  let component: ClientPhoneNumberComponent;
  let fixture: ComponentFixture<ClientPhoneNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPhoneNumberComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientPhoneNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
