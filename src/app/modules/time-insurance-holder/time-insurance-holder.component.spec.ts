/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/core/models';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { TimeInsuranceHolderComponent } from './time-insurance-holder.component';

describe('TimeInsuranceHolderComponent', () => {
  let component: TimeInsuranceHolderComponent;
  let fixture: ComponentFixture<TimeInsuranceHolderComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant', 'translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);

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
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeInsuranceHolderComponent);
    component = fixture.componentInstance;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['_contextData'] = {
      insuranceCompany: {
        yearsAsOwner: 2
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contextData and selectedYears on ngOnInit', () => {
    component.ngOnInit();

    expect(component['_contextData']).toEqual({ insuranceCompany: { yearsAsOwner: 2 } } as QuoteModel);
    expect(component.selectedYears).toBe(2);
  });

  it('should update contextData and call nextStep on selectedYears', () => {
    component.selectData(3);

    expect(component['_contextData'].insuranceCompany.yearsAsOwner).toBe(3);
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return true if yearsAsOwner value is valid in updateValidData', () => {
    component['_contextData'] = { insuranceCompany: { yearsAsOwner: 1 } } as QuoteModel;

    expect(component['updateValidData']()).toBeTrue();
  });

  it('should return false if yearsAsOwner value is invalid in updateValidData', () => {
    component['_contextData'] = { insuranceCompany: { YearsAsOwner: null } } as unknown as QuoteModel;

    expect(component['updateValidData']()).toBeFalse();
  });

  it('should call updateValidData on canDeactivate', () => {
    spyOn(component as any, 'updateValidData').and.callThrough();
    component.canDeactivate();

    expect(component['updateValidData']).toHaveBeenCalled();
  });
});
