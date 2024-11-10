/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import moment from 'moment';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteModel } from 'src/app/core/models';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { DrivingLicenseDateComponent } from './driving-license-date.component';

describe('DrivingLicenseDateComponent', () => {
  let component: DrivingLicenseDateComponent;
  let fixture: ComponentFixture<DrivingLicenseDateComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

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

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

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
    const drivenLicenseDate = moment(new Date(component.form.controls['drivenLicenseDate'].value)).format('YYYY-MM-DD');

    expect(drivenLicenseDate).toEqual('2022-01-01');
  });

  it('should mark all fields as touched and update context data on valid form', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.controls['drivenLicenseDate'].setValue('2022-01-01');
    const isValid = component['updateValidData']();

    expect(isValid).toBeTrue();
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, jasmine.any(Object));
  });

  it('should not update context data on invalid form', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.controls['drivenLicenseDate'].setValue(null);
    const isValid = component['updateValidData']();

    expect(isValid).toBeFalse();
    expect(setContextDataSpy).not.toHaveBeenCalled();
  });

  it('should call canDeactivate and return form validity', () => {
    spyOn<any>(component, 'updateValidData').and.callThrough();
    const canDeactivate = component.canDeactivate();

    expect(component['updateValidData']).toHaveBeenCalled();
    expect(canDeactivate).toBe(component.form.valid);
  });

  it('should invalidate form if driving license date is a future date', () => {
    component.form.controls['drivenLicenseDate'].setValue(moment().add(1, 'years').format('YYYY-MM-DD'));
    const isValid = component['updateValidData']();

    expect(isValid).toBeFalse();
    expect(component.form.controls['drivenLicenseDate'].errors).toEqual({ futureDate: true });
  });
});
