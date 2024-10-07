import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import {
  ContextDataServiceMock,
  HttpServiceMock,
  RoutingServiceMock,
  TranslateServiceMock,
  VehicleServiceMock
} from 'src/app/core/mock/services';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { VehicleModelVersionsComponent } from './vehicle-model-versions.component';

describe('VehicleModelVersionsComponent', () => {
  let component: VehicleModelVersionsComponent;
  let fixture: ComponentFixture<VehicleModelVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelVersionsComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: VehicleService, useClass: VehicleServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleModelVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
