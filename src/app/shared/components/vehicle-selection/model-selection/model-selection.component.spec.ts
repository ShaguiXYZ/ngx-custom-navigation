import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, HttpServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { VehicleServiceMock } from 'src/app/core/mock/services/vehicle-service.mock';
import { VehicleService } from 'src/app/core/services';
import { ModelSelectionComponent } from './model-selection.component';

describe('ModelSelectionComponent', () => {
  let component: ModelSelectionComponent;
  let fixture: ComponentFixture<ModelSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelSelectionComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: VehicleService, useClass: VehicleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModelSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should selectModel', () => {
    component.selectModel('a');
    component.buttonType('a');
    component.toggleAllModels();
  });
});
