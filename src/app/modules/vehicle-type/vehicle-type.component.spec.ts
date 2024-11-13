/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, IndexedData } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { VehicleTypes } from './models';
import { VehicleTypeComponent } from './vehicle-type.component';

describe('VehicleTypeComponent', () => {
  let component: VehicleTypeComponent;
  let fixture: ComponentFixture<VehicleTypeComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);

    await TestBed.configureTestingModule({
      imports: [VehicleTypeComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTypeComponent);
    component = fixture.componentInstance;

    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['contextData'] = { vehicle: { vehicleTtype: 'new' } } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contextData and selectedType on ngOnInit', () => {
    component.ngOnInit();

    expect(component['contextData']).toEqual({ vehicle: { vehicleTtype: 'new' } } as QuoteModel);
    expect(component.selectedType).toEqual(VehicleTypes.find(type => type.index === 'new'));
  });

  it('should select a vehicle type and update context data', () => {
    const type: IndexedData = { index: 'old', data: 'SUV' };
    component.selectType(type);

    expect(component.selectedType).toEqual(type);
    expect(component['contextData'].vehicle.vehicleTtype).toEqual('old');
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return true if vehicle type is valid', () => {
    component['contextData'] = { vehicle: { vehicleTtype: 'new' } } as QuoteModel;

    expect(component['isValidData']()).toBeTrue();
  });

  it('should return false if vehicle type is not valid', () => {
    component['contextData'] = { vehicle: { vehicleTtype: undefined } } as QuoteModel;

    expect(component['isValidData']()).toBeFalse();
  });

  it('should call isValidData on canDeactivate', () => {
    spyOn(component as any, 'isValidData').and.returnValue(true);

    expect(component.canDeactivate()).toBeTrue();
    expect(component['isValidData']).toHaveBeenCalled();
  });
});
