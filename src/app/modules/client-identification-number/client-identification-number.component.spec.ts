import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { ClientIdentificationNumberComponent } from './client-identification-number.component';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { TranslateService } from '@ngx-translate/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';

describe('ClientIdentificationNumberComponent', () => {
  let component: ClientIdentificationNumberComponent;
  let fixture: ComponentFixture<ClientIdentificationNumberComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ClientIdentificationNumberComponent,
        FormsModule,
        ReactiveFormsModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxInputModule,
        QuoteFooterComponent,
        QuoteFooterInfoComponent,
        HeaderTitleComponent,
        QuoteLiteralDirective,
        QuoteLiteralPipe
      ],
      providers: [
        { provide: NX_DATE_LOCALE, useValue: 'es-ES' },
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientIdentificationNumberComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      personalData: {
        identificationNumber: '123456789'
      }
    } as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with context data', () => {
    expect(component.form.value.identificationNumber).toBe('123456789');
  });

  it('should mark all fields as touched and update context data on updateValidData', () => {
    let setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.controls['identificationNumber'].setValue('987654321');
    const isValid = component['updateValidData']();

    expect(isValid).toBeTrue();
    expect(setContextDataSpy).toHaveBeenCalledWith(
      QUOTE_CONTEXT_DATA,
      jasmine.objectContaining({
        personalData: jasmine.objectContaining({
          identificationNumber: '987654321'
        })
      })
    );
  });

  it('should return false if form is invalid on updateValidData', () => {
    let setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.controls['identificationNumber'].setValue('');
    const isValid = component['updateValidData']();

    expect(isValid).toBeFalse();
    expect(setContextDataSpy).not.toHaveBeenCalled();
  });

  it('should call updateValidData on canDeactivate', () => {
    spyOn<any>(component, 'updateValidData').and.callThrough();
    const canDeactivate = component.canDeactivate();

    expect(component['updateValidData']).toHaveBeenCalled();
    expect(canDeactivate).toBe(component.form.valid);
  });
});
