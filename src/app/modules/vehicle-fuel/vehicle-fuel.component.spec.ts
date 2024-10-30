import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { CubicCapacityModel, FuelModel, FuelTypes, VehicleClassesModel, QuoteModel } from 'src/app/shared/models';
import { VehicleFuelComponent } from './vehicle-fuel.component';

describe('VehicleFuelComponent', () => {
  let component: VehicleFuelComponent;
  let fixture: ComponentFixture<VehicleFuelComponent>;

  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;
  let vehicleService: jasmine.SpyObj<VehicleService>;

  beforeEach(async () => {
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['getFuelTypes', 'getVehicleClasses', 'cubicCapacities']);
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CommonModule,
        VehicleFuelComponent,
        HeaderTitleComponent,
        SelectableOptionComponent,
        QuoteLiteralDirective,
        ReactiveFormsModule,
        NxAccordionModule,
        NxButtonModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxInputModule
      ],
      providers: [
        provideAnimations(),
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleFuelComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      vehicle: {
        fuel: { index: '1', data: 'Petrol' },
        cubicCapacity: { index: '1', data: '1000cc' },
        powerRange: { index: '1', data: '100hp' }
      }
    } as unknown as QuoteModel);

    // contextDataService.get.and.returnValue({
    //   configuration: { literals: {} },
    //   navigation: { lastPage: { configuration: { literals: {} } } },
    //   vehicle: {
    //     fuel: { index: 1, data: 'Petrol' },
    //     cubicCapacity: { index: 1, data: '1000cc' },
    //     powerRange: { index: 1, data: '100hp' }
    //   }
    // });

    vehicleService.getFuelTypes.and.returnValue(Promise.resolve([] as FuelModel[]));
    vehicleService.getVehicleClasses.and.returnValue(Promise.resolve([] as VehicleClassesModel[]));
    vehicleService.cubicCapacities.and.returnValue(Promise.resolve([] as CubicCapacityModel[]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize context data on init', async () => {
    await component.ngOnInit();

    expect(vehicleService.getFuelTypes).toHaveBeenCalled();
    expect(vehicleService.getVehicleClasses).toHaveBeenCalled();
    expect(vehicleService.cubicCapacities).toHaveBeenCalled();
  });

  it('should select fuel and reset cubic capacity and power', () => {
    const fuel: FuelModel = { index: FuelTypes.DIESEL, data: 'Diesel' };
    component.selectFuel(fuel);

    expect(component.selectedFuel).toEqual(fuel);
    expect(component.selectedCubicCapacity).toBeUndefined();
    expect(component.selectedPower).toBeUndefined();
  });

  it('should select cubic capacity and reset power', () => {
    const cubicCapacity: CubicCapacityModel = { index: '2', data: '1500cc' };
    component.selectCubicCapacity(cubicCapacity);

    expect(component.selectedCubicCapacity).toEqual(cubicCapacity);
    expect(component.selectedPower).toBeUndefined();
  });

  it('should select power and navigate to next page', () => {
    const power: VehicleClassesModel = { index: '150hp', data: '150hp' };
    component.selectPower(power);

    expect(component.selectedPower).toEqual(power);
    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should return true for canDeactivate if all vehicle data is defined', () => {
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false for canDeactivate if any vehicle data is undefined', () => {
    component['contextData'].vehicle.fuel = undefined;

    expect(component.canDeactivate()).toBeFalse();
  });
});
