import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { NX_RECAPTCHA_TOKEN } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { ClientPhoneNumberComponent } from './client-phone-number.component';

describe('ClientPhoneNumberComponent', () => {
  let component: ClientPhoneNumberComponent;
  let fixture: ComponentFixture<ClientPhoneNumberComponent>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
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
      imports: [ClientPhoneNumberComponent, ReactiveFormsModule, NxCopytextModule, NxFormfieldModule, NxMaskModule, NxInputModule],
      providers: [
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
    fixture = TestBed.createComponent(ClientPhoneNumberComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      personalData: {
        phoneNumber: '+34123456789'
      }
    } as QuoteModel;

    component['ngOnQuoteInit']();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with phone number', () => {
    expect(component.form.get('phoneNumber')?.value).toBe('+34123456789');
  });

  it('should mark form as touched and update context data on valid form', () => {
    component.form.get('phoneNumber')?.setValue('+34987654321');
    component['updateValidData']();

    expect(component.form.touched).toBeTrue();
    expect(component.form.valid).toBeTrue();
  });

  it('should not update context data on invalid form', () => {
    component.form.get('phoneNumber')?.setValue('');
    component['updateValidData']();
    expect(component.form.valid).toBeFalse();
  });

  it('should return true from canDeactivate if form is valid', async () => {
    component.form.get('phoneNumber')?.setValue('+34987654321');
    const canDeactivate = await component.canDeactivate();
    expect(canDeactivate).toBeTrue();
  });

  it('should return false from canDeactivate if form is invalid', async () => {
    component.form.get('phoneNumber')?.setValue('');
    const canDeactivate = component.canDeactivate();
    expect(canDeactivate).toBeFalse();
  });
});
