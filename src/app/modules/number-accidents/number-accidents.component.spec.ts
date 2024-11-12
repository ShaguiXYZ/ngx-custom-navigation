/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteModel } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { NumberAccidentsComponent } from './number-accidents.component';

describe('NumberAccidentsComponent', () => {
  let component: NumberAccidentsComponent;
  let fixture: ComponentFixture<NumberAccidentsComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant', 'translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        NumberAccidentsComponent,
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
        { provide: RoutingService, useValue: routingServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberAccidentsComponent);
    component = fixture.componentInstance;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['contextData'] = {
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

    expect(component['contextData']).toEqual({
      client: { accidents: 2 },
      insuranceCompany: {
        yearsAsOwner: 5
      }
    } as QuoteModel);
    expect(component.selectedAccidents).toBe(2);
  });

  it('should update contextData and call nextStep on selectAccidents', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.selectAccidents(3);

    expect(component['contextData'].client.accidents).toBe(3);
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, component['contextData']);
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return true if accidents value is valid in updateValidData', () => {
    component['contextData'] = { client: { accidents: 1 } } as QuoteModel;

    expect(component['updateValidData']()).toBeTrue();
  });

  it('should return false if accidents value is invalid in updateValidData', () => {
    component['contextData'] = { client: { accidents: null } } as unknown as QuoteModel;

    expect(component['updateValidData']()).toBeFalse();
  });

  it('should call updateValidData on canDeactivate', () => {
    spyOn(component as any, 'updateValidData').and.callThrough();
    component.canDeactivate();

    expect(component['updateValidData']).toHaveBeenCalled();
  });
});
