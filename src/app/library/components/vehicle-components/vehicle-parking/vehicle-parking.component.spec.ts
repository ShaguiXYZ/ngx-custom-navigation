/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, IndexedData } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { ServiceActivatorService } from 'src/app/core/service-activators';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteTrackService } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { VehicleParkingTypes } from './models';
import { VehicleParkingComponent } from './vehicle-parking.component';

describe('VehicleParkingComponent', () => {
  let component: VehicleParkingComponent;
  let fixture: ComponentFixture<VehicleParkingComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const quoteTrackServiceSpy = jasmine.createSpyObj('QuoteTrackService', ['trackView']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
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
      imports: [VehicleParkingComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ServiceActivatorService, useValue: activateEntryPointSpy },
        { provide: QuoteTrackService, useValue: quoteTrackServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleParkingComponent);
    component = fixture.componentInstance;

    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['_contextData'] = { vehicle: { vehicleParkingType: 'street_parked' } } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contextData and selectedType on ngOnInit', () => {
    component.ngOnInit();

    expect(component['_contextData']).toEqual({ vehicle: { vehicleParkingType: 'street_parked' } } as QuoteModel);
    expect(component.selectedType).toEqual(VehicleParkingTypes.find(type => type.index === 'street_parked'));
  });

  it('should select a vehicle type and update context data', () => {
    const type: IndexedData = { index: 'old', data: 'SUV' };
    component.selectType(type);

    expect(component.selectedType).toEqual(type);
    expect(component['_contextData'].vehicle.vehicleParkingType).toEqual('old');
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return true if vehicle type is valid', () => {
    component['_contextData'] = { vehicle: { vehicleParkingType: 'street_parked' } } as QuoteModel;

    expect(component['isValidData']()).toBeTrue();
  });

  it('should return false if vehicle type is not valid', () => {
    component['_contextData'] = { vehicle: { vehicleParkingType: undefined } } as QuoteModel;

    expect(component['isValidData']()).toBeFalse();
  });

  it('should call isValidData on canDeactivate', () => {
    spyOn(component as any, 'isValidData').and.returnValue(true);

    expect(component.canDeactivate()).toBeTrue();
    expect(component['isValidData']).toHaveBeenCalled();
  });
});
