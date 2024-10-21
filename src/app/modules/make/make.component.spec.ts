import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxAutocompleteModule } from '@aposin/ng-aquila/autocomplete';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxPageSearchModule } from '@aposin/ng-aquila/page-search';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/shared/models';
import { MakeComponent } from './make.component';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { TranslateService } from '@ngx-translate/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';

describe('MakeComponent', () => {
  let component: MakeComponent;
  let fixture: ComponentFixture<MakeComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let vehicleService: jasmine.SpyObj<VehicleService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['vehicleBrands']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MakeComponent,
        ReactiveFormsModule,
        FormsModule,
        NxAutocompleteModule,
        NxIconModule,
        NxPageSearchModule,
        NxFormfieldModule,
        NxInputModule
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy },
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    vehicleService.vehicleBrands.and.returnValue(Promise.resolve(['Toyota', 'Honda']));

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      vehicle: {
        make: 'Toyota'
      }
    } as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value.searchInput).toBe('Toyota');
  });

  it('should update searchedMakes on searchPlace', async () => {
    component.form.controls['searchInput'].setValue('Toy');
    await component['searchPlace']();

    expect(component.searchedMakes).toEqual(['Toyota', 'Honda']);
  });

  it('should select make and update context data', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.selectMake('Honda');

    expect(component.selectedMake).toBe('Honda');
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, jasmine.objectContaining({ vehicle: { make: 'Honda' } }));
    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription$'] = [subscriptionSpy];
    component.ngOnDestroy();

    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should return true if selected make matches context data', () => {
    component.selectedMake = 'Toyota';

    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false if selected make does not match context data', () => {
    component.selectedMake = 'Honda';

    expect(component.canDeactivate()).toBeFalse();
  });
});
