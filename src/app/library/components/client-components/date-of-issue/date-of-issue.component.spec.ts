/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import moment from 'moment';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { DEFAULT_DATE_FORMAT } from 'src/app/core/constants';
import { NX_RECAPTCHA_TOKEN } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { DateOfIssueComponent } from './date-of-issue.component';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { of } from 'rxjs';

describe('DateOfIssueComponent', () => {
  let component: DateOfIssueComponent;
  let fixture: ComponentFixture<DateOfIssueComponent>;

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
        DateOfIssueComponent,
        ReactiveFormsModule,
        NxDatefieldModule,
        NxFormfieldModule,
        NxInputModule,
        NxMomentDateModule,
        HeaderTitleComponent,
        QuoteFooterComponent,
        QuoteLiteralDirective,
        QuoteLiteralPipe
      ],
      providers: [
        { provide: NX_DATE_LOCALE, useValue: 'es-ES' },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DateOfIssueComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      client: {
        dateOfIssue: '01-01-2003'
      }
    } as unknown as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    const dateOfIssue = moment(new Date(component.form.controls['dateOfIssue'].value)).format(DEFAULT_DATE_FORMAT);

    expect(dateOfIssue).toEqual('2003-01-01');
  });

  it('should mark form as touched and update context data on updateValidData', () => {
    const futureDate = moment().add(1, 'day').format(DEFAULT_DATE_FORMAT);
    const expiration = moment(futureDate).add(component['expirationInfo'].value, component['expirationInfo'].unit);

    component.form.controls['dateOfIssue'].setValue(futureDate);
    component['updateValidData']();

    expect(component.form.valid).toBeTrue();
    expect(component.form.touched).toBeTrue();
    expect((component as any)._contextData.client.dateOfIssue).toEqual(futureDate);
    expect((component as any)._contextData.client.expiration).toEqual(expiration.format(DEFAULT_DATE_FORMAT));
  });

  it('should return form validity on canDeactivate', done => {
    const futureDate = moment().add(1, 'day').format(DEFAULT_DATE_FORMAT);

    component.form.controls['dateOfIssue'].setValue(futureDate);
    const result = component.canDeactivate();

    expect(result).toBeTrue();
    done();
  });

  it('should invalidate form if dateOfIssue is empty', () => {
    component.form.controls['dateOfIssue'].setValue(null);
    component['updateValidData']();

    expect(component.form.valid).toBeFalse();
    expect(component.form.controls['dateOfIssue'].hasError('required')).toBeTrue();
  });
});
