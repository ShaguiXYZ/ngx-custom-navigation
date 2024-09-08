import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, HttpServiceMock, RoutingServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { DrivingLicenseLocationComponent } from './driving-license-location.component';

describe('DrivingLicenseLocationComponent', () => {
  let component: DrivingLicenseLocationComponent;
  let fixture: ComponentFixture<DrivingLicenseLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrivingLicenseLocationComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrivingLicenseLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
