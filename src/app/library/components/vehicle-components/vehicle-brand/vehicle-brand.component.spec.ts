import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { VehicleService } from 'src/app/library/services';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { BrandComponentService } from './services';
import { VehicleBrandComponent } from './vehicle-brand.component';

describe('VehicleBrandComponent', () => {
  let component: VehicleBrandComponent;
  let fixture: ComponentFixture<VehicleBrandComponent>;
  let vehicleService: jasmine.SpyObj<VehicleService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['getBrands']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const brandServiceSpy = jasmine.createSpyObj('BrandService', ['iconBrands']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [VehicleBrandComponent, ReactiveFormsModule, NxIconModule, NxFormfieldModule, NxInputModule],
      providers: [
        { provide: BrandComponentService, useValue: brandServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy }
      ]
    }).compileComponents();

    TestBed.overrideComponent(VehicleBrandComponent, {
      set: {
        providers: [
          { provide: BrandComponentService, useValue: brandServiceSpy },
          { provide: VehicleService, useValue: vehicleServiceSpy }
        ]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleBrandComponent);
    component = fixture.componentInstance;

    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    vehicleService.getBrands.and.returnValue(Promise.resolve(['Toyota', 'Honda']));

    component['_contextData'] = {
      vehicle: {
        brand: 'Toyota'
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value.searchInput).toBe('Toyota');
  });

  it('should update searchBrands on searchPlace', async () => {
    component.form.controls['searchInput'].setValue('Toy');
    await component['searchBrands']();

    expect(component.searchedBrands).toEqual(['Toyota', 'Honda']);
  });

  it('should select brand and update context data', () => {
    component.selectBrand('Honda');

    expect(component.selectedBrand).toBe('Honda');
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription$'] = [subscriptionSpy];
    component.ngOnDestroy();

    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should return true if selected brand matches context data', () => {
    component.selectedBrand = 'Toyota';

    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false if selected brand does not match context data', () => {
    component.selectedBrand = 'Honda';

    expect(component.canDeactivate()).toBeFalse();
  });
});
