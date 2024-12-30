/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { CurrentlyInsuredComponent } from './currently-insured.component';

describe('CurrentlyInsuredComponent', () => {
  let component: CurrentlyInsuredComponent;
  let fixture: ComponentFixture<CurrentlyInsuredComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CurrentlyInsuredComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentlyInsuredComponent);
    component = fixture.componentInstance;

    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['_contextData'] = {
      client: {
        isCurrentlyInsured: true
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update contextData and call nextStep on onCurrentlyInsuredChange', () => {
    component.onCurrentlyInsuredChange(false);

    expect(component['_contextData'].client.isCurrentlyInsured).toBeFalse();
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return the correct value for isCurrentlyInsured getter', () => {
    expect(component.isCurrentlyInsured).toBeTrue();
  });

  it('should validate data correctly in isValidData', () => {
    expect(component['isValidData']()).toBeTrue();

    component.onCurrentlyInsuredChange(undefined as any);

    expect(component['isValidData']()).toBeFalse();
  });

  it('should call isValidData in canDeactivate', () => {
    spyOn(component as any, 'isValidData').and.returnValue(true);

    expect(component.canDeactivate()).toBeTrue();
    expect(component['isValidData']).toHaveBeenCalled();
  });
});
