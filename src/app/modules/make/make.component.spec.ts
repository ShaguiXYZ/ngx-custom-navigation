import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/core/models';
import { RoutingService, VehicleService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { MakeComponent } from './make.component';

describe('MakeComponent', () => {
  let component: MakeComponent;
  let fixture: ComponentFixture<MakeComponent>;
  let vehicleService: jasmine.SpyObj<VehicleService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['getBrands']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [MakeComponent, ReactiveFormsModule, NxIconModule, NxFormfieldModule, NxInputModule],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy }
      ]
    }).compileComponents();

    TestBed.overrideComponent(MakeComponent, {
      set: {
        providers: [{ provide: VehicleService, useValue: vehicleServiceSpy }]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeComponent);
    component = fixture.componentInstance;

    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    vehicleService.getBrands.and.returnValue(Promise.resolve(['Toyota', 'Honda']));

    component['contextData'] = {
      vehicle: {
        make: 'Toyota'
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

  it('should update searchedMakes on searchPlace', async () => {
    component.form.controls['searchInput'].setValue('Toy');
    await component['searchBrands']();

    expect(component.searchedMakes).toEqual(['Toyota', 'Honda']);
  });

  it('should select make and update context data', () => {
    component.selectMake('Honda');

    expect(component.selectedBrand).toBe('Honda');
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription$'] = [subscriptionSpy];
    component.ngOnDestroy();

    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should return true if selected make matches context data', () => {
    component.selectedBrand = 'Toyota';

    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false if selected make does not match context data', () => {
    component.selectedBrand = 'Honda';

    expect(component.canDeactivate()).toBeFalse();
  });
});
