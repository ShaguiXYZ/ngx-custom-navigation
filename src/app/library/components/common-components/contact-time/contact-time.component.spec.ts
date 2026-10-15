/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from '../../../../core/components/models';
import { NX_LANGUAGE_CONFIG } from '../../../../core/models';
import { NX_RECAPTCHA_TOKEN } from '../../../../core/services';
import { ContextDataServiceStub } from '../../../../core/stub';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';
import { ContactTimeComponent } from './contact-time.component';

describe('ContactTimeComponent', () => {
  let component: ContactTimeComponent;
  let fixture: ComponentFixture<ContactTimeComponent>;

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
      imports: [ContactTimeComponent],
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
    fixture = TestBed.createComponent(ContactTimeComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      contactData: {
        contactHour: '10:00'
      }
    } as unknown as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct contact hour', () => {
    expect(component.selectedHour).toBe('10:00');
  });

  it('should allow selecting an hour', () => {
    component.selectHour('14:00');
    expect(component.selectedHour).toBe('14:00');
  });

  it('should update valid data correctly', () => {
    component.selectHour('15:00');
    component['updateValidData']();
    expect((component as any)._contextData.contactData.contactHour).toBe('15:00');
  });

  it('should allow deactivation if an hour is selected', () => {
    component.selectHour('16:00');
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should not allow deactivation if no hour is selected', () => {
    component.selectedHour = undefined;
    expect(component.canDeactivate()).toBeFalse();
  });
});
