import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { DEBOUNCE_TIME, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/shared/models';
import { VehicleModelsComponent } from './vehicle-models.component';

describe('VehicleModelsComponent', () => {
  let component: VehicleModelsComponent;
  let fixture: ComponentFixture<VehicleModelsComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;
  let vehicleService: jasmine.SpyObj<VehicleService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['vehicleModels']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [VehicleModelsComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translationsServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: VehicleService, useValue: vehicleServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleModelsComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      vehicle: {
        make: 'Toyota',
        model: 'Camry'
      }
    } as QuoteModel);

    vehicleService.vehicleModels.and.returnValue(Promise.resolve(['Camry', 'Corolla', 'Prius']));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value.searchInput).toBe('Camry');
  });

  it('should populate models on init', async () => {
    await fixture.whenStable();

    expect(component.models).toEqual(['Camry', 'Corolla', 'Prius']);
  });

  it('should update selected model and context data on selectModel', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.selectModel('Corolla');

    expect(component.selectedModel).toBe('Corolla');
    expect(setContextDataSpy).toHaveBeenCalledWith(
      QUOTE_CONTEXT_DATA,
      jasmine.objectContaining({
        vehicle: jasmine.objectContaining({ model: 'Corolla' })
      })
    );
    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const spy = spyOn(component['subscription$'][0], 'unsubscribe');
    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });

  it('should update models on search input keyup', fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    input.value = 'Prius';
    input.dispatchEvent(new Event('keyup'));

    component.form.controls['searchInput'].setValue('Prius');

    fixture.detectChanges();

    tick(DEBOUNCE_TIME);
    // await fixture.whenStable();

    expect(vehicleService.vehicleModels).toHaveBeenCalledWith('Toyota', 'Prius');
  }));

  it('should return true for canDeactivate if model is selected', () => {
    component.selectedModel = 'Camry';

    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false for canDeactivate if no model is selected', () => {
    component['contextData'].vehicle.model = undefined;

    expect(component.canDeactivate()).toBeFalse();
  });
});
