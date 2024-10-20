import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { QuoteModel } from 'src/app/shared/models';
import { ClientPhoneNumberComponent } from './client-phone-number.component';

describe('ClientPhoneNumberComponent', () => {
  let component: ClientPhoneNumberComponent;
  let fixture: ComponentFixture<ClientPhoneNumberComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ClientPhoneNumberComponent, ReactiveFormsModule, NxCopytextModule, NxFormfieldModule, NxMaskModule, NxInputModule],
      providers: [
        { provide: NX_DATE_LOCALE, useValue: 'es-ES' },
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPhoneNumberComponent);
    component = fixture.componentInstance;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      personalData: {
        phoneNumber: '123456789'
      }
    } as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with phone number', () => {
    expect(component.form.get('phoneNumber')?.value).toBe('123456789');
  });

  it('should mark form as touched and update context data on valid form', () => {
    let setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.get('phoneNumber')?.setValue('987654321');
    const isValid = component['updateValidData']();
    expect(isValid).toBeTrue();
    expect(setContextDataSpy).toHaveBeenCalledWith(
      QUOTE_CONTEXT_DATA,
      jasmine.objectContaining({
        personalData: jasmine.objectContaining({
          phoneNumber: '987654321'
        })
      })
    );
  });

  it('should not update context data on invalid form', () => {
    let setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.get('phoneNumber')?.setValue('');
    const isValid = component['updateValidData']();
    expect(isValid).toBeFalse();
    expect(setContextDataSpy).not.toHaveBeenCalled();
  });

  it('should return true from canDeactivate if form is valid', async () => {
    component.form.get('phoneNumber')?.setValue('987654321');
    const canDeactivate = await component.canDeactivate();
    expect(canDeactivate).toBeTrue();
  });

  it('should return false from canDeactivate if form is invalid', async () => {
    component.form.get('phoneNumber')?.setValue('');
    const canDeactivate = await component.canDeactivate();
    expect(canDeactivate).toBeFalse();
  });
});
