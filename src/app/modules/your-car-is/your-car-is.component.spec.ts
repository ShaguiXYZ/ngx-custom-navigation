import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { firstValueFrom, of } from 'rxjs';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { YourCarIsComponent } from './your-car-is.component';
import { QuoteVehicleModel, QuoteModel } from 'src/app/shared/models';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { TranslateService } from '@ngx-translate/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';

describe('YourCarIsComponent', () => {
  let component: YourCarIsComponent;
  let fixture: ComponentFixture<YourCarIsComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;
  let vehicleService: jasmine.SpyObj<VehicleService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['vehicles']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        YourCarIsComponent,
        FormsModule,
        ReactiveFormsModule,
        NxButtonModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxInputModule,
        NxMaskModule,
        HeaderTitleComponent,
        QuoteFooterComponent,
        SelectableOptionComponent,
        QuoteLiteralDirective
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: VehicleService, useValue: vehicleServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourCarIsComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      vehicle: {}
    } as QuoteModel);

    vehicleService.vehicles.and.returnValue(firstValueFrom(of([])));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize vehicle options on init', async () => {
    await component.ngOnInit();

    expect(vehicleService.vehicles).toHaveBeenCalled();
    expect(component.vehicleOptions).toEqual([]);
  });

  it('should set selected vehicle from context data on init', async () => {
    const mockVehicle = { make: 'Nissan', vehicleTtype: 'Test Vehicle' } as QuoteVehicleModel;

    component['contextData'] = {
      vehicle: mockVehicle
    } as QuoteModel;

    await component.ngOnInit();

    expect(component.selectedVehicle).toEqual(mockVehicle);
  });

  it('should allow deactivation if a vehicle is selected', () => {
    component['contextData'].vehicle = { make: 'Nissan', vehicleTtype: 'Test Vehicle' } as QuoteVehicleModel;

    expect(component.canDeactivate()).toBeTrue();
  });

  it('should not allow deactivation if no vehicle is selected', () => {
    component['contextData'].vehicle = QuoteVehicleModel.init();

    expect(component.canDeactivate()).toBeFalse();
  });

  it('should update context data and navigate to next step on vehicle selection', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');
    const mockVehicle = { make: 'Nissan', vehicleTtype: 'Test Vehicle' } as QuoteVehicleModel;

    component['contextData'] = { vehicle: {} } as QuoteModel;
    component.selectVehicle(mockVehicle);

    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, { vehicle: mockVehicle });
    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should update context data and navigate to next step on continue', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component['contextData'] = { vehicle: { make: '' } } as QuoteModel;
    component.continue();

    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, { vehicle: QuoteVehicleModel.init() });
    expect(routingService.nextStep).toHaveBeenCalled();
  });
});
