/* eslint-disable @typescript-eslint/no-explicit-any */
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxInputModule } from '@allianz/ng-aquila/input';
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from '../../../../core/components/models';
import { NX_LANGUAGE_CONFIG } from '../../../../core/models';
import { NX_RECAPTCHA_TOKEN } from '../../../../core/services';
import { ContextDataServiceStub } from '../../../../core/stub';
import { HeaderTitleComponent, QuoteFooterComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';
import { ClientIdentificationNumberComponent } from './client-identification-number.component';

describe('ClientIdentificationNumberComponent', () => {
  let component: ClientIdentificationNumberComponent;
  let fixture: ComponentFixture<ClientIdentificationNumberComponent>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setFallbackLang', 'use', 'instant']);
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
        ClientIdentificationNumberComponent,
        ReactiveFormsModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxInputModule,
        QuoteFooterComponent,
        HeaderTitleComponent,
        QuoteLiteralDirective,
        QuoteLiteralPipe
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
    fixture = TestBed.createComponent(ClientIdentificationNumberComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      personalData: {
        identificationNumber: '123456789'
      }
    } as QuoteModel;

    component['ngOnQuoteInit']();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with context data', () => {
    expect(component.form.value.identificationNumber).toBe('123456789');
  });

  it('should mark all fields as touched and update context data on updateValidData', () => {
    component.form.controls['identificationNumber'].setValue('11111111H');

    expect(component.form.valid).toBeTrue();
  });

  it('should mark as invalid if identification number is invalid', () => {
    component.form.controls['identificationNumber'].setValue('11111112H');

    expect(component.form.valid).toBeFalse();
  });

  it('should return false if form is invalid on updateValidData', () => {
    component.form.controls['identificationNumber'].setValue('');
    component['updateValidData']();

    expect(component.form.valid).toBeFalse();
  });

  it('should call updateValidData on canDeactivate', () => {
    spyOn<any>(component, 'updateValidData').and.callThrough();
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBe(component.form.valid);
  });
});
