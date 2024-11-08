/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxSwitcherModule } from '@aposin/ng-aquila/switcher';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteModel } from 'src/app/core/models';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { ClientEMailComponent } from './client-email.component';

describe('ClientEMailComponent', () => {
  let component: ClientEMailComponent;
  let fixture: ComponentFixture<ClientEMailComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ClientEMailComponent,
        HeaderTitleComponent,
        QuoteFooterComponent,
        QuoteLiteralDirective,
        QuoteLiteralPipe,
        FormsModule,
        ReactiveFormsModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxInputModule,
        NxLinkModule,
        NxSwitcherModule
      ],
      providers: [
        { provide: NX_DATE_LOCALE, useValue: 'es-ES' },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEMailComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    component['contextData'] = {
      personalData: {
        email: 'test@example.com'
      },
      client: {
        accepInfo: false,
        acceptPrivacyPolicy: true
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value).toEqual({
      email: 'test@example.com',
      accepInfo: false,
      acceptPrivacyPolicy: true
    });
  });

  it('should mark all fields as touched and update context data on updateValidData', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.controls['email'].setValue('new@example.com');
    component.form.controls['accepInfo'].setValue(false);
    component.form.controls['acceptPrivacyPolicy'].setValue(true);

    const isValid = component['updateValidData']();

    expect(isValid).toBeTrue();
    expect(component.form.touched).toBeTrue();
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, {
      personalData: {
        email: 'new@example.com'
      },
      client: {
        accepInfo: false,
        acceptPrivacyPolicy: true
      }
    });
  });

  it('should return false if form is invalid on updateValidData', () => {
    component.form.controls['email'].setValue('');
    const isValid = component['updateValidData']();
    expect(isValid).toBeFalse();
  });

  it('should call updateValidData on canDeactivate', () => {
    spyOn<any>(component, 'updateValidData').and.callThrough();
    component.canDeactivate();
    expect(component['updateValidData']).toHaveBeenCalled();
  });
});
