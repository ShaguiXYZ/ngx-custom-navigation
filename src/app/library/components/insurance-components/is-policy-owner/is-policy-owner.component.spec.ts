/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { ServiceActivatorService } from 'src/app/core/service-activators';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteTrackService } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { IsPolicyOwnerComponent } from './is-policy-owner.component';

describe('IsPolicyOwnerComponent', () => {
  let component: IsPolicyOwnerComponent;
  let fixture: ComponentFixture<IsPolicyOwnerComponent>;
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
      imports: [IsPolicyOwnerComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
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
    fixture = TestBed.createComponent(IsPolicyOwnerComponent);
    component = fixture.componentInstance;

    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['_contextData'] = {
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

    expect(component['_contextData'].client.isPolicyOwner).toBeFalse();
    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return isPolicyOwner value from contextData', () => {
    component['_contextData'].client.isPolicyOwner = true;

    expect(component.isPolicyOwner).toBeTrue();
  });

  it('should validate data correctly in isValidData', () => {
    component['_contextData'].client.isPolicyOwner = true;

    expect(component['isValidData']()).toBeTrue();

    component.onIsPolicyOwnerChange(undefined as any);

    expect(component['isValidData']()).toBeFalse();
  });
});
