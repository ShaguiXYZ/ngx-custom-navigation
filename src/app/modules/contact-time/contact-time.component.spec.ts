/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/core/models';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { ContactTimeComponent } from './contact-time.component';

describe('ContactTimeComponent', () => {
  let component: ContactTimeComponent;
  let fixture: ComponentFixture<ContactTimeComponent>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [ContactTimeComponent],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactTimeComponent);
    component = fixture.componentInstance;

    component['contextData'] = {
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
    expect((component as any).contextData.contactData.contactHour).toBe('15:00');
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
