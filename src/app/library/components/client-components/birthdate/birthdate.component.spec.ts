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
import { of, Subject } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { DEFAULT_DATE_FORMAT, QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { NX_RECAPTCHA_TOKEN } from 'src/app/core/services';
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { BirthdateComponent } from './birthdate.component';

describe('BirthdateComponent', () => {
  let component: BirthdateComponent;
  let fixture: ComponentFixture<BirthdateComponent>;

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

    translateServiceSpy.use.and.returnValue(of('en'));

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
      imports: [BirthdateComponent, ReactiveFormsModule, NxDatefieldModule, NxFormfieldModule, NxInputModule, NxIsoDateModule],
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
    fixture = TestBed.createComponent(BirthdateComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      personalData: {
        birthdate: '01-01-2000'
      }
    } as unknown as QuoteModel;

    component['ngOnQuoteInit']();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with birthdate from context', () => {
    const birthdate = dayjs(new Date(component.form.controls['birthdate'].value)).format(DEFAULT_DATE_FORMAT);

    expect(birthdate).toEqual('2000-01-01');
  });

  it('should mark form as touched and update context data on updateValidData', () => {
    component.form.controls['birthdate'].setValue('2000-01-01');
    component['updateValidData']();

    expect(component.form.touched).toBeTrue();
    expect(component.form.valid).toBeTrue();
  });

  it('should invalidate form if birthdate is less than 18 years ago', () => {
    component.form.controls['birthdate'].setValue(dayjs().subtract(17, 'years').format(DEFAULT_DATE_FORMAT));

    expect(component.form.valid).toBeFalse();
    expect(component.form.controls['birthdate'].errors).toEqual({ olderThanYears: true });
  });

  it('should validate form if birthdate is 18 years or more ago', () => {
    component.form.controls['birthdate'].setValue(dayjs().subtract(18, 'years').format(DEFAULT_DATE_FORMAT));
    component['updateValidData']();

    expect(component.form.valid).toBeTrue();
    expect(component.form.controls['birthdate'].errors).toBeNull();
  });
});
