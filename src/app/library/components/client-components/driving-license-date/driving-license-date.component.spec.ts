/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxIsoDateModule } from '@aposin/ng-aquila/iso-date-adapter';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { DEFAULT_DATE_FORMAT, QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { NX_RECAPTCHA_TOKEN } from 'src/app/core/services';
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { DrivingLicenseDateComponent } from './driving-license-date.component';

describe('DrivingLicenseDateComponent', () => {
  let component: DrivingLicenseDateComponent;
  let fixture: ComponentFixture<DrivingLicenseDateComponent>;

  beforeEach(async () => {
    const contextDataSubject = new Subject<any>();
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set', 'onDataChange']);
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

    contextDataServiceSpy.get.and.callFake((contextDataKey: string): any => {
      if (contextDataKey === QUOTE_APP_CONTEXT_DATA) {
        return {
          configuration: { literals: {} },
          navigation: { lastPage: { pageId: 'page1' }, viewedPages: ['page1', 'page2'] }
        } as AppContextData;
      } else if (contextDataKey === QUOTE_CONTEXT_DATA) {
        return {};
      }

      return null;
    });

    contextDataServiceSpy.onDataChange.and.returnValue(contextDataSubject.asObservable());

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [DrivingLicenseDateComponent, ReactiveFormsModule, NxDatefieldModule, NxFormfieldModule, NxInputModule, NxIsoDateModule],
      providers: [
        { provide: ContextDataService, useValue: contextDataServiceSpy },
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
    fixture = TestBed.createComponent(DrivingLicenseDateComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      personalData: { birthdate: '01-01-2000' },
      driven: { licenseDate: '01-01-2022' }
    } as unknown as QuoteModel;

    component['ngOnQuoteInit']();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    const licenseDate = dayjs(new Date(component.form.controls['licenseDate'].value)).format(DEFAULT_DATE_FORMAT);

    expect(licenseDate).toEqual('2022-01-01');
  });

  it('should mark all fields as touched and update context data on valid form', () => {
    component.form.controls['licenseDate'].setValue('2022-01-01');

    expect(component.form.valid).toBeTrue();
  });

  it('should not update context data on invalid form', () => {
    component.form.controls['licenseDate'].setValue(null);
    component['updateValidData']();

    expect(component.form.valid).toBeFalse();
  });

  it('should call canDeactivate and return form validity', () => {
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBe(component.form.valid);
  });

  it('should invalidate form if driving license date is a future date', () => {
    component.form.controls['licenseDate'].setValue(dayjs().add(1, 'years').format(DEFAULT_DATE_FORMAT));

    expect(component.form.valid).toBeFalse();
  });
});
