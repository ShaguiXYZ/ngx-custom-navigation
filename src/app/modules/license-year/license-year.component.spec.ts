import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel } from 'src/app/shared/models';
import { LicenseYearComponent } from './license-year.component';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { TranslateService } from '@ngx-translate/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';

describe('LicenseYearComponent', () => {
  let component: LicenseYearComponent;
  let fixture: ComponentFixture<LicenseYearComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        LicenseYearComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NxFormfieldModule,
        NxInputModule,
        NxMaskModule,
        NxButtonModule
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseYearComponent);
    component = fixture.componentInstance;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      vehicle: { yearOfManufacture: 2020 },
      driven: { hasDrivenLicense: true }
    } as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with context data', () => {
    expect(component.form.value.yearOfManufacture).toBe(2020);
  });

  it('should mark form as touched and update context data on updateValidData', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.controls['yearOfManufacture'].setValue(2021);
    const isValid = component['updateValidData']();

    expect(isValid).toBeTrue();
    expect(setContextDataSpy).toHaveBeenCalledWith(
      QUOTE_CONTEXT_DATA,
      jasmine.objectContaining({
        vehicle: { yearOfManufacture: 2021 }
      })
    );
  });

  it('should not update context data if form is invalid', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.controls['yearOfManufacture'].setValue('');
    const isValid = component['updateValidData']();

    expect(isValid).toBeFalse();
    expect(setContextDataSpy).not.toHaveBeenCalled();
  });

  it('should set hasDrivenLicense to false on continue', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.continue();
    expect(setContextDataSpy).toHaveBeenCalledWith(
      QUOTE_CONTEXT_DATA,
      jasmine.objectContaining({
        driven: { hasDrivenLicense: false }
      })
    );
  });

  it('should allow deactivation if form is valid', () => {
    component.form.controls['yearOfManufacture'].setValue(2021);
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBeTrue();
  });

  it('should not allow deactivation if form is invalid', () => {
    component.form.controls['yearOfManufacture'].setValue('');
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBeFalse();
  });
});
