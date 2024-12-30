/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { NX_RECAPTCHA_TOKEN } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { ContactTimeComponent } from './contact-time.component';

describe('ContactTimeComponent', () => {
  let component: ContactTimeComponent;
  let fixture: ComponentFixture<ContactTimeComponent>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [ContactTimeComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } }
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
