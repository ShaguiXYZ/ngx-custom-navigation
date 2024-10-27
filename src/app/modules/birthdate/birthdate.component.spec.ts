import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import moment from 'moment';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { BirthdateComponent } from './birthdate.component';
import { QuoteModel } from 'src/app/shared/models';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';

describe('BirthdateComponent', () => {
  let component: BirthdateComponent;
  let fixture: ComponentFixture<BirthdateComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        BirthdateComponent,
        ReactiveFormsModule,
        FormsModule,
        NxDatefieldModule,
        NxFormfieldModule,
        NxInputModule,
        NxMomentDateModule
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    fixture = TestBed.createComponent(BirthdateComponent);
    component = fixture.componentInstance;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      personalData: {
        birthdate: '01-01-2000'
      }
    } as unknown as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with birthdate from context', () => {
    const birthdate = moment(new Date(component.form.controls['birthdate'].value)).format('YYYY-MM-DD');

    expect(birthdate).toEqual('2000-01-01');
  });

  it('should mark form as touched and update context data on updateValidData', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.controls['birthdate'].setValue('2000-01-01');
    const isValid = component['updateValidData']();

    expect(component.form.touched).toBeTrue();
    expect(isValid).toBeTrue();
    expect(setContextDataSpy).toHaveBeenCalled();
  });

  it('should invalidate form if birthdate is less than 18 years ago', () => {
    component.form.controls['birthdate'].setValue(moment().subtract(17, 'years').format('YYYY-MM-DD'));
    const isValid = component['updateValidData']();

    expect(isValid).toBeFalse();
    expect(component.form.controls['birthdate'].errors).toEqual({ clientOld: true });
  });

  it('should validate form if birthdate is 18 years or more ago', () => {
    component.form.controls['birthdate'].setValue(moment().subtract(18, 'years').format('YYYY-MM-DD'));
    const isValid = component['updateValidData']();

    expect(isValid).toBeTrue();
    expect(component.form.controls['birthdate'].errors).toBeNull();
  });
});
