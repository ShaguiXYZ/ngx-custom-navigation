import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, HttpServiceMock, VehicleServiceMock } from 'src/app/core/mock/services';
import { VehicleService } from 'src/app/core/services';
import { VehicleYearSelectionComponent } from './vehicle-year-selection.component';

describe('VehicleYearSelectionComponent', () => {
  let component: VehicleYearSelectionComponent;
  let fixture: ComponentFixture<VehicleYearSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleYearSelectionComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: VehicleService, useClass: VehicleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleYearSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should selectYear', () => {
    component.selectYear(1);
    component.buttonType(1);
  });
});
