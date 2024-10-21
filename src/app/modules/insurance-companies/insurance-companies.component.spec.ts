import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { IndexedData } from 'src/app/core/models';
import { InsuranceCompaniesService, RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, IconCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteModel } from 'src/app/shared/models';
import { InsuranceCompaniesComponent } from './insurance-companies.component';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';

describe('InsuranceCompaniesComponent', () => {
  let component: InsuranceCompaniesComponent;
  let fixture: ComponentFixture<InsuranceCompaniesComponent>;
  let insuranceCompaniesService: jasmine.SpyObj<InsuranceCompaniesService>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const insuranceCompaniesServiceSpy = jasmine.createSpyObj('InsuranceCompaniesService', ['companies']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [InsuranceCompaniesComponent, CommonModule, IconCardComponent, HeaderTitleComponent, QuoteLiteralDirective],
      providers: [
        { provide: InsuranceCompaniesService, useValue: insuranceCompaniesServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCompaniesComponent);
    component = fixture.componentInstance;

    insuranceCompaniesService = TestBed.inject(InsuranceCompaniesService) as jasmine.SpyObj<InsuranceCompaniesService>;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    insuranceCompaniesService.companies.and.returnValue(Promise.resolve([{ index: 'CIA', data: 'Company A' } as IndexedData]));

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      insuranceCompany: {
        company: 'CIA'
      }
    } as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize insurance companies and selected company', async () => {
    await component.ngOnInit();
    expect(component.insuranceCompanies.length).toBe(1);
    expect(component.selectedCompany?.index).toBe('CIA');
  });

  it('should select a company and update context data', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');
    const company: IndexedData = { index: 'CIAB', data: 'Company B' };

    component.selectCompany(company);

    expect(component.selectedCompany).toEqual(company);
    expect(setContextDataSpy).toHaveBeenCalledWith(
      QUOTE_CONTEXT_DATA,
      jasmine.objectContaining({
        insuranceCompany: { company: 'CIAB' }
      })
    );
    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should return true for valid data', () => {
    component['contextData'] = { insuranceCompany: { company: 'CIA3' } } as QuoteModel;
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false for invalid data', () => {
    component['contextData'] = { insuranceCompany: { company: undefined } } as QuoteModel;
    expect(component.canDeactivate()).toBeFalse();
  });
});
