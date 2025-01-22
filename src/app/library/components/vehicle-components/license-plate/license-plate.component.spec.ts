import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLicencePlateModule } from '@aposin/ng-aquila/licence-plate';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { LicensePlateComponent } from './license-plate.component';

describe('LicensePlateComponent', () => {
  let component: LicensePlateComponent;
  let fixture: ComponentFixture<LicensePlateComponent>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setDefaultLang', 'use', 'instant']);
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
        LicensePlateComponent,
        ReactiveFormsModule,
        NxButtonModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxInputModule,
        NxLicencePlateModule,
        NxMaskModule,
        QuoteFooterComponent,
        HeaderTitleComponent,
        QuoteLiteralDirective,
        QuoteLiteralPipe
      ],
      providers: [
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensePlateComponent);
    component = fixture.componentInstance;

    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    component['_contextData'] = {
      driven: {
        hasDrivenLicense: true
      },
      vehicle: {
        plateNumber: '1234-SSS'
      }
    } as QuoteModel;

    component['ngOnQuoteInit']();

    fixture.detectChanges();
  });

  it('should create', () => {
    component['_contextData'] = {
      driven: {
        hasDrivenLicense: true
      },
      vehicle: {
        plateNumber: '1234-SSS'
      }
    } as QuoteModel;

    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value.plateNumber).toBe('1234-SSS');
  });

  it('should mark form as touched and update context data on valid form', () => {
    component.form.setValue({ plateNumber: '1234-SSS' });
    component['updateValidData']();

    const isValid = component.form.valid;

    expect(component.form.touched).toBeTrue();
    expect(isValid).toBeTrue();
  });

  it('should not update context data on invalid form', () => {
    component.form.setValue({ plateNumber: '' });
    component['updateValidData']();

    const isValid = component.form.valid;

    expect(isValid).toBeFalse();
  });

  it('should call nextStep on continueWithOutLicensePlate', () => {
    component.continueWithOutLicensePlate();

    expect(routingService.next).toHaveBeenCalled();
  });

  it('should return true on canDeactivate', () => {
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should return false on canDeactivate', () => {
    component.form.setValue({ plateNumber: '' });
    expect(component.canDeactivate()).toBeFalse();
  });
});
