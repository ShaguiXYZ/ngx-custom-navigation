import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/core/models';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { ClientPhoneNumberComponent } from './client-phone-number.component';

describe('ClientPhoneNumberComponent', () => {
  let component: ClientPhoneNumberComponent;
  let fixture: ComponentFixture<ClientPhoneNumberComponent>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ClientPhoneNumberComponent, ReactiveFormsModule, NxCopytextModule, NxFormfieldModule, NxMaskModule, NxInputModule],
      providers: [
        { provide: NX_DATE_LOCALE, useValue: 'es-ES' },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPhoneNumberComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      personalData: {
        phoneNumber: '123456789'
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with phone number', () => {
    expect(component.form.get('phoneNumber')?.value).toBe('123456789');
  });

  it('should mark form as touched and update context data on valid form', () => {
    component.form.get('phoneNumber')?.setValue('987654321');
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
    component.form.get('phoneNumber')?.setValue('987654321');
    const canDeactivate = await component.canDeactivate();
    expect(canDeactivate).toBeTrue();
  });

  it('should return false from canDeactivate if form is invalid', async () => {
    component.form.get('phoneNumber')?.setValue('');
    const canDeactivate = component.canDeactivate();
    expect(canDeactivate).toBeFalse();
  });
});
