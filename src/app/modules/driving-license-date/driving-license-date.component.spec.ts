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
import { DrivingLicenseDateComponent } from './driving-license-date.component';

describe('DrivingLicenseDateComponent', () => {
  let component: DrivingLicenseDateComponent;
  let fixture: ComponentFixture<DrivingLicenseDateComponent>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [DrivingLicenseDateComponent, ReactiveFormsModule, NxDatefieldModule, NxFormfieldModule, NxInputModule, NxMomentDateModule],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingLicenseDateComponent);
    component = fixture.componentInstance;

    component['contextData'] = {
      personalData: { birthdate: '01-01-2000' },
      driven: { drivenLicenseDate: '01-01-2022' }
    } as unknown as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    const drivenLicenseDate = moment(new Date(component.form.controls['drivenLicenseDate'].value)).format(DEFAULT_DATE_FORMAT);

    expect(drivenLicenseDate).toEqual('2022-01-01');
  });

  it('should mark all fields as touched and update context data on valid form', () => {
    component.form.controls['drivenLicenseDate'].setValue('2022-01-01');

    expect(component.form.valid).toBeTrue();
  });

  it('should not update context data on invalid form', () => {
    component.form.controls['drivenLicenseDate'].setValue(null);
    component['updateValidData']();

    expect(component.form.valid).toBeFalse();
  });

  it('should call canDeactivate and return form validity', () => {
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBe(component.form.valid);
  });

  it('should invalidate form if driving license date is a future date', () => {
    component.form.controls['drivenLicenseDate'].setValue(moment().add(1, 'years').format(DEFAULT_DATE_FORMAT));

    expect(component.form.valid).toBeFalse();
  });
});
