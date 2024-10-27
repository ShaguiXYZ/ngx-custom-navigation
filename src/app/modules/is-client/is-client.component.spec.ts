/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { RoutingService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/shared/models';
import { IsClientComponent } from './is-client.component';

describe('IsClientComponent', () => {
  let component: IsClientComponent;
  let fixture: ComponentFixture<IsClientComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [IsClientComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsClientComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      client: {
        isClient: true
      }
    } as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contextData on ngOnInit', () => {
    const getContextDataSpy = spyOn(contextDataService, 'get');
    contextDataService.get.and.returnValue({ client: { isClient: true } } as QuoteModel);

    component.ngOnInit();

    expect(getContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
    expect(component['contextData']).toEqual({ client: { isClient: true } } as QuoteModel);
  });

  it('should update contextData and call nextStep on onIsClientChange', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.onIsClientChange(false);

    expect(component['contextData'].client.isClient).toBeFalse();
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, component['contextData']);
    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should return the correct value for isClient getter', () => {
    expect(component.isClient).toBeTrue();
  });

  it('should validate data correctly in isValidData', () => {
    expect(component['isValidData']()).toBeTrue();

    component.onIsClientChange(undefined as any);

    expect(component['isValidData']()).toBeFalse();
  });

  it('should call isValidData in canDeactivate', () => {
    spyOn(component as any, 'isValidData').and.returnValue(true);

    expect(component.canDeactivate()).toBeTrue();
    expect(component['isValidData']).toHaveBeenCalled();
  });
});
