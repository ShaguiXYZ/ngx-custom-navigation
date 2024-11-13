/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { IsPolicyOwnerComponent } from './is-policy-owner.component';

describe('IsPolicyOwnerComponent', () => {
  let component: IsPolicyOwnerComponent;
  let fixture: ComponentFixture<IsPolicyOwnerComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [IsPolicyOwnerComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsPolicyOwnerComponent);
    component = fixture.componentInstance;

    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['contextData'] = {
      client: {
        isPolicyOwner: true
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    component.onIsPolicyOwnerChange(false);

    expect(component['contextData'].client.isPolicyOwner).toBeFalse();
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return isPolicyOwner value from contextData', () => {
    component['contextData'].client.isPolicyOwner = true;

    expect(component.isPolicyOwner).toBeTrue();
  });

  it('should validate data correctly in isValidData', () => {
    component['contextData'].client.isPolicyOwner = true;

    expect(component['isValidData']()).toBeTrue();

    component.onIsPolicyOwnerChange(undefined as any);

    expect(component['isValidData']()).toBeFalse();
  });
});
