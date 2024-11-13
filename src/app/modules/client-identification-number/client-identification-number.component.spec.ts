/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/core/models';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { ClientIdentificationNumberComponent } from './client-identification-number.component';

describe('ClientIdentificationNumberComponent', () => {
  let component: ClientIdentificationNumberComponent;
  let fixture: ComponentFixture<ClientIdentificationNumberComponent>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ClientIdentificationNumberComponent,
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
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientIdentificationNumberComponent);
    component = fixture.componentInstance;

    component['contextData'] = {
      personalData: {
        identificationNumber: '123456789'
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with context data', () => {
    expect(component.form.value.identificationNumber).toBe('123456789');
  });

  it('should mark all fields as touched and update context data on updateValidData', () => {
    component.form.controls['identificationNumber'].setValue('987654321');

    expect(component.form.valid).toBeTrue();
  });

  it('should return false if form is invalid on updateValidData', () => {
    component.form.controls['identificationNumber'].setValue('');
    component['updateValidData']();

    expect(component.form.valid).toBeFalse();
  });

  it('should call updateValidData on canDeactivate', () => {
    spyOn<any>(component, 'updateValidData').and.callThrough();
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBe(component.form.valid);
  });
});
