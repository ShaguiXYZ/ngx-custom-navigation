/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteModel } from 'src/app/shared/models';
import { TimeInsuranceHolderComponent } from './time-insurance-holder.component';

describe('TimeInsuranceHolderComponent', () => {
  let component: TimeInsuranceHolderComponent;
  let fixture: ComponentFixture<TimeInsuranceHolderComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        TimeInsuranceHolderComponent,
        NxCopytextModule,
        HeaderTitleComponent,
        QuoteFooterComponent,
        QuoteFooterInfoComponent,
        SelectableOptionComponent,
        QuoteLiteralDirective
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeInsuranceHolderComponent);
    component = fixture.componentInstance;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      insuranceCompany: {
        yearsAsOwner: 2
      }
    } as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contextData and selectedYears on ngOnInit', () => {
    component.ngOnInit();

    expect(component['contextData']).toEqual({ insuranceCompany: { yearsAsOwner: 2 } } as QuoteModel);
    expect(component.selectedYears).toBe(2);
  });

  it('should update contextData and call nextStep on selectedYears', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.selectData(3);

    expect(component['contextData'].insuranceCompany.yearsAsOwner).toBe(3);
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, component['contextData']);
    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should return true if yearsAsOwner value is valid in updateValidData', () => {
    component['contextData'] = { insuranceCompany: { yearsAsOwner: 1 } } as QuoteModel;

    expect(component['updateValidData']()).toBeTrue();
  });

  it('should return false if yearsAsOwner value is invalid in updateValidData', () => {
    component['contextData'] = { insuranceCompany: { YearsAsOwner: null } } as unknown as QuoteModel;

    expect(component['updateValidData']()).toBeFalse();
  });

  it('should call updateValidData on canDeactivate', () => {
    spyOn(component as any, 'updateValidData').and.callThrough();
    component.canDeactivate();

    expect(component['updateValidData']).toHaveBeenCalled();
  });
});
