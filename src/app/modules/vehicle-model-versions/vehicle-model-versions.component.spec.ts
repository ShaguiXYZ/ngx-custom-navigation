import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { ModelVersionModel, QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { VehicleModelVersionsComponent } from './vehicle-model-versions.component';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { TranslateService } from '@ngx-translate/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';

describe('VehicleModelVersionsComponent', () => {
  let component: VehicleModelVersionsComponent;
  let fixture: ComponentFixture<VehicleModelVersionsComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;
  let vehicleService: jasmine.SpyObj<VehicleService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['vehicleModelVersions']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        VehicleModelVersionsComponent,
        ReactiveFormsModule,
        FormsModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxIconModule,
        NxInputModule,
        HeaderTitleComponent,
        IconCardComponent,
        TextCardComponent,
        QuoteLiteralDirective,
        QuoteLiteralPipe
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translationsServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: VehicleService, useValue: vehicleServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleModelVersionsComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;

    component['contextData'] = {
      vehicle: {
        model: 'testModel',
        vehicleModelVersion: { data: 'testVersion' }
      }
    } as QuoteModel;

    vehicleService.vehicleModelVersions.and.returnValue(Promise.resolve([{ index: 1, data: 'testVersion' }] as ModelVersionModel[]));

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
    const setContextDataSpy = spyOn(contextDataService, 'set');
    const version = { index: 2, data: 'newVersion' } as ModelVersionModel;

    component.selectVersion(version);

    expect(component.selectedModelVersion).toBe(version);
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, jasmine.any(Object));
    expect(routingService.nextStep).toHaveBeenCalled();
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
