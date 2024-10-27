/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import moment from 'moment';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/shared/models';
import { DrivingLicenseDateComponent } from './driving-license-date.component';

describe('DrivingLicenseDateComponent', () => {
  let component: DrivingLicenseDateComponent;
  let fixture: ComponentFixture<DrivingLicenseDateComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        DrivingLicenseDateComponent,
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
    fixture = TestBed.createComponent(DrivingLicenseDateComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      driven: { drivenLicenseDate: '01-01-2022' }
    } as unknown as QuoteModel);

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
});
