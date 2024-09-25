import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, HttpServiceMock, VehicleServiceMock } from 'src/app/core/mock/services';
import { VehicleService } from 'src/app/core/services';
import { PowerRangesModel } from 'src/app/shared/models';
import { PowerRangesSelectionComponent } from './power-ranges-selection.component';

describe('PowerRangesSelectionComponent', () => {
  let component: PowerRangesSelectionComponent;
  let fixture: ComponentFixture<PowerRangesSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerRangesSelectionComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: VehicleService, useClass: VehicleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PowerRangesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should selectPower', () => {
    const power: PowerRangesModel = { index: 'a', data: 'a' };
    component.selectPower(power);

    component.buttonType(power);
  });
});
