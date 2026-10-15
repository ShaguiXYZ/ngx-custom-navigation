import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxInputModule } from '@allianz/ng-aquila/input';
import { NxMaskModule } from '@allianz/ng-aquila/mask';
import { CommonModule } from '@angular/common';
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
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';
import { LicenseYearComponent } from './license-year.component';

describe('LicenseYearComponent', () => {
  let component: LicenseYearComponent;
  let fixture: ComponentFixture<LicenseYearComponent>;

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
      imports: [LicenseYearComponent, CommonModule, ReactiveFormsModule, NxFormfieldModule, NxInputModule, NxMaskModule, NxButtonModule],
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
    fixture = TestBed.createComponent(LicenseYearComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      vehicle: { yearOfManufacture: 2020 },
      driven: { hasDrivenLicense: true }
    } as QuoteModel;

    component['ngOnQuoteInit']();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with context data', () => {
    expect(component.form.value.yearOfManufacture).toBe(2020);
  });

  it('should mark form as touched and update context data on updateValidData', () => {
    component.form.controls['yearOfManufacture'].setValue(2021);
    const markAllAsTouchedSpy = spyOn(component.form, 'markAllAsTouched');

    component.updateValidData();

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(component.form.valid).toBeTrue();
    });
  });

  it('should not update context data if form is invalid', () => {
    component.form.controls['yearOfManufacture'].setValue('');

    expect(component.form.valid).toBeFalse();
  });

  it('should allow deactivation if form is valid', () => {
    component.form.controls['yearOfManufacture'].setValue(2021);
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBeTrue();
  });

  it('should not allow deactivation if form is invalid', () => {
    component.form.controls['yearOfManufacture'].setValue('');
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBeFalse();
  });
});
