import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextDataServiceMock, HttpServiceMock, RoutingServiceMock, VehicleServiceMock } from 'src/app/core/mock/services';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { VehicleModelsComponent } from './vehicle-models.component';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';

describe('VehicleModelsComponent', () => {
  let component: VehicleModelsComponent;
  let fixture: ComponentFixture<VehicleModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelsComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock },
        { provide: VehicleService, useClass: VehicleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
