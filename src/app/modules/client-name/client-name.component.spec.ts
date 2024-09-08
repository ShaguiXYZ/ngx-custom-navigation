import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, RoutingServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { ClientNameComponent } from './client-name.component';

describe('ClientNameComponent', () => {
  let component: ClientNameComponent;
  let fixture: ComponentFixture<ClientNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientNameComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
