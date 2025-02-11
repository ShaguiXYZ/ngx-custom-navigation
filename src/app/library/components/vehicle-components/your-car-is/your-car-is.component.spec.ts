import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { firstValueFrom, of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { ServiceActivatorService } from 'src/app/core/service-activators';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel, QuoteVehicleModel } from 'src/app/library/models';
import { VehicleService } from 'src/app/library/services';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { YourCarIsComponent } from './your-car-is.component';
import { QuoteTrackService } from 'src/app/core/tracking';

describe('YourCarIsComponent', () => {
  let component: YourCarIsComponent;
  let fixture: ComponentFixture<YourCarIsComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;
  let vehicleService: jasmine.SpyObj<VehicleService>;

  beforeEach(async () => {
    const quoteTrackServiceSpy = jasmine.createSpyObj('QuoteTrackService', ['trackView']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['vehicles']);
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
      imports: [
        YourCarIsComponent,
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
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: ServiceActivatorService, useValue: activateEntryPointSpy },
        { provide: QuoteTrackService, useValue: quoteTrackServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    }).compileComponents();

    TestBed.overrideComponent(YourCarIsComponent, {
      set: {
        providers: [{ provide: VehicleService, useValue: vehicleServiceSpy }]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourCarIsComponent);
    component = fixture.componentInstance;

    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;

    vehicleService.vehicles.and.returnValue(firstValueFrom(of([])));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize vehicle options on init', async () => {
    component['_contextData'] = { vehicle: {} } as QuoteModel;

    await component.ngOnInit();

    expect(vehicleService.vehicles).toHaveBeenCalled();
    expect(component.vehicleOptions).toEqual([]);
  });

  it('should set selected vehicle from context data on init', async () => {
    const mockVehicle = { brand: 'Nissan', vehicleType: 'Test Vehicle' } as QuoteVehicleModel;

    component['_contextData'] = {
      vehicle: mockVehicle
    } as QuoteModel;

    await component.ngOnInit();

    expect(component.selectedVehicle).toEqual(mockVehicle);
  });

  it('should allow deactivation if a vehicle is selected', () => {
    component['_contextData'].vehicle = { brand: 'Nissan', vehicleType: 'Test Vehicle' } as QuoteVehicleModel;

    expect(component.canDeactivate()).toBeTrue();
  });

  it('should not allow deactivation if no vehicle is selected', () => {
    component['_contextData'].vehicle = QuoteVehicleModel.init();

    expect(component.canDeactivate()).toBeFalse();
  });

  it('should update context data and navigate to next step on vehicle selection', () => {
    const mockVehicle = { brand: 'Nissan', vehicleType: 'Test Vehicle' } as QuoteVehicleModel;

    component['_contextData'] = { vehicle: {} } as QuoteModel;
    component.selectVehicle(mockVehicle);

    expect(routingService.next).toHaveBeenCalled();
  });

  it('should update context data and navigate to next step on continue', () => {
    component['_contextData'] = { vehicle: { brand: '' } } as QuoteModel;
    component.continue();

    expect(routingService.next).toHaveBeenCalled();
  });
});
