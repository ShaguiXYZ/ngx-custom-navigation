/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { RoutingService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/shared/models';
import { IsPolicyOwnerComponent } from './is-policy-owner.component';

describe('IsPolicyOwnerComponent', () => {
  let component: IsPolicyOwnerComponent;
  let fixture: ComponentFixture<IsPolicyOwnerComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['nextStep']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [IsPolicyOwnerComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsPolicyOwnerComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      client: {
        isPolicyOwner: true
      }
    } as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contextData on ngOnInit', () => {
    const getContextDataSpy = spyOn(contextDataService, 'get');

    contextDataService.get.and.returnValue({ client: { isPolicyOwner: true } } as QuoteModel);

    component.ngOnInit();

    expect(getContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
    expect(component['contextData']).toEqual({ client: { isPolicyOwner: true } } as QuoteModel);
  });

  it('should return true from canDeactivate if data is valid', () => {
    spyOn(component as any, 'isValidData').and.returnValue(true);

    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false from canDeactivate if data is invalid', () => {
    spyOn(component as any, 'isValidData').and.returnValue(false);

    expect(component.canDeactivate()).toBeFalse();
  });

  it('should update contextData and call nextStep on onIsPolicyOwnerChange', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.ngOnInit();
    component.onIsPolicyOwnerChange(false);

    expect(component['contextData'].client.isPolicyOwner).toBeFalse();
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, component['contextData']);
    expect(routingService.nextStep).toHaveBeenCalled();
  });

  it('should return isPolicyOwner value from contextData', () => {
    component.ngOnInit();

    expect(component.isPolicyOwner).toBeTrue();
  });

  it('should validate data correctly in isValidData', () => {
    component.ngOnInit();

    expect(component['isValidData']()).toBeTrue();

    component.onIsPolicyOwnerChange(undefined as any);

    expect(component['isValidData']()).toBeFalse();
  });
});
