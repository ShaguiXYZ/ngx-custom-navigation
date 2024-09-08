import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, HttpServiceMock, RoutingServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { VehicleTypeComponent } from './vehicle-type.component';

describe('VehicleTypeComponent', () => {
  let component: VehicleTypeComponent;
  let fixture: ComponentFixture<VehicleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTypeComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: RoutingService, useClass: RoutingServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
