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
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { ClientEMailComponent } from './client-email.component';

describe('ClientEMailComponent', () => {
  let component: ClientEMailComponent;
  let fixture: ComponentFixture<ClientEMailComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

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
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEMailComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      personalData: {
        email: 'test@example.com',
        productsInfo: false,
        privacyPolicy: true
      }
    } as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value).toEqual({
      email: 'test@example.com',
      productsInfo: false,
      privacyPolicy: true
    });
  });

  it('should mark all fields as touched and update context data on updateValidData', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.controls['email'].setValue('new@example.com');
    component.form.controls['productsInfo'].setValue(false);
    component.form.controls['privacyPolicy'].setValue(true);

    const isValid = component['updateValidData']();

    expect(isValid).toBeTrue();
    expect(component.form.touched).toBeTrue();
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, {
      personalData: {
        email: 'new@example.com',
        productsInfo: false,
        privacyPolicy: true
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
