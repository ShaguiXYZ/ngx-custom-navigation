import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { ServiceActivatorService } from 'src/app/core/service-activators';
import { RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { ModelVersionModel } from 'src/app/library/models/vehicle';
import { VehicleService } from 'src/app/library/services';
import { HeaderTitleComponent, IconCardComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { VehicleModelVersionsComponent } from './vehicle-model-versions.component';

describe('VehicleModelVersionsComponent', () => {
  let component: VehicleModelVersionsComponent;
  let fixture: ComponentFixture<VehicleModelVersionsComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;
  let vehicleService: jasmine.SpyObj<VehicleService>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['getSubmodels']);
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
        VehicleModelVersionsComponent,
        ReactiveFormsModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxInputModule,
        HeaderTitleComponent,
        IconCardComponent,
        TextCardComponent,
        QuoteLiteralDirective,
        QuoteLiteralPipe
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: ServiceActivatorService, useValue: activateEntryPointSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    }).compileComponents();

    TestBed.overrideComponent(VehicleModelVersionsComponent, {
      set: {
        providers: [{ provide: VehicleService, useValue: vehicleServiceSpy }]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleModelVersionsComponent);
    component = fixture.componentInstance;

    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;

    component['_contextData'] = {
      vehicle: {
        model: 'testModel',
        modelVersion: { data: 'testVersion' }
      }
    } as QuoteModel;

    vehicleService.getSubmodels.and.returnValue(Promise.resolve([{ index: 1, data: 'testVersion' }] as ModelVersionModel[]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with selected model version', () => {
    expect(component.form.value.searchInput).toBe('testVersion');
  });

  it('should filter model versions based on search input', async () => {
    component.form.controls['searchInput'].setValue('test');
    await component['filteredVersions']();

    expect(component.modelVersions.length).toBe(1);
  });

  it('should select a model version and update context data', () => {
    const version = { index: 2, data: 'newVersion' } as ModelVersionModel;

    component.selectVersion(version);

    expect(component.selectedModelVersion).toBe(version);
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return true if vehicle model version is valid', () => {
    expect(component['updateValidData']()).toBeTrue();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription$'] = [subscriptionSpy];
    component.ngOnDestroy();

    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });
});
