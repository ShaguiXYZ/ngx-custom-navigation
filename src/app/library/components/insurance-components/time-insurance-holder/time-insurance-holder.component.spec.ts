/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, IndexedData } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { ServiceActivatorService } from 'src/app/core/service-activators';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteTrackService } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { TimeInsuranceHolderComponent } from './time-insurance-holder.component';

describe('TimeInsuranceHolderComponent', () => {
  let component: TimeInsuranceHolderComponent;
  let fixture: ComponentFixture<TimeInsuranceHolderComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const quoteTrackServiceSpy = jasmine.createSpyObj('QuoteTrackService', ['trackView']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
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
        TimeInsuranceHolderComponent,
        NxCopytextModule,
        HeaderTitleComponent,
        QuoteFooterComponent,
        SelectableOptionComponent,
        QuoteLiteralDirective
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ServiceActivatorService, useValue: activateEntryPointSpy },
        { provide: QuoteTrackService, useValue: quoteTrackServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
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
    expect(component.selectedYears).toEqual({ index: 2, data: 'years' });
  });

  it('should update contextData and call nextStep on selectedYears', () => {
    component.selectData({ index: 3 } as IndexedData<string, number>);

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
