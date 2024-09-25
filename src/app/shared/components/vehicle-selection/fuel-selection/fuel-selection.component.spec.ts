import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, HttpServiceMock, VehicleServiceMock } from 'src/app/core/mock/services';
import { VehicleService } from 'src/app/core/services';
import { FuelModel, FuelTypes } from 'src/app/shared/models';
import { FuelSelectionComponent } from './fuel-selection.component';

describe('FuelSelectionComponent', () => {
  let component: FuelSelectionComponent;
  let fixture: ComponentFixture<FuelSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelSelectionComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: VehicleService, useClass: VehicleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FuelSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should selectFuel', () => {
    const value: FuelTypes = FuelTypes.BIOETHANOL;
    const fuel: FuelModel = { index: FuelTypes.DIESEL, data: value };
    component.selectFuel(fuel);
    component.buttonType(fuel);
  });
});
