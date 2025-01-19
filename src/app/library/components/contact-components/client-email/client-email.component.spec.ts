import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxSwitcherModule } from '@aposin/ng-aquila/switcher';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { NX_RECAPTCHA_TOKEN } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { ClientEMailComponent } from './client-email.component';

describe('ClientEMailComponent', () => {
  let component: ClientEMailComponent;
  let fixture: ComponentFixture<ClientEMailComponent>;

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
      imports: [
        ClientEMailComponent,
        HeaderTitleComponent,
        QuoteFooterComponent,
        QuoteLiteralDirective,
        QuoteLiteralPipe,
        ReactiveFormsModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxInputModule,
        NxLinkModule,
        NxSwitcherModule
      ],
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
    fixture = TestBed.createComponent(ClientEMailComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      personalData: {
        email: 'test@example.com'
      },
      client: {
        accepInfo: false,
        acceptPrivacyPolicy: true
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value).toEqual({
      email: 'test@example.com',
      accepInfo: false,
      acceptPrivacyPolicy: true
    });
  });

  it('should mark all fields as touched and update context data on updateValidData', () => {
    component.form.controls['email'].setValue('new@example.com');
    component.form.controls['accepInfo'].setValue(false);
    component.form.controls['acceptPrivacyPolicy'].setValue(true);

    component['updateValidData']();

    expect(component.form.valid).toBeTrue();
    expect(component.form.touched).toBeTrue();
  });

  it('should return false if form is invalid on updateValidData', () => {
    component.form.controls['email'].setValue('');
    component['updateValidData']();

    expect(component.form.valid).toBeFalse();
  });
});
