import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { ServiceActivatorService } from 'src/app/core/service-activators';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/library/models';
import { CubicCapacityModel, FuelModel, VehicleClassesModel } from 'src/app/library/models/vehicle';
import { VehicleService } from 'src/app/library/services';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { VehicleCharacteristicsComponent } from './vehicle-characteristics.component';

describe('VehicleCharacteristicsComponent', () => {
  let component: VehicleCharacteristicsComponent;
  let fixture: ComponentFixture<VehicleCharacteristicsComponent>;
  let vehicleService: jasmine.SpyObj<VehicleService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['getFuelTypes', 'cubicCapacities', 'getVehicleClasses']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setDefaultLang', 'use', 'instant']);
    const activateEntryPointSpy = jasmine.createSpyObj('ServiceActivatorService', ['activateEntryPoint']);
    const mockWorkflowConfig = {
      errorPageId: 'error',
      manifest: {}
    };
    const mockLanguageConfig = {
      current: 'en',
      languages: ['en', 'fr']
    };

    translateServiceSpy.use.and.returnValue(of('en'));

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [VehicleCharacteristicsComponent, BrowserAnimationsModule],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ServiceActivatorService, useValue: activateEntryPointSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    }).compileComponents();

    TestBed.overrideComponent(VehicleCharacteristicsComponent, {
      set: {
        providers: [{ provide: VehicleService, useValue: vehicleServiceSpy }]
      }
    });

    fixture = TestBed.createComponent(VehicleCharacteristicsComponent);
    component = fixture.componentInstance;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with data', async () => {
    const fuel = { index: '1', data: 'Petrol' } as unknown as FuelModel;
    const cubicCapacity: CubicCapacityModel = { index: '1', data: '1500cc' };
    const power: VehicleClassesModel = { index: '1', data: '100hp' };

    component['_contextData'] = {
      vehicle: {
        fuel,
        cubicCapacity,
        powerRange: power
      }
    } as QuoteModel;

    vehicleService.getFuelTypes.and.returnValue(Promise.resolve([fuel]));
    vehicleService.cubicCapacities.and.returnValue(Promise.resolve([cubicCapacity]));
    vehicleService.getVehicleClasses.and.returnValue(Promise.resolve([power]));

    await component.ngOnInit();

    expect(component.selectedFuel).toEqual(fuel);
    expect(component.selectedCubicCapacity).toEqual(cubicCapacity);
    expect(component.selectedPower).toEqual(power);
    expect(component.fuels).toEqual([fuel]);
    expect(component.cubicCapacities).toEqual([cubicCapacity]);
    expect(component.powers).toEqual([power]);
  });

  it('should validate form on canDeactivate', () => {
    component.selectedFuel = undefined;
    component.selectedCubicCapacity = undefined;
    component.selectedPower = undefined;

    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBeFalse();
    expect(component.formValidations.fuel).toBeTrue();
    expect(component.formValidations.cubicCapacity).toBeTrue();
    expect(component.formValidations.power).toBeTrue();
  });

  it('should select fuel and reset cubic capacity and power', async () => {
    const fuel = { index: '1', data: 'Petrol' } as unknown as FuelModel;
    component['_contextData'] = { vehicle: {} } as QuoteModel;

    await component.selectFuel(fuel);

    expect(component.selectedFuel).toEqual(fuel);
    expect(component.selectedCubicCapacity).toBeUndefined();
    expect(component.selectedPower).toBeUndefined();
  });

  it('should select cubic capacity and reset power', async () => {
    const cubicCapacity: CubicCapacityModel = { index: '1', data: '1500cc' };
    component['_contextData'] = { vehicle: {} } as QuoteModel;

    await component.selectCubicCapacity(cubicCapacity);

    expect(component.selectedCubicCapacity).toEqual(cubicCapacity);
    expect(component.selectedPower).toBeUndefined();
  });

  it('should select power', () => {
    const power: VehicleClassesModel = { index: '1', data: '100hp' };

    component.selectPower(power);

    expect(component.selectedPower).toEqual(power);
  });

  it('should populate data and navigate to next', () => {
    const fuel: FuelModel = { index: '1', data: 'Petrol' } as unknown as FuelModel;
    const cubicCapacity: CubicCapacityModel = { index: '1', data: '1500cc' };
    const power: VehicleClassesModel = { index: '1', data: '100hp' };

    component.selectedFuel = fuel;
    component.selectedCubicCapacity = cubicCapacity;
    component.selectedPower = power;
    component['_contextData'] = { vehicle: {} } as QuoteModel;

    component.populateData();

    expect((component['_contextData'] as QuoteModel).vehicle.fuel).toEqual(fuel);
    expect((component['_contextData'] as QuoteModel).vehicle.cubicCapacity).toEqual(cubicCapacity);
    expect((component['_contextData'] as QuoteModel).vehicle.powerRange).toEqual(power);
    expect(routingService.next).toHaveBeenCalled();
  });
});
