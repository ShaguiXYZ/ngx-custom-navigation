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
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { CurrentlyInsuredComponent } from './currently-insured.component';
import { QuoteTrackService } from 'src/app/core/tracking';

describe('CurrentlyInsuredComponent', () => {
  let component: CurrentlyInsuredComponent;
  let fixture: ComponentFixture<CurrentlyInsuredComponent>;
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
      imports: [CurrentlyInsuredComponent],
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
