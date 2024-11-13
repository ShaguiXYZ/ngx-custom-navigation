/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, IndexedData } from '@shagui/ng-shagui/core';
import { DEBOUNCE_TIME } from 'src/app/core/constants';
import { QuoteModel } from 'src/app/core/models';
import { InsuranceCompaniesService, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { InsuranceCompaniesComponent } from './insurance-companies.component';

describe('InsuranceCompaniesComponent', () => {
  let component: InsuranceCompaniesComponent;
  let fixture: ComponentFixture<InsuranceCompaniesComponent>;
  let insuranceCompaniesService: jasmine.SpyObj<InsuranceCompaniesService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const insuranceCompaniesServiceSpy = jasmine.createSpyObj('InsuranceCompaniesService', ['companies']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [InsuranceCompaniesComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: InsuranceCompaniesService, useValue: insuranceCompaniesServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy }
      ]
    }).compileComponents();

    TestBed.overrideComponent(InsuranceCompaniesComponent, {
      set: {
        providers: [{ provide: InsuranceCompaniesService, useValue: insuranceCompaniesServiceSpy }]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCompaniesComponent);
    component = fixture.componentInstance;
    insuranceCompaniesService = TestBed.inject(InsuranceCompaniesService) as jasmine.SpyObj<InsuranceCompaniesService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    insuranceCompaniesService.companies.and.returnValue(Promise.resolve([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and context data on init', async () => {
    await component.ngOnInit();

    expect(component.form).toBeDefined();
    expect(component['contextData']).toBeDefined();
  });

  it('should call searchInsurances on search input keyup', fakeAsync(async () => {
    await component.ngOnInit();
    spyOn(component as any, 'searchInsurances');

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'test';
    input.dispatchEvent(new Event('keyup'));

    fixture.detectChanges();

    tick(DEBOUNCE_TIME);

    expect(component['searchInsurances']).toHaveBeenCalled();
  }));

  it('should select a company and update context data', () => {
    const company: IndexedData = { index: 'test', data: 'Test Company' };
    component.selectCompany(company);

    expect(component.selectedCompany).toEqual(company);
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription$'] = [subscription];
    component.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should return true if context data has a selected company', () => {
    component['contextData'] = { insuranceCompany: { company: { index: 'test', data: 'Test Company' } } } as QuoteModel;

    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false if context data does not have a selected company', () => {
    component['contextData'] = { insuranceCompany: { company: undefined } } as QuoteModel;

    expect(component.canDeactivate()).toBeFalse();
  });
});
