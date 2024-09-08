import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, HttpServiceMock, TranslateServiceMock, VehicleServiceMock } from 'src/app/core/mock/services';
import { VehicleService } from 'src/app/core/services';
import { BrandsSelectionComponent } from './brands-selection.component';

describe('BrandsSelectionComponent', () => {
  let component: BrandsSelectionComponent;
  let fixture: ComponentFixture<BrandsSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsSelectionComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: VehicleService, useClass: VehicleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should selectBrand', () => {
    component.selectBrand('a');
    component.toggleAllBrands();
  });
});
