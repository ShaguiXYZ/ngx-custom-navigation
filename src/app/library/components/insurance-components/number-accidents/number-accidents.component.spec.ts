/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { NumberAccidentsComponent } from './number-accidents.component';

describe('NumberAccidentsComponent', () => {
  let component: NumberAccidentsComponent;
  let fixture: ComponentFixture<NumberAccidentsComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant', 'translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const mockConfig = {
      errorPageId: 'error',
      manifest: {}
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        NumberAccidentsComponent,
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
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberAccidentsComponent);
    component = fixture.componentInstance;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['_contextData'] = {
      client: {
        accidents: 2
      },
      insuranceCompany: {
        yearsAsOwner: 5
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contextData and selectedAccidents on ngOnInit', () => {
    component.ngOnInit();

    expect(component['_contextData']).toEqual({
      client: { accidents: 2 },
      insuranceCompany: {
        yearsAsOwner: 5
      }
    } as QuoteModel);
    expect(component.selectedAccidents).toBe(2);
  });

  it('should update contextData and call nextStep on selectAccidents', () => {
    component.selectAccidents(3);

    expect(component['_contextData'].client.accidents).toBe(3);
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return true if accidents value is valid in updateValidData', () => {
    component['_contextData'] = { client: { accidents: 1 } } as QuoteModel;

    expect(component['updateValidData']()).toBeTrue();
  });

  it('should return false if accidents value is invalid in updateValidData', () => {
    component['_contextData'] = { client: { accidents: null } } as unknown as QuoteModel;

    expect(component['updateValidData']()).toBeFalse();
  });

  it('should call updateValidData on canDeactivate', () => {
    spyOn(component as any, 'updateValidData').and.callThrough();
    component.canDeactivate();

    expect(component['updateValidData']).toHaveBeenCalled();
  });
});
