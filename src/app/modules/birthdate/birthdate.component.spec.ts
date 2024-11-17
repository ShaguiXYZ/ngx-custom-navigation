import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'src/app/core/constants';
import { QuoteModel } from 'src/app/core/models';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { BirthdateComponent } from './birthdate.component';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

describe('BirthdateComponent', () => {
  let component: BirthdateComponent;
  let fixture: ComponentFixture<BirthdateComponent>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [BirthdateComponent, ReactiveFormsModule, NxDatefieldModule, NxFormfieldModule, NxInputModule, NxMomentDateModule],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthdateComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      personalData: {
        birthdate: '01-01-2000'
      }
    } as unknown as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with birthdate from context', () => {
    const birthdate = moment(new Date(component.form.controls['birthdate'].value)).format(DEFAULT_DATE_FORMAT);

    expect(birthdate).toEqual('2000-01-01');
  });

  it('should mark form as touched and update context data on updateValidData', () => {
    component.form.controls['birthdate'].setValue('2000-01-01');
    component['updateValidData']();

    expect(component.form.touched).toBeTrue();
    expect(component.form.valid).toBeTrue();
  });

  it('should invalidate form if birthdate is less than 18 years ago', () => {
    component.form.controls['birthdate'].setValue(moment().subtract(17, 'years').format(DEFAULT_DATE_FORMAT));

    expect(component.form.valid).toBeFalse();
    expect(component.form.controls['birthdate'].errors).toEqual({ olderThanYears: true });
  });

  it('should validate form if birthdate is 18 years or more ago', () => {
    component.form.controls['birthdate'].setValue(moment().subtract(18, 'years').format(DEFAULT_DATE_FORMAT));
    component['updateValidData']();

    expect(component.form.valid).toBeTrue();
    expect(component.form.controls['birthdate'].errors).toBeNull();
  });
});
